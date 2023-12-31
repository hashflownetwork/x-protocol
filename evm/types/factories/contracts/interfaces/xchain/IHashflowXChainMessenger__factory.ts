/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IHashflowXChainMessenger,
  IHashflowXChainMessengerInterface,
} from "../../../../contracts/interfaces/xchain/IHashflowXChainMessenger";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "chainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "remoteAddress",
        type: "bytes",
      },
    ],
    name: "UpdateXChainRemoteAddress",
    type: "event",
  },
  {
    inputs: [],
    name: "hChainId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "srcChainId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "dstChainId",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "srcPool",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "dstPool",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "srcExternalAccount",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "dstExternalAccount",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "dstTrader",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "quoteToken",
            type: "bytes32",
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
            internalType: "bytes32",
            name: "txid",
            type: "bytes32",
          },
        ],
        internalType: "struct IHashflowXChainMessenger.XChainQuote",
        name: "xChainQuote",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "dstContract",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "dstCalldata",
        type: "bytes",
      },
    ],
    name: "tradeXChain",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "hChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "remoteAddress",
        type: "bytes",
      },
    ],
    name: "updateXChainRemoteAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "hChainId",
        type: "uint16",
      },
    ],
    name: "xChainRemotes",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IHashflowXChainMessenger__factory {
  static readonly abi = _abi;
  static createInterface(): IHashflowXChainMessengerInterface {
    return new Interface(_abi) as IHashflowXChainMessengerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IHashflowXChainMessenger {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IHashflowXChainMessenger;
  }
}
