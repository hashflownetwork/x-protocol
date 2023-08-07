/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IHashflowPool,
  IHashflowPoolInterface,
} from "../../../contracts/interfaces/IHashflowPool";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawAmount",
        type: "uint256",
      },
    ],
    name: "RemoveLiquidity",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "effectiveTrader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quoteTokenAmount",
        type: "uint256",
      },
    ],
    name: "Trade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "prevSigner",
        type: "address",
      },
    ],
    name: "UpdateSigner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "authorized",
        type: "bool",
      },
    ],
    name: "UpdateWithdrawalAccount",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "dstChainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "dstPool",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "dstTrader",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "quoteToken",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quoteTokenAmount",
        type: "uint256",
      },
    ],
    name: "XChainTrade",
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
    name: "XChainTradeFill",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approveToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "decreaseTokenAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "externalAccount",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quoteTokenAmount",
        type: "uint256",
      },
    ],
    name: "fillXChain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "increaseTokenAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "address",
        name: "operations",
        type: "address",
      },
      {
        internalType: "address",
        name: "router",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "isValidSignature",
    outputs: [
      {
        internalType: "bytes4",
        name: "magicValue",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "killswitchOperations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "operations",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "signerConfiguration",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
            internalType: "bytes32",
            name: "txid",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "takerSignature",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerSignature",
            type: "bytes",
          },
        ],
        internalType: "struct IQuote.RFQMQuote",
        name: "quote",
        type: "tuple",
      },
    ],
    name: "tradeRFQM",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
        internalType: "struct IQuote.RFQTQuote",
        name: "quote",
        type: "tuple",
      },
    ],
    name: "tradeRFQT",
    outputs: [],
    stateMutability: "payable",
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
            internalType: "uint256",
            name: "quoteExpiry",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "txid",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "xChainMessenger",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "takerSignature",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerSignature",
            type: "bytes",
          },
        ],
        internalType: "struct IQuote.XChainRFQMQuote",
        name: "quote",
        type: "tuple",
      },
    ],
    name: "tradeXChainRFQM",
    outputs: [],
    stateMutability: "nonpayable",
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
            internalType: "address",
            name: "xChainMessenger",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct IQuote.XChainRFQTQuote",
        name: "quote",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
    ],
    name: "tradeXChainRFQT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "updateSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "withdrawalAccounts",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "authorized",
        type: "bool",
      },
    ],
    name: "updateWithdrawalAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "xChainMessenger",
        type: "address",
      },
      {
        internalType: "bool",
        name: "authorized",
        type: "bool",
      },
    ],
    name: "updateXChainMessengerAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "chainId",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "pool",
            type: "bytes32",
          },
        ],
        internalType: "struct IHashflowPool.AuthorizedXChainPool[]",
        name: "pools",
        type: "tuple[]",
      },
      {
        internalType: "bool",
        name: "authorized",
        type: "bool",
      },
    ],
    name: "updateXChainPoolAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IHashflowPool__factory {
  static readonly abi = _abi;
  static createInterface(): IHashflowPoolInterface {
    return new Interface(_abi) as IHashflowPoolInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IHashflowPool {
    return new Contract(address, _abi, runner) as unknown as IHashflowPool;
  }
}
