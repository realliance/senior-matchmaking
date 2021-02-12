import { Player } from '../mmplayer';
import { MatchMakingQueue } from '../mmqueue';
import { MatchingState, MMQClientUpdate, Status } from '../proto/matchmaking_pb';

let queue: MatchMakingQueue = new MatchMakingQueue();

beforeEach(() => {
    queue = new MatchMakingQueue();
});

const getTestChannel = () => ({ write: () => true, end: () => null });

const getOpJoinUpdate = (): MMQClientUpdate => {
    const upd: MMQClientUpdate = new MMQClientUpdate();
    upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_JOIN);
    return upd;
};

const getOpExitUpdate = (): MMQClientUpdate => {
    const upd: MMQClientUpdate = new MMQClientUpdate();
    upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_EXIT);
    return upd;
};

const getTestPlayers = (numberOfPlayers: number, start = 0): Player[] => {
    const plys: Player[] = [...Array(numberOfPlayers).keys()].map((val) => ({ uid: val + start }));
    return plys;
};

const expectPlayersAreInState = (plys: Player[], state: MatchingState) : void => {
    plys.forEach((ply) => {
        expect(queue.getPlayerInfo(ply).matchState).toBe(state);
    });
};

describe('Single-player queue correctness', () => {
    test('Player is stored on connection', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        expect(queue.players[ply.uid]).toBeTruthy();
        expect(queue.getPlayerInfo(ply)).toBeTruthy();
    });

    test('Player initially has STATE_IDLE', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        expect(queue.getPlayerInfo(ply).matchState).toBe(MatchingState.STATE_IDLE);
    });

    test('OP_JOIN joins a player to the queue', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        queue.onPlayerUpdate(getOpJoinUpdate(), ply);
        expect(queue.queue.length).toBe(1);
    });

    test('Player can be removed from queue', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        queue.onPlayerUpdate(getOpJoinUpdate(), ply);
        expect(queue.queue.length).toBe(1);
        expect(queue.removeFromQueue(ply)).toBeTruthy();

        // Queue should be 0 afterwards
        expect(queue.queue.length).toBe(0);

        // Removing again should fail
        expect(queue.removeFromQueue(ply)).toBeFalsy();
    });

    test('Player can leave queue', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        queue.onPlayerUpdate(getOpJoinUpdate(), ply);
        expect(queue.queue.length).toBe(1);

        queue.onPlayerUpdate(getOpExitUpdate(), ply);
        expect(queue.queue.length).toBe(0);
    });

    test('Player is cleaned up after disconnecting', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        queue.onPlayerUpdate(getOpJoinUpdate(), ply);
        expect(queue.players[ply.uid]).toBeTruthy();

        queue.onPlayerDisconnect(ply);

        expect(queue.queue.length).toBe(0);
        expect(queue.players[ply.uid]).toBeUndefined();
    });

    test('Correct player state after issuing OP_EXIT', () => {
        const ply: Player = { uid: 0 };
        queue.onPlayerConnected(ply, getTestChannel());
        queue.onPlayerUpdate(getOpJoinUpdate(), ply);

        queue.onPlayerUpdate(getOpExitUpdate(), ply);
        expect(queue.queue.length).toBe(0);
        expectPlayersAreInState([ply], MatchingState.STATE_IDLE);
        expect(queue.players[ply.uid]).toBeTruthy();
    });
});

