/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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
} from "../../../../common";

export interface IACLManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "ADDRESSES_PROVIDER"
      | "ASSET_LISTING_ADMIN_ROLE"
      | "BRIDGE_ROLE"
      | "EMERGENCY_ADMIN_ROLE"
      | "FLASH_BORROWER_ROLE"
      | "POOL_ADMIN_ROLE"
      | "RISK_ADMIN_ROLE"
      | "addAssetListingAdmin"
      | "addBridge"
      | "addEmergencyAdmin"
      | "addFlashBorrower"
      | "addPoolAdmin"
      | "addRiskAdmin"
      | "isAssetListingAdmin"
      | "isBridge"
      | "isEmergencyAdmin"
      | "isFlashBorrower"
      | "isPoolAdmin"
      | "isRiskAdmin"
      | "removeAssetListingAdmin"
      | "removeBridge"
      | "removeEmergencyAdmin"
      | "removeFlashBorrower"
      | "removePoolAdmin"
      | "removeRiskAdmin"
      | "setRoleAdmin"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ADDRESSES_PROVIDER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ASSET_LISTING_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "BRIDGE_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EMERGENCY_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLASH_BORROWER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "POOL_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "RISK_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addAssetListingAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addBridge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addEmergencyAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addFlashBorrower",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addPoolAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addRiskAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isAssetListingAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isBridge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isEmergencyAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isFlashBorrower",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isPoolAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isRiskAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeAssetListingAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeBridge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeEmergencyAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeFlashBorrower",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removePoolAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeRiskAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRoleAdmin",
    values: [BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "ADDRESSES_PROVIDER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ASSET_LISTING_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "BRIDGE_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EMERGENCY_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLASH_BORROWER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "POOL_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "RISK_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addAssetListingAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addBridge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addEmergencyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addFlashBorrower",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addPoolAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addRiskAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAssetListingAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isBridge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isEmergencyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isFlashBorrower",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isPoolAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRiskAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeAssetListingAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeBridge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeEmergencyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeFlashBorrower",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removePoolAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeRiskAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRoleAdmin",
    data: BytesLike
  ): Result;
}

export interface IACLManager extends BaseContract {
  connect(runner?: ContractRunner | null): IACLManager;
  waitForDeployment(): Promise<this>;

  interface: IACLManagerInterface;

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

  ADDRESSES_PROVIDER: TypedContractMethod<[], [string], "view">;

  ASSET_LISTING_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  BRIDGE_ROLE: TypedContractMethod<[], [string], "view">;

  EMERGENCY_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  FLASH_BORROWER_ROLE: TypedContractMethod<[], [string], "view">;

  POOL_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  RISK_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  addAssetListingAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  addBridge: TypedContractMethod<[bridge: AddressLike], [void], "nonpayable">;

  addEmergencyAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  addFlashBorrower: TypedContractMethod<
    [borrower: AddressLike],
    [void],
    "nonpayable"
  >;

  addPoolAdmin: TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;

  addRiskAdmin: TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;

  isAssetListingAdmin: TypedContractMethod<
    [admin: AddressLike],
    [boolean],
    "view"
  >;

  isBridge: TypedContractMethod<[bridge: AddressLike], [boolean], "view">;

  isEmergencyAdmin: TypedContractMethod<
    [admin: AddressLike],
    [boolean],
    "view"
  >;

  isFlashBorrower: TypedContractMethod<
    [borrower: AddressLike],
    [boolean],
    "view"
  >;

  isPoolAdmin: TypedContractMethod<[admin: AddressLike], [boolean], "view">;

  isRiskAdmin: TypedContractMethod<[admin: AddressLike], [boolean], "view">;

  removeAssetListingAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  removeBridge: TypedContractMethod<
    [bridge: AddressLike],
    [void],
    "nonpayable"
  >;

  removeEmergencyAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  removeFlashBorrower: TypedContractMethod<
    [borrower: AddressLike],
    [void],
    "nonpayable"
  >;

  removePoolAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  removeRiskAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  setRoleAdmin: TypedContractMethod<
    [role: BytesLike, adminRole: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "ADDRESSES_PROVIDER"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "ASSET_LISTING_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "BRIDGE_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "EMERGENCY_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "FLASH_BORROWER_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "POOL_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "RISK_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "addAssetListingAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addBridge"
  ): TypedContractMethod<[bridge: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addEmergencyAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addFlashBorrower"
  ): TypedContractMethod<[borrower: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addPoolAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addRiskAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "isAssetListingAdmin"
  ): TypedContractMethod<[admin: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isBridge"
  ): TypedContractMethod<[bridge: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isEmergencyAdmin"
  ): TypedContractMethod<[admin: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isFlashBorrower"
  ): TypedContractMethod<[borrower: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isPoolAdmin"
  ): TypedContractMethod<[admin: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isRiskAdmin"
  ): TypedContractMethod<[admin: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "removeAssetListingAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeBridge"
  ): TypedContractMethod<[bridge: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeEmergencyAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeFlashBorrower"
  ): TypedContractMethod<[borrower: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removePoolAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeRiskAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setRoleAdmin"
  ): TypedContractMethod<
    [role: BytesLike, adminRole: BytesLike],
    [void],
    "nonpayable"
  >;

  filters: {};
}