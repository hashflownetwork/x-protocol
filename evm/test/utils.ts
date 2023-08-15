import {
  BigNumberish,
  TransactionResponse,
  solidityPackedKeccak256,
  Signer,
  TypedDataDomain,
} from 'ethers';
import {
  HardhatEthersSigner,
  SignerWithAddress,
} from '@nomicfoundation/hardhat-ethers/signers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export async function sendETH(
  signer: SignerWithAddress,
  value: BigNumberish,
  recipient: string
): Promise<TransactionResponse> {
  const tx = {
    from: await signer.getAddress(),
    to: recipient,
    value,
    nonce: await signer.getNonce(),
    gasLimit: '30000',
    gasPrice: '1000000000',
    type: 0,
  };

  return await signer.sendTransaction(tx);
}
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface RFQMQuoteData {
  pool: string;
  externalAccount: string;
  trader: string;
  baseToken: string;
  quoteToken: string;
  baseTokenAmount: BigNumberish;
  quoteTokenAmount: BigNumberish;
  quoteExpiry: number;
  txid: string;
}

export interface QuoteData {
  pool: string;
  externalAccount: string;
  trader: string;
  effectiveTrader: string;
  baseToken: string;
  quoteToken: string;
  baseTokenAmount: BigNumberish;
  quoteTokenAmount: BigNumberish;
  quoteExpiry: number;
  nonce: number;
  txid: string;
}

export interface XChainQuoteData {
  srcChainId: number;
  dstChainId: number;
  srcPool: string;
  dstPool: string;
  srcExternalAccount: string;
  dstExternalAccount: string;
  dstTrader: string;
  baseToken: string;
  quoteToken: string;
  effectiveBaseTokenAmount: BigNumberish;
  baseTokenAmount: BigNumberish;
  quoteTokenAmount: BigNumberish;
  quoteExpiry: number;
  nonce: number;
  txid: string;
  xChainMessenger: string;
}

export interface XChainRFQMQuoteData {
  srcChainId: number;
  dstChainId: number;
  srcPool: string;
  dstPool: string;
  srcExternalAccount: string;
  dstExternalAccount: string;
  trader: string;
  dstTrader: string;
  baseToken: string;
  quoteToken: string;
  baseTokenAmount: BigNumberish;
  quoteTokenAmount: BigNumberish;
  quoteExpiry: number;
  txid: string;
  xChainMessenger: string;
}

export async function signQuote(
  quote: QuoteData,
  signer: Signer
): Promise<string> {
  const digest = hashQuote(quote);
  return await signer.signMessage(Buffer.from(digest.slice(2), 'hex'));
}

export async function signQuoteXChain(
  quote: XChainQuoteData,
  signer: Signer
): Promise<string> {
  const digest = hashQuoteXChain(quote);
  return await signer.signMessage(Buffer.from(digest.slice(2), 'hex'));
}

export async function signQuoteRFQMTaker(
  quote: RFQMQuoteData,
  chainId: number,
  routerAddress: string,
  signer: HardhatEthersSigner
): Promise<string> {
  const domain: TypedDataDomain = {
    name: 'Hashflow - Router',
    version: '1.0',
    chainId,
    verifyingContract: routerAddress,
  };

  return await signer.signTypedData(
    domain,
    {
      Quote: [
        { name: 'txid', type: 'bytes32' },
        { name: 'trader', type: 'address' },
        { name: 'pool', type: 'address' },
        { name: 'externalAccount', type: 'address' },
        { name: 'baseToken', type: 'address' },
        { name: 'quoteToken', type: 'address' },
        { name: 'baseTokenAmount', type: 'uint256' },
        { name: 'quoteTokenAmount', type: 'uint256' },
        { name: 'quoteExpiry', type: 'uint256' },
      ],
    },
    {
      txid: quote.txid,
      trader: quote.trader,
      pool: quote.pool,
      externalAccount: quote.externalAccount,
      baseToken: quote.baseToken,
      quoteToken: quote.quoteToken,
      baseTokenAmount: quote.baseTokenAmount,
      quoteTokenAmount: quote.quoteTokenAmount,
      quoteExpiry: quote.quoteExpiry,
    }
  );
}

export async function signQuoteRFQMMaker(
  quote: RFQMQuoteData,
  signer: Signer
): Promise<string> {
  const digest = hashQuoteRFQMMaker(quote);
  return await signer.signMessage(Buffer.from(digest.slice(2), 'hex'));
}

export async function signQuoteXChainRFQMTaker(
  quote: XChainRFQMQuoteData,
  chainId: number,
  routerAddress: string,
  signer: HardhatEthersSigner
): Promise<string> {
  const domain: TypedDataDomain = {
    name: 'Hashflow - Router',
    version: '1.0',
    chainId,
    verifyingContract: routerAddress,
  };

  return await signer.signTypedData(
    domain,
    {
      XChainQuote: [
        { name: 'txid', type: 'bytes32' },
        { name: 'srcChainId', type: 'uint256' },
        { name: 'dstChainId', type: 'uint256' },
        { name: 'trader', type: 'address' },
        { name: 'srcPool', type: 'address' },
        { name: 'srcExternalAccount', type: 'address' },
        { name: 'dstPool', type: 'bytes32' },
        { name: 'dstExternalAccount', type: 'bytes32' },
        { name: 'baseToken', type: 'address' },
        { name: 'quoteToken', type: 'bytes32' },
        { name: 'baseTokenAmount', type: 'uint256' },
        { name: 'quoteTokenAmount', type: 'uint256' },
        { name: 'quoteExpiry', type: 'uint256' },
      ],
    },
    {
      txid: quote.txid,
      srcChainId: quote.srcChainId,
      dstChainId: quote.dstChainId,
      trader: quote.trader,
      srcPool: quote.srcPool,
      srcExternalAccount: quote.srcExternalAccount,
      dstPool: quote.dstPool,
      dstExternalAccount: quote.dstExternalAccount,
      baseToken: quote.baseToken,
      quoteToken: quote.quoteToken,
      baseTokenAmount: quote.baseTokenAmount,
      quoteTokenAmount: quote.quoteTokenAmount,
      quoteExpiry: quote.quoteExpiry,
    }
  );
}

