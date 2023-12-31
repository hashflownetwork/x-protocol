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
} from "../../../common";

export declare namespace IRenovaCommandDeck {
  export type ItemMintSpecStruct = {
    hashverseItemIds: BigNumberish[];
    rootId: BytesLike;
    proof: BytesLike[];
  };

  export type ItemMintSpecStructOutput = [
    hashverseItemIds: bigint[],
    rootId: string,
    proof: string[]
  ] & { hashverseItemIds: bigint[]; rootId: string; proof: string[] };
}

export interface IRenovaCommandDeckInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createQuest"
      | "depositTokenForQuest"
      | "hashflowRouter"
      | "initialize"
      | "itemMerkleRoots"
      | "mintItemAdmin"
      | "mintItems"
      | "questDeploymentAddresses"
      | "questIdsByDeploymentAddress"
      | "questOwner"
      | "renovaAvatar"
      | "renovaItem"
      | "updateHashflowRouter"
      | "updateQuestOwner"
      | "uploadItemMerkleRoot"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "CreateQuest"
      | "MintItems"
      | "UpdateHashflowRouter"
      | "UpdateQuestOwner"
      | "UploadItemMerkleRoot"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "createQuest",
    values: [BytesLike, BigNumberish, BigNumberish, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositTokenForQuest",
    values: [AddressLike, BigNumberish]
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
    functionFragment: "mintItemAdmin",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mintItems",
    values: [AddressLike, IRenovaCommandDeck.ItemMintSpecStruct[]]
  ): string;
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
    functionFragment: "renovaAvatar",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renovaItem",
    values?: undefined
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
    functionFragment: "depositTokenForQuest",
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
    functionFragment: "mintItemAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mintItems", data: BytesLike): Result;
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
    functionFragment: "renovaAvatar",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "renovaItem", data: BytesLike): Result;
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
    startTime: BigNumberish,
    endTime: BigNumberish,
    depositToken: AddressLike,
    minDepositAmount: BigNumberish
  ];
  export type OutputTuple = [
    questId: string,
    questAddress: string,
    startTime: bigint,
    endTime: bigint,
    depositToken: string,
    minDepositAmount: bigint
  ];
  export interface OutputObject {
    questId: string;
    questAddress: string;
    startTime: bigint;
    endTime: bigint;
    depositToken: string;
    minDepositAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintItemsEvent {
  export type InputTuple = [rootId: BytesLike, player: AddressLike];
  export type OutputTuple = [rootId: string, player: string];
  export interface OutputObject {
    rootId: string;
    player: string;
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

export interface IRenovaCommandDeck extends BaseContract {
  connect(runner?: ContractRunner | null): IRenovaCommandDeck;
  waitForDeployment(): Promise<this>;

  interface: IRenovaCommandDeckInterface;

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
      startTime: BigNumberish,
      endTime: BigNumberish,
      depositToken: AddressLike,
      minDepositAmount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  depositTokenForQuest: TypedContractMethod<
    [player: AddressLike, depositAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  hashflowRouter: TypedContractMethod<[], [string], "view">;

  initialize: TypedContractMethod<
    [
      renovaAvatar: AddressLike,
      renovaItem: AddressLike,
      hashflowRouter: AddressLike,
      questOwner: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  itemMerkleRoots: TypedContractMethod<[rootId: BytesLike], [string], "view">;

  mintItemAdmin: TypedContractMethod<
    [tokenOwner: AddressLike, hashverseItemId: BigNumberish],
    [void],
    "nonpayable"
  >;

  mintItems: TypedContractMethod<
    [
      tokenOwner: AddressLike,
      mintSpecs: IRenovaCommandDeck.ItemMintSpecStruct[]
    ],
    [void],
    "nonpayable"
  >;

  questDeploymentAddresses: TypedContractMethod<
    [questId: BytesLike],
    [string],
    "view"
  >;

  questIdsByDeploymentAddress: TypedContractMethod<
    [questAddress: AddressLike],
    [string],
    "view"
  >;

  questOwner: TypedContractMethod<[], [string], "view">;

  renovaAvatar: TypedContractMethod<[], [string], "view">;

  renovaItem: TypedContractMethod<[], [string], "view">;

  updateHashflowRouter: TypedContractMethod<
    [hashflowRouter: AddressLike],
    [void],
    "nonpayable"
  >;

  updateQuestOwner: TypedContractMethod<
    [questOwner: AddressLike],
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
      startTime: BigNumberish,
      endTime: BigNumberish,
      depositToken: AddressLike,
      minDepositAmount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositTokenForQuest"
  ): TypedContractMethod<
    [player: AddressLike, depositAmount: BigNumberish],
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
      renovaAvatar: AddressLike,
      renovaItem: AddressLike,
      hashflowRouter: AddressLike,
      questOwner: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "itemMerkleRoots"
  ): TypedContractMethod<[rootId: BytesLike], [string], "view">;
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
      mintSpecs: IRenovaCommandDeck.ItemMintSpecStruct[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "questDeploymentAddresses"
  ): TypedContractMethod<[questId: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "questIdsByDeploymentAddress"
  ): TypedContractMethod<[questAddress: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "questOwner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renovaAvatar"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renovaItem"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "updateHashflowRouter"
  ): TypedContractMethod<[hashflowRouter: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateQuestOwner"
  ): TypedContractMethod<[questOwner: AddressLike], [void], "nonpayable">;
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
    key: "MintItems"
  ): TypedContractEvent<
    MintItemsEvent.InputTuple,
    MintItemsEvent.OutputTuple,
    MintItemsEvent.OutputObject
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
    "CreateQuest(bytes32,address,uint256,uint256,address,uint256)": TypedContractEvent<
      CreateQuestEvent.InputTuple,
      CreateQuestEvent.OutputTuple,
      CreateQuestEvent.OutputObject
    >;
    CreateQuest: TypedContractEvent<
      CreateQuestEvent.InputTuple,
      CreateQuestEvent.OutputTuple,
      CreateQuestEvent.OutputObject
    >;

    "MintItems(bytes32,address)": TypedContractEvent<
      MintItemsEvent.InputTuple,
      MintItemsEvent.OutputTuple,
      MintItemsEvent.OutputObject
    >;
    MintItems: TypedContractEvent<
      MintItemsEvent.InputTuple,
      MintItemsEvent.OutputTuple,
      MintItemsEvent.OutputObject
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
