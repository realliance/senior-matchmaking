export interface Player {
    uid: string;
}

export const getPlayerInfo = async (token: string) : Promise<Player> => ({ uid: "0" });
