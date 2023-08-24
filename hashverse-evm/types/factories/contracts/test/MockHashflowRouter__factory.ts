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
  MockHashflowRouter,
  MockHashflowRouterInterface,
} from "../../../contracts/test/MockHashflowRouter";

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
            name: "maxBaseTokenAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxQuoteTokenAmount",
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
        internalType: "struct IHashflowRouter.RFQTQuote",
        name: "quote",
        type: "tuple",
      },
    ],
    name: "tradeSingleHop",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506108cb806100206000396000f3fe6080604052600436106100225760003560e01c8063f02109291461002e57600080fd5b3661002957005b600080fd5b61004161003c366004610694565b610043565b005b60808101516001600160a01b03166100e9578060c0015134146100e45760405162461bcd60e51b815260206004820152604860248201527f4d6f636b48617368666c6f77526f757465723a3a747261646553696e676c654860448201527f6f70206d73672e76616c75652073686f756c6420657175616c207472616465646064820152671030b6b7bab73a1760c11b608482015260a4015b60405180910390fd5b610111565b61011133308360c0015184608001516001600160a01b0316610187909392919063ffffffff16565b61010081015160e082015160c0830151101561014e578160e001518260c0015183610100015161014191906107ac565b61014b91906107d7565b90505b60a08201516001600160a01b031661016e5761016a33826101f8565b5050565b60a082015161016a906001600160a01b03163383610316565b6040516001600160a01b03808516602483015283166044820152606481018290526101f29085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610346565b50505050565b804710156102485760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016100db565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610295576040519150601f19603f3d011682016040523d82523d6000602084013e61029a565b606091505b50509050806103115760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016100db565b505050565b6040516001600160a01b03831660248201526044810182905261031190849063a9059cbb60e01b906064016101bb565b600061039b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661041b9092919063ffffffff16565b90508051600014806103bc5750808060200190518101906103bc91906107f9565b6103115760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016100db565b606061042a8484600085610432565b949350505050565b6060824710156104935760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016100db565b600080866001600160a01b031685876040516104af9190610846565b60006040518083038185875af1925050503d80600081146104ec576040519150601f19603f3d011682016040523d82523d6000602084013e6104f1565b606091505b50915091506105028783838761050d565b979650505050505050565b6060831561057c578251600003610575576001600160a01b0385163b6105755760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016100db565b508161042a565b61042a83838151156105915781518083602001fd5b8060405162461bcd60e51b81526004016100db9190610862565b634e487b7160e01b600052604160045260246000fd5b6040516101a0810167ffffffffffffffff811182821017156105e5576105e56105ab565b60405290565b80356001600160a01b038116811461060257600080fd5b919050565b600082601f83011261061857600080fd5b813567ffffffffffffffff80821115610633576106336105ab565b604051601f8301601f19908116603f0116810190828211818310171561065b5761065b6105ab565b8160405283815286602085880101111561067457600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000602082840312156106a657600080fd5b813567ffffffffffffffff808211156106be57600080fd5b908301906101a082860312156106d357600080fd5b6106db6105c1565b6106e4836105eb565b81526106f2602084016105eb565b6020820152610703604084016105eb565b6040820152610714606084016105eb565b6060820152610725608084016105eb565b608082015261073660a084016105eb565b60a082015260c0838101359082015260e080840135908201526101008084013590820152610120808401359082015261014080840135908201526101608084013590820152610180808401358381111561078f57600080fd5b61079b88828701610607565b918301919091525095945050505050565b80820281158282048414176107d157634e487b7160e01b600052601160045260246000fd5b92915050565b6000826107f457634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561080b57600080fd5b8151801515811461081b57600080fd5b9392505050565b60005b8381101561083d578181015183820152602001610825565b50506000910152565b60008251610858818460208701610822565b9190910192915050565b6020815260008251806020840152610881816040850160208701610822565b601f01601f1916919091016040019291505056fea2646970667358221220494a2ee4a1e2ae7ff5c8e26b9e09908210cef9b64c37d49ea3f7d1bf12ccac0464736f6c63430008130033";

type MockHashflowRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockHashflowRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockHashflowRouter__factory extends ContractFactory {
  constructor(...args: MockHashflowRouterConstructorParams) {
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
      MockHashflowRouter & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockHashflowRouter__factory {
    return super.connect(runner) as MockHashflowRouter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockHashflowRouterInterface {
    return new Interface(_abi) as MockHashflowRouterInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MockHashflowRouter {
    return new Contract(address, _abi, runner) as unknown as MockHashflowRouter;
  }
}
