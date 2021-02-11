import {MatchMakingSessions} from '../mmsession'

test('Can insert a session', async () => {
    const sessions: MatchMakingSessions = new MatchMakingSessions();
    sessions.createSession("test_token", {uid: 0});

    expect(sessions.hasSession("test_token")).toBe(true)
});
