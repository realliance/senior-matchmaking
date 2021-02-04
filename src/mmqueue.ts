import {ConfirmResponse, MatchParameters, MMQClientUpdate, MMQServerUpdate, Status} from './proto/matchmaking_pb'
import {Player} from './mmplayer'

export class MatchMakingQueue {
    onPlayerConnected(ply: Player) : void {

    }

    onPlayerUpdate(req: MMQClientUpdate, ply: Player, write: (res: MMQServerUpdate) => boolean) : void {

    }

    onPlayerDisconnect(ply: Player) : void {

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
