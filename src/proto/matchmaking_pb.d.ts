// package: 
// file: proto/matchmaking.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class MMQClientUpdate extends jspb.Message { 
    getRequestedoperation(): MMQClientUpdate.QueueOperation;
    setRequestedoperation(value: MMQClientUpdate.QueueOperation): MMQClientUpdate;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MMQClientUpdate.AsObject;
    static toObject(includeInstance: boolean, msg: MMQClientUpdate): MMQClientUpdate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MMQClientUpdate, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MMQClientUpdate;
    static deserializeBinaryFromReader(message: MMQClientUpdate, reader: jspb.BinaryReader): MMQClientUpdate;
}

export namespace MMQClientUpdate {
    export type AsObject = {
        requestedoperation: MMQClientUpdate.QueueOperation,
    }

    export enum QueueOperation {
    OP_JOIN = 0,
    OP_EXIT = 1,
    }

}

export class MMQServerUpdate extends jspb.Message { 
    getStatus(): MMQServerUpdate.QueueUpdate;
    setStatus(value: MMQServerUpdate.QueueUpdate): MMQServerUpdate;

    getEstQueueTime(): number;
    setEstQueueTime(value: number): MMQServerUpdate;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MMQServerUpdate.AsObject;
    static toObject(includeInstance: boolean, msg: MMQServerUpdate): MMQServerUpdate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MMQServerUpdate, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MMQServerUpdate;
    static deserializeBinaryFromReader(message: MMQServerUpdate, reader: jspb.BinaryReader): MMQServerUpdate;
}

export namespace MMQServerUpdate {
    export type AsObject = {
        status: MMQServerUpdate.QueueUpdate,
        estQueueTime: number,
    }

    export enum QueueUpdate {
    STATUS_CANCELLED_SOFT = 0,
    STATUS_CANCELLED_HARD = 1,
    STATUS_PENDING_CONFIRMATION = 2,
    STATUS_QUEUE_UPDATE = 3,
    STATUS_MATCH_FOUND = 4,
    STATUS_RECONNECT = 5,
    STATUS_ACK = 6,
    }

}

export class AuthenticateRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): AuthenticateRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticateRequest): AuthenticateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticateRequest;
    static deserializeBinaryFromReader(message: AuthenticateRequest, reader: jspb.BinaryReader): AuthenticateRequest;
}

export namespace AuthenticateRequest {
    export type AsObject = {
        token: string,
    }
}

export class AuthenticateResponse extends jspb.Message { 
    getStatus(): Status;
    setStatus(value: Status): AuthenticateResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticateResponse): AuthenticateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticateResponse;
    static deserializeBinaryFromReader(message: AuthenticateResponse, reader: jspb.BinaryReader): AuthenticateResponse;
}

export namespace AuthenticateResponse {
    export type AsObject = {
        status: Status,
    }
}

export class ConfirmRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfirmRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfirmRequest): ConfirmRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfirmRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfirmRequest;
    static deserializeBinaryFromReader(message: ConfirmRequest, reader: jspb.BinaryReader): ConfirmRequest;
}

export namespace ConfirmRequest {
    export type AsObject = {
    }
}

export class ConfirmResponse extends jspb.Message { 
    getStatus(): Status;
    setStatus(value: Status): ConfirmResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfirmResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfirmResponse): ConfirmResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfirmResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfirmResponse;
    static deserializeBinaryFromReader(message: ConfirmResponse, reader: jspb.BinaryReader): ConfirmResponse;
}

export namespace ConfirmResponse {
    export type AsObject = {
        status: Status,
    }
}

export class MatchParametersRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MatchParametersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: MatchParametersRequest): MatchParametersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MatchParametersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MatchParametersRequest;
    static deserializeBinaryFromReader(message: MatchParametersRequest, reader: jspb.BinaryReader): MatchParametersRequest;
}

export namespace MatchParametersRequest {
    export type AsObject = {
    }
}

export class MatchParameters extends jspb.Message { 
    getStatus(): MatchParameters.MatchStatus;
    setStatus(value: MatchParameters.MatchStatus): MatchParameters;

    getIp(): string;
    setIp(value: string): MatchParameters;

    getPort(): number;
    setPort(value: number): MatchParameters;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MatchParameters.AsObject;
    static toObject(includeInstance: boolean, msg: MatchParameters): MatchParameters.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MatchParameters, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MatchParameters;
    static deserializeBinaryFromReader(message: MatchParameters, reader: jspb.BinaryReader): MatchParameters;
}

export namespace MatchParameters {
    export type AsObject = {
        status: MatchParameters.MatchStatus,
        ip: string,
        port: number,
    }

    export enum MatchStatus {
    OK = 0,
    ERR_NONEXISTANT = 1,
    }

}

export enum Status {
    STATUS_OK = 0,
    STATUS_ERR = 1,
}
