/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IHashflowWormholeMessenger,
  IHashflowWormholeMessengerInterface,
} from "../../../../contracts/interfaces/xchain/IHashflowWormholeMessenger";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "hChainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "relayer",
        type: "bytes32",
      },
    ],
    name: "UpdatePermissionedRelayer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "hChainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wormholeChainId",
        type: "uint256",
      },
    ],
    name: "UpdateWormholeChainId",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "consistencyLevel",
        type: "uint256",
      },
    ],
    name: "UpdateWormholeConsistencyLevel",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "consistencyLevel",
        type: "uint256",
      },
    ],
    name: "UpdateWormholeConsistencyLevelFast",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "wormholeEndpoint",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "prevWormholeEndpoint",
        type: "address",
      },
    ],
    name: "UpdateWormholeEndpoint",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
    ],
    name: "WormholeReceive",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sequence",
        type: "uint256",
      },
    ],
    name: "WormholeSend",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sequence",
        type: "uint256",
      },
    ],
    name: "WormholeSendFast",
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
    inputs: [
      {
        internalType: "uint16",
        name: "hChainId",
        type: "uint16",
      },
    ],
    name: "hChainIdToWormholeChainId",
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
    inputs: [
      {
        internalType: "uint16",
        name: "hChainId",
        type: "uint16",
      },
    ],
    name: "permissionedRelayers",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
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
        internalType: "bytes32",
        name: "relayer",
        type: "bytes32",
      },
    ],
    name: "updatePermissionedRelayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wormhole",
        type: "address",
      },
    ],
    name: "updateWormhole",
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
      {
        internalType: "uint16",
        name: "wormholeChainId",
        type: "uint16",
      },
    ],
    name: "updateWormholeChainIdForHashflowChainId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "consistencyLevel",
        type: "uint8",
      },
    ],
    name: "updateWormholeConsistencyLevel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "consistencyLevel",
        type: "uint8",
      },
    ],
    name: "updateWormholeConsistencyLevelFast",
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
        name: "wormholeChainId",
        type: "uint16",
      },
    ],
    name: "wormholeChainIdToHChainId",
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
    name: "wormholeConsistencyLevel",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wormholeConsistencyLevelFast",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wormholeEndpoint",
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
        internalType: "bytes",
        name: "encodedVM",
        type: "bytes",
      },
    ],
    name: "wormholeReceive",
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

export class IHashflowWormholeMessenger__factory {
  static readonly abi = _abi;
  static createInterface(): IHashflowWormholeMessengerInterface {
    return new Interface(_abi) as IHashflowWormholeMessengerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IHashflowWormholeMessenger {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IHashflowWormholeMessenger;
  }
}
