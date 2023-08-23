/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IMockHashflowRouter,
  IMockHashflowRouterInterface,
} from "../../../../contracts/test/MockHashflowRouter.sol/IMockHashflowRouter";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalAccount",
            type: "address",
          },
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "address",
            name: "effectiveTrader",
            type: "address",
          },
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "quoteToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "effectiveBaseTokenAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseTokenAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quoteTokenAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quoteExpiry",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "txid",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct IMockHashflowRouter.RFQTQuote",
        name: "quote",
        type: "tuple",
      },
    ],
    name: "tradeRFQT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export class IMockHashflowRouter__factory {
  static readonly abi = _abi;
  static createInterface(): IMockHashflowRouterInterface {
    return new Interface(_abi) as IMockHashflowRouterInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IMockHashflowRouter {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IMockHashflowRouter;
  }
}
