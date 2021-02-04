import * as grpc from '@grpc/grpc-js';
import {IMatchMakingServer} from './proto/matchmaking_grpc_pb';
import {MatchMakingQueue} from './mmqueue'
import * as mm from './proto/matchmaking_pb';

let playerQueue: MatchMakingQueue = new MatchMakingQueue();
export class MatchMakingServer implements IMatchMakingServer {
    [method: string]: grpc.UntypedHandleCall

    async queue(call: grpc.ServerDuplexStream<mm.MMQClientUpdate, mm.MMQServerUpdate>) : Promise<void> {
        call.on('data', (req: mm.MMQClientUpdate) => {

        })

        call.on('end', () => {

        })
    }

    confirmMatch(call: grpc.ServerUnaryCall<mm.ConfirmRequest, mm.ConfirmResponse>, callback: grpc.sendUnaryData<mm.ConfirmResponse>) : void {

    }

    getMatchParameters(call: grpc.ServerUnaryCall<mm.MatchParametersRequest, mm.MatchParameters>, callback: grpc.sendUnaryData<mm.MatchParameters>) : void {

    }
}
