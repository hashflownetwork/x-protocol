/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  StakingVault,
  StakingVaultInterface,
} from "../../../contracts/staking/StakingVault";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_hft",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "daysStaked",
        type: "uint64",
      },
    ],
    name: "BoostHFTStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "lockExpiry",
        type: "uint64",
      },
    ],
    name: "StakeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetVault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
    ],
    name: "TransferHFTStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "maxDaysToStake",
        type: "uint16",
      },
    ],
    name: "UpdateMaxDaysToStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAuthorized",
        type: "bool",
      },
    ],
    name: "UpdateSourceVaultAuthorization",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAuthorized",
        type: "bool",
      },
    ],
    name: "UpdateTargetVaultAuthorization",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amountWithdrawn",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amountRestaked",
        type: "uint128",
      },
    ],
    name: "WithdrawHFT",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "daysToStake",
        type: "uint16",
      },
    ],
    name: "boostHFTStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "daysToStake",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "approvalAmount",
        type: "uint256",
      },
    ],
    name: "boostHFTStakeWithPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getStakePower",
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
    name: "hft",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
    ],
    name: "increaseHFTStakeAmountFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxDaysToStake",
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
    name: "owner",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        internalType: "uint64",
        name: "lockExpiry",
        type: "uint64",
      },
    ],
    name: "receiveHFTStakeTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "sourceVaultAuthorization",
    outputs: [
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakes",
    outputs: [
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        internalType: "uint64",
        name: "lockExpiry",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "targetVaultAuthorization",
    outputs: [
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
        internalType: "address",
        name: "targetVault",
        type: "address",
      },
    ],
    name: "transferHFTStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "newMaxDaysToStake",
        type: "uint16",
      },
    ],
    name: "updateMaxDaysToStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isAuthorized",
        type: "bool",
      },
    ],
    name: "updateSourceVaultAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isAuthorized",
        type: "bool",
      },
    ],
    name: "updateTargetVaultAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "amountToRestake",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "daysToRestake",
        type: "uint16",
      },
    ],
    name: "withdrawHFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620024293803806200242983398101604081905262000034916200012c565b60016000556200004433620000da565b6001600160a01b038116620000b35760405162461bcd60e51b815260206004820152602b60248201527f5374616b696e675661756c743a3a636f6e7374727563746f722048465420697360448201526a10181030b2323932b9b99760a91b606482015260840160405180910390fd5b6001600160a01b03166080526001805461ffff60a01b191661016d60a21b1790556200015e565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000602082840312156200013f57600080fd5b81516001600160a01b03811681146200015757600080fd5b9392505050565b608051612277620001b26000396000818161027e015281816104140152818161052a01528181610a0201528181610a9e01528181610ad701528181610e2501528181611162015261122c01526122776000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063aa815743116100a2578063d87a26aa11610071578063d87a26aa14610279578063dd6ba7c2146102a0578063f2fde38b146102b3578063fb099fd9146102c6578063fc2cde48146102f957600080fd5b8063aa8157431461022d578063acec84fc14610240578063bae3264e14610253578063d7f35da01461026657600080fd5b8063715018a6116100e9578063715018a6146101b25780637e636b4d146101ba5780638b69af5a146101cd5780638da5cb5b146101f5578063a5eb539b1461021a57600080fd5b806309d2a7761461011b57806316934fc4146101415780633072133a1461018a578063422c63c91461019f575b600080fd5b61012e610129366004611e7e565b61031c565b6040519081526020015b60405180910390f35b61017c61014f366004611e7e565b6002602052600090815260409020546001600160801b03811690600160801b90046001600160401b031682565b604051610138929190611ea0565b61019d610198366004611eeb565b6103b5565b005b61019d6101ad366004611f1e565b610449565b61019d61055b565b61019d6101c8366004611f56565b6105d1565b6001546101e290600160a01b900461ffff1681565b60405161ffff9091168152602001610138565b6001546001600160a01b03165b6040516001600160a01b039091168152602001610138565b61019d610228366004611f8d565b610753565b61019d61023b366004611fe0565b610a3f565b61019d61024e366004611eeb565b610b11565b61019d610261366004612050565b610e5b565b61019d610274366004611e7e565b610f42565b6102027f000000000000000000000000000000000000000000000000000000000000000081565b61019d6102ae366004611f56565b61130c565b61019d6102c1366004611e7e565b611486565b6102e96102d4366004611e7e565b60036020526000908152604090205460ff1681565b6040519015158152602001610138565b6102e9610307366004611e7e565b60046020526000908152604090205460ff1681565b6001600160a01b03811660009081526002602090815260408083208151808301909252546001600160801b0381168252600160801b90046001600160401b03169181018290528291421015610387574281602001516001600160401b03166103849190612081565b91505b8051630784ce00906103a39084906001600160801b031661209a565b6103ad91906120b1565b949350505050565b6103c03383836114fc565b604080516001600160801b038416815261ffff8316602082015233917f86b3e0a1de6bacc903f2345288bc1d2c660fc307c42f9101090143f7efc8f664910160405180910390a26104456001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633306001600160801b038616611845565b5050565b333b6104cd5760405162461bcd60e51b815260206004820152604260248201527f5374616b696e675661756c743a3a696e6372656173654846545374616b65416d60448201527f6f756e74466f722043616c6c65722073686f756c6420626520636f6e747261636064820152613a1760f11b608482015260a4015b60405180910390fd5b6104d9828260006114fc565b816001600160a01b03167f86b3e0a1de6bacc903f2345288bc1d2c660fc307c42f9101090143f7efc8f664826000604051610515929190611ea0565b60405180910390a26104456001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633306001600160801b038516611845565b6105636118b0565b60405162461bcd60e51b815260206004820152603a60248201527f5374616b696e675661756c743a3a72656e6f756e63654f776e6572736869702060448201527f43616e6e6f742072656e6f756e6365206f776e6572736869702e00000000000060648201526084016104c4565b6105d96118b0565b306001600160a01b038316036106635760405162461bcd60e51b815260206004820152604360248201527f5374616b696e675661756c743a3a757064617465536f757263655661756c744160448201527f7574686f72697a6174696f6e2043616e6e6f742073656c662d617574686f72696064820152623d329760e91b608482015260a4016104c4565b6001600160a01b03821660009081526003602052604090205481151560ff9091161515036106ef5760405162461bcd60e51b815260206004820152603360248201527f5374616b696e675661756c743a3a757064617465536f757263655661756c74416044820152723aba3437b934bd30ba34b7b710273796b7b81760691b60648201526084016104c4565b6001600160a01b038216600081815260036020908152604091829020805460ff19168515159081179091558251938452908301527f70732b7013abd74771dcf234d3590fe1c500ea2682edf734f6eaa3940b9ea2aa91015b60405180910390a15050565b61075b61190c565b3360009081526003602052604090205460ff166107eb5760405162461bcd60e51b815260206004820152604260248201527f5374616b696e675661756c743a3a726563656976654846545374616b6554726160448201527f6e7366657220536f75726365205661756c74206e6f7420617574686f72697a65606482015261321760f11b608482015260a4016104c4565b6001600160a01b0383166000908152600260209081526040918290208251808401909352546001600160801b03811683526001600160401b03600160801b9091048116918301829052839291908316101561084857806020015191505b600154610864906201518090600160a01b900461ffff166120d3565b61086e90426120fe565b6001600160401b0316826001600160401b031611156108f55760405162461bcd60e51b815260206004820152603960248201527f5374616b696e675661756c743a3a726563656976654846545374616b6554726160448201527f6e736665722054696d65206c6f636b20746f6f20686967682e0000000000000060648201526084016104c4565b6001600160401b038216602082015280516001600160801b039081169061091d908690612125565b6001600160801b0316116109925760405162461bcd60e51b815260206004820152603660248201527f5374616b696e675661756c743a3a726563656976654846545374616b655472616044820152753739b332b91030b6b7bab73a103a37b7903434b3b41760511b60648201526084016104c4565b83816000018181516109a49190612145565b6001600160801b039081169091526001600160a01b03808816600090815260026020908152604090912085518154928701516001600160401b0316600160801b026001600160c01b031990931690851617919091179055610a2e92507f00000000000000000000000000000000000000000000000000000000000000001690339030908816611845565b5050610a3a6001600055565b505050565b610a4a3388886114fc565b604080516001600160801b038916815261ffff8816602082015233917f86b3e0a1de6bacc903f2345288bc1d2c660fc307c42f9101090143f7efc8f664910160405180910390a2610aca6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633308489898989611965565b610b086001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633306001600160801b038b16611845565b50505050505050565b336000908152600260209081526040918290208251808401909352546001600160801b0381168352600160801b90046001600160401b0316908201819052421015610baf5760405162461bcd60e51b815260206004820152602860248201527f5374616b696e675661756c743a3a776974686472617748465420484654206973604482015267103637b1b5b2b21760c11b60648201526084016104c4565b80516001600160801b0316610c175760405162461bcd60e51b815260206004820152602860248201527f5374616b696e675661756c743a3a7769746864726177484654204e6f204846546044820152671039ba30b5b2b21760c11b60648201526084016104c4565b80516001600160801b03841615610d265760008361ffff1611610c975760405162461bcd60e51b815260206004820152603260248201527f5374616b696e675661756c743a3a77697468647261774846542054696d65206c60448201527137b1b5903737ba1039b832b1b4b334b2b21760711b60648201526084016104c4565b81600001516001600160801b0316846001600160801b03161115610d195760405162461bcd60e51b815260206004820152603360248201527f5374616b696e675661756c743a3a77697468647261774846542052652d73746160448201527235b29030b6b7bab73a103a37b7903434b3b41760691b60648201526084016104c4565b610d238482612125565b90505b6000808352338082526002602090815260409283902085518154928701516001600160401b038116600160801b026001600160c01b03199094166001600160801b0383161793909317909155925191927fdbdb18caec8ad3ec704832308d0bd122427925c5d868b0433d7274abcb3dced992610da29290611ea0565b60405180910390a26001600160801b03841615610dc457610dc43385856114fc565b604080516001600160801b0380841682528616602082015233917f494cd4093d13ed8794a3d071baa5d2303ef94892de13e5de5867b32f36a791ed910160405180910390a26001600160801b03811615610e5557610e556001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016336001600160801b038416611b3b565b50505050565b610e636118b0565b60015461ffff600160a01b909104811690821603610ee95760405162461bcd60e51b815260206004820152603a60248201527f5374616b696e675661756c743a3a7570646174654d617844617973546f53746160448201527f6b65204e756d62657220686173206e6f74206368616e6765642e00000000000060648201526084016104c4565b6001805461ffff60a01b1916600160a01b61ffff8481168202929092179283905560405192041681527f9a08e049fdbac625df76c3bf444b79a8efce4cbacbdecb8256e15b706870427f9060200160405180910390a150565b610f4a61190c565b6001600160a01b03811660009081526004602052604090205460ff16610fd85760405162461bcd60e51b815260206004820152603b60248201527f5374616b696e675661756c743a3a7472616e736665724846545374616b65205460448201527f6172676574205661756c74206e6f7420617574686f72697a65642e000000000060648201526084016104c4565b336000908152600260209081526040918290208251808401909352546001600160801b038116808452600160801b9091046001600160401b03169183019190915261107b5760405162461bcd60e51b815260206004820152602d60248201527f5374616b696e675661756c743a3a7472616e736665724846545374616b65204e60448201526c379024232a103637b1b5b2b21760991b60648201526084016104c4565b80516020808301805160008086528083523380825260029094526040908190208651815494516001600160401b038116600160801b026001600160c01b03199096166001600160801b038316179590951790915590519193927fdbdb18caec8ad3ec704832308d0bd122427925c5d868b0433d7274abcb3dced992611101929190611ea0565b60405180910390a2604080516001600160a01b03861681526001600160801b038416602082015233917ffb37715dec5843656a46bcaec02818c7312ec8634e32d05ca8e6c394078faf5d910160405180910390a26111926001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016856001600160801b038516611b6b565b60405163a5eb539b60e01b81523360048201526001600160801b03831660248201526001600160401b03821660448201526001600160a01b0385169063a5eb539b90606401600060405180830381600087803b1580156111f157600080fd5b505af1158015611205573d6000803e3d6000fd5b5050604051636eb1769f60e11b81523060048201526001600160a01b0387811660248301527f000000000000000000000000000000000000000000000000000000000000000016925063dd62ed3e9150604401602060405180830381865afa158015611275573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112999190612165565b156112fc5760405162461bcd60e51b815260206004820152602d60248201527f5374616b696e675661756c743a3a7472616e736665724846545374616b65204860448201526c232a103737ba1039b832b73a1760991b60648201526084016104c4565b5050506113096001600055565b50565b6113146118b0565b306001600160a01b0383160361139e5760405162461bcd60e51b815260206004820152604360248201527f5374616b696e675661756c743a3a7570646174655461726765745661756c744160448201527f7574686f72697a6174696f6e2043616e6e6f742073656c662d617574686f72696064820152623d329760e91b608482015260a4016104c4565b6001600160a01b03821660009081526004602052604090205481151560ff90911615150361142a5760405162461bcd60e51b815260206004820152603360248201527f5374616b696e675661756c743a3a7570646174655461726765745661756c74416044820152723aba3437b934bd30ba34b7b710273796b7b81760691b60648201526084016104c4565b6001600160a01b038216600081815260046020908152604091829020805460ff19168515159081179091558251938452908301527fe3092a057e4413769c2e5e18895003df1e1dafe3f2327ae9365dd5dc122849929101610747565b61148e6118b0565b6001600160a01b0381166114f35760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104c4565b61130981611c18565b6000826001600160801b03161180611518575060008161ffff16115b61158a5760405162461bcd60e51b815260206004820152603a60248201527f5374616b696e675661756c743a3a5f626f6f73744846545374616b6520416d6f60448201527f756e74206f722064617973206861766520746f206265203e203000000000000060648201526084016104c4565b6001600160a01b0383166000908152600260209081526040918290208251808401909352546001600160801b0381168352600160801b90046001600160401b03169082015261ffff8216156117055760004282602001516001600160401b0316111561160357428260200151611600919061217e565b90505b60006116166201518061ffff86166120d3565b600154909150611635906201518090600160a01b900461ffff166120d3565b6001600160401b031661164883836120fe565b6001600160401b031611156116b75760405162461bcd60e51b815260206004820152602f60248201527f5374616b696e675661756c743a3a5f626f6f73744846545374616b652054696d60448201526e0ca40d8dec6d640e8dede40d0d2ced608b1b60648201526084016104c4565b6001600160401b038216156116e95780836020018181516116d891906120fe565b6001600160401b0316905250611702565b6116f381426120fe565b6001600160401b031660208401525b50505b6001600160801b038316156117b65780516001600160801b038085169161172b91612125565b6001600160801b0316116117975760405162461bcd60e51b815260206004820152602d60248201527f5374616b696e675661756c743a3a5f626f6f73744846545374616b6520616d6f60448201526c3ab73a103a37b7903434b3b41760991b60648201526084016104c4565b82816000018181516117a99190612145565b6001600160801b03169052505b6001600160a01b03841660008181526002602090815260409182902084518154928601516001600160401b038116600160801b026001600160c01b03199094166001600160801b038316179390931790915591517fdbdb18caec8ad3ec704832308d0bd122427925c5d868b0433d7274abcb3dced992611837929091611ea0565b60405180910390a250505050565b6040516001600160a01b0380851660248301528316604482015260648101829052610e559085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611c6a565b6001546001600160a01b0316331461190a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104c4565b565b60026000540361195e5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016104c4565b6002600055565b604051623f675f60e91b81526001600160a01b038881166004830152600091908a1690637ecebe0090602401602060405180830381865afa1580156119ae573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119d29190612165565b60405163d505accf60e01b81526001600160a01b038a811660048301528981166024830152604482018990526064820188905260ff8716608483015260a4820186905260c48201859052919250908a169063d505accf9060e401600060405180830381600087803b158015611a4657600080fd5b505af1158015611a5a573d6000803e3d6000fd5b5050604051623f675f60e91b81526001600160a01b038b81166004830152600093508c169150637ecebe0090602401602060405180830381865afa158015611aa6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611aca9190612165565b9050611ad782600161219e565b8114611b2f5760405162461bcd60e51b815260206004820152602160248201527f5361666545524332303a207065726d697420646964206e6f74207375636365656044820152601960fa1b60648201526084016104c4565b50505050505050505050565b6040516001600160a01b038316602482015260448101829052610a3a90849063a9059cbb60e01b90606401611879565b604051636eb1769f60e11b81523060048201526001600160a01b0383811660248301526000919085169063dd62ed3e90604401602060405180830381865afa158015611bbb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bdf9190612165565b9050610e558463095ea7b360e01b85611bf8868661219e565b6040516001600160a01b0390921660248301526044820152606401611879565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000611cbf826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611d3f9092919063ffffffff16565b9050805160001480611ce0575080806020019051810190611ce091906121b1565b610a3a5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016104c4565b60606103ad848460008585600080866001600160a01b03168587604051611d6691906121f2565b60006040518083038185875af1925050503d8060008114611da3576040519150601f19603f3d011682016040523d82523d6000602084013e611da8565b606091505b5091509150611db987838387611dc4565b979650505050505050565b60608315611e33578251600003611e2c576001600160a01b0385163b611e2c5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016104c4565b50816103ad565b6103ad8383815115611e485781518083602001fd5b8060405162461bcd60e51b81526004016104c4919061220e565b80356001600160a01b0381168114611e7957600080fd5b919050565b600060208284031215611e9057600080fd5b611e9982611e62565b9392505050565b6001600160801b039290921682526001600160401b0316602082015260400190565b80356001600160801b0381168114611e7957600080fd5b803561ffff81168114611e7957600080fd5b60008060408385031215611efe57600080fd5b611f0783611ec2565b9150611f1560208401611ed9565b90509250929050565b60008060408385031215611f3157600080fd5b611f3a83611e62565b9150611f1560208401611ec2565b801515811461130957600080fd5b60008060408385031215611f6957600080fd5b611f7283611e62565b91506020830135611f8281611f48565b809150509250929050565b600080600060608486031215611fa257600080fd5b611fab84611e62565b9250611fb960208501611ec2565b915060408401356001600160401b0381168114611fd557600080fd5b809150509250925092565b600080600080600080600060e0888a031215611ffb57600080fd5b61200488611ec2565b965061201260208901611ed9565b955060408801359450606088013560ff8116811461202f57600080fd5b9699959850939660808101359560a0820135955060c0909101359350915050565b60006020828403121561206257600080fd5b611e9982611ed9565b634e487b7160e01b600052601160045260246000fd5b818103818111156120945761209461206b565b92915050565b80820281158282048414176120945761209461206b565b6000826120ce57634e487b7160e01b600052601260045260246000fd5b500490565b6001600160401b038181168382160280821691908281146120f6576120f661206b565b505092915050565b6001600160401b0381811683821601908082111561211e5761211e61206b565b5092915050565b6001600160801b0382811682821603908082111561211e5761211e61206b565b6001600160801b0381811683821601908082111561211e5761211e61206b565b60006020828403121561217757600080fd5b5051919050565b6001600160401b0382811682821603908082111561211e5761211e61206b565b808201808211156120945761209461206b565b6000602082840312156121c357600080fd5b8151611e9981611f48565b60005b838110156121e95781810151838201526020016121d1565b50506000910152565b600082516122048184602087016121ce565b9190910192915050565b602081526000825180602084015261222d8160408501602087016121ce565b601f01601f1916919091016040019291505056fea264697066735822122027f0241461b620c50d5e0b35a94f980508a794314d6068002e9d452e6ed5c28964736f6c63430008130033";

type StakingVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StakingVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StakingVault__factory extends ContractFactory {
  constructor(...args: StakingVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _hft: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_hft, overrides || {});
  }
  override deploy(
    _hft: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_hft, overrides || {}) as Promise<
      StakingVault & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): StakingVault__factory {
    return super.connect(runner) as StakingVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingVaultInterface {
    return new Interface(_abi) as StakingVaultInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): StakingVault {
    return new Contract(address, _abi, runner) as unknown as StakingVault;
  }
}
