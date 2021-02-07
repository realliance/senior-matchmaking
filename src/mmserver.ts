import * as grpc from '@grpc/grpc-js';
import {IMatchMakingServer} from './proto/matchmaking_grpc_pb';
import {MatchMakingQueue} from './mmqueue'
import {Player, getPlayerInfo} from './mmplayer'
import * as mm from './proto/matchmaking_pb';
import {MatchMakingSessions} from './mmsession'

let playerQueue: MatchMakingQueue = new MatchMakingQueue();
let sessions: MatchMakingSessions = new MatchMakingSessions();
export class MatchMakingServer implements IMatchMakingServer {
    [method: string]: grpc.UntypedHandleCall

    async queue(call: grpc.ServerDuplexStream<mm.MMQClientUpdate, mm.MMQServerUpdate>) : Promise<void> {
        let token: String = call.metadata.getMap()['token'] as String
        let ply: Player = await getPlayerInfo(token)
        playerQueue.onPlayerConnected(ply, {
            write: call.write,
            end: call.end
        })

        call.on('data', (req: mm.MMQClientUpdate) => {
            playerQueue.onPlayerUpdate(req, ply)
        })

        call.on('end', () => {
            playerQueue.onPlayerDisconnect(ply)
        })
    }

    async confirmMatch(call: grpc.ServerUnaryCall<mm.ConfirmRequest, mm.ConfirmResponse>, callback: grpc.sendUnaryData<mm.ConfirmResponse>) : Promise<void> {
        let ply: Player = await getPlayerInfo(call.metadata.getMap()['token'] as String)
        callback(null, playerQueue.onPlayerConfirm(ply))
    }

    async getMatchParameters(call: grpc.ServerUnaryCall<mm.MatchParametersRequest, mm.MatchParameters>, callback: grpc.sendUnaryData<mm.MatchParameters>) : Promise<void> {
        let token: String = call.metadata.getMap()['token'] as String
        let ply: Player = await getPlayerInfo(token)
        callback(null, playerQueue.onPlayerRequestMatchParams(ply))
    }
}
