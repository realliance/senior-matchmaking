import * as grpc from '@grpc/grpc-js';
import { MatchMakingClient } from '../proto/matchmaking_grpc_pb';
import { ConfirmRequest, MatchingState, MMQClientUpdate, MMQServerUpdate } from '../proto/matchmaking_pb';

console.log('MM RPC Client');

let findValue = (obj : any, val : any) => {
    let ret = null
    Object.keys(obj).forEach(key => {
        if (obj[key] === val) {
            ret = key
        }
    })
    return ret
}

const client = new MatchMakingClient('localhost:4000', grpc.credentials.createInsecure());

const md = new grpc.Metadata();
let sentJoin = false

md.set('token', process.argv[2] || 'test');
console.log("Using token", md.get('token').toString())
const stream = client.queue(md);
stream.on('data', (data: MMQServerUpdate) => {
    console.log("Matchmaking update")
    console.log("Status", findValue(MMQServerUpdate.QueueUpdate, data.getStatus()));
    console.log("Queue state", findValue(MatchingState, data.getQueueState()));

    if(!sentJoin) {
        let upd : MMQClientUpdate = new MMQClientUpdate();
        upd.setRequestedoperation(MMQClientUpdate.QueueOperation.OP_JOIN);
        stream.write(upd);
        sentJoin = true
    } else if(data.getStatus() == MMQServerUpdate.QueueUpdate.STATUS_STATEUPDATE) {
        switch(data.getQueueState()) {
            case MatchingState.STATE_CONFIRMING:
            {
                console.log('Sending confirm request')
                let req = new ConfirmRequest();
                client.confirmMatch(req, md, () => {})
                break;
            }
        }
    }
});

stream.on('end', () => {
    console.log('Stream ended.');
});

