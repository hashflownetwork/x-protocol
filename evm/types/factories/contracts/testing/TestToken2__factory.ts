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
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  TestToken2,
  TestToken2Interface,
} from "../../../contracts/testing/TestToken2";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "owner",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
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
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
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
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101606040523480156200001257600080fd5b506040516200194e3803806200194e83398101604081905262000035916200031e565b6040518060400160405280600c81526020016b2a32b9ba102a37b5b2b7101960a11b81525080604051806040016040528060018152602001603160f81b8152506040518060400160405280600c81526020016b2a32b9ba102a37b5b2b7101960a11b815250604051806040016040528060038152602001622a2a1960e91b8152508160039081620000c79190620003dc565b506004620000d68282620003dc565b505050620000f4600583620001bc60201b6200063d1790919060201c565b6101205262000111816006620001bc602090811b6200063d17901c565b61014052815160208084019190912060e052815190820120610100524660a0526200019f60e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c05250620001b533826200020c565b506200053f565b6000602083511015620001dc57620001d483620002d3565b905062000206565b82620001f3836200031660201b6200066e1760201c565b90620002009082620003dc565b5060ff90505b92915050565b6001600160a01b038216620002685760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b80600260008282546200027c9190620004a8565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600080829050601f8151111562000301578260405163305a27a960e01b81526004016200025f9190620004ca565b80516200030e826200051a565b179392505050565b90565b505050565b6000602082840312156200033157600080fd5b5051919050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200036357607f821691505b6020821081036200038457634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200031957600081815260208120601f850160051c81016020861015620003b35750805b601f850160051c820191505b81811015620003d457828155600101620003bf565b505050505050565b81516001600160401b03811115620003f857620003f862000338565b62000410816200040984546200034e565b846200038a565b602080601f8311600181146200044857600084156200042f5750858301515b600019600386901b1c1916600185901b178555620003d4565b600085815260208120601f198616915b82811015620004795788860151825594840194600190910190840162000458565b5085821015620004985787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b808201808211156200020657634e487b7160e01b600052601160045260246000fd5b600060208083528351808285015260005b81811015620004f957858101830151858201604001528201620004db565b506000604082860101526040601f19601f8301168501019250505092915050565b80516020808301519190811015620003845760001960209190910360031b1b16919050565b60805160a05160c05160e0516101005161012051610140516113b46200059a60003960006103ad0152600061038201526000610a8d01526000610a65015260006109c0015260006109ea01526000610a1401526113b46000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c80637ecebe0011610097578063a457c2d711610066578063a457c2d714610207578063a9059cbb1461021a578063d505accf1461022d578063dd62ed3e1461024257600080fd5b80637ecebe00146101be57806384b0196e146101d157806395d89b41146101ec578063a0712d68146101f457600080fd5b8063313ce567116100d3578063313ce5671461016b5780633644e5151461017a578063395093511461018257806370a082311461019557600080fd5b806306fdde0314610105578063095ea7b31461012357806318160ddd1461014657806323b872dd14610158575b600080fd5b61010d610255565b60405161011a9190610fbf565b60405180910390f35b610136610131366004610ff5565b6102e7565b604051901515815260200161011a565b6002545b60405190815260200161011a565b61013661016636600461101f565b610301565b6040516012815260200161011a565b61014a610325565b610136610190366004610ff5565b610334565b61014a6101a336600461105b565b6001600160a01b031660009081526020819052604090205490565b61014a6101cc36600461105b565b610356565b6101d9610374565b60405161011a9796959493929190611076565b61010d6103fd565b61013661020236600461110c565b61040c565b610136610215366004610ff5565b610420565b610136610228366004610ff5565b6104a0565b61024061023b366004611125565b6104ae565b005b61014a610250366004611198565b610612565b606060038054610264906111cb565b80601f0160208091040260200160405190810160405280929190818152602001828054610290906111cb565b80156102dd5780601f106102b2576101008083540402835291602001916102dd565b820191906000526020600020905b8154815290600101906020018083116102c057829003601f168201915b5050505050905090565b6000336102f5818585610671565b60019150505b92915050565b60003361030f858285610795565b61031a85858561080f565b506001949350505050565b600061032f6109b3565b905090565b6000336102f58185856103478383610612565b61035191906111ff565b610671565b6001600160a01b0381166000908152600760205260408120546102fb565b6000606080828080836103a87f00000000000000000000000000000000000000000000000000000000000000006005610ade565b6103d37f00000000000000000000000000000000000000000000000000000000000000006006610ade565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060048054610264906111cb565b60006104183383610b82565b506001919050565b6000338161042e8286610612565b9050838110156104935760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61031a8286868403610671565b6000336102f581858561080f565b834211156104fe5760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e65000000604482015260640161048a565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c988888861052d8c610c41565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061058882610c69565b9050600061059882878787610c96565b9050896001600160a01b0316816001600160a01b0316146105fb5760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e61747572650000604482015260640161048a565b6106068a8a8a610671565b50505050505050505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60006020835110156106595761065283610cbe565b90506102fb565b816106648482611284565b5060ff90506102fb565b90565b6001600160a01b0383166106d35760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161048a565b6001600160a01b0382166107345760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161048a565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60006107a18484610612565b9050600019811461080957818110156107fc5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161048a565b6108098484848403610671565b50505050565b6001600160a01b0383166108735760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161048a565b6001600160a01b0382166108d55760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161048a565b6001600160a01b0383166000908152602081905260409020548181101561094d5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161048a565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610809565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610a0c57507f000000000000000000000000000000000000000000000000000000000000000046145b15610a3657507f000000000000000000000000000000000000000000000000000000000000000090565b61032f604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b606060ff8314610af15761065283610d01565b818054610afd906111cb565b80601f0160208091040260200160405190810160405280929190818152602001828054610b29906111cb565b8015610b765780601f10610b4b57610100808354040283529160200191610b76565b820191906000526020600020905b815481529060010190602001808311610b5957829003601f168201915b505050505090506102fb565b6001600160a01b038216610bd85760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161048a565b8060026000828254610bea91906111ff565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b60006102fb610c766109b3565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000610ca787878787610d40565b91509150610cb481610e04565b5095945050505050565b600080829050601f81511115610ce9578260405163305a27a960e01b815260040161048a9190610fbf565b8051610cf482611344565b179392505050565b505050565b60606000610d0e83610f51565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115610d775750600090506003610dfb565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610dcb573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610df457600060019250925050610dfb565b9150600090505b94509492505050565b6000816004811115610e1857610e18611368565b03610e205750565b6001816004811115610e3457610e34611368565b03610e815760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161048a565b6002816004811115610e9557610e95611368565b03610ee25760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161048a565b6003816004811115610ef657610ef6611368565b03610f4e5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161048a565b50565b600060ff8216601f8111156102fb57604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b81811015610f9f57602081850181015186830182015201610f83565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610fd26020830184610f79565b9392505050565b80356001600160a01b0381168114610ff057600080fd5b919050565b6000806040838503121561100857600080fd5b61101183610fd9565b946020939093013593505050565b60008060006060848603121561103457600080fd5b61103d84610fd9565b925061104b60208501610fd9565b9150604084013590509250925092565b60006020828403121561106d57600080fd5b610fd282610fd9565b60ff60f81b881681526000602060e08184015261109660e084018a610f79565b83810360408501526110a8818a610f79565b606085018990526001600160a01b038816608086015260a0850187905284810360c0860152855180825283870192509083019060005b818110156110fa578351835292840192918401916001016110de565b50909c9b505050505050505050505050565b60006020828403121561111e57600080fd5b5035919050565b600080600080600080600060e0888a03121561114057600080fd5b61114988610fd9565b965061115760208901610fd9565b95506040880135945060608801359350608088013560ff8116811461117b57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156111ab57600080fd5b6111b483610fd9565b91506111c260208401610fd9565b90509250929050565b600181811c908216806111df57607f821691505b602082108103610c6357634e487b7160e01b600052602260045260246000fd5b808201808211156102fb57634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b601f821115610cfc57600081815260208120601f850160051c8101602086101561125d5750805b601f850160051c820191505b8181101561127c57828155600101611269565b505050505050565b815167ffffffffffffffff81111561129e5761129e611220565b6112b2816112ac84546111cb565b84611236565b602080601f8311600181146112e757600084156112cf5750858301515b600019600386901b1c1916600185901b17855561127c565b600085815260208120601f198616915b82811015611316578886015182559484019460019091019084016112f7565b50858210156113345787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b80516020808301519190811015610c635760001960209190910360031b1b16919050565b634e487b7160e01b600052602160045260246000fdfea264697066735822122073dd4b2b944a374d1d7145182a3c956f2a754592a7303d56fd0b595ec011116d64736f6c63430008120033";

type TestToken2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestToken2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestToken2__factory extends ContractFactory {
  constructor(...args: TestToken2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _totalSupply: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_totalSupply, overrides || {});
  }
  override deploy(
    _totalSupply: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_totalSupply, overrides || {}) as Promise<
      TestToken2 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TestToken2__factory {
    return super.connect(runner) as TestToken2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestToken2Interface {
    return new Interface(_abi) as TestToken2Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): TestToken2 {
    return new Contract(address, _abi, runner) as unknown as TestToken2;
  }
}
