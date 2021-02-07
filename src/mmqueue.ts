import {ConfirmResponse, MatchParameters, MMQClientUpdate, MMQServerUpdate, Status} from './proto/matchmaking_pb'
import {Player} from './mmplayer'
import { PlayerChannel } from './mmchannel';

enum MatchingState {
    STATE_LOOKING,
    STATE_CONFIRMING,
    STATE_INGAME,
    STATE_IDLE
}

interface QueueEntry {
    ply: Player;
    entryTime: number;
}

interface PlayerInfo {
    matchState: MatchingState;
    channel: PlayerChannel;
}

export class MatchMakingQueue {
    players: Record<number, PlayerInfo> = {};
    queue: Array<QueueEntry> = [];

    getPlayerInfo(ply: Player) : PlayerInfo {
        return this.players[ply.uid];
    }

    onPlayerConnected(ply: Player, channel: PlayerChannel) : void {
        this.players[ply.uid] = {
            matchState: MatchingState.STATE_IDLE,
            channel: channel
        }
    }

    //serveQueue
    //Pull out the next batch of players when possible
    //Mark them as STATE_CONFIRMING, sent cond notices
    //Build a Match with the players, insert into matches
    //init timeout, players that haven't confirmed at this point get hard kicked
    //otherwise transfer all players to STATE_INGAME, launch a server, and mark the match as active


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
