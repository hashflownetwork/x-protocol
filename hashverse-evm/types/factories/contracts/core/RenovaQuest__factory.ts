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
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  RenovaQuest,
  RenovaQuestInterface,
} from "../../../contracts/core/RenovaQuest";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "renovaAvatar",
        type: "address",
      },
      {
        internalType: "address",
        name: "hashflowRouter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_depositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_minDepositAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_questOwner",
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
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "RegisterPlayer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
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
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "UpdateTokenAuthorizationStatus",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawToken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowedTokens",
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
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
    ],
    name: "depositAndEnter",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositToken",
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
    name: "endTime",
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
    name: "minDepositAmount",
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
    name: "numRegisteredPlayers",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "portfolioTokenBalances",
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
    name: "questOwner",
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
        name: "",
        type: "address",
      },
    ],
    name: "registered",
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
    name: "startTime",
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
    name: "trade",
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
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "updateTokenAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6101806040523480156200001257600080fd5b506040516200225a3803806200225a833981016040819052620000359162000256565b600160005533608052428511620000b95760405162461bcd60e51b815260206004820152603c60248201527f52656e6f766151756573743a3a636f6e7374727563746f72205374617274207460448201527f696d652073686f756c6420626520696e20746865206675747572652e0000000060648201526084015b60405180910390fd5b848411620001305760405162461bcd60e51b815260206004820152603d60248201527f52656e6f766151756573743a3a636f6e7374727563746f7220456e642074696d60448201527f652073686f756c642062652061667465722073746172742074696d652e0000006064820152608401620000b0565b62a37a00620001408686620002d0565b1115620001a15760405162461bcd60e51b815260206004820152602860248201527f52656e6f766151756573743a3a636f6e7374727563746f72205175657374207460448201526737b7903637b7339760c11b6064820152608401620000b0565b60e08590526101008490526001600160a01b03838116610120819052610140849052600081815260026020908152604091829020805460ff19166001908117909155858516610160528b851660a052938a1660c05281519283528201929092527fca81d9f3a3bf255dd1251f103d6a27ab2aabb091b3d80c54aec8ec37af53e307910160405180910390a150505050505050620002f8565b80516001600160a01b03811681146200025157600080fd5b919050565b600080600080600080600060e0888a0312156200027257600080fd5b6200027d8862000239565b96506200028d6020890162000239565b95506040880151945060608801519350620002ab6080890162000239565b925060a08801519150620002c260c0890162000239565b905092959891949750929550565b81810381811115620002f257634e487b7160e01b600052601160045260246000fd5b92915050565b60805160a05160c05160e05161010051610120516101405161016051611ea8620003b2600039600081816102990152610b900152600081816101850152610fac01526000818161024d015281816111dc0152818161131e015281816113810152818161140f01528181611454015261156501526000818161012f0152818161053d0152610f090152600081816101b9015261051201526000818161098a0152610a7a015260006110f5015260006114f00152611ea86000f3fe6080604052600436106100c65760003560e01c8063b2dd5c071161007f578063dda1958511610059578063dda19585146102bb578063e34c739d146102db578063e744092e146102f1578063eac38b0d1461032157600080fd5b8063b2dd5c07146101fb578063c89039c51461023b578063d9df1b8b1461028757600080fd5b806306271172146100d25780633197cbb61461011d5780635ecb16cd14610151578063645006ca1461017357806378e97925146101a7578063981abf76146101db57600080fd5b366100cd57005b600080fd5b3480156100de57600080fd5b5061010a6100ed3660046118ce565b600460209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b34801561012957600080fd5b5061010a7f000000000000000000000000000000000000000000000000000000000000000081565b34801561015d57600080fd5b5061017161016c366004611972565b610334565b005b34801561017f57600080fd5b5061010a7f000000000000000000000000000000000000000000000000000000000000000081565b3480156101b357600080fd5b5061010a7f000000000000000000000000000000000000000000000000000000000000000081565b3480156101e757600080fd5b506101716101f6366004611a8f565b610508565b34801561020757600080fd5b5061022b610216366004611ba7565b60016020526000908152604090205460ff1681565b6040519015158152602001610114565b34801561024757600080fd5b5061026f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610114565b34801561029357600080fd5b5061026f7f000000000000000000000000000000000000000000000000000000000000000081565b3480156102c757600080fd5b506101716102d6366004611bd7565b610b8d565b3480156102e757600080fd5b5061010a60035481565b3480156102fd57600080fd5b5061022b61030c366004611ba7565b60026020526000908152604090205460ff1681565b61017161032f366004611c0e565b610c98565b61033c610cb4565b60005b81518110156104fa573360009081526004602052604081208351829085908590811061036d5761036d611c27565b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020549050806000036103a657506104e8565b336000908152600460205260408120845182908690869081106103cb576103cb611c27565b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020819055506103fe3390565b6001600160a01b03167f037238854fe57fbf51f09946f854fc3916fe83938d6521f09bd05463839f130484848151811061043a5761043a611c27565b6020026020010151836040516104659291906001600160a01b03929092168252602082015260400190565b60405180910390a260006001600160a01b031683838151811061048a5761048a611c27565b60200260200101516001600160a01b0316036104af576104aa3382610d0d565b6104e6565b6104e633828585815181106104c6576104c6611c27565b60200260200101516001600160a01b0316610e2b9092919063ffffffff16565b505b806104f281611c53565b91505061033f565b506105056001600055565b50565b610510610cb4565b7f0000000000000000000000000000000000000000000000000000000000000000421015801561055f57507f000000000000000000000000000000000000000000000000000000000000000042105b6105c15760405162461bcd60e51b815260206004820152602860248201527f52656e6f766151756573743a3a7472616465205175657374206973206e6f742060448201526737b733b7b4b7339760c11b60648201526084015b60405180910390fd5b60a08101516001600160a01b031660009081526002602052604090205460ff166106415760405162461bcd60e51b815260206004820152602b60248201527f52656e6f766151756573743a3a74726164652051756f746520546f6b656e206e60448201526a37ba1030b63637bbb2b21760a91b60648201526084016105b8565b3360009081526001602052604090205460ff166106b25760405162461bcd60e51b815260206004820152602960248201527f52656e6f766151756573743a3a747261646520506c61796572206e6f7420726560448201526833b4b9ba32b932b21760b91b60648201526084016105b8565b60c081015133600090815260046020908152604080832060808601516001600160a01b03168452909152902054101561073d5760405162461bcd60e51b815260206004820152602760248201527f52656e6f766151756573743a3a747261646520496e73756666696369656e742060448201526662616c616e636560c81b60648201526084016105b8565b60408101516001600160a01b031630146107b55760405162461bcd60e51b815260206004820152603360248201527f52656e6f766151756573743a3a7472616465205472616465722073686f756c646044820152721031329028bab2b9ba1031b7b73a3930b1ba1760691b60648201526084016105b8565b60608101516001600160a01b0316331461082f5760405162461bcd60e51b815260206004820152603560248201527f52656e6f766151756573743a3a747261646520456666656374697665205472616044820152743232b91039b437bab63210313290383630bcb2b91760591b60648201526084016105b8565b61010081015160e082015160c0830151101561086c578160e001518261010001518360c0015161085f9190611c6c565b6108699190611c83565b90505b60c082015133600090815260046020908152604080832060808701516001600160a01b03168452909152812080549091906108a8908490611ca5565b909155505033600090815260046020908152604080832060a08601516001600160a01b03168452909152812080548392906108e4908490611cb8565b909155505060808281015160a084015160c0850151604080516001600160a01b03948516815293909216602084015282820152606082018490525133927fec0d3e799aa270a144d7e3be084ccfc657450e33ecea1b1a4154c95cedaae5c3928290030190a260808201516000906001600160a01b0316610969575060c0820151610a67565b608083015160c084015160405163095ea7b360e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482019290925291169063095ea7b3906044016020604051808303816000875af11580156109e3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a079190611ccb565b610a675760405162461bcd60e51b815260206004820152602b60248201527f52656e6f766151756573743a3a747261646520436f756c64206e6f742061707060448201526a3937bb32903a37b5b2b71760a91b60648201526084016105b8565b6000610a768460a00151610e7d565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c52ac72083866040518363ffffffff1660e01b8152600401610ac59190611d38565b6000604051808303818588803b158015610ade57600080fd5b505af1158015610af2573d6000803e3d6000fd5b50505050506000610b068560a00151610e7d565b905080610b138584611cb8565b14610b7f5760405162461bcd60e51b815260206004820152603660248201527f52656e6f766151756573743a3a747261646520446964206e6f742072656365696044820152753b329032b737bab3b41038bab7ba32903a37b5b2b71760511b60648201526084016105b8565b505050506105056001600055565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614610c355760405162461bcd60e51b815260206004820152604160248201527f52656e6f766151756573743a3a757064617465546f6b656e417574686f72697a60448201527f6174696f6e2053656e646572206d757374206265207175657374206f776e65726064820152601760f91b608482015260a4016105b8565b6001600160a01b038216600081815260026020908152604091829020805460ff19168515159081179091558251938452908301527fca81d9f3a3bf255dd1251f103d6a27ab2aabb091b3d80c54aec8ec37af53e307910160405180910390a15050565b610ca0610cb4565b610caa3382610f07565b6105056001600055565b600260005403610d065760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016105b8565b6002600055565b80471015610d5d5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016105b8565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610daa576040519150601f19603f3d011682016040523d82523d6000602084013e610daf565b606091505b5050905080610e265760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016105b8565b505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610e26908490611652565b60006001600160a01b038216610e94575047919050565b6040516370a0823160e01b81523060048201526001600160a01b038316906370a0823190602401602060405180830381865afa158015610ed8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610efc9190611e2a565b92915050565b919050565b7f00000000000000000000000000000000000000000000000000000000000000004210610faa5760405162461bcd60e51b815260206004820152604560248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220436160448201527f6e206f6e6c79206465706f736974206265666f7265207468652071756573742060648201526432b732399760d91b608482015260a4016105b8565b7f00000000000000000000000000000000000000000000000000000000000000008110156110385760405162461bcd60e51b815260206004820152603560248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e7465722044656044820152743837b9b4ba1030b6b7bab73a103a37b7903637bb9760591b60648201526084016105b8565b6001600160a01b03821660009081526001602052604090205460ff16156110d35760405162461bcd60e51b815260206004820152604360248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220506c60448201527f617965722068617320616c726561647920656e7465726564207468652071756560648201526239ba1760e91b608482015260a4016105b8565b60405163fc97a30360e01b81526001600160a01b0383811660048301526000917f00000000000000000000000000000000000000000000000000000000000000009091169063fc97a30390602401602060405180830381865afa15801561113e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111629190611e2a565b9050806000036111da5760405162461bcd60e51b815260206004820152603b60248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220506c60448201527f6179657220686173206e6f74206d696e746564204176617461722e000000000060648201526084016105b8565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166112825781341461127d5760405162461bcd60e51b815260206004820152603c60248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e746572206d7360448201527f672e76616c75652073686f756c6420657175616c20616d6f756e742e0000000060648201526084016105b8565b6112ed565b34156112ed5760405162461bcd60e51b815260206004820152603460248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e746572206d7360448201527333973b30b63ab29039b437bab63210313290181760611b60648201526084016105b8565b6001600160a01b038084166000908152600160208181526040808420805460ff1916909317909255600481528183207f00000000000000000000000000000000000000000000000000000000000000009094168352929092529081208054849290611359908490611cb8565b90915550506003805490600061136e83611c53565b9091555050604080516001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081168252602082018590528516917f4b3f81827ede20c81afbf1bb77b954afcdcae24d391d99042310cb1d9210dd57910160405180910390a26040516001600160a01b038416907f78a3e890e8235e6b7edfa99fe4cdff6feceeeedcc419289d33f67eee0863307590600090a27f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031615610e26576040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156114a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114c79190611e2a565b60405163223c296b60e21b81526001600160a01b038681166004830152602482018690529192507f0000000000000000000000000000000000000000000000000000000000000000909116906388f0a5ac90604401600060405180830381600087803b15801561153657600080fd5b505af115801561154a573d6000803e3d6000fd5b50506040516370a0823160e01b8152306004820152600092507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031691506370a0823190602401602060405180830381865afa1580156115b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115d99190611e2a565b90506115e58483611cb8565b811461164b5760405162461bcd60e51b815260206004820152602f60248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220426160448201526e3630b731b29036b4b9b6b0ba31b41760891b60648201526084016105b8565b5050505050565b60006116a7826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166117279092919063ffffffff16565b90508051600014806116c85750808060200190518101906116c89190611ccb565b610e265760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105b8565b6060611736848460008561173e565b949350505050565b60608247101561179f5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016105b8565b600080866001600160a01b031685876040516117bb9190611e43565b60006040518083038185875af1925050503d80600081146117f8576040519150601f19603f3d011682016040523d82523d6000602084013e6117fd565b606091505b509150915061180e87838387611819565b979650505050505050565b60608315611888578251600003611881576001600160a01b0385163b6118815760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105b8565b5081611736565b611736838381511561189d5781518083602001fd5b8060405162461bcd60e51b81526004016105b89190611e5f565b80356001600160a01b0381168114610f0257600080fd5b600080604083850312156118e157600080fd5b6118ea836118b7565b91506118f8602084016118b7565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b6040516101a0810167ffffffffffffffff8111828210171561193b5761193b611901565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561196a5761196a611901565b604052919050565b6000602080838503121561198557600080fd5b823567ffffffffffffffff8082111561199d57600080fd5b818501915085601f8301126119b157600080fd5b8135818111156119c3576119c3611901565b8060051b91506119d4848301611941565b81815291830184019184810190888411156119ee57600080fd5b938501935b83851015611a1357611a04856118b7565b825293850193908501906119f3565b98975050505050505050565b600082601f830112611a3057600080fd5b813567ffffffffffffffff811115611a4a57611a4a611901565b611a5d601f8201601f1916602001611941565b818152846020838601011115611a7257600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215611aa157600080fd5b813567ffffffffffffffff80821115611ab957600080fd5b908301906101a08286031215611ace57600080fd5b611ad6611917565b611adf836118b7565b8152611aed602084016118b7565b6020820152611afe604084016118b7565b6040820152611b0f606084016118b7565b6060820152611b20608084016118b7565b6080820152611b3160a084016118b7565b60a082015260c0838101359082015260e0808401359082015261010080840135908201526101208084013590820152610140808401359082015261016080840135908201526101808084013583811115611b8a57600080fd5b611b9688828701611a1f565b918301919091525095945050505050565b600060208284031215611bb957600080fd5b611bc2826118b7565b9392505050565b801515811461050557600080fd5b60008060408385031215611bea57600080fd5b611bf3836118b7565b91506020830135611c0381611bc9565b809150509250929050565b600060208284031215611c2057600080fd5b5035919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611c6557611c65611c3d565b5060010190565b8082028115828204841417610efc57610efc611c3d565b600082611ca057634e487b7160e01b600052601260045260246000fd5b500490565b81810381811115610efc57610efc611c3d565b80820180821115610efc57610efc611c3d565b600060208284031215611cdd57600080fd5b8151611bc281611bc9565b60005b83811015611d03578181015183820152602001611ceb565b50506000910152565b60008151808452611d24816020860160208601611ce8565b601f01601f19169290920160200192915050565b60208152611d526020820183516001600160a01b03169052565b60006020830151611d6e60408401826001600160a01b03169052565b5060408301516001600160a01b03811660608401525060608301516001600160a01b03811660808401525060808301516001600160a01b03811660a08401525060a08301516001600160a01b03811660c08401525060c083015160e08381019190915283015161010080840191909152830151610120808401919091528301516101408084019190915283015161016080840191909152830151610180808401919091528301516101a0808401526117366101c0840182611d0c565b600060208284031215611e3c57600080fd5b5051919050565b60008251611e55818460208701611ce8565b9190910192915050565b602081526000611bc26020830184611d0c56fea2646970667358221220bd154bdd6cbadfa482c6b4ac23f796d59463be355235b8160301e927100149c564736f6c63430008130033";

type RenovaQuestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RenovaQuestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RenovaQuest__factory extends ContractFactory {
  constructor(...args: RenovaQuestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    renovaAvatar: AddressLike,
    hashflowRouter: AddressLike,
    _startTime: BigNumberish,
    _endTime: BigNumberish,
    _depositToken: AddressLike,
    _minDepositAmount: BigNumberish,
    _questOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      renovaAvatar,
      hashflowRouter,
      _startTime,
      _endTime,
      _depositToken,
      _minDepositAmount,
      _questOwner,
      overrides || {}
    );
  }
  override deploy(
    renovaAvatar: AddressLike,
    hashflowRouter: AddressLike,
    _startTime: BigNumberish,
    _endTime: BigNumberish,
    _depositToken: AddressLike,
    _minDepositAmount: BigNumberish,
    _questOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      renovaAvatar,
      hashflowRouter,
      _startTime,
      _endTime,
      _depositToken,
      _minDepositAmount,
      _questOwner,
      overrides || {}
    ) as Promise<
      RenovaQuest & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): RenovaQuest__factory {
    return super.connect(runner) as RenovaQuest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RenovaQuestInterface {
    return new Interface(_abi) as RenovaQuestInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): RenovaQuest {
    return new Contract(address, _abi, runner) as unknown as RenovaQuest;
  }
}
