import {
  BigNumberish,
  Signer,
  TransactionResponse,
  TypedDataDomain,
} from 'ethers';

import { ERC20Permit } from '../types/index';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function toWei(amountEth: BigNumberish, decimals?: number): bigint {
  return BigInt(amountEth) * BigInt(10) ** BigInt(decimals ?? 18);
}

export async function mineBlock(
  hre: HardhatRuntimeEnvironment,
  timestamp: number
): Promise<void> {
  await hre.ethers.provider.send('evm_mine', [timestamp]);
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

export async function sendETH(
  signer: Signer,
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

export async function signERC20Permit(
  signer: Signer,
  spender: string,
  erc20: ERC20Permit,
  version: string,
  value: BigNumberish,
  deadline: BigNumberish
): Promise<{
  r: string;
  s: string;
  v: number;
}> {
  const owner = await signer.getAddress();
  const nonce = await erc20.nonces(owner);

  const domain: TypedDataDomain = {
    name: await erc20.name(),
    version,
    chainId: 31337,
    verifyingContract: await erc20.getAddress(),
  };

  const signature = await signer.signTypedData(
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
      value,
      nonce,
      deadline,
    }
  );

  return parseSignatureRSV(signature);
}

export function strip0xPrefix(hexString: string): string {
  if (hexString.startsWith('0x')) {
    return hexString.slice(2);
  }

  return hexString;
}

export function parseSignatureRSV(signature: string | Buffer): {
  r: string;
  s: string;
  v: number;
} {
  const sigString = strip0xPrefix(
    Buffer.isBuffer(signature) ? signature.toString('hex') : signature
  );

  if (sigString.length !== 130) {
    throw new Error(`Invalid signature length: ${sigString.length}`);
  }

  const r = `0x${sigString.slice(0, 64)}`;
  const s = `0x${sigString.slice(64, 128)}`;
  const v = parseInt(sigString.slice(128, 130), 16);

  if (v !== 27 && v !== 28 && v !== 0 && v !== 1) {
    throw new Error(`Invalid v value: ${v}`);
  }

  return { r, s, v };
}
