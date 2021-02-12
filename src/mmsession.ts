import { Player } from './mmplayer';

export class MatchMakingSessions {
    sessions: Record<string, Player>;

    constructor() {
        this.sessions = {};
    }

    createSession(token: string, ply: Player) : void {
        this.sessions[token] = ply;
    }

    hasSession(token: string) : boolean {
        return this.sessions[token] !== undefined;
    }
}
