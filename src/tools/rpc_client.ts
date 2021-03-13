import * as grpc from '@grpc/grpc-js';
import { MatchMakingClient } from '../proto/matchmaking_grpc_pb';
import { MMQClientUpdate, MMQServerUpdate } from '../proto/matchmaking_pb';

console.log('MM RPC Client');

const client = new MatchMakingClient('localhost:4000', grpc.credentials.createInsecure());

const md = new grpc.Metadata();

md.set('token', process.argv[2] || 'test');
console.log("Using token", md.get('token').toString())
const stream = client.queue(md);
stream.on('data', (data: MMQServerUpdate) => {
    console.log("Matchmaking update")
    console.log("Status", data.getStatus());
    console.log("Queue state", data.getQueueState());

    let upd : MMQClientUpdate = new MMQClientUpdate();
    upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_JOIN);
    stream.write(upd);
});

stream.on('end', () => {
    console.log('Stream ended.');
});

