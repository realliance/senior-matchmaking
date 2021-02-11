export interface Player {
    uid: number;
}

export async function getPlayerInfo(token: string) : Promise<Player> {
    return {uid: 0}
}
