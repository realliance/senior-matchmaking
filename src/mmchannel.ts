import { MMQServerUpdate } from "./proto/matchmaking_pb";

export interface PlayerChannel {
    write: (res: MMQServerUpdate) => boolean;
    end: () => void;
}
