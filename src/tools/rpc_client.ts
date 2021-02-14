import * as grpc from '@grpc/grpc-js';
import { MatchMakingClient } from '../proto/matchmaking_grpc_pb';
import { MMQServerUpdate } from '../proto/matchmaking_pb';

const client = new MatchMakingClient('localhost:4000', grpc.credentials.createInsecure());

const md = new grpc.Metadata();
md.set('token', 'test');

const stream = client.queue(md);
stream.on('data', (data: MMQServerUpdate) => {
    console.log(data);
});

stream.on('end', () => {
    console.log('Stream ended.');
});

console.log('MM RPC Client');
