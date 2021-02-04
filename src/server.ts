import * as grpc from '@grpc/grpc-js';
import {MatchMakingService} from './proto/matchmaking_grpc_pb';
import {MatchMakingServer} from './mmserver'
const server = new grpc.Server()

server.addService(MatchMakingService, new MatchMakingServer())
server.bindAsync("0.0.0.0:4000", grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
    if(error)
        throw error
    server.start()
})
