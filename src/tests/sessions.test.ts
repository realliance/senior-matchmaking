import { MatchMakingSessions, PlayerConnection } from '../mmsession';
import * as mmapi from '../mmapi'

jest.mock('../mmapi');
const mockedmmapi = mmapi as jest.Mocked<typeof mmapi>;
mockedmmapi.getPlayerInfo.mockResolvedValue({uid: '0'})
let sessions: MatchMakingSessions;
const token = 'test_token';

beforeEach(() => {
    sessions = new MatchMakingSessions();
})

describe('Session storage functionality', () => {
    test('Can insert a session', async () => {
        sessions.createSession(token, {uid: '0'}, {} as PlayerConnection);

        expect(sessions.hasSession(token)).toBe(true);
    });

    test('initConnection creates a session', async () => {
        await sessions.initConnection(token, {} as PlayerConnection);
        expect(sessions.hasSession(token)).toBe(true);
    });

    test('validateSession can retreive the player', async () => {
        await sessions.initConnection(token, {} as PlayerConnection);
        expect(sessions.validateSession(token)?.uid).toBe('0')
    });

    test('Clearing a session properly deletes player records', async () => {
        await sessions.initConnection(token, {} as PlayerConnection);

        expect(Object.keys(sessions.playerToToken).length).toBe(1)
        expect(Object.keys(sessions.sessions).length).toBe(1)

        sessions.clearSession(token);
        expect(Object.keys(sessions.playerToToken).length).toBe(0)
        expect(Object.keys(sessions.sessions).length).toBe(0)
    });

    test('validateSession can retreive the player', async () => {
        expect(sessions.validateSession(token)).toBe(null);
    });
});

describe('Session Management', () => {
    test('Duplicate session kicks earlier session', async () => {
        const endMock = jest.fn();
        let res = await sessions.initConnection(token, <unknown>{end: endMock} as PlayerConnection);
        expect(res).toBe(true);
        expect(endMock).toBeCalledTimes(0);
        let res2 = await sessions.initConnection(token, <unknown>{end: endMock} as PlayerConnection);
        expect(res2).toBe(true);
        expect(Object.keys(sessions.playerToToken).length).toBe(1);
        expect(Object.keys(sessions.sessions).length).toBe(1);
        expect(endMock).toBeCalledTimes(1);
    });

    test('Player can be kicked by token', async () => {
        const endMock = jest.fn();
        await sessions.initConnection(token, <unknown>{end: endMock} as PlayerConnection);
        sessions.kickSessionByToken(token);
        expect(Object.keys(sessions.playerToToken).length).toBe(0)
        expect(Object.keys(sessions.sessions).length).toBe(0)
        expect(endMock).toBeCalled()
    });

    test('Player can be kicked by player UID', async () => {
        const endMock = jest.fn();
        await sessions.initConnection(token, <unknown>{end: endMock} as PlayerConnection);
        sessions.kickSessionByPlayer({uid: '0'});
        expect(Object.keys(sessions.playerToToken).length).toBe(0)
        expect(Object.keys(sessions.sessions).length).toBe(0)
        expect(endMock).toBeCalled()
    });
})
