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
  HashflowAavePortal,
  HashflowAavePortalInterface,
} from "../../../contracts/xapp/HashflowAavePortal";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_aavePool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_hashflowRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_wormholeMessenger",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Freeze",
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
    name: "OwnershipTransferStarted",
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
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "aToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
    ],
    name: "ReceiveAssetPosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "aToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "dstHashflowChainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dstAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dstAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
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
        internalType: "bytes32",
        name: "dstContract",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "dstCalldata",
        type: "bytes",
      },
    ],
    name: "TransferAssetPosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "killswitch",
        type: "bool",
      },
    ],
    name: "UpdateKillswitch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "hashflowChainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "address",
        name: "portal",
        type: "address",
      },
    ],
    name: "UpdateRemotePortal",
    type: "event",
  },
  {
    inputs: [],
    name: "aavePool",
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
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "freeze",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "frozen",
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
    inputs: [],
    name: "hashflowRouter",
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
    name: "killswitch",
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
    inputs: [],
    name: "pendingOwner",
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
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "txid",
        type: "bytes32",
      },
    ],
    name: "receiveAssetPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "remotePortals",
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
    name: "renounceOwnership",
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
        internalType: "struct IHashflowAavePortal.XChainQuote",
        name: "quote",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "underlyingAssetAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "transferAssetPosition",
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
        internalType: "bool",
        name: "_killswitch",
        type: "bool",
      },
    ],
    name: "updateKillswitch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "hashflowChainId",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "portal",
        type: "address",
      },
    ],
    name: "updateRemotePortal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wormholeMessenger",
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
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200246c3803806200246c833981016040819052620000349162000369565b6200003f33620002c3565b6001600160a01b038316620000b05760405162461bcd60e51b815260206004820152603e60248201526000805160206200244c83398151915260448201527f4161766520506f6f6c2063616e6e6f74206265203020616464726573732e000060648201526084015b60405180910390fd5b620000cf836001600160a01b0316620002ed60201b6200137d1760201c565b620001325760405162461bcd60e51b815260206004820152603d60248201526000805160206200244c83398151915260448201527f4161766520506f6f6c206d757374206265206120636f6e74726163742e0000006064820152608401620000a7565b6001600160a01b038216620001ad5760405162461bcd60e51b8152602060048201526044602482018190526000805160206200244c833981519152908201527f48617368666c6f7720526f757465722063616e6e6f742062652030206164647260648201526332b9b99760e11b608482015260a401620000a7565b620001cc826001600160a01b0316620002ed60201b6200137d1760201c565b6200023b5760405162461bcd60e51b815260206004820152604360248201526000805160206200244c83398151915260448201527f48617368666c6f7720526f75746572206d757374206265206120636f6e74726160648201526231ba1760e91b608482015260a401620000a7565b600280546001600160a01b038581166001600160a01b031992831617909255600380548584169216919091179055600480546001600160a81b03191691831691909117600160a01b179055604051600181527f52742f67dab6d106dc1ab78b179c61e8df8fd635061024a7057d2bcc22ae23c49060200160405180910390a1505050620003b3565b600180546001600160a01b0319169055620002ea81620002fc602090811b6200138c17901c565b50565b6001600160a01b03163b151590565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146200036457600080fd5b919050565b6000806000606084860312156200037f57600080fd5b6200038a846200034c565b92506200039a602085016200034c565b9150620003aa604085016200034c565b90509250925092565b61208980620003c36000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806379ba509711610097578063a6b5c8fd11610066578063a6b5c8fd146101f7578063dc2e50e814610220578063e30c397814610233578063f2fde38b1461024457600080fd5b806379ba5097146101b857806384d612e6146101c05780638da5cb5b146101d3578063a03e4bc3146101e457600080fd5b80635a29c95c116100d35780635a29c95c1461018257806362a5af3b146101955780636b2148f51461019d578063715018a6146101b057600080fd5b8063049a804914610105578063054f7d9c1461011a5780633c1df5ca1461014357806342dd96f71461016e575b600080fd5b610118610113366004611862565b610257565b005b60045461012e90600160a81b900460ff1681565b60405190151581526020015b60405180910390f35b600454610156906001600160a01b031681565b6040516001600160a01b03909116815260200161013a565b60045461012e90600160a01b900460ff1681565b6101186101903660046118c6565b6102ba565b6101186104d0565b6101186101ab3660046118ff565b610583565b6101186108f4565b610118610908565b6101186101ce366004611a38565b610982565b6000546001600160a01b0316610156565b600254610156906001600160a01b031681565b610156610205366004611b8b565b6005602052600090815260409020546001600160a01b031681565b600354610156906001600160a01b031681565b6001546001600160a01b0316610156565b610118610252366004611ba8565b61130c565b61025f6113dc565b6004805460ff60a01b1916600160a01b8315158102919091179182905560405160ff9190920416151581527f52742f67dab6d106dc1ab78b179c61e8df8fd635061024a7057d2bcc22ae23c49060200160405180910390a150565b6102c26113dc565b600454600160a81b900460ff16156103385760405162461bcd60e51b815260206004820152602e60248201527f48617368666c6f7741617665506f7274616c3a3a75706461746552656d6f746560448201526d2837b93a30b610233937bd32b71760911b60648201526084015b60405180910390fd5b61ffff82166000908152600560205260409020546001600160a01b0316156103e75760035461ffff83166000908152600560205260409020546001600160a01b03918216916315c67d1d918591166040516001600160e01b031960e085901b16815261ffff9092166004830152602482015260006044820152606401600060405180830381600087803b1580156103ce57600080fd5b505af11580156103e2573d6000803e3d6000fd5b505050505b61ffff8216600090815260056020526040902080546001600160a01b0319166001600160a01b03838116918217909255600354909116906315c67d1d9084906040516001600160e01b031960e085901b16815261ffff9092166004830152602482015260016044820152606401600060405180830381600087803b15801561046e57600080fd5b505af1158015610482573d6000803e3d6000fd5b50506040805161ffff861681526001600160a01b03851660208201527f2fb23fdc513dceedad2c63d8b15d74e6851bf50a76bf6130ce2ec6d869b26372935001905060405180910390a15050565b6104d86113dc565b600454600160a81b900460ff16156105455760405162461bcd60e51b815260206004820152602a60248201527f48617368666c6f7741617665506f7274616c3a3a667265657a6520416c726561604482015269323c90333937bd32b71760b11b606482015260840161032f565b6004805460ff60a81b1916600160a81b1790556040517f615acbaede366d76a8b8cb2a9ada6a71495f0786513d71aa97aaf0c3910b78de90600090a1565b600454600160a01b900460ff166106025760405162461bcd60e51b815260206004820152603760248201527f48617368666c6f7741617665506f7274616c3a3a72656365697665417373657460448201527f506f736974696f6e20506f7274616c206973206f66662e000000000000000000606482015260840161032f565b6003546001600160a01b031633146106825760405162461bcd60e51b815260206004820152603f60248201527f48617368666c6f7741617665506f7274616c3a3a72656365697665417373657460448201527f506f736974696f6e2053656e646572206d75737420626520726f757465722e00606482015260840161032f565b6002546040516335ea6a7560e01b81526001600160a01b03868116600483015260009216906335ea6a75906024016101e060405180830381865afa1580156106ce573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106f29190611c52565b6101008101519091506001600160a01b0381166107845760405163a9059cbb60e01b81526001600160a01b0385811660048301526024820187905287169063a9059cbb906044016020604051808303816000875af1158015610758573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061077c9190611d75565b5050506108ee565b6002546040516369a933a560e01b81526001600160a01b03888116600483015260248201889052868116604483015260006064830152909116906369a933a590608401600060405180830381600087803b1580156107e157600080fd5b505af11580156107f5573d6000803e3d6000fd5b505060025461081392506001600160a01b0389811692501687611436565b60025460405163d65dc7a160e01b81526001600160a01b03888116600483015260248201889052600060448301529091169063d65dc7a1906064016020604051808303816000875af115801561086d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108919190611d92565b50604080516001600160a01b0388811682528381166020830152818301889052861660608201526080810185905290517f13ea64cce66fae7b13489db5576a471d1ccff8429ac5e9233afbf94e8b3ea54d9181900360a00190a150505b50505050565b6108fc6113dc565b61090660006114f8565b565b60015433906001600160a01b031681146109765760405162461bcd60e51b815260206004820152602960248201527f4f776e61626c6532537465703a2063616c6c6572206973206e6f7420746865206044820152683732bb9037bbb732b960b91b606482015260840161032f565b61097f816114f8565b50565b600454600160a01b900460ff166109ef5760405162461bcd60e51b8152602060048201526038602482015260008051602061203483398151915260448201527f74506f736974696f6e20506f7274616c206973206f66662e0000000000000000606482015260840161032f565b60208084015161ffff166000908152600590915260409020546001600160a01b0316610a7f5760405162461bcd60e51b815260206004820152604460248201819052600080516020612034833981519152908201527f74506f736974696f6e20496e76616c69642064657374696e6174696f6e20636860648201526330b4b71760e11b608482015260a40161032f565b6004546101c08401516001600160a01b03908116911614610af65760405162461bcd60e51b815260206004820152603c602482015260008051602061203483398151915260448201527f74506f736974696f6e20496e76616c6964206d657373656e6765722e00000000606482015260840161032f565b60c08301516001600160a01b03811614610b765760405162461bcd60e51b8152602060048201526047602482015260008051602061203483398151915260448201527f74506f736974696f6e20647374547261646572206974206e6f742045564d206160648201526632323932b9b99760c91b608482015260a40161032f565b60208381015161ffff1660009081526005909152604090205460c08401516001600160a01b03908116911614610c165760405162461bcd60e51b815260206004820152604b602482015260008051602061203483398151915260448201527f74506f736974696f6e206473745472616465722073686f756c64203d3d20726560648201526a36b7ba32a837b93a30b61760a91b608482015260a40161032f565b6101008301516001600160a01b03811614610c985760405162461bcd60e51b8152602060048201526048602482015260008051602061203483398151915260448201527f74506f736974696f6e2071756f7465546f6b656e206974206e6f742045564d2060648201526730b2323932b9b99760c11b608482015260a40161032f565b60025460e08401516040516335ea6a7560e01b81526001600160a01b03918216600482015260009291909116906335ea6a75906024016101e060405180830381865afa158015610cec573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d109190611c52565b610100015190506001600160a01b038116610d815760405162461bcd60e51b815260206004820152603b602482015260008051602061203483398151915260448201527f74506f736974696f6e2061546f6b656e206e6f7420666f756e642e0000000000606482015260840161032f565b6001600160a01b0381166323b872dd33306001600160a01b0385166370a08231336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610de6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e0a9190611d92565b6040516001600160e01b031960e086901b1681526001600160a01b03938416600482015292909116602483015260448201526064016020604051808303816000875af1158015610e5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e829190611d75565b50604080516102208101825260008082526020820181905291810182905260608082018390526080820183905260a0820183905260c0820183905260e08201839052610100820183905261012082018390526101408201839052610160820183905261018082018390526101a082018390526101c082018390526101e0820192909252610200810191909152845161ffff9081168252602080870151909116908201526040808601516001600160a01b03908116828401526060808801519084015260808088015182169084015260a0808801519084015260c0808801519084015260e0808801805183169185019190915261010080890151908501526101208801516101408086019190915288015161016080860191909152880151610180808601919091528801516101a0808601919091528801516101c08086019190915288015182166101e08086019190915288015161020085015260025490519251631a4ca37b60e21b81529282166004840152602483018790523060448401526000929116906369328dec906064016020604051808303816000875af115801561102f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110539190611d92565b90508561012001518111156110d75760405162461bcd60e51b8152602060048201526050602482015260008051602061203483398151915260448201527f74506f736974696f6e205769746864726577206d6f7265207468616e2074686560648201526f1038bab7ba329039bab83837b93a399760811b608482015260a40161032f565b610120808301829052610140870151908701519091101561111b5785610120015182610120015187610140015161110e9190611dab565b6111189190611dd0565b90505b60035461012083015160e0880151611141926001600160a01b0391821692911690611436565b60208681015161ffff16600090815260058252604090819020546101008901516101a08a015183516001600160a01b0392831660248201526044810187905289831660648201526084808201929092528451808203909201825260a401845293840180516001600160e01b0316636b2148f560e01b1790526003549251637ce330b360e11b81529181169392169063f9c66166906111e790879086908690600401611e42565b600060405180830381600087803b15801561120157600080fd5b505af1158015611215573d6000803e3d6000fd5b5050505061129c6112233390565b6040516370a0823160e01b81523060048201526001600160a01b038816906370a0823190602401602060405180830381865afa158015611267573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061128b9190611d92565b6001600160a01b0388169190611511565b7f3602426fe0e114001da2f1f7db41afa13fd9955ffa919e052351fe23124b6ff18860e00151868661012001518b602001516112da8d610100015190565b888c8f6101a001518a8a6040516112fa9a99989796959493929190611f93565b60405180910390a15050505050505050565b6113146113dc565b600180546001600160a01b0383166001600160a01b031990911681179091556113456000546001600160a01b031690565b6001600160a01b03167f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270060405160405180910390a350565b6001600160a01b03163b151590565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000546001600160a01b031633146109065760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161032f565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b1790526114878482611546565b6108ee576040516001600160a01b0384166024820152600060448201526114ee90859063095ea7b360e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526115ef565b6108ee84826115ef565b600180546001600160a01b031916905561097f8161138c565b6040516001600160a01b03831660248201526044810182905261154190849063a9059cbb60e01b906064016114b7565b505050565b6000806000846001600160a01b0316846040516115639190612004565b6000604051808303816000865af19150503d80600081146115a0576040519150601f19603f3d011682016040523d82523d6000602084013e6115a5565b606091505b50915091508180156115cf5750805115806115cf5750808060200190518101906115cf9190611d75565b80156115e457506001600160a01b0385163b15155b925050505b92915050565b6000611644826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166116c49092919063ffffffff16565b90508051600014806116655750808060200190518101906116659190611d75565b6115415760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161032f565b60606116d384846000856116db565b949350505050565b60608247101561173c5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161032f565b600080866001600160a01b031685876040516117589190612004565b60006040518083038185875af1925050503d8060008114611795576040519150601f19603f3d011682016040523d82523d6000602084013e61179a565b606091505b50915091506117ab878383876117b6565b979650505050505050565b6060831561182557825160000361181e576001600160a01b0385163b61181e5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161032f565b50816116d3565b6116d3838381511561183a5781518083602001fd5b8060405162461bcd60e51b815260040161032f9190612020565b801515811461097f57600080fd5b60006020828403121561187457600080fd5b813561187f81611854565b9392505050565b61ffff8116811461097f57600080fd5b80356118a181611886565b919050565b6001600160a01b038116811461097f57600080fd5b80356118a1816118a6565b600080604083850312156118d957600080fd5b82356118e481611886565b915060208301356118f4816118a6565b809150509250929050565b6000806000806080858703121561191557600080fd5b8435611920816118a6565b9350602085013592506040850135611937816118a6565b9396929550929360600135925050565b634e487b7160e01b600052604160045260246000fd5b604051610200810167ffffffffffffffff8111828210171561198157611981611947565b60405290565b6040516101e0810167ffffffffffffffff8111828210171561198157611981611947565b600082601f8301126119bc57600080fd5b813567ffffffffffffffff808211156119d7576119d7611947565b604051601f8301601f19908116603f011681019082821181831017156119ff576119ff611947565b81604052838152866020858801011115611a1857600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600060608486031215611a4d57600080fd5b833567ffffffffffffffff80821115611a6557600080fd5b908501906102008288031215611a7a57600080fd5b611a8261195d565b611a8b83611896565b8152611a9960208401611896565b6020820152611aaa604084016118bb565b604082015260608301356060820152611ac5608084016118bb565b608082015260a083013560a082015260c083013560c0820152611aea60e084016118bb565b60e0820152610100838101359082015261012080840135908201526101408084013590820152610160808401359082015261018080840135908201526101a080840135908201526101c0611b3f8185016118bb565b908201526101e08381013583811115611b5757600080fd5b611b638a8287016119ab565b82840152505080955050505060208401359150611b82604085016118bb565b90509250925092565b600060208284031215611b9d57600080fd5b813561187f81611886565b600060208284031215611bba57600080fd5b813561187f816118a6565b600060208284031215611bd757600080fd5b6040516020810181811067ffffffffffffffff82111715611bfa57611bfa611947565b6040529151825250919050565b80516fffffffffffffffffffffffffffffffff811681146118a157600080fd5b805164ffffffffff811681146118a157600080fd5b80516118a181611886565b80516118a1816118a6565b60006101e08284031215611c6557600080fd5b611c6d611987565b611c778484611bc5565b8152611c8560208401611c07565b6020820152611c9660408401611c07565b6040820152611ca760608401611c07565b6060820152611cb860808401611c07565b6080820152611cc960a08401611c07565b60a0820152611cda60c08401611c27565b60c0820152611ceb60e08401611c3c565b60e0820152610100611cfe818501611c47565b90820152610120611d10848201611c47565b90820152610140611d22848201611c47565b90820152610160611d34848201611c47565b90820152610180611d46848201611c07565b908201526101a0611d58848201611c07565b908201526101c0611d6a848201611c07565b908201529392505050565b600060208284031215611d8757600080fd5b815161187f81611854565b600060208284031215611da457600080fd5b5051919050565b80820281158282048414176115e957634e487b7160e01b600052601160045260246000fd5b600082611ded57634e487b7160e01b600052601260045260246000fd5b500490565b60005b83811015611e0d578181015183820152602001611df5565b50506000910152565b60008151808452611e2e816020860160208601611df2565b601f01601f19169290920160200192915050565b60608152611e5760608201855161ffff169052565b60006020850151611e6e608084018261ffff169052565b5060408501516001600160a01b03811660a084015250606085015160c083015260808501516001600160a01b03811660e08401525060a0850151610100818185015260c08701519150610120828186015260e08801519250610140611edd818701856001600160a01b03169052565b91880151610160868101919091529088015161018080870191909152918801516101a080870191909152908801516101c080870191909152918801516101e08087019190915290880151610200808701919091529188015161022080870191909152908801516001600160a01b0316610240860152908701516102608501919091529050611f6f610280840182611e16565b90508460208401528281036040840152611f898185611e16565b9695505050505050565b600061014060018060a01b03808e168452808d1660208501528b604085015261ffff8b166060850152808a1660808501528860a085015280881660c0850152508560e08401528461010084015280610120840152611ff381840185611e16565b9d9c50505050505050505050505050565b60008251612016818460208701611df2565b9190910192915050565b60208152600061187f6020830184611e1656fe48617368666c6f7741617665506f7274616c3a3a7472616e7366657241737365a26469706673582212203390aa6875d710252bed6f9e8c4d1ea19621622cd340b9de105649c638458a4364736f6c6343000812003348617368666c6f7741617665506f7274616c3a3a636f6e7374727563746f7220";

type HashflowAavePortalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HashflowAavePortalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HashflowAavePortal__factory extends ContractFactory {
  constructor(...args: HashflowAavePortalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _aavePool: AddressLike,
    _hashflowRouter: AddressLike,
    _wormholeMessenger: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _aavePool,
      _hashflowRouter,
      _wormholeMessenger,
      overrides || {}
    );
  }
  override deploy(
    _aavePool: AddressLike,
    _hashflowRouter: AddressLike,
    _wormholeMessenger: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _aavePool,
      _hashflowRouter,
      _wormholeMessenger,
      overrides || {}
    ) as Promise<
      HashflowAavePortal & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): HashflowAavePortal__factory {
    return super.connect(runner) as HashflowAavePortal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HashflowAavePortalInterface {
    return new Interface(_abi) as HashflowAavePortalInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): HashflowAavePortal {
    return new Contract(address, _abi, runner) as unknown as HashflowAavePortal;
  }
}
