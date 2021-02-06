import {Player} from './mmplayer'

export class MatchMakingSessions {
    _sessions: Record<string, Player>;

    constructor() {
        this._sessions = {}
    }

    createSession(token: string, ply: Player) {
        this._sessions[token] = ply;
    }

    hasSession(token: string) {
        return this._sessions[token] != undefined
    }
}
