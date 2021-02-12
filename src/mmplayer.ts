export interface Player {
    uid: number;
}

export const getPlayerInfo = async (token: string) : Promise<Player> => {
    return {uid: 0}
}
