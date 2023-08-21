/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface WormholeBaseUpgradeableInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
      | "updateWormhole"
      | "updateWormholeConsistencyLevel"
      | "updateWormholeRemote"
      | "withdrawRelayerFees"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Initialized"
      | "OwnershipTransferred"
      | "UpdateWormhole"
      | "UpdateWormholeChainId"
      | "UpdateWormholeConsistencyLevel"
      | "UpdateWormholeRemote"
      | "WormholeReceive"
      | "WormholeSend"
  ): EventFragment;

  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateWormhole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateWormholeConsistencyLevel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateWormholeRemote",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawRelayerFees",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateWormhole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateWormholeConsistencyLevel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateWormholeRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRelayerFees",
    data: BytesLike
  ): Result;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateWormholeEvent {
  export type InputTuple = [newWormhole: AddressLike, oldWormhole: AddressLike];
  export type OutputTuple = [newWormhole: string, oldWormhole: string];
  export interface OutputObject {
    newWormhole: string;
    oldWormhole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateWormholeChainIdEvent {
  export type InputTuple = [
    newWormholeChainId: BigNumberish,
    oldWormholeChainId: BigNumberish
  ];
  export type OutputTuple = [
    newWormholeChainId: bigint,
    oldWormholeChainId: bigint
  ];
  export interface OutputObject {
    newWormholeChainId: bigint;
    oldWormholeChainId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateWormholeConsistencyLevelEvent {
  export type InputTuple = [
    newConsistencyLevel: BigNumberish,
    oldConsistencyLevel: BigNumberish
  ];
  export type OutputTuple = [
    newConsistencyLevel: bigint,
    oldConsistencyLevel: bigint
  ];
  export interface OutputObject {
    newConsistencyLevel: bigint;
    oldConsistencyLevel: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateWormholeRemoteEvent {
  export type InputTuple = [wormholeChainId: BigNumberish, remote: BytesLike];
  export type OutputTuple = [wormholeChainId: bigint, remote: string];
  export interface OutputObject {
    wormholeChainId: bigint;
    remote: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WormholeReceiveEvent {
  export type InputTuple = [
    emitterChainId: BigNumberish,
    emitterAddress: BytesLike,
    sequence: BigNumberish
  ];
  export type OutputTuple = [
    emitterChainId: bigint,
    emitterAddress: string,
    sequence: bigint
  ];
  export interface OutputObject {
    emitterChainId: bigint;
    emitterAddress: string;
    sequence: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WormholeSendEvent {
  export type InputTuple = [sequence: BigNumberish];
  export type OutputTuple = [sequence: bigint];
  export interface OutputObject {
    sequence: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface WormholeBaseUpgradeable extends BaseContract {
  connect(runner?: ContractRunner | null): WormholeBaseUpgradeable;
  waitForDeployment(): Promise<this>;

  interface: WormholeBaseUpgradeableInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateWormhole: TypedContractMethod<
    [wormhole: AddressLike],
    [void],
    "nonpayable"
  >;

  updateWormholeConsistencyLevel: TypedContractMethod<
    [wormholeConsistencyLevel: BigNumberish],
    [void],
    "nonpayable"
  >;

  updateWormholeRemote: TypedContractMethod<
    [wormholeChainId: BigNumberish, authorizedRemote: BytesLike],
    [void],
    "nonpayable"
  >;

  withdrawRelayerFees: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateWormhole"
  ): TypedContractMethod<[wormhole: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateWormholeConsistencyLevel"
  ): TypedContractMethod<
    [wormholeConsistencyLevel: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateWormholeRemote"
  ): TypedContractMethod<
    [wormholeChainId: BigNumberish, authorizedRemote: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawRelayerFees"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "UpdateWormhole"
  ): TypedContractEvent<
    UpdateWormholeEvent.InputTuple,
    UpdateWormholeEvent.OutputTuple,
    UpdateWormholeEvent.OutputObject
  >;
  getEvent(
    key: "UpdateWormholeChainId"
  ): TypedContractEvent<
    UpdateWormholeChainIdEvent.InputTuple,
    UpdateWormholeChainIdEvent.OutputTuple,
    UpdateWormholeChainIdEvent.OutputObject
  >;
  getEvent(
    key: "UpdateWormholeConsistencyLevel"
  ): TypedContractEvent<
    UpdateWormholeConsistencyLevelEvent.InputTuple,
    UpdateWormholeConsistencyLevelEvent.OutputTuple,
    UpdateWormholeConsistencyLevelEvent.OutputObject
  >;
  getEvent(
    key: "UpdateWormholeRemote"
  ): TypedContractEvent<
    UpdateWormholeRemoteEvent.InputTuple,
    UpdateWormholeRemoteEvent.OutputTuple,
    UpdateWormholeRemoteEvent.OutputObject
  >;
  getEvent(
    key: "WormholeReceive"
  ): TypedContractEvent<
    WormholeReceiveEvent.InputTuple,
    WormholeReceiveEvent.OutputTuple,
    WormholeReceiveEvent.OutputObject
  >;
  getEvent(
    key: "WormholeSend"
  ): TypedContractEvent<
    WormholeSendEvent.InputTuple,
    WormholeSendEvent.OutputTuple,
    WormholeSendEvent.OutputObject
  >;

  filters: {
    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "UpdateWormhole(address,address)": TypedContractEvent<
      UpdateWormholeEvent.InputTuple,
      UpdateWormholeEvent.OutputTuple,
      UpdateWormholeEvent.OutputObject
    >;
    UpdateWormhole: TypedContractEvent<
      UpdateWormholeEvent.InputTuple,
      UpdateWormholeEvent.OutputTuple,
      UpdateWormholeEvent.OutputObject
    >;

    "UpdateWormholeChainId(uint16,uint16)": TypedContractEvent<
      UpdateWormholeChainIdEvent.InputTuple,
      UpdateWormholeChainIdEvent.OutputTuple,
      UpdateWormholeChainIdEvent.OutputObject
    >;
    UpdateWormholeChainId: TypedContractEvent<
      UpdateWormholeChainIdEvent.InputTuple,
      UpdateWormholeChainIdEvent.OutputTuple,
      UpdateWormholeChainIdEvent.OutputObject
    >;

    "UpdateWormholeConsistencyLevel(uint8,uint8)": TypedContractEvent<
      UpdateWormholeConsistencyLevelEvent.InputTuple,
      UpdateWormholeConsistencyLevelEvent.OutputTuple,
      UpdateWormholeConsistencyLevelEvent.OutputObject
    >;
    UpdateWormholeConsistencyLevel: TypedContractEvent<
      UpdateWormholeConsistencyLevelEvent.InputTuple,
      UpdateWormholeConsistencyLevelEvent.OutputTuple,
      UpdateWormholeConsistencyLevelEvent.OutputObject
    >;

    "UpdateWormholeRemote(uint16,bytes32)": TypedContractEvent<
      UpdateWormholeRemoteEvent.InputTuple,
      UpdateWormholeRemoteEvent.OutputTuple,
      UpdateWormholeRemoteEvent.OutputObject
    >;
    UpdateWormholeRemote: TypedContractEvent<
      UpdateWormholeRemoteEvent.InputTuple,
      UpdateWormholeRemoteEvent.OutputTuple,
      UpdateWormholeRemoteEvent.OutputObject
    >;

    "WormholeReceive(uint16,bytes32,uint64)": TypedContractEvent<
      WormholeReceiveEvent.InputTuple,
      WormholeReceiveEvent.OutputTuple,
      WormholeReceiveEvent.OutputObject
    >;
    WormholeReceive: TypedContractEvent<
      WormholeReceiveEvent.InputTuple,
      WormholeReceiveEvent.OutputTuple,
      WormholeReceiveEvent.OutputObject
    >;

    "WormholeSend(uint64)": TypedContractEvent<
      WormholeSendEvent.InputTuple,
      WormholeSendEvent.OutputTuple,
      WormholeSendEvent.OutputObject
    >;
    WormholeSend: TypedContractEvent<
      WormholeSendEvent.InputTuple,
      WormholeSendEvent.OutputTuple,
      WormholeSendEvent.OutputObject
    >;
  };
}
