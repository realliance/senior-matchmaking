import { Player } from '../mmplayer';
import {MatchMakingQueue} from '../mmqueue'
import { MatchingState, MMQClientUpdate } from '../proto/matchmaking_pb';

let queue: MatchMakingQueue = new MatchMakingQueue();
let ply: Player = {uid:0};

beforeEach(() => {
    queue = new MatchMakingQueue();
    ply = {uid: 0};
})

function getTestChannel() {
    return {write: () => true, end: () => null}
}

function getOpJoinUpdate() {
    let upd: MMQClientUpdate = new MMQClientUpdate();
    upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_JOIN)
    return upd
}

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
