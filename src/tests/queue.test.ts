import { Player } from '../mmplayer';
import {MatchMakingQueue} from '../mmqueue'
import { ConfirmResponse, MatchingState, MMQClientUpdate, Status } from '../proto/matchmaking_pb';

process.on('unhandledRejection', console.warn)

let queue: MatchMakingQueue = new MatchMakingQueue();
let ply: Player = {uid:0};

beforeEach(() => {
    queue = new MatchMakingQueue();
    ply = {uid: 0};
})

function getTestChannel() {
    return {write: () => true, end: () => null}
}

function getOpJoinUpdate(): MMQClientUpdate {
    const upd: MMQClientUpdate = new MMQClientUpdate();
    upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_JOIN)
    return upd
}

function getOpExitUpdate(): MMQClientUpdate {
    const upd: MMQClientUpdate = new MMQClientUpdate();
    upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_EXIT)
    return upd
}

function getTestPlayers(numberOfPlayers: number, start = 0): Player[] {
    const plys: Player[] = [...Array(numberOfPlayers).keys()].map((val)=>({uid:val+start}))
    return plys
}

function expectPlayersAreInState(plys: Player[], state: MatchingState) : void {
    plys.forEach((ply) => {
        expect(queue.getPlayerInfo(ply).matchState).toBe(state)
    })
}

describe('Single-player queue correctness', () => {
    test('Player is stored on connection', () => {
        queue.onPlayerConnected(ply, getTestChannel())
        expect(queue.players[ply.uid]).toBeTruthy()
        expect(queue.getPlayerInfo(ply)).toBeTruthy()
    })

    test('Player initially has STATE_IDLE', () => {
        queue.onPlayerConnected(ply, getTestChannel())
        expect(queue.getPlayerInfo(ply).matchState).toBe(MatchingState.STATE_IDLE)
    })

    test('OP_JOIN joins a player to the queue', () => {
        queue.onPlayerConnected(ply, getTestChannel())
        queue.onPlayerUpdate(getOpJoinUpdate(), ply)
        expect(queue.queue.length).toBe(1)
    })

    test('Player can be removed from queue', () => {
        queue.onPlayerConnected(ply, getTestChannel())
        queue.onPlayerUpdate(getOpJoinUpdate(), ply)
        expect(queue.queue.length).toBe(1)
        expect(queue.removeFromQueue(ply)).toBeTruthy()

        //Queue should be 0 afterwards
        expect(queue.queue.length).toBe(0)

        //Removing again should fail
        expect(queue.removeFromQueue(ply)).toBeFalsy()
    })

    test('Player can leave queue', () => {
        queue.onPlayerConnected(ply, getTestChannel())
        queue.onPlayerUpdate(getOpJoinUpdate(), ply)
        expect(queue.queue.length).toBe(1)

        queue.onPlayerUpdate(getOpExitUpdate(), ply)
        expect(queue.queue.length).toBe(0)
    })

    test('Player is cleaned up after disconnecting', () => {
        queue.onPlayerConnected(ply, getTestChannel())
        queue.onPlayerUpdate(getOpJoinUpdate(), ply)
        expect(queue.players[ply.uid]).toBeTruthy()

        queue.onPlayerDisconnect(ply)

        expect(queue.queue.length).toBe(0)
        expect(queue.players[ply.uid]).toBeUndefined()
    })
})

describe('Matchmaking functionality', () => {
    test('Match can be setup', () => {
        const plys: Player[] = getTestPlayers(8)
        plys.forEach((ply) => queue.onPlayerConnected(ply, getTestChannel()))
        expect(queue.serveQueue()).toBeFalsy()
        expectPlayersAreInState(plys, MatchingState.STATE_IDLE)

        plys.forEach((ply) => queue.onPlayerUpdate(getOpJoinUpdate(), ply))
        expectPlayersAreInState(plys, MatchingState.STATE_LOOKING)
        expect(queue.serveQueue()).toBeTruthy()
        expectPlayersAreInState(plys, MatchingState.STATE_CONFIRMING)

        plys.forEach((ply) => {
            expect(queue.onPlayerConfirm(ply).getStatus()).toBe(Status.STATUS_OK)
        })

        expectPlayersAreInState(plys, MatchingState.STATE_INGAME)
    })
})