export async function signQuoteXChainRFQMMaker(
  quote: XChainRFQMQuoteData,
  signer: Signer
): Promise<string> {
  const digest = hashQuoteXChainRFQMMaker(quote);
  return await signer.signMessage(Buffer.from(digest.slice(2), 'hex'));
}

export function hashQuote(quote: QuoteData): string {
  return solidityPackedKeccak256(
    [
      'address',
      'address',
      'address',
      'address',
      'address',
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bytes32',
      'uint256',
    ],
    [
      quote.pool,
      quote.trader,
      quote.effectiveTrader,
      quote.externalAccount,
      quote.baseToken,
      quote.quoteToken,
      quote.baseTokenAmount,
      quote.quoteTokenAmount,
      quote.nonce,
      quote.quoteExpiry,
      quote.txid,
      31337,
    ]
  );
}

export function hashQuoteRFQMMaker(quote: RFQMQuoteData): string {
  return solidityPackedKeccak256(
    [
      'address',
      'address',
      'address',
      'address',
      'address',
      'uint256',
      'uint256',
      'uint256',
      'bytes32',
      'uint256',
    ],
    [
      quote.pool,
      quote.externalAccount,
      quote.trader,
      quote.baseToken,
      quote.quoteToken,
      quote.baseTokenAmount,
      quote.quoteTokenAmount,
      quote.quoteExpiry,
      quote.txid,
      31337,
    ]
  );
}

export function hashQuoteXChain(quote: XChainQuoteData) {
  return solidityPackedKeccak256(
    [
      'bytes32',
      'bytes32',
      'address',
      'bytes32',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bytes32',
      'address',
    ],
    [
      solidityPackedKeccak256(
        ['uint16', 'uint16', 'address', 'bytes32', 'address', 'bytes32'],
        [
          quote.srcChainId,
          quote.dstChainId,
          quote.srcPool,
          quote.dstPool,
          quote.srcExternalAccount,
          quote.dstExternalAccount,
        ]
      ),
      quote.dstTrader,
      quote.baseToken,
      quote.quoteToken,
      quote.baseTokenAmount,
      quote.quoteTokenAmount,
      quote.quoteExpiry,
      quote.nonce,
      quote.txid,
      quote.xChainMessenger,
    ]
  );
}

export function hashQuoteXChainRFQMMaker(quote: XChainRFQMQuoteData): string {
  return solidityPackedKeccak256(
    [
      'bytes32',
      'address',
      'address',
      'bytes32',
      'uint256',
      'uint256',
      'uint256',
      'bytes32',
      'address',
    ],
    [
      solidityPackedKeccak256(
        ['uint16', 'uint16', 'address', 'bytes32', 'address', 'bytes32'],
        [
          quote.srcChainId,
          quote.dstChainId,
          quote.srcPool,
          quote.dstPool,
          quote.srcExternalAccount,
          quote.dstExternalAccount,
        ]
      ),
      quote.trader,
      quote.baseToken,
      quote.quoteToken,
      quote.baseTokenAmount,
      quote.quoteTokenAmount,
      quote.quoteExpiry,
      quote.txid,
      quote.xChainMessenger,
    ]
  );
}

export async function signERC20Permit(
  owner: string,
  spender: string,
  nonce: number,
  amount: BigNumberish,
  deadline: number,
  tokenAddress: string,
  tokenName: string,
  tokenVersion: string,
  chainId: number,
  signer: HardhatEthersSigner
): Promise<string> {
  const domain: TypedDataDomain = {
    name: tokenName,
    version: tokenVersion,
    chainId,
    verifyingContract: tokenAddress,
  };

  return await signer.signTypedData(
    domain,
    {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    {
      owner,
      spender,
      value: amount,
      nonce,
      deadline,
    }
  );
}

export function expandTo18Decimals(n: number): bigint {
  return BigInt(n) * BigInt(10) ** BigInt(18);
}

export async function mineBlock(
  hre: HardhatRuntimeEnvironment,
  timestamp: number
): Promise<void> {
  return hre.ethers.provider.send('evm_mine', [timestamp]);
}

export function hashMessage(message: string): string {
  return solidityPackedKeccak256(['string'], [message]);
}

export function padAddressTo32Bytes(address: string | Buffer): Buffer {
  const strAddress = address.toString();
  let paddedAddress =
    strAddress.indexOf('0x') === -1 ? strAddress : strAddress.slice(2);

  while (paddedAddress.length < 64) {
    paddedAddress = `00${paddedAddress}`;
  }

  return Buffer.from(paddedAddress, 'hex');
}
