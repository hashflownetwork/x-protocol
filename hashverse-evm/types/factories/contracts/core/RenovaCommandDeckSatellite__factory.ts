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
  RenovaCommandDeckSatellite,
  RenovaCommandDeckSatelliteInterface,
} from "../../../contracts/core/RenovaCommandDeckSatellite";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "questId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "questAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minDepositAmount",
        type: "uint256",
      },
    ],
    name: "CreateQuest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
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
        name: "newRouter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oldRouter",
        type: "address",
      },
    ],
    name: "UpdateHashflowRouter",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newQuestOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oldQuestOwner",
        type: "address",
      },
    ],
    name: "UpdateQuestOwner",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "questId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minDepositAmount",
        type: "uint256",
      },
    ],
    name: "createQuest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "address",
        name: "depositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
    ],
    name: "depositTokenForQuest",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "_renovaAvatar",
        type: "address",
      },
      {
        internalType: "address",
        name: "_renovaItem",
        type: "address",
      },
      {
        internalType: "address",
        name: "_hashflowRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_questOwner",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "questDeploymentAddresses",
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
    name: "questIdsByDeploymentAddress",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renovaAvatar",
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
    name: "renovaItem",
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
        internalType: "address",
        name: "_hashflowRouter",
        type: "address",
      },
    ],
    name: "updateHashflowRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_questOwner",
        type: "address",
      },
    ],
    name: "updateQuestOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001961001e565b6100dd565b600054610100900460ff161561008a5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100db576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b613624806100ec6000396000f3fe60806040523480156200001157600080fd5b5060043610620000fd5760003560e01c80639db3382d1162000097578063d9df1b8b116200006e578063d9df1b8b146200021a578063dc2e50e8146200022e578063f2fde38b1462000242578063f8c8765e146200025957600080fd5b80639db3382d14620001db5780639dbb61b614620001ef578063d0252d50146200020657600080fd5b8063715018a611620000d8578063715018a6146200014957806381cf2d3b14620001535780638da5cb5b146200018957806394ca8cc514620001af57600080fd5b8063121fbc731462000102578063129b1ffb146200011b57806348da49461462000132575b600080fd5b620001196200011336600462001191565b62000270565b005b620001196200012c366004620011b8565b62000367565b620001196200014336600462001191565b620005a8565b6200011962000699565b620001766200016436600462001191565b606a6020526000908152604090205481565b6040519081526020015b60405180910390f35b6033546001600160a01b03165b6040516001600160a01b03909116815260200162000180565b62000196620001c036600462001204565b6069602052600090815260409020546001600160a01b031681565b60665462000196906001600160a01b031681565b62000119620002003660046200121e565b6200071e565b60655462000196906001600160a01b031681565b60685462000196906001600160a01b031681565b60675462000196906001600160a01b031681565b620001196200025336600462001191565b620008c2565b620001196200026a36600462001264565b62000941565b6200027a62000a63565b6001600160a01b038116620002fe576040805162461bcd60e51b81526020600482015260248101919091527f52656e6f7661436f6d6d616e644465636b426173653a3a75706461746548617360448201527f68666c6f77526f757465722043616e6e6f74206265203020616464726573732e60648201526084015b60405180910390fd5b606754604080516001600160a01b03808516825290921660208301527ff00d2c3bc5b9a001cabe832285cfa786318b02990016dbf81aab162aa906be8f910160405180910390a1606780546001600160a01b0319166001600160a01b0392909216919091179055565b6068546001600160a01b0316336001600160a01b031614620003f25760405162461bcd60e51b815260206004820152603e60248201527f52656e6f7661436f6d6d616e644465636b426173653a3a63726561746551756560448201527f73742053656e646572206d757374206265205175657374204f776e65722e00006064820152608401620002f5565b6000858152606960205260409020546001600160a01b0316156200047f5760405162461bcd60e51b815260206004820152603960248201527f52656e6f7661436f6d6d616e644465636b426173653a3a63726561746551756560448201527f737420517565737420616c726561647920637265617465642e000000000000006064820152608401620002f5565b6065546067546068546040516000936001600160a01b03908116938116928992899289928992911690620004b3906200116d565b6001600160a01b0397881681529587166020870152604086019490945260608501929092528416608084015260a083015290911660c082015260e001604051809103906000f0801580156200050c573d6000803e3d6000fd5b50600087815260696020908152604080832080546001600160a01b0319166001600160a01b03868116918217909255808552606a8452938290208b905581518b815292830193909352810188905260608101879052908516608082015260a081018490529091507f672677a2003183fe3f761f807a6875d62bf03ee2efe167fe2b33d0eec5c28ece9060c00160405180910390a1505050505050565b620005b262000a63565b6001600160a01b038116620006305760405162461bcd60e51b815260206004820152603c60248201527f52656e6f7661436f6d6d616e644465636b426173653a3a75706461746551756560448201527f73744f776e65722043616e6e6f74206265203020616464726573732e000000006064820152608401620002f5565b606854604080516001600160a01b03808516825290921660208301527fc72b19c512ea8057ad851418ca6d3016b5273fc12e1488da3fa457571c11c47c910160405180910390a1606880546001600160a01b0319166001600160a01b0392909216919091179055565b620006a362000a63565b60405162461bcd60e51b815260206004820152604360248201527f52656e6f7661436f6d6d616e644465636b426173653a3a72656e6f756e63654f60448201527f776e6572736869702043616e6e6f742072656e6f756e6365206f776e6572736860648201526234b81760e91b608482015260a401620002f5565b336000908152606a6020526040902054620007ad5760405162461bcd60e51b815260206004820152604260248201527f52656e6f7661436f6d6d616e644465636b426173653a3a6465706f736974546f60448201527f6b656e73466f725175657374205175657374206e6f7420726567697374657265606482015261321760f11b608482015260a401620002f5565b6001600160a01b038216336001600160a01b031663c89039c56040518163ffffffff1660e01b8152600401602060405180830381865afa158015620007f6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200081c9190620012c9565b6001600160a01b031614620008a65760405162461bcd60e51b815260206004820152604360248201527f52656e6f7661436f6d6d616e644465636b426173653a3a6465706f736974546f60448201527f6b656e466f72517565737420496e636f7272656374206465706f736974546f6b60648201526232b71760e91b608482015260a401620002f5565b620008bd6001600160a01b03831684338462000ac1565b505050565b620008cc62000a63565b6001600160a01b038116620009335760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401620002f5565b6200093e8162000b23565b50565b600054610100900460ff1615808015620009625750600054600160ff909116105b806200097e5750303b1580156200097e575060005460ff166001145b620009e35760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401620002f5565b6000805460ff19166001179055801562000a07576000805461ff0019166101001790555b62000a158585858562000b75565b801562000a5c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b6033546001600160a01b0316331462000abf5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401620002f5565b565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905262000b1d90859062000e85565b50505050565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff1662000b9f5760405162461bcd60e51b8152600401620002f590620012e9565b62000ba962000f61565b6001600160a01b03841662000c2c5760405162461bcd60e51b815260206004820152604d6024820152600080516020620035cf83398151915260448201527f6f6d6d616e644465636b426173655f696e69742052656e6f766141766174617260648201526c103737ba103232b334b732b21760991b608482015260a401620002f5565b6001600160a01b03831662000cad5760405162461bcd60e51b815260206004820152604b6024820152600080516020620035cf83398151915260448201527f6f6d6d616e644465636b426173655f696e69742052656e6f76614974656d206e60648201526a37ba103232b334b732b21760a91b608482015260a401620002f5565b6001600160a01b03821662000d325760405162461bcd60e51b815260206004820152604f6024820152600080516020620035cf83398151915260448201527f6f6d6d616e644465636b426173655f696e69742048617368666c6f77526f757460648201526e32b9103737ba103232b334b732b21760891b608482015260a401620002f5565b6001600160a01b03811662000db45760405162461bcd60e51b815260206004820152604c6024820152600080516020620035cf83398151915260448201527f6f6d6d616e644465636b426173655f696e6974205175657374206f776e65722060648201526b3737ba103232b334b732b21760a11b608482015260a401620002f5565b606580546001600160a01b038681166001600160a01b03199283161790925560668054868416908316179055606780548584169083168117909155606880549385169390921692909217905560408051918252600060208301527ff00d2c3bc5b9a001cabe832285cfa786318b02990016dbf81aab162aa906be8f910160405180910390a1606854604080516001600160a01b039092168252600060208301527fc72b19c512ea8057ad851418ca6d3016b5273fc12e1488da3fa457571c11c47c910160405180910390a150505050565b600062000edc826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031662000f959092919063ffffffff16565b905080516000148062000f0057508080602001905181019062000f00919062001334565b620008bd5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401620002f5565b600054610100900460ff1662000f8b5760405162461bcd60e51b8152600401620002f590620012e9565b62000abf62000fae565b606062000fa6848460008562000fe3565b949350505050565b600054610100900460ff1662000fd85760405162461bcd60e51b8152600401620002f590620012e9565b62000abf3362000b23565b606082471015620010465760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401620002f5565b600080866001600160a01b031685876040516200106491906200137e565b60006040518083038185875af1925050503d8060008114620010a3576040519150601f19603f3d011682016040523d82523d6000602084013e620010a8565b606091505b5091509150620010bb87838387620010c6565b979650505050505050565b606083156200113a57825160000362001132576001600160a01b0385163b620011325760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401620002f5565b508162000fa6565b62000fa68383815115620011515781518083602001fd5b8060405162461bcd60e51b8152600401620002f591906200139c565b6121fd80620013d283390190565b6001600160a01b03811681146200093e57600080fd5b600060208284031215620011a457600080fd5b8135620011b1816200117b565b9392505050565b600080600080600060a08688031215620011d157600080fd5b8535945060208601359350604086013592506060860135620011f3816200117b565b949793965091946080013592915050565b6000602082840312156200121757600080fd5b5035919050565b6000806000606084860312156200123457600080fd5b833562001241816200117b565b9250602084013562001253816200117b565b929592945050506040919091013590565b600080600080608085870312156200127b57600080fd5b843562001288816200117b565b935060208501356200129a816200117b565b92506040850135620012ac816200117b565b91506060850135620012be816200117b565b939692955090935050565b600060208284031215620012dc57600080fd5b8151620011b1816200117b565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6000602082840312156200134757600080fd5b81518015158114620011b157600080fd5b60005b83811015620013755781810151838201526020016200135b565b50506000910152565b600082516200139281846020870162001358565b9190910192915050565b6020815260008251806020840152620013bd81604085016020870162001358565b601f01601f1916919091016040019291505056fe6101806040523480156200001257600080fd5b50604051620021fd380380620021fd833981016040819052620000359162000256565b600160005533608052428511620000b95760405162461bcd60e51b815260206004820152603c60248201527f52656e6f766151756573743a3a636f6e7374727563746f72205374617274207460448201527f696d652073686f756c6420626520696e20746865206675747572652e0000000060648201526084015b60405180910390fd5b848411620001305760405162461bcd60e51b815260206004820152603d60248201527f52656e6f766151756573743a3a636f6e7374727563746f7220456e642074696d60448201527f652073686f756c642062652061667465722073746172742074696d652e0000006064820152608401620000b0565b62a37a00620001408686620002d0565b1115620001a15760405162461bcd60e51b815260206004820152602860248201527f52656e6f766151756573743a3a636f6e7374727563746f72205175657374207460448201526737b7903637b7339760c11b6064820152608401620000b0565b60e08590526101008490526001600160a01b03838116610120819052610140849052600081815260026020908152604091829020805460ff19166001908117909155858516610160528b851660a052938a1660c05281519283528201929092527fca81d9f3a3bf255dd1251f103d6a27ab2aabb091b3d80c54aec8ec37af53e307910160405180910390a150505050505050620002f8565b80516001600160a01b03811681146200025157600080fd5b919050565b600080600080600080600060e0888a0312156200027257600080fd5b6200027d8862000239565b96506200028d6020890162000239565b95506040880151945060608801519350620002ab6080890162000239565b925060a08801519150620002c260c0890162000239565b905092959891949750929550565b81810381811115620002f257634e487b7160e01b600052601160045260246000fd5b92915050565b60805160a05160c05160e05161010051610120516101405161016051611e59620003a4600039600081816103240152610c1b01526000818161021d01526110370152600081816102d801528181611267015281816113a90152818161140c01526114b70152600081816101c7015281816105c80152610f94015260008181610251015261059d015260008181610a150152610b0501526000611180015260006114e60152611e596000f3fe6080604052600436106100ec5760003560e01c8063981abf761161008a578063dda1958511610059578063dda1958514610346578063e34c739d14610366578063e744092e1461037c578063eac38b0d146103ac57600080fd5b8063981abf7614610273578063b2dd5c0714610286578063c89039c5146102c6578063d9df1b8b1461031257600080fd5b80633197cbb6116100c65780633197cbb6146101b55780635ecb16cd146101e9578063645006ca1461020b57806378e979251461023f57600080fd5b806306271172146100f8578063150b7a02146101435780632ec6496d1461018857600080fd5b366100f357005b600080fd5b34801561010457600080fd5b506101306101133660046117c3565b600560209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b34801561014f57600080fd5b5061016f61015e3660046117f6565b630a85bd0160e11b95945050505050565b6040516001600160e01b0319909116815260200161013a565b34801561019457600080fd5b506101306101a3366004611891565b60046020526000908152604090205481565b3480156101c157600080fd5b506101307f000000000000000000000000000000000000000000000000000000000000000081565b3480156101f557600080fd5b5061020961020436600461192a565b6103bf565b005b34801561021757600080fd5b506101307f000000000000000000000000000000000000000000000000000000000000000081565b34801561024b57600080fd5b506101307f000000000000000000000000000000000000000000000000000000000000000081565b610209610281366004611a47565b610593565b34801561029257600080fd5b506102b66102a1366004611b5f565b60016020526000908152604090205460ff1681565b604051901515815260200161013a565b3480156102d257600080fd5b506102fa7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161013a565b34801561031e57600080fd5b506102fa7f000000000000000000000000000000000000000000000000000000000000000081565b34801561035257600080fd5b50610209610361366004611b88565b610c18565b34801561037257600080fd5b5061013060035481565b34801561038857600080fd5b506102b6610397366004611b5f565b60026020526000908152604090205460ff1681565b6102096103ba366004611bbf565b610d23565b6103c7610d3f565b60005b815181101561058557336000908152600560205260408120835182908590859081106103f8576103f8611bd8565b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020549050806000036104315750610573565b3360009081526005602052604081208451829086908690811061045657610456611bd8565b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020819055506104893390565b6001600160a01b03167f037238854fe57fbf51f09946f854fc3916fe83938d6521f09bd05463839f13048484815181106104c5576104c5611bd8565b6020026020010151836040516104f09291906001600160a01b03929092168252602082015260400190565b60405180910390a260006001600160a01b031683838151811061051557610515611bd8565b60200260200101516001600160a01b03160361053a576105353382610d98565b610571565b610571338285858151811061055157610551611bd8565b60200260200101516001600160a01b0316610eb69092919063ffffffff16565b505b8061057d81611c04565b9150506103ca565b506105906001600055565b50565b61059b610d3f565b7f000000000000000000000000000000000000000000000000000000000000000042101580156105ea57507f000000000000000000000000000000000000000000000000000000000000000042105b61064c5760405162461bcd60e51b815260206004820152602860248201527f52656e6f766151756573743a3a7472616465205175657374206973206e6f742060448201526737b733b7b4b7339760c11b60648201526084015b60405180910390fd5b60a08101516001600160a01b031660009081526002602052604090205460ff166106cc5760405162461bcd60e51b815260206004820152602b60248201527f52656e6f766151756573743a3a74726164652051756f746520546f6b656e206e60448201526a37ba1030b63637bbb2b21760a91b6064820152608401610643565b3360009081526001602052604090205460ff1661073d5760405162461bcd60e51b815260206004820152602960248201527f52656e6f766151756573743a3a747261646520506c61796572206e6f7420726560448201526833b4b9ba32b932b21760b91b6064820152608401610643565b60c081015133600090815260056020908152604080832060808601516001600160a01b0316845290915290205410156107c85760405162461bcd60e51b815260206004820152602760248201527f52656e6f766151756573743a3a747261646520496e73756666696369656e742060448201526662616c616e636560c81b6064820152608401610643565b60408101516001600160a01b031630146108405760405162461bcd60e51b815260206004820152603360248201527f52656e6f766151756573743a3a7472616465205472616465722073686f756c646044820152721031329028bab2b9ba1031b7b73a3930b1ba1760691b6064820152608401610643565b60608101516001600160a01b031633146108ba5760405162461bcd60e51b815260206004820152603560248201527f52656e6f766151756573743a3a747261646520456666656374697665205472616044820152743232b91039b437bab63210313290383630bcb2b91760591b6064820152608401610643565b61010081015160e082015160c083015110156108f7578160e001518261010001518360c001516108ea9190611c1d565b6108f49190611c34565b90505b60c082015133600090815260056020908152604080832060808701516001600160a01b0316845290915281208054909190610933908490611c56565b909155505033600090815260056020908152604080832060a08601516001600160a01b031684529091528120805483929061096f908490611c69565b909155505060808281015160a084015160c0850151604080516001600160a01b03948516815293909216602084015282820152606082018490525133927fec0d3e799aa270a144d7e3be084ccfc657450e33ecea1b1a4154c95cedaae5c3928290030190a260808201516000906001600160a01b03166109f4575060c0820151610af2565b608083015160c084015160405163095ea7b360e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482019290925291169063095ea7b3906044016020604051808303816000875af1158015610a6e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a929190611c7c565b610af25760405162461bcd60e51b815260206004820152602b60248201527f52656e6f766151756573743a3a747261646520436f756c64206e6f742061707060448201526a3937bb32903a37b5b2b71760a91b6064820152608401610643565b6000610b018460a00151610f08565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c52ac72083866040518363ffffffff1660e01b8152600401610b509190611ce9565b6000604051808303818588803b158015610b6957600080fd5b505af1158015610b7d573d6000803e3d6000fd5b50505050506000610b918560a00151610f08565b905080610b9e8584611c69565b14610c0a5760405162461bcd60e51b815260206004820152603660248201527f52656e6f766151756573743a3a747261646520446964206e6f742072656365696044820152753b329032b737bab3b41038bab7ba32903a37b5b2b71760511b6064820152608401610643565b505050506105906001600055565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614610cc05760405162461bcd60e51b815260206004820152604160248201527f52656e6f766151756573743a3a757064617465546f6b656e417574686f72697a60448201527f6174696f6e2053656e646572206d757374206265207175657374206f776e65726064820152601760f91b608482015260a401610643565b6001600160a01b038216600081815260026020908152604091829020805460ff19168515159081179091558251938452908301527fca81d9f3a3bf255dd1251f103d6a27ab2aabb091b3d80c54aec8ec37af53e307910160405180910390a15050565b610d2b610d3f565b610d353382610f92565b6105906001600055565b600260005403610d915760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610643565b6002600055565b80471015610de85760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610643565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610e35576040519150601f19603f3d011682016040523d82523d6000602084013e610e3a565b606091505b5050905080610eb15760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608401610643565b505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610eb1908490611547565b60006001600160a01b038216610f1f575047919050565b6040516370a0823160e01b81523060048201526001600160a01b038316906370a0823190602401602060405180830381865afa158015610f63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f879190611ddb565b92915050565b919050565b7f000000000000000000000000000000000000000000000000000000000000000042106110355760405162461bcd60e51b815260206004820152604560248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220436160448201527f6e206f6e6c79206465706f736974206265666f7265207468652071756573742060648201526432b732399760d91b608482015260a401610643565b7f00000000000000000000000000000000000000000000000000000000000000008110156110c35760405162461bcd60e51b815260206004820152603560248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e7465722044656044820152743837b9b4ba1030b6b7bab73a103a37b7903637bb9760591b6064820152608401610643565b6001600160a01b03821660009081526001602052604090205460ff161561115e5760405162461bcd60e51b815260206004820152604360248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220506c60448201527f617965722068617320616c726561647920656e7465726564207468652071756560648201526239ba1760e91b608482015260a401610643565b60405163fc97a30360e01b81526001600160a01b0383811660048301526000917f00000000000000000000000000000000000000000000000000000000000000009091169063fc97a30390602401602060405180830381865afa1580156111c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111ed9190611ddb565b9050806000036112655760405162461bcd60e51b815260206004820152603b60248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e74657220506c60448201527f6179657220686173206e6f74206d696e746564204176617461722e00000000006064820152608401610643565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661130d578134146113085760405162461bcd60e51b815260206004820152603c60248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e746572206d7360448201527f672e76616c75652073686f756c6420657175616c20616d6f756e742e000000006064820152608401610643565b611378565b34156113785760405162461bcd60e51b815260206004820152603460248201527f52656e6f766151756573743a3a5f6465706f736974416e64456e746572206d7360448201527333973b30b63ab29039b437bab63210313290181760611b6064820152608401610643565b6001600160a01b038084166000908152600160208181526040808420805460ff1916909317909255600581528183207f000000000000000000000000000000000000000000000000000000000000000090941683529290925290812080548492906113e4908490611c69565b9091555050600380549060006113f983611c04565b9091555050604080516001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081168252602082018590528516917f4b3f81827ede20c81afbf1bb77b954afcdcae24d391d99042310cb1d9210dd57910160405180910390a26040516001600160a01b038416907f78a3e890e8235e6b7edfa99fe4cdff6feceeeedcc419289d33f67eee0863307590600090a2604051634eddb0db60e11b81526001600160a01b0384811660048301527f000000000000000000000000000000000000000000000000000000000000000081166024830152604482018490527f00000000000000000000000000000000000000000000000000000000000000001690639dbb61b690606401600060405180830381600087803b15801561152a57600080fd5b505af115801561153e573d6000803e3d6000fd5b50505050505050565b600061159c826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661161c9092919063ffffffff16565b90508051600014806115bd5750808060200190518101906115bd9190611c7c565b610eb15760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610643565b606061162b8484600085611633565b949350505050565b6060824710156116945760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610643565b600080866001600160a01b031685876040516116b09190611df4565b60006040518083038185875af1925050503d80600081146116ed576040519150601f19603f3d011682016040523d82523d6000602084013e6116f2565b606091505b50915091506117038783838761170e565b979650505050505050565b6060831561177d578251600003611776576001600160a01b0385163b6117765760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610643565b508161162b565b61162b83838151156117925781518083602001fd5b8060405162461bcd60e51b81526004016106439190611e10565b80356001600160a01b0381168114610f8d57600080fd5b600080604083850312156117d657600080fd5b6117df836117ac565b91506117ed602084016117ac565b90509250929050565b60008060008060006080868803121561180e57600080fd5b611817866117ac565b9450611825602087016117ac565b935060408601359250606086013567ffffffffffffffff8082111561184957600080fd5b818801915088601f83011261185d57600080fd5b81358181111561186c57600080fd5b89602082850101111561187e57600080fd5b9699959850939650602001949392505050565b6000602082840312156118a357600080fd5b8135600281106118b257600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b6040516101a0810167ffffffffffffffff811182821017156118f3576118f36118b9565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715611922576119226118b9565b604052919050565b6000602080838503121561193d57600080fd5b823567ffffffffffffffff8082111561195557600080fd5b818501915085601f83011261196957600080fd5b81358181111561197b5761197b6118b9565b8060051b915061198c8483016118f9565b81815291830184019184810190888411156119a657600080fd5b938501935b838510156119cb576119bc856117ac565b825293850193908501906119ab565b98975050505050505050565b600082601f8301126119e857600080fd5b813567ffffffffffffffff811115611a0257611a026118b9565b611a15601f8201601f19166020016118f9565b818152846020838601011115611a2a57600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215611a5957600080fd5b813567ffffffffffffffff80821115611a7157600080fd5b908301906101a08286031215611a8657600080fd5b611a8e6118cf565b611a97836117ac565b8152611aa5602084016117ac565b6020820152611ab6604084016117ac565b6040820152611ac7606084016117ac565b6060820152611ad8608084016117ac565b6080820152611ae960a084016117ac565b60a082015260c0838101359082015260e0808401359082015261010080840135908201526101208084013590820152610140808401359082015261016080840135908201526101808084013583811115611b4257600080fd5b611b4e888287016119d7565b918301919091525095945050505050565b600060208284031215611b7157600080fd5b6118b2826117ac565b801515811461059057600080fd5b60008060408385031215611b9b57600080fd5b611ba4836117ac565b91506020830135611bb481611b7a565b809150509250929050565b600060208284031215611bd157600080fd5b5035919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611c1657611c16611bee565b5060010190565b8082028115828204841417610f8757610f87611bee565b600082611c5157634e487b7160e01b600052601260045260246000fd5b500490565b81810381811115610f8757610f87611bee565b80820180821115610f8757610f87611bee565b600060208284031215611c8e57600080fd5b81516118b281611b7a565b60005b83811015611cb4578181015183820152602001611c9c565b50506000910152565b60008151808452611cd5816020860160208601611c99565b601f01601f19169290920160200192915050565b60208152611d036020820183516001600160a01b03169052565b60006020830151611d1f60408401826001600160a01b03169052565b5060408301516001600160a01b03811660608401525060608301516001600160a01b03811660808401525060808301516001600160a01b03811660a08401525060a08301516001600160a01b03811660c08401525060c083015160e08381019190915283015161010080840191909152830151610120808401919091528301516101408084019190915283015161016080840191909152830151610180808401919091528301516101a08084015261162b6101c0840182611cbd565b600060208284031215611ded57600080fd5b5051919050565b60008251611e06818460208701611c99565b9190910192915050565b6020815260006118b26020830184611cbd56fea264697066735822122052cfebf37dec7efbccd3f84f839118e4718354736d65d9392892d36e2041da2f64736f6c6343000813003352656e6f7661436f6d6d616e644465636b426173653a3a5f5f52656e6f766143a26469706673582212206a8fd49f5a83531e18c83c1848c58a625dc94285802349f32a6edcc01ad2d8a164736f6c63430008130033";

type RenovaCommandDeckSatelliteConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RenovaCommandDeckSatelliteConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RenovaCommandDeckSatellite__factory extends ContractFactory {
  constructor(...args: RenovaCommandDeckSatelliteConstructorParams) {
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
      RenovaCommandDeckSatellite & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): RenovaCommandDeckSatellite__factory {
    return super.connect(runner) as RenovaCommandDeckSatellite__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RenovaCommandDeckSatelliteInterface {
    return new Interface(_abi) as RenovaCommandDeckSatelliteInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RenovaCommandDeckSatellite {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as RenovaCommandDeckSatellite;
  }
}
