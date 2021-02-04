import {MMQClientUpdate, MMQServerUpdate} from './proto/matchmaking_pb'
import {Player} from './mmplayer'
import {ServerDuplexStream} from '@grpc/grpc-js';

export class MatchMakingQueue {
    onPlayerUpdate(channel: ServerDuplexStream<MMQClientUpdate, MMQServerUpdate>, ply: Player) : void {

    }

    onPlayerDisconnect(ply: Player) : void {

    }
}