describe('Matchmaking functionality', () => {
    test('Match can be setup', () => {
        const plys: Player[] = getTestPlayers(8);
        plys.forEach((ply) => queue.onPlayerConnected(ply, getTestChannel()));
        expect(queue.serveQueue()).toBeFalsy();
        expectPlayersAreInState(plys, MatchingState.STATE_IDLE);

        plys.forEach((ply) => queue.onPlayerUpdate(getOpJoinUpdate(), ply));
        expectPlayersAreInState(plys, MatchingState.STATE_LOOKING);
        expect(queue.serveQueue()).toBeTruthy();
        expectPlayersAreInState(plys, MatchingState.STATE_CONFIRMING);

        plys.forEach((ply) => {
            expect(queue.onPlayerConfirm(ply).getStatus()).toBe(Status.STATUS_OK);
        });

        expectPlayersAreInState(plys, MatchingState.STATE_INGAME);
    });

    test('Match cancelled if player disconnects', () => {
        const plys: Player[] = getTestPlayers(8);
        plys.forEach((ply) => queue.onPlayerConnected(ply, getTestChannel()));
        plys.forEach((ply) => queue.onPlayerUpdate(getOpJoinUpdate(), ply));
        queue.serveQueue();

        expectPlayersAreInState(plys, MatchingState.STATE_CONFIRMING);

        plys.slice(1, 8).forEach((ply) => {
            expect(queue.onPlayerConfirm(ply).getStatus()).toBe(Status.STATUS_OK);
        });

        queue.onPlayerDisconnect(plys[0]);

        // Only 7 of the 8 players should be present
        expect(Object.keys(queue.players).length).toBe(7);

        // Match refs should all be cleared
        expect(Object.keys(queue.playerToMatch).length).toBe(0);

        // The 7 players should be back in queue
        expect(queue.queue.length).toBe(7);

        // Remaining players should have the proper state
        expectPlayersAreInState(plys.slice(1, 8), MatchingState.STATE_LOOKING);
    });

    test('Match cancelled if player sends OP_EXIT', () => {
        const plys: Player[] = getTestPlayers(8);
        plys.forEach((ply) => queue.onPlayerConnected(ply, getTestChannel()));
        plys.forEach((ply) => queue.onPlayerUpdate(getOpJoinUpdate(), ply));
        queue.serveQueue();

        expectPlayersAreInState(plys, MatchingState.STATE_CONFIRMING);

        plys.slice(1, 8).forEach((ply) => {
            expect(queue.onPlayerConfirm(ply).getStatus()).toBe(Status.STATUS_OK);
        });

        queue.onPlayerUpdate(getOpExitUpdate(), plys[0]);

        // All 8 players should be present in the player roster
        expect(Object.keys(queue.players).length).toBe(8);

        // Match refs should all be cleared
        expect(Object.keys(queue.playerToMatch).length).toBe(0);

        // The 7 players should be back in queue
        expect(queue.queue.length).toBe(7);

        // Remaining players should have the proper state
        expectPlayersAreInState(plys.slice(1, 8), MatchingState.STATE_LOOKING);
        expect(queue.getPlayerInfo(plys[0]).matchState).toBe(MatchingState.STATE_IDLE);
    });

    test('Match cancelled if confirmation stage times out', async () => {
        // Lower confirmation timeout
        queue.config.confirmTimeout = 50;

        const plys: Player[] = getTestPlayers(8);
        plys.forEach((ply) => queue.onPlayerConnected(ply, getTestChannel()));
        plys.forEach((ply) => queue.onPlayerUpdate(getOpJoinUpdate(), ply));
        queue.serveQueue();

        expectPlayersAreInState(plys, MatchingState.STATE_CONFIRMING);

        plys.slice(2, 8).forEach((ply) => {
            expect(queue.onPlayerConfirm(ply).getStatus()).toBe(Status.STATUS_OK);
        });

        // Wait for the confirmation timeout to expire
        await new Promise((resolve) => {
            setTimeout(resolve, 100);
        });

        // All 8 players should be present in the player roster
        expect(Object.keys(queue.players).length).toBe(8);

        // Match refs should all be cleared
        expect(Object.keys(queue.playerToMatch).length).toBe(0);

        // 6 of the players should be back in queue
        expect(queue.queue.length).toBe(6);

        // Remaining players should have the proper state
        expectPlayersAreInState(plys.slice(2, 8), MatchingState.STATE_LOOKING);
        expectPlayersAreInState(plys.slice(0, 2), MatchingState.STATE_IDLE);
    });
});
