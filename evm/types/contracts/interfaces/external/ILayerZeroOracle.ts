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

export interface ILayerZeroOracleInterface extends Interface {
  getFunction(
    nameOrSignature: "getPrice" | "isApproved" | "notifyOracle"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getPrice",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApproved",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "notifyOracle",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isApproved", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "notifyOracle",
    data: BytesLike
  ): Result;
}

export interface ILayerZeroOracle extends BaseContract {
  connect(runner?: ContractRunner | null): ILayerZeroOracle;
  waitForDeployment(): Promise<this>;

  interface: ILayerZeroOracleInterface;

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

  getPrice: TypedContractMethod<
    [_dstChainId: BigNumberish, _outboundProofType: BigNumberish],
    [bigint],
    "view"
  >;

  isApproved: TypedContractMethod<[_address: AddressLike], [boolean], "view">;

  notifyOracle: TypedContractMethod<
    [
      _dstChainId: BigNumberish,
      _outboundProofType: BigNumberish,
      _outboundBlockConfirmations: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getPrice"
  ): TypedContractMethod<
    [_dstChainId: BigNumberish, _outboundProofType: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "isApproved"
  ): TypedContractMethod<[_address: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "notifyOracle"
  ): TypedContractMethod<
    [
      _dstChainId: BigNumberish,
      _outboundProofType: BigNumberish,
      _outboundBlockConfirmations: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  filters: {};
}
