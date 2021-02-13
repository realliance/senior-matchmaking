import * as grpc from '@grpc/grpc-js';
import { IMatchMakingServer } from './proto/matchmaking_grpc_pb';
import { MatchMakingQueue } from './mmqueue';
import { Player } from './mmplayer';
import * as mm from './proto/matchmaking_pb';
import { MatchMakingSessions } from './mmsession';
import { getPlayerInfo } from './mmapi';

const playerQueue: MatchMakingQueue = new MatchMakingQueue();
const sessions: MatchMakingSessions = new MatchMakingSessions();
export class MatchMakingServer implements IMatchMakingServer {
    [method: string]: grpc.UntypedHandleCall

    async queue(call: grpc.ServerDuplexStream<mm.MMQClientUpdate, mm.MMQServerUpdate>) : Promise<void> {
        const token: string = call.metadata.getMap().token as string;
        const ply: Player|null = await getPlayerInfo(token);
        if (!ply) return;

        playerQueue.onPlayerConnected(ply, {
            write: call.write,
            end: call.end,
        });

        call.on('data', (req: mm.MMQClientUpdate) => {
            playerQueue.onPlayerUpdate(req, ply);
        });

        call.on('end', () => {
            playerQueue.onPlayerDisconnect(ply);
        });
    }

    async confirmMatch(call: grpc.ServerUnaryCall<mm.ConfirmRequest, mm.ConfirmResponse>, callback: grpc.sendUnaryData<mm.ConfirmResponse>) : Promise<void> {
        const ply: Player|null = await getPlayerInfo(call.metadata.getMap().token as string);
        if (!ply) return;

        callback(null, playerQueue.onPlayerConfirm(ply));
    }

    async getMatchParameters(call: grpc.ServerUnaryCall<mm.MatchParametersRequest, mm.MatchParameters>, callback: grpc.sendUnaryData<mm.MatchParameters>) : Promise<void> {
        const token: string = call.metadata.getMap().token as string;
        const ply: Player|null = await getPlayerInfo(token);
        if (!ply) return;

        callback(null, playerQueue.onPlayerRequestMatchParams(ply));
    }
}
