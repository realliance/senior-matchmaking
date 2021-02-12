import { Player } from './mmplayer';

export type PlayerUID = string;

export interface QueueEntry {
    ply: Player;
    entryTime: number;
}

export class MatchConfig {
    numPlayers = 8;

    confirmTimeout = 12 * 1000;
}

export interface MatchRecord {
    ip: string;
    port: number;
}

export class Match {
    players: Player[];

    confirmTimer: NodeJS.Timeout|null = null;

    parameters: MatchRecord|null = null;

    constructor(ql: QueueEntry[]) {
        this.players = ql.map((el: QueueEntry) => el.ply);
    }
}
