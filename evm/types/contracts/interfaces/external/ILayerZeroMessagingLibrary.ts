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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface ILayerZeroMessagingLibraryInterface extends Interface {
  getFunction(
    nameOrSignature: "estimateFees" | "getConfig" | "send" | "setConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "estimateFees",
    values: [BigNumberish, AddressLike, BytesLike, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getConfig",
    values: [BigNumberish, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "send",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike,
      AddressLike,
      AddressLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [BigNumberish, AddressLike, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "estimateFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
}

export interface ILayerZeroMessagingLibrary extends BaseContract {
  connect(runner?: ContractRunner | null): ILayerZeroMessagingLibrary;
  waitForDeployment(): Promise<this>;

  interface: ILayerZeroMessagingLibraryInterface;

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

  estimateFees: TypedContractMethod<
    [
      _chainId: BigNumberish,
      _userApplication: AddressLike,
      _payload: BytesLike,
      _payInZRO: boolean,
      _adapterParam: BytesLike
    ],
    [[bigint, bigint] & { nativeFee: bigint; zroFee: bigint }],
    "view"
  >;

  getConfig: TypedContractMethod<
    [
      _chainId: BigNumberish,
      _userApplication: AddressLike,
      _configType: BigNumberish
    ],
    [string],
    "view"
  >;

  send: TypedContractMethod<
    [
      _userApplication: AddressLike,
      _lastNonce: BigNumberish,
      _chainId: BigNumberish,
      _destination: BytesLike,
      _payload: BytesLike,
      refundAddress: AddressLike,
      _zroPaymentAddress: AddressLike,
      _adapterParams: BytesLike
    ],
    [void],
    "payable"
  >;

  setConfig: TypedContractMethod<
    [
      _chainId: BigNumberish,
      _userApplication: AddressLike,
      _configType: BigNumberish,
      _config: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "estimateFees"
  ): TypedContractMethod<
    [
      _chainId: BigNumberish,
      _userApplication: AddressLike,
      _payload: BytesLike,
      _payInZRO: boolean,
      _adapterParam: BytesLike
    ],
    [[bigint, bigint] & { nativeFee: bigint; zroFee: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "getConfig"
  ): TypedContractMethod<
    [
      _chainId: BigNumberish,
      _userApplication: AddressLike,
      _configType: BigNumberish
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "send"
  ): TypedContractMethod<
    [
      _userApplication: AddressLike,
      _lastNonce: BigNumberish,
      _chainId: BigNumberish,
      _destination: BytesLike,
      _payload: BytesLike,
      refundAddress: AddressLike,
      _zroPaymentAddress: AddressLike,
      _adapterParams: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setConfig"
  ): TypedContractMethod<
    [
      _chainId: BigNumberish,
      _userApplication: AddressLike,
      _configType: BigNumberish,
      _config: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  filters: {};
}
