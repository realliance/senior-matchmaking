import superagent from 'superagent';
import { Match } from './mmmatch';
import { Player } from './mmplayer';

export const getPlayerInfo = async (token: string) : Promise<Player|null> => {
    const res = await superagent.get(
        `${process.env.accountApi}/internal/users/${encodeURIComponent(token)}`,
    ).accept('Application/json');

    if (res.status === 200 && res?.body?.user) {
        return { uid: res.body.user.id };
    }

    return null;
};

export const notifyMatchInit = async (match: Match) : Promise<string|null> => {
    const res = await superagent.post(
        `${process.env.accountApi}/internal/match`,
    ).accept('Application/json')
        .send({
            match: {
                users: match.players.map((ply: Player) => ply.uid),
            },
        });

    if (res.status === 200 && res?.body?.match) {
        return res.body.match.id;
    }

    return null;
};
