import * as grpc from '@grpc/grpc-js';
import { IMatchMakingServer } from './proto/matchmaking_grpc_pb';
import { MatchMakingQueue } from './mmqueue';
import { Player } from './mmplayer';
import * as mm from './proto/matchmaking_pb';
import { MatchMakingSessions } from './mmsession';

const playerQueue: MatchMakingQueue = new MatchMakingQueue();
const sessions: MatchMakingSessions = new MatchMakingSessions();
export class MatchMakingServer implements IMatchMakingServer {
    [method: string]: grpc.UntypedHandleCall

    async queue(call: grpc.ServerDuplexStream<mm.MMQClientUpdate, mm.MMQServerUpdate>) : Promise<void> {
        const token: string = call.metadata.getMap().token as string;
        if (!await sessions.initConnection(token, call)) {
            call.end();
            return;
        }

        const ply: Player|null = sessions.validateSession(token);
        if (!ply) {
            call.end();
            return;
        }

        playerQueue.onPlayerConnected(ply, {
            write: call.write,
            end: call.end,
        });

        call.on('data', (req: mm.MMQClientUpdate) => {
            playerQueue.onPlayerUpdate(req, ply);
        });

        call.on('end', () => {
            playerQueue.onPlayerDisconnect(ply);
            sessions.clearSession(token);
        });
    }

    confirmMatch(call: grpc.ServerUnaryCall<mm.ConfirmRequest, mm.ConfirmResponse>, callback: grpc.sendUnaryData<mm.ConfirmResponse>) : void {
        const ply: Player|null = sessions.validateSession(call.metadata.getMap().token as string);
        if (!ply) {
            callback({ code: grpc.status.UNAUTHENTICATED });
            return;
        }

        callback(null, playerQueue.onPlayerConfirm(ply));
    }

    getMatchParameters(call: grpc.ServerUnaryCall<mm.MatchParametersRequest, mm.MatchParameters>, callback: grpc.sendUnaryData<mm.MatchParameters>) : void {
        const token: string = call.metadata.getMap().token as string;
        const ply: Player|null = sessions.validateSession(token);
        if (!ply) {
            callback({ code: grpc.status.UNAUTHENTICATED });
            return;
        }

        callback(null, playerQueue.onPlayerRequestMatchParams(ply));
    }
}
