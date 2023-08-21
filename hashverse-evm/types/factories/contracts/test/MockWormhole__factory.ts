/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  MockWormhole,
  MockWormholeInterface,
} from "../../../contracts/test/MockWormhole";

const _abi = [
  {
    inputs: [],
    name: "chainId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b50607880601d6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80639a8a059214602d575b600080fd5b604080516103e8815290519081900360200190f3fea264697066735822122034e0a4e07be7d5b7ed67e2cd056f7c14e0a421ddfee16df8ec1ae8d432acb4c164736f6c63430008130033";

type MockWormholeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockWormholeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockWormhole__factory extends ContractFactory {
  constructor(...args: MockWormholeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MockWormhole & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockWormhole__factory {
    return super.connect(runner) as MockWormhole__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockWormholeInterface {
    return new Interface(_abi) as MockWormholeInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MockWormhole {
    return new Contract(address, _abi, runner) as unknown as MockWormhole;
  }
}
