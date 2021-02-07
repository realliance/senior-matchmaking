import {ConfirmResponse, MatchParameters, MMQClientUpdate, MMQServerUpdate, Status, MatchingState} from './proto/matchmaking_pb'
import {Player} from './mmplayer'
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
    numPlayers: number = 8;
    confirmTimeout: number = 12;
}

class Match {
    players: Player[];
    confirmTimer: NodeJS.Timeout|null = null;

    constructor(ql: QueueEntry[]) {
        this.players = ql.map((el: QueueEntry) => el.ply)
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

    onPlayerConnected(ply: Player, channel: PlayerChannel) : void {
        this.players[ply.uid] = {
            matchState: MatchingState.STATE_IDLE,
            channel: channel
        }
    }

    updatePlayerState(ply: Player, state: MatchingState) {
        let info: PlayerInfo = this.getPlayerInfo(ply)
        info.matchState = state

        let upd: MMQServerUpdate = new MMQServerUpdate();
        upd.setStatus(MMQServerUpdate.QueueUpdate.STATUS_STATEUPDATE);
        upd.setQueueState(info.matchState);

        info.channel.write(upd);
    }

    cancelMatch(match: Match) : void {

    }

    //serveQueue
    //Pull out the next batch of players when possible
    //Mark them as STATE_CONFIRMING, sent cond notices
    //Build a Match with the players, insert into matches
    //init timeout, players that haven't confirmed at this point get hard kicked
    //otherwise transfer all players to STATE_INGAME, launch a server, and mark the match as active

    serveQueue() : boolean {
        if(this.queue.length < this.config.numPlayers)
            return false;

        let entries: QueueEntry[] = this.queue.splice(0, this.config.numPlayers);

        //Construct a new match
        let match: Match = new Match(entries)

        entries.forEach((qe: QueueEntry) => {
            //Mark all players as confirming
            this.updatePlayerState(qe.ply, MatchingState.STATE_CONFIRMING)
        })

        //Setup a timer to timeout the match queue
        //This timer will be cancelled if everyone confirms
        match.confirmTimer = setTimeout(() => {
            let unconfirmedPlayers: Player[] = match.players.filter((ply:Player) => this.getPlayerInfo(ply).matchState != MatchingState.STATE_CONFIRMED)

            //Match needs to be cancelled
            if(unconfirmedPlayers.length > 0)
                this.cancelMatch(match)
        }, this.config.confirmTimeout * 1000)

        return true;
    }

    handleJoin(ply: Player) : void {
        let info: PlayerInfo = this.getPlayerInfo(ply)

        // Player can enter the queue
        if(info.matchState == MatchingState.STATE_IDLE) {
            info.matchState = MatchingState.STATE_LOOKING;
            this.queue.push({
                ply: ply,
                entryTime: Date.now()/1000
            })
        }
    }

    handleLeave(ply: Player) : void {
        let info: PlayerInfo = this.getPlayerInfo(ply)

        //Player can only leave during the confirmation phase and searching
        switch(info.matchState) {
            case MatchingState.STATE_CONFIRMING:
            {
                break;
            }
            case MatchingState.STATE_LOOKING:
            {
                break;
            }

        }
    }

    onPlayerUpdate(req: MMQClientUpdate, ply: Player) : void {
        switch(req.getRequestedoperation()) {
            case MMQClientUpdate.QueueOperation.OP_JOIN:
            {
                this.handleJoin(ply);
                break
            }
            case MMQClientUpdate.QueueOperation.OP_EXIT:
            {
                this.handleLeave(ply);
                break
            }
            default:
                break
        }
    }

    removeFromQueue(ply: Player) : boolean {
        let idx: number = this.queue.findIndex((el) => {
            return el.ply.uid === ply.uid
        })

        if(idx !== -1) {
            this.queue.splice(idx, 1);
            return true
        }

        return false
    }

    onPlayerDisconnect(ply: Player) : void {
        let info: PlayerInfo = this.getPlayerInfo(ply)

        // Player needs to be pulled from the queue
        if(info.matchState == MatchingState.STATE_LOOKING) {

        }
    }

    onPlayerConfirm(ply: Player) : ConfirmResponse {
        let res: ConfirmResponse = new ConfirmResponse()
        res.setStatus(Status.STATUS_OK)
        return res
    }

    onPlayerRequestMatchParams(ply: Player) : MatchParameters {
        let res: MatchParameters = new MatchParameters()
        return res
    }
}
