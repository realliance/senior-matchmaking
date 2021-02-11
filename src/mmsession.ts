import {Player} from './mmplayer'

export class MatchMakingSessions {
    _sessions: Record<string, Player>;

    constructor() {
        this._sessions = {}
    }

    createSession(token: string, ply: Player) : void {
        this._sessions[token] = ply;
    }

    hasSession(token: string) : boolean {
        return this._sessions[token] != undefined
    }
}
