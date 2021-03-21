import { Player } from './mmplayer';

export interface QueueEntry {
    ply: Player;
    entryTime: number;
}

export class MatchConfig {
    numPlayers = parseInt(process.env.MATCH_PLAYERS || '8', 10);

    confirmTimeout = 12 * 1000;
}

export interface ServerRecord {
    ip: string;
    port: number;
    serverName: string;
}

export class Match {
    players: Player[];

    confirmTimer: NodeJS.Timeout|null = null;

    parameters: ServerRecord|null = null;

    constructor(ql: QueueEntry[]) {
        this.players = ql.map((el: QueueEntry) => el.ply);
    }
}
