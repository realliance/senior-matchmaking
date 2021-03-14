import superagent from 'superagent';
import { Match } from './mmmatch';
import { Player } from './mmplayer';

export const getPlayerInfo = async (token: string) : Promise<Player|null> => {
    const res = await superagent.get(
        `${process.env.accountApi || ''}/internal/users/${encodeURIComponent(token)}`,
    ).accept('application/json');

    if (res.status === 200 && res?.body?.user) {
        return { uid: res.body.user.id };
    }

    return null;
};

export const notifyMatchInit = async (match: Match) : Promise<string|null> => {
    if(process.env.DISABLE_API) {
        return match.parameters?.serverName || ""
    }

    const res = await superagent.post(
        `${process.env.accountApi || ''}/internal/match`,
    ).accept('application/json')
        .send({
            match: {
                users: match.players.map((ply: Player) => ply.uid),
                serverName: match.parameters?.serverName,
            },
        });

    if (res.status === 200 && res?.body?.match) {
        return res.body.match.id;
    }

    return null;
};
