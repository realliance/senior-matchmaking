import assert from 'assert';
import {
    ConfirmResponse, MatchParameters, MMQClientUpdate, MMQServerUpdate, Status, MatchingState,
} from './proto/matchmaking_pb';
import { Player } from './mmplayer';
import { PlayerChannel } from './mmchannel';

interface QueueEntry {
    ply: Player;
    entryTime: number;
}

interface PlayerInfo {
    matchState: MatchingState;
    channel: PlayerChannel;
}

class MatchConfig {
    numPlayers = 8;

    confirmTimeout = 12 * 1000;
}

interface MatchRecord {
    ip: string;
    port: number;
}

class Match {
    players: Player[];

    confirmTimer: NodeJS.Timeout|null = null;

    parameters: MatchRecord|null = null;

    constructor(ql: QueueEntry[]) {
        this.players = ql.map((el: QueueEntry) => el.ply);
    }
}

export class MatchMakingQueue {
    players: Record<number, PlayerInfo> = {};

    queue: Array<QueueEntry> = [];

    playerToMatch: Record<number, Match> = {};

    config: MatchConfig = new MatchConfig();

    getPlayerInfo(ply: Player) : PlayerInfo {
        return this.players[ply.uid];
    }

    getPlayerMatch(ply: Player) : Match|undefined {
        return this.playerToMatch[ply.uid];
    }

    onPlayerConnected(ply: Player, channel: PlayerChannel) : void {
        this.players[ply.uid] = {
            matchState: MatchingState.STATE_IDLE,
            channel,
        };

        // Player has disconnected but is still in a match, so we give the opportunity to reconnect.
        if(this.playerToMatch[ply.uid]) {
            this.players[ply.uid].matchState = MatchingState.STATE_INGAME;
        }

        this.updatePlayerState(ply, this.players[ply.uid].matchState);
    }

    updatePlayerState(ply: Player, state: MatchingState) : void {
        const info: PlayerInfo = this.getPlayerInfo(ply);
        info.matchState = state;

        const upd: MMQServerUpdate = new MMQServerUpdate();
        upd.setStatus(MMQServerUpdate.QueueUpdate.STATUS_STATEUPDATE);
        upd.setQueueState(info.matchState);

        info.channel.write(upd);
    }

    cancelMatch(match: Match, playersToKick: Player[]) : void {
        match.players.forEach((ply: Player) => {
            const info: PlayerInfo = this.getPlayerInfo(ply);
            if (!playersToKick.includes(ply)) {
                assert(info.matchState === MatchingState.STATE_CONFIRMED || info.matchState === MatchingState.STATE_CONFIRMING);
                this.updatePlayerState(ply, MatchingState.STATE_LOOKING);

                // Put the player back in the queue
                this.queue.unshift({
                    ply,
                    entryTime: Date.now() / 1000,
                });
            } else if (info.matchState === MatchingState.STATE_CONFIRMING || info.matchState === MatchingState.STATE_CONFIRMED) {
                this.updatePlayerState(ply, MatchingState.STATE_IDLE);
            } else {
                throw Error(`Player in invalid state: ${info.matchState.toString()}`);
            }

            delete this.playerToMatch[ply.uid];
        });

        if (match.confirmTimer !== null) clearTimeout(match.confirmTimer);
    }

    async initMatchIfReady(match: Match) : Promise<boolean> {
        // If every player has confirmed
        if (match.players.every((ply:Player) => this.getPlayerInfo(ply).matchState === MatchingState.STATE_CONFIRMED)) {
            // Time to spin up a server here

            // Mark players as IN_GAME, at this point match parameters can be retreived
            match.players.forEach((ply: Player) => {
                this.updatePlayerState(ply, MatchingState.STATE_INGAME);
            });

            // Cancel the timeout
            if (match.confirmTimer !== null) {
                clearTimeout(match.confirmTimer);
                match.confirmTimer = null;
            }

            return true;
        }

        return false;
    }

    // serveQueue
    // Pull out the next batch of players when possible
    // Mark them as STATE_CONFIRMING, sent cond notices
    // Build a Match with the players, insert into matches
    // init timeout, players that haven't confirmed at this point get hard kicked
    // otherwise transfer all players to STATE_INGAME, launch a server, and mark the match as active

