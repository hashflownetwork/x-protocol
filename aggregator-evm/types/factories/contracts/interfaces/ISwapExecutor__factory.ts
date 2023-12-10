/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ISwapExecutor,
  ISwapExecutorInterface,
} from "../../../contracts/interfaces/ISwapExecutor";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "exactAmount",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "recipient",
            type: "address",
          },
        ],
        internalType: "struct ISwapExecutor.TokenTransferInfo[]",
        name: "targetTokenTransferInfos",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "sourceToken",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "tokenRatio",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
              {
                internalType: "uint256",
                name: "params",
                type: "uint256",
              },
            ],
            internalType: "struct ISwapExecutor.TargetSwapDescription[]",
            name: "swaps",
            type: "tuple[]",
          },
        ],
        internalType: "struct ISwapExecutor.SwapDescription[]",
        name: "swapDescriptions",
        type: "tuple[]",
      },
    ],
    name: "executeSwap",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export class ISwapExecutor__factory {
  static readonly abi = _abi;
  static createInterface(): ISwapExecutorInterface {
    return new Interface(_abi) as ISwapExecutorInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ISwapExecutor {
    return new Contract(address, _abi, runner) as unknown as ISwapExecutor;
  }
}