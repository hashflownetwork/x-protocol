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

export declare namespace IQuote {
  export type RFQTQuoteStruct = {
    pool: AddressLike;
    externalAccount: AddressLike;
    trader: AddressLike;
    effectiveTrader: AddressLike;
    baseToken: AddressLike;
    quoteToken: AddressLike;
    effectiveBaseTokenAmount: BigNumberish;
    baseTokenAmount: BigNumberish;
    quoteTokenAmount: BigNumberish;
    quoteExpiry: BigNumberish;
    nonce: BigNumberish;
    txid: BytesLike;
    signature: BytesLike;
  };

  export type RFQTQuoteStructOutput = [
    pool: string,
    externalAccount: string,
    trader: string,
    effectiveTrader: string,
    baseToken: string,
    quoteToken: string,
    effectiveBaseTokenAmount: bigint,
    baseTokenAmount: bigint,
    quoteTokenAmount: bigint,
    quoteExpiry: bigint,
    nonce: bigint,
    txid: string,
    signature: string
  ] & {
    pool: string;
    externalAccount: string;
    trader: string;
    effectiveTrader: string;
    baseToken: string;
    quoteToken: string;
    effectiveBaseTokenAmount: bigint;
    baseTokenAmount: bigint;
    quoteTokenAmount: bigint;
    quoteExpiry: bigint;
    nonce: bigint;
    txid: string;
    signature: string;
  };
}

