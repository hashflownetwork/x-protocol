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

export declare namespace IRenovaQuest {
  export type TokenDepositStruct = { token: AddressLike; amount: BigNumberish };

  export type TokenDepositStructOutput = [token: string, amount: bigint] & {
    token: string;
    amount: bigint;
  };
}

export interface RenovaCommandDeckInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createQuest"
      | "depositTokensForQuest"
      | "hashflowRouter"
      | "initialize"
      | "itemMerkleRoots"
      | "loadItemsForQuest"
      | "mintItemAdmin"
      | "mintItems"
      | "owner"
      | "questDeploymentAddresses"
      | "questIdsByDeploymentAddress"
      | "questOwner"
      | "renounceOwnership"
      | "renovaAvatar"
      | "renovaItem"
      | "transferOwnership"
      | "updateHashflowRouter"
      | "updateQuestOwner"
      | "uploadItemMerkleRoot"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "CreateQuest"
      | "Initialized"
      | "OwnershipTransferred"
      | "UpdateHashflowRouter"
      | "UpdateQuestOwner"
      | "UploadItemMerkleRoot"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "createQuest",
    values: [
      BytesLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "depositTokensForQuest",
    values: [AddressLike, IRenovaQuest.TokenDepositStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "hashflowRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "itemMerkleRoots",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "loadItemsForQuest",
    values: [AddressLike, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "mintItemAdmin",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mintItems",
    values: [AddressLike, BigNumberish[], BytesLike, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "questDeploymentAddresses",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "questIdsByDeploymentAddress",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "questOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renovaAvatar",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renovaItem",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateHashflowRouter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateQuestOwner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "uploadItemMerkleRoot",
    values: [BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "createQuest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositTokensForQuest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hashflowRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "itemMerkleRoots",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "loadItemsForQuest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintItemAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mintItems", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "questDeploymentAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "questIdsByDeploymentAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "questOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renovaAvatar",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "renovaItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateHashflowRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateQuestOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uploadItemMerkleRoot",
    data: BytesLike
  ): Result;
}

export namespace CreateQuestEvent {
  export type InputTuple = [
    questId: BytesLike,
    questAddress: AddressLike,
    questMode: BigNumberish,
    maxPlayers: BigNumberish,
    maxItemsPerPlayer: BigNumberish,
    startTime: BigNumberish,
    endTime: BigNumberish
  ];
  export type OutputTuple = [
    questId: string,
    questAddress: string,
    questMode: bigint,
    maxPlayers: bigint,
    maxItemsPerPlayer: bigint,
    startTime: bigint,
    endTime: bigint
  ];
  export interface OutputObject {
    questId: string;
    questAddress: string;
    questMode: bigint;
    maxPlayers: bigint;
    maxItemsPerPlayer: bigint;
    startTime: bigint;
    endTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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

export namespace UpdateHashflowRouterEvent {
  export type InputTuple = [newRouter: AddressLike, oldRouter: AddressLike];
  export type OutputTuple = [newRouter: string, oldRouter: string];
  export interface OutputObject {
    newRouter: string;
    oldRouter: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateQuestOwnerEvent {
  export type InputTuple = [
    newQuestOwner: AddressLike,
    oldQuestOwner: AddressLike
  ];
  export type OutputTuple = [newQuestOwner: string, oldQuestOwner: string];
  export interface OutputObject {
    newQuestOwner: string;
    oldQuestOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UploadItemMerkleRootEvent {
  export type InputTuple = [rootId: BytesLike, root: BytesLike];
  export type OutputTuple = [rootId: string, root: string];
  export interface OutputObject {
    rootId: string;
    root: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RenovaCommandDeck extends BaseContract {
  connect(runner?: ContractRunner | null): RenovaCommandDeck;
  waitForDeployment(): Promise<this>;

  interface: RenovaCommandDeckInterface;

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

  createQuest: TypedContractMethod<
    [
      questId: BytesLike,
      questMode: BigNumberish,
      maxPlayers: BigNumberish,
      maxItemsPerPlayer: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  depositTokensForQuest: TypedContractMethod<
    [player: AddressLike, tokenDeposits: IRenovaQuest.TokenDepositStruct[]],
    [void],
    "nonpayable"
  >;

  hashflowRouter: TypedContractMethod<[], [string], "view">;

  initialize: TypedContractMethod<
    [
      _renovaAvatar: AddressLike,
      _renovaItem: AddressLike,
      _hashflowRouter: AddressLike,
      _questOwner: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  itemMerkleRoots: TypedContractMethod<[arg0: BytesLike], [string], "view">;

  loadItemsForQuest: TypedContractMethod<
    [player: AddressLike, tokenIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  mintItemAdmin: TypedContractMethod<
    [tokenOwner: AddressLike, hashverseItemId: BigNumberish],
    [void],
    "nonpayable"
  >;

  mintItems: TypedContractMethod<
    [
      tokenOwner: AddressLike,
      hashverseItemIds: BigNumberish[],
      rootId: BytesLike,
      proof: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  questDeploymentAddresses: TypedContractMethod<
    [arg0: BytesLike],
    [string],
    "view"
  >;

  questIdsByDeploymentAddress: TypedContractMethod<
    [arg0: AddressLike],
    [string],
    "view"
  >;

  questOwner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "view">;

  renovaAvatar: TypedContractMethod<[], [string], "view">;

  renovaItem: TypedContractMethod<[], [string], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateHashflowRouter: TypedContractMethod<
    [_hashflowRouter: AddressLike],
    [void],
    "nonpayable"
  >;

  updateQuestOwner: TypedContractMethod<
    [_questOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  uploadItemMerkleRoot: TypedContractMethod<
    [rootId: BytesLike, root: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createQuest"
  ): TypedContractMethod<
    [
      questId: BytesLike,
      questMode: BigNumberish,
      maxPlayers: BigNumberish,
      maxItemsPerPlayer: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositTokensForQuest"
  ): TypedContractMethod<
    [player: AddressLike, tokenDeposits: IRenovaQuest.TokenDepositStruct[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hashflowRouter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      _renovaAvatar: AddressLike,
      _renovaItem: AddressLike,
      _hashflowRouter: AddressLike,
      _questOwner: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "itemMerkleRoots"
  ): TypedContractMethod<[arg0: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "loadItemsForQuest"
  ): TypedContractMethod<
    [player: AddressLike, tokenIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "mintItemAdmin"
  ): TypedContractMethod<
    [tokenOwner: AddressLike, hashverseItemId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "mintItems"
  ): TypedContractMethod<
    [
      tokenOwner: AddressLike,
      hashverseItemIds: BigNumberish[],
      rootId: BytesLike,
      proof: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "questDeploymentAddresses"
  ): TypedContractMethod<[arg0: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "questIdsByDeploymentAddress"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "questOwner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "view">;
  getFunction(
    nameOrSignature: "renovaAvatar"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renovaItem"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateHashflowRouter"
  ): TypedContractMethod<[_hashflowRouter: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateQuestOwner"
  ): TypedContractMethod<[_questOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "uploadItemMerkleRoot"
  ): TypedContractMethod<
    [rootId: BytesLike, root: BytesLike],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "CreateQuest"
  ): TypedContractEvent<
    CreateQuestEvent.InputTuple,
    CreateQuestEvent.OutputTuple,
    CreateQuestEvent.OutputObject
  >;
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
    key: "UpdateHashflowRouter"
  ): TypedContractEvent<
    UpdateHashflowRouterEvent.InputTuple,
    UpdateHashflowRouterEvent.OutputTuple,
    UpdateHashflowRouterEvent.OutputObject
  >;
  getEvent(
    key: "UpdateQuestOwner"
  ): TypedContractEvent<
    UpdateQuestOwnerEvent.InputTuple,
    UpdateQuestOwnerEvent.OutputTuple,
    UpdateQuestOwnerEvent.OutputObject
  >;
  getEvent(
    key: "UploadItemMerkleRoot"
  ): TypedContractEvent<
    UploadItemMerkleRootEvent.InputTuple,
    UploadItemMerkleRootEvent.OutputTuple,
    UploadItemMerkleRootEvent.OutputObject
  >;

  filters: {
    "CreateQuest(bytes32,address,uint8,uint256,uint256,uint256,uint256)": TypedContractEvent<
      CreateQuestEvent.InputTuple,
      CreateQuestEvent.OutputTuple,
      CreateQuestEvent.OutputObject
    >;
    CreateQuest: TypedContractEvent<
      CreateQuestEvent.InputTuple,
      CreateQuestEvent.OutputTuple,
      CreateQuestEvent.OutputObject
    >;

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

    "UpdateHashflowRouter(address,address)": TypedContractEvent<
      UpdateHashflowRouterEvent.InputTuple,
      UpdateHashflowRouterEvent.OutputTuple,
      UpdateHashflowRouterEvent.OutputObject
    >;
    UpdateHashflowRouter: TypedContractEvent<
      UpdateHashflowRouterEvent.InputTuple,
      UpdateHashflowRouterEvent.OutputTuple,
      UpdateHashflowRouterEvent.OutputObject
    >;

    "UpdateQuestOwner(address,address)": TypedContractEvent<
      UpdateQuestOwnerEvent.InputTuple,
      UpdateQuestOwnerEvent.OutputTuple,
      UpdateQuestOwnerEvent.OutputObject
    >;
    UpdateQuestOwner: TypedContractEvent<
      UpdateQuestOwnerEvent.InputTuple,
      UpdateQuestOwnerEvent.OutputTuple,
      UpdateQuestOwnerEvent.OutputObject
    >;

    "UploadItemMerkleRoot(bytes32,bytes32)": TypedContractEvent<
      UploadItemMerkleRootEvent.InputTuple,
      UploadItemMerkleRootEvent.OutputTuple,
      UploadItemMerkleRootEvent.OutputObject
    >;
    UploadItemMerkleRoot: TypedContractEvent<
      UploadItemMerkleRootEvent.InputTuple,
      UploadItemMerkleRootEvent.OutputTuple,
      UploadItemMerkleRootEvent.OutputObject
    >;
  };
}
