import { ServerDuplexStream } from '@grpc/grpc-js';
import { Player, PlayerUID } from './mmplayer';
import { MMQClientUpdate, MMQServerUpdate } from './proto/matchmaking_pb';
import { getPlayerInfo } from './mmapi';

export type PlayerConnection = ServerDuplexStream<MMQClientUpdate, MMQServerUpdate>;

interface Session {
    player: Player;
    connection: PlayerConnection;
}

export class MatchMakingSessions {
    sessions: Record<string, Session>;

    playerToToken: Record<PlayerUID, string>;

    authenticationDisabled = false;

    constructor() {
        this.sessions = {};
        this.playerToToken = {};

        this.authenticationDisabled = (process.env.DISABLE_AUTH || '').toLowerCase() === 'true';
    }

    createSession(token: string, ply: Player, conn: PlayerConnection) : void {
        this.sessions[token] = {
            player: ply,
            connection: conn,
        };

        this.playerToToken[ply.uid] = token;
    }

    hasSession(token: string) : boolean {
        return this.sessions[token] !== undefined;
    }

    getSession(token: string) : Session {
        return this.sessions[token];
    }

    async initConnection(token: string, call: PlayerConnection) : Promise<boolean> {
        if (this.hasSession(token)) {
            this.kickSessionByToken(token);
        }

        let ply: Player|null = null;
        if (!this.authenticationDisabled) {
            // Retreive player info from the accounts service, or null if the token is invalid.
            ply = await getPlayerInfo(token);
        } else {
            // Use the user provided token as the player id when auth is disabled.
            ply = {
                uid: token,
            };
        }

        if (ply === null) {
            call.end();
            return false;
        }

        this.createSession(token, ply, call);
        return true;
    }

    validateSession(token: string) : Player|null {
        if (this.hasSession(token)) {
            return this.getSession(token).player;
        }

        return null;
    }

    clearSession(token: string) : void {
        if (this.hasSession(token)) {
            const ply: Player = this.sessions[token].player;
            delete this.playerToToken[ply.uid];
            delete this.sessions[token];
        }
    }

    kickSessionByToken(token: string) : void {
        const session = this.getSession(token);
        session.connection.end();
        this.clearSession(token);
    }

    kickSessionByPlayer(ply: Player) : void {
        const token = this.playerToToken[ply.uid];
        if (token) {
            this.kickSessionByToken(token);
        }
    }
}
