import * as grpc from '@grpc/grpc-js';
import {IMatchMakingServer} from './proto/matchmaking_grpc_pb';
import {MatchMakingQueue} from './mmqueue'
import {Player, getPlayerInfo} from './mmplayer'
import * as mm from './proto/matchmaking_pb';

let playerQueue: MatchMakingQueue = new MatchMakingQueue();
export class MatchMakingServer implements IMatchMakingServer {
    [method: string]: grpc.UntypedHandleCall

    async queue(call: grpc.ServerDuplexStream<mm.MMQClientUpdate, mm.MMQServerUpdate>) : Promise<void> {
        let ply: Player = await getPlayerInfo(call.metadata.getMap()['token'] as String)
        playerQueue.onPlayerConnected(ply)

        call.on('data', (req: mm.MMQClientUpdate) => {
            playerQueue.onPlayerUpdate(req, ply, call.write)
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
        let ply: Player = await getPlayerInfo(call.metadata.getMap()['token'] as String)
        callback(null, playerQueue.onPlayerRequestMatchParams(ply))
    }
}