    serveQueue() : boolean {
        if (this.queue.length < this.config.numPlayers) return false;

        const entries: QueueEntry[] = this.queue.splice(0, this.config.numPlayers);

        // Construct a new match
        const match: Match = new Match(entries);

        entries.forEach((qe: QueueEntry) => {
            // Mark all players as confirming
            this.updatePlayerState(qe.ply, MatchingState.STATE_CONFIRMING);

            // Mark each player as belonging to this match
            this.playerToMatch[qe.ply.uid] = match;
        });

        // Setup a timer to timeout the match queue
        // This timer will be cancelled if everyone confirms
        match.confirmTimer = setTimeout(() => {
            // Invalidate the timer
            match.confirmTimer = null;

            const unconfirmedPlayers: Player[] = match.players.filter((ply:Player) => this.getPlayerInfo(ply).matchState !== MatchingState.STATE_CONFIRMED);

            // Match needs to be cancelled
            if (unconfirmedPlayers.length > 0) this.cancelMatch(match, unconfirmedPlayers);
        }, this.config.confirmTimeout);

        return true;
    }

    handleJoin(ply: Player) : void {
        const info: PlayerInfo = this.getPlayerInfo(ply);

        // Player can enter the queue
        if (info.matchState === MatchingState.STATE_IDLE) {
            info.matchState = MatchingState.STATE_LOOKING;
            this.queue.push({
                ply,
                entryTime: Date.now() / 1000,
            });
        }
    }

    handleLeave(ply: Player) : void {
        const info: PlayerInfo = this.getPlayerInfo(ply);

        // Player can only leave during the confirmation phase and searching
        switch (info.matchState) {
            case MatchingState.STATE_CONFIRMING:
            {
                this.cancelMatch(this.playerToMatch[ply.uid], [ply]);
                break;
            }
            case MatchingState.STATE_LOOKING:
            {
                this.removeFromQueue(ply);
                break;
            }
            default:
                break;
        }
    }

    onPlayerUpdate(req: MMQClientUpdate, ply: Player) : void {
        switch (req.getRequestedoperation()) {
            case MMQClientUpdate.QueueOperation.OP_JOIN:
            {
                this.handleJoin(ply);
                break;
            }
            case MMQClientUpdate.QueueOperation.OP_EXIT:
            {
                this.handleLeave(ply);
                break;
            }
            default:
                break;
        }
    }

    removeFromQueue(ply: Player) : boolean {
        const idx: number = this.queue.findIndex((el) => el.ply.uid === ply.uid);

        if (idx !== -1) {
            assert(this.getPlayerInfo(ply).matchState === MatchingState.STATE_LOOKING);
            this.queue.splice(idx, 1);
            this.getPlayerInfo(ply).matchState = MatchingState.STATE_IDLE;
            return true;
        }

        return false;
    }

    onPlayerDisconnect(ply: Player) : void {
        this.handleLeave(ply);
        delete this.players[ply.uid];
    }

    onPlayerConfirm(ply: Player) : ConfirmResponse {
        const info: PlayerInfo = this.getPlayerInfo(ply);
        const res: ConfirmResponse = new ConfirmResponse();

        if (info.matchState === MatchingState.STATE_CONFIRMING) {
            this.updatePlayerState(ply, MatchingState.STATE_CONFIRMED);
            this.initMatchIfReady(this.playerToMatch[ply.uid]);
            res.setStatus(Status.STATUS_OK);
        } else {
            res.setStatus(Status.STATUS_ERR);
        }

        return res;
    }

    onPlayerRequestMatchParams(ply: Player) : MatchParameters {
        const res: MatchParameters = new MatchParameters();
        const match = this.getPlayerMatch(ply);

        if (match?.parameters) {
            res.setStatus(MatchParameters.MatchStatus.OK);
            res.setIp(match.parameters.ip);
            res.setPort(match.parameters.port);
        } else {
            res.setStatus(MatchParameters.MatchStatus.ERR_NONEXISTENT);
        }
        return res;
    }
}