export interface RenovaQuestInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "allowedTokens"
      | "depositAndEnter"
      | "depositToken"
      | "endTime"
      | "minDepositAmount"
      | "numRegisteredPlayers"
      | "numRegisteredPlayersPerFaction"
      | "onERC721Received"
      | "portfolioTokenBalances"
      | "questOwner"
      | "registered"
      | "startTime"
      | "trade"
      | "updateTokenAuthorization"
      | "withdrawTokens"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "DepositToken"
      | "RegisterPlayer"
      | "Trade"
      | "UpdateTokenAuthorizationStatus"
      | "WithdrawToken"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "allowedTokens",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "depositAndEnter",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "endTime", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "minDepositAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numRegisteredPlayers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numRegisteredPlayersPerFaction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "portfolioTokenBalances",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "questOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registered",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "startTime", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "trade",
    values: [IQuote.RFQTQuoteStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTokenAuthorization",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTokens",
    values: [AddressLike[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "allowedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositAndEnter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "endTime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "minDepositAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numRegisteredPlayers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numRegisteredPlayersPerFaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "portfolioTokenBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "questOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registered", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startTime", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "trade", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateTokenAuthorization",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTokens",
    data: BytesLike
  ): Result;
}

export namespace DepositTokenEvent {
  export type InputTuple = [
    player: AddressLike,
    token: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [player: string, token: string, amount: bigint];
  export interface OutputObject {
    player: string;
    token: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RegisterPlayerEvent {
  export type InputTuple = [player: AddressLike];
  export type OutputTuple = [player: string];
  export interface OutputObject {
    player: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TradeEvent {
  export type InputTuple = [
    player: AddressLike,
    baseToken: AddressLike,
    quoteToken: AddressLike,
    baseTokenAmount: BigNumberish,
    quoteTokenAmount: BigNumberish
  ];
  export type OutputTuple = [
    player: string,
    baseToken: string,
    quoteToken: string,
    baseTokenAmount: bigint,
    quoteTokenAmount: bigint
  ];
  export interface OutputObject {
    player: string;
    baseToken: string;
    quoteToken: string;
    baseTokenAmount: bigint;
    quoteTokenAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateTokenAuthorizationStatusEvent {
  export type InputTuple = [token: AddressLike, status: boolean];
  export type OutputTuple = [token: string, status: boolean];
  export interface OutputObject {
    token: string;
    status: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawTokenEvent {
  export type InputTuple = [
    player: AddressLike,
    token: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [player: string, token: string, amount: bigint];
  export interface OutputObject {
    player: string;
    token: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RenovaQuest extends BaseContract {
  connect(runner?: ContractRunner | null): RenovaQuest;
  waitForDeployment(): Promise<this>;

  interface: RenovaQuestInterface;

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

  allowedTokens: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  depositAndEnter: TypedContractMethod<
    [depositAmount: BigNumberish],
    [void],
    "payable"
  >;

  depositToken: TypedContractMethod<[], [string], "view">;

  endTime: TypedContractMethod<[], [bigint], "view">;

  minDepositAmount: TypedContractMethod<[], [bigint], "view">;

  numRegisteredPlayers: TypedContractMethod<[], [bigint], "view">;

  numRegisteredPlayersPerFaction: TypedContractMethod<
    [arg0: BigNumberish],
    [bigint],
    "view"
  >;

  onERC721Received: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "view"
  >;

  portfolioTokenBalances: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;

  questOwner: TypedContractMethod<[], [string], "view">;

  registered: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  startTime: TypedContractMethod<[], [bigint], "view">;

  trade: TypedContractMethod<
    [quote: IQuote.RFQTQuoteStruct],
    [void],
    "payable"
  >;

  updateTokenAuthorization: TypedContractMethod<
    [token: AddressLike, status: boolean],
    [void],
    "nonpayable"
  >;

  withdrawTokens: TypedContractMethod<
    [tokens: AddressLike[]],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "allowedTokens"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "depositAndEnter"
  ): TypedContractMethod<[depositAmount: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "depositToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "endTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minDepositAmount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "numRegisteredPlayers"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "numRegisteredPlayersPerFaction"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "onERC721Received"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "portfolioTokenBalances"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "questOwner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "registered"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "startTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "trade"
  ): TypedContractMethod<[quote: IQuote.RFQTQuoteStruct], [void], "payable">;
  getFunction(
    nameOrSignature: "updateTokenAuthorization"
  ): TypedContractMethod<
    [token: AddressLike, status: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawTokens"
  ): TypedContractMethod<[tokens: AddressLike[]], [void], "nonpayable">;

  getEvent(
    key: "DepositToken"
  ): TypedContractEvent<
    DepositTokenEvent.InputTuple,
    DepositTokenEvent.OutputTuple,
    DepositTokenEvent.OutputObject
  >;
  getEvent(
    key: "RegisterPlayer"
  ): TypedContractEvent<
    RegisterPlayerEvent.InputTuple,
    RegisterPlayerEvent.OutputTuple,
    RegisterPlayerEvent.OutputObject
  >;
  getEvent(
    key: "Trade"
  ): TypedContractEvent<
    TradeEvent.InputTuple,
    TradeEvent.OutputTuple,
    TradeEvent.OutputObject
  >;
  getEvent(
    key: "UpdateTokenAuthorizationStatus"
  ): TypedContractEvent<
    UpdateTokenAuthorizationStatusEvent.InputTuple,
    UpdateTokenAuthorizationStatusEvent.OutputTuple,
    UpdateTokenAuthorizationStatusEvent.OutputObject
  >;
  getEvent(
    key: "WithdrawToken"
  ): TypedContractEvent<
    WithdrawTokenEvent.InputTuple,
    WithdrawTokenEvent.OutputTuple,
    WithdrawTokenEvent.OutputObject
  >;

  filters: {
    "DepositToken(address,address,uint256)": TypedContractEvent<
      DepositTokenEvent.InputTuple,
      DepositTokenEvent.OutputTuple,
      DepositTokenEvent.OutputObject
    >;
    DepositToken: TypedContractEvent<
      DepositTokenEvent.InputTuple,
      DepositTokenEvent.OutputTuple,
      DepositTokenEvent.OutputObject
    >;

    "RegisterPlayer(address)": TypedContractEvent<
      RegisterPlayerEvent.InputTuple,
      RegisterPlayerEvent.OutputTuple,
      RegisterPlayerEvent.OutputObject
    >;
    RegisterPlayer: TypedContractEvent<
      RegisterPlayerEvent.InputTuple,
      RegisterPlayerEvent.OutputTuple,
      RegisterPlayerEvent.OutputObject
    >;

    "Trade(address,address,address,uint256,uint256)": TypedContractEvent<
      TradeEvent.InputTuple,
      TradeEvent.OutputTuple,
      TradeEvent.OutputObject
    >;
    Trade: TypedContractEvent<
      TradeEvent.InputTuple,
      TradeEvent.OutputTuple,
      TradeEvent.OutputObject
    >;

    "UpdateTokenAuthorizationStatus(address,bool)": TypedContractEvent<
      UpdateTokenAuthorizationStatusEvent.InputTuple,
      UpdateTokenAuthorizationStatusEvent.OutputTuple,
      UpdateTokenAuthorizationStatusEvent.OutputObject
    >;
    UpdateTokenAuthorizationStatus: TypedContractEvent<
      UpdateTokenAuthorizationStatusEvent.InputTuple,
      UpdateTokenAuthorizationStatusEvent.OutputTuple,
      UpdateTokenAuthorizationStatusEvent.OutputObject
    >;

    "WithdrawToken(address,address,uint256)": TypedContractEvent<
      WithdrawTokenEvent.InputTuple,
      WithdrawTokenEvent.OutputTuple,
      WithdrawTokenEvent.OutputObject
    >;
    WithdrawToken: TypedContractEvent<
      WithdrawTokenEvent.InputTuple,
      WithdrawTokenEvent.OutputTuple,
      WithdrawTokenEvent.OutputObject
    >;
  };
}
