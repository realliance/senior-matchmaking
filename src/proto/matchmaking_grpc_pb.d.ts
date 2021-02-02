// package: 
// file: proto/matchmaking.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as proto_matchmaking_pb from "../proto/matchmaking_pb";

interface IMatchMakingService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    authenticate: IMatchMakingService_IAuthenticate;
    queue: IMatchMakingService_IQueue;
    confirmMatch: IMatchMakingService_IConfirmMatch;
    getMatchParameters: IMatchMakingService_IGetMatchParameters;
}

interface IMatchMakingService_IAuthenticate extends grpc.MethodDefinition<proto_matchmaking_pb.AuthenticateRequest, proto_matchmaking_pb.AuthenticateResponse> {
    path: "/MatchMaking/Authenticate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_matchmaking_pb.AuthenticateRequest>;
    requestDeserialize: grpc.deserialize<proto_matchmaking_pb.AuthenticateRequest>;
    responseSerialize: grpc.serialize<proto_matchmaking_pb.AuthenticateResponse>;
    responseDeserialize: grpc.deserialize<proto_matchmaking_pb.AuthenticateResponse>;
}
interface IMatchMakingService_IQueue extends grpc.MethodDefinition<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate> {
    path: "/MatchMaking/Queue";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<proto_matchmaking_pb.MMQClientUpdate>;
    requestDeserialize: grpc.deserialize<proto_matchmaking_pb.MMQClientUpdate>;
    responseSerialize: grpc.serialize<proto_matchmaking_pb.MMQServerUpdate>;
    responseDeserialize: grpc.deserialize<proto_matchmaking_pb.MMQServerUpdate>;
}
interface IMatchMakingService_IConfirmMatch extends grpc.MethodDefinition<proto_matchmaking_pb.ConfirmRequest, proto_matchmaking_pb.ConfirmResponse> {
    path: "/MatchMaking/ConfirmMatch";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_matchmaking_pb.ConfirmRequest>;
    requestDeserialize: grpc.deserialize<proto_matchmaking_pb.ConfirmRequest>;
    responseSerialize: grpc.serialize<proto_matchmaking_pb.ConfirmResponse>;
    responseDeserialize: grpc.deserialize<proto_matchmaking_pb.ConfirmResponse>;
}
interface IMatchMakingService_IGetMatchParameters extends grpc.MethodDefinition<proto_matchmaking_pb.MatchParametersRequest, proto_matchmaking_pb.MatchParameters> {
    path: "/MatchMaking/GetMatchParameters";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_matchmaking_pb.MatchParametersRequest>;
    requestDeserialize: grpc.deserialize<proto_matchmaking_pb.MatchParametersRequest>;
    responseSerialize: grpc.serialize<proto_matchmaking_pb.MatchParameters>;
    responseDeserialize: grpc.deserialize<proto_matchmaking_pb.MatchParameters>;
}

export const MatchMakingService: IMatchMakingService;

export interface IMatchMakingServer extends grpc.UntypedServiceImplementation {
    authenticate: grpc.handleUnaryCall<proto_matchmaking_pb.AuthenticateRequest, proto_matchmaking_pb.AuthenticateResponse>;
    queue: grpc.handleBidiStreamingCall<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate>;
    confirmMatch: grpc.handleUnaryCall<proto_matchmaking_pb.ConfirmRequest, proto_matchmaking_pb.ConfirmResponse>;
    getMatchParameters: grpc.handleUnaryCall<proto_matchmaking_pb.MatchParametersRequest, proto_matchmaking_pb.MatchParameters>;
}

export interface IMatchMakingClient {
    authenticate(request: proto_matchmaking_pb.AuthenticateRequest, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.AuthenticateResponse) => void): grpc.ClientUnaryCall;
    authenticate(request: proto_matchmaking_pb.AuthenticateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.AuthenticateResponse) => void): grpc.ClientUnaryCall;
    authenticate(request: proto_matchmaking_pb.AuthenticateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.AuthenticateResponse) => void): grpc.ClientUnaryCall;
    queue(): grpc.ClientDuplexStream<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate>;
    queue(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate>;
    queue(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate>;
    confirmMatch(request: proto_matchmaking_pb.ConfirmRequest, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.ConfirmResponse) => void): grpc.ClientUnaryCall;
    confirmMatch(request: proto_matchmaking_pb.ConfirmRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.ConfirmResponse) => void): grpc.ClientUnaryCall;
    confirmMatch(request: proto_matchmaking_pb.ConfirmRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.ConfirmResponse) => void): grpc.ClientUnaryCall;
    getMatchParameters(request: proto_matchmaking_pb.MatchParametersRequest, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.MatchParameters) => void): grpc.ClientUnaryCall;
    getMatchParameters(request: proto_matchmaking_pb.MatchParametersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.MatchParameters) => void): grpc.ClientUnaryCall;
    getMatchParameters(request: proto_matchmaking_pb.MatchParametersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.MatchParameters) => void): grpc.ClientUnaryCall;
}

export class MatchMakingClient extends grpc.Client implements IMatchMakingClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public authenticate(request: proto_matchmaking_pb.AuthenticateRequest, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.AuthenticateResponse) => void): grpc.ClientUnaryCall;
    public authenticate(request: proto_matchmaking_pb.AuthenticateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.AuthenticateResponse) => void): grpc.ClientUnaryCall;
    public authenticate(request: proto_matchmaking_pb.AuthenticateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.AuthenticateResponse) => void): grpc.ClientUnaryCall;
    public queue(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate>;
    public queue(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_matchmaking_pb.MMQClientUpdate, proto_matchmaking_pb.MMQServerUpdate>;
    public confirmMatch(request: proto_matchmaking_pb.ConfirmRequest, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.ConfirmResponse) => void): grpc.ClientUnaryCall;
    public confirmMatch(request: proto_matchmaking_pb.ConfirmRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.ConfirmResponse) => void): grpc.ClientUnaryCall;
    public confirmMatch(request: proto_matchmaking_pb.ConfirmRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.ConfirmResponse) => void): grpc.ClientUnaryCall;
    public getMatchParameters(request: proto_matchmaking_pb.MatchParametersRequest, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.MatchParameters) => void): grpc.ClientUnaryCall;
    public getMatchParameters(request: proto_matchmaking_pb.MatchParametersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.MatchParameters) => void): grpc.ClientUnaryCall;
    public getMatchParameters(request: proto_matchmaking_pb.MatchParametersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_matchmaking_pb.MatchParameters) => void): grpc.ClientUnaryCall;
}
