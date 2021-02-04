export interface Player {
    uid: number;
}

export async function getPlayerInfo(token: String) : Promise<Player> {
    return {uid: 0}
}
