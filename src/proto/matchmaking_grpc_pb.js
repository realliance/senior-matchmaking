// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_matchmaking_pb = require('../proto/matchmaking_pb.js');

function serialize_ConfirmRequest(arg) {
  if (!(arg instanceof proto_matchmaking_pb.ConfirmRequest)) {
    throw new Error('Expected argument of type ConfirmRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfirmRequest(buffer_arg) {
  return proto_matchmaking_pb.ConfirmRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfirmResponse(arg) {
  if (!(arg instanceof proto_matchmaking_pb.ConfirmResponse)) {
    throw new Error('Expected argument of type ConfirmResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfirmResponse(buffer_arg) {
  return proto_matchmaking_pb.ConfirmResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MMQClientUpdate(arg) {
  if (!(arg instanceof proto_matchmaking_pb.MMQClientUpdate)) {
    throw new Error('Expected argument of type MMQClientUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MMQClientUpdate(buffer_arg) {
  return proto_matchmaking_pb.MMQClientUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MMQServerUpdate(arg) {
  if (!(arg instanceof proto_matchmaking_pb.MMQServerUpdate)) {
    throw new Error('Expected argument of type MMQServerUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MMQServerUpdate(buffer_arg) {
  return proto_matchmaking_pb.MMQServerUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MatchParameters(arg) {
  if (!(arg instanceof proto_matchmaking_pb.MatchParameters)) {
    throw new Error('Expected argument of type MatchParameters');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MatchParameters(buffer_arg) {
  return proto_matchmaking_pb.MatchParameters.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MatchParametersRequest(arg) {
  if (!(arg instanceof proto_matchmaking_pb.MatchParametersRequest)) {
    throw new Error('Expected argument of type MatchParametersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MatchParametersRequest(buffer_arg) {
  return proto_matchmaking_pb.MatchParametersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var MatchMakingService = exports.MatchMakingService = {
  queue: {
    path: '/MatchMaking/Queue',
    requestStream: true,
    responseStream: true,
    requestType: proto_matchmaking_pb.MMQClientUpdate,
    responseType: proto_matchmaking_pb.MMQServerUpdate,
    requestSerialize: serialize_MMQClientUpdate,
    requestDeserialize: deserialize_MMQClientUpdate,
    responseSerialize: serialize_MMQServerUpdate,
    responseDeserialize: deserialize_MMQServerUpdate,
  },
  confirmMatch: {
    path: '/MatchMaking/ConfirmMatch',
    requestStream: false,
    responseStream: false,
    requestType: proto_matchmaking_pb.ConfirmRequest,
    responseType: proto_matchmaking_pb.ConfirmResponse,
    requestSerialize: serialize_ConfirmRequest,
    requestDeserialize: deserialize_ConfirmRequest,
    responseSerialize: serialize_ConfirmResponse,
    responseDeserialize: deserialize_ConfirmResponse,
  },
  getMatchParameters: {
    path: '/MatchMaking/GetMatchParameters',
    requestStream: false,
    responseStream: false,
    requestType: proto_matchmaking_pb.MatchParametersRequest,
    responseType: proto_matchmaking_pb.MatchParameters,
    requestSerialize: serialize_MatchParametersRequest,
    requestDeserialize: deserialize_MatchParametersRequest,
    responseSerialize: serialize_MatchParameters,
    responseDeserialize: deserialize_MatchParameters,
  },
};

exports.MatchMakingClient = grpc.makeGenericClientConstructor(MatchMakingService);
