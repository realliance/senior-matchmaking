import * as grpc from '@grpc/grpc-js';
import Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import { MatchMakingService } from './proto/matchmaking_grpc_pb';
import { MatchMakingServer } from './mmserver';

global.rootdir = __dirname || process.cwd();

if (process.env.NODE_ENV === 'production') {
    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            release: `senior-matchmaking@${process.env.RELEASE}`,
            integrations: [
                new RewriteFrames({
                    root: global.rootdir,
                }),
            ],
        });
    } else {
        console.warn('Warning: SENTRY_DSN not supplied!');
    }
}

const server = new grpc.Server();

server.addService(MatchMakingService, new MatchMakingServer());
server.bindAsync('0.0.0.0:4000', grpc.ServerCredentials.createInsecure(), (error: Error | null) => {
    if (error) throw error;
    server.start();
});

process.on('unhandledRejection', (error: Error | null) => {
    console.log('Unhandled Rejection');
    if (error) console.log(error);
});
