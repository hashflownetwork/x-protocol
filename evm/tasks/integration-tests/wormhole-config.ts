import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { ethers } from 'ethers';

export const EVM_POOL_ADDRESS_HEX =
  '0x1E5604A142F15dA5Aab6DdC2fa00A1CC3E56059b';
export const EVM_TEST_TOKEN_1_ADDRESS_HEX =
  '0xdFccc9C59c7361307d47c558ffA75840B32DbA29';
export const EVM_TEST_TOKEN_2_ADDRESS_HEX =
  '0x9e90054F4B6730cffAf1E6f6ea10e1bF9dD26dbb';
export const EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX =
  '0xe93e3B649d4E01e47dd2170CAFEf0651477649Da';

export const SOLANA_HASHFLOW_CHAIN_ID = 100;
export const SOLANA_WORMHOLE_CHAIN_ID = 1;
export const SOLANA_EMITTER_ADDRESS_BASE58 =
  'BiGKLEuA4mWeVhWfrHnscSecxTBR7xeLPYQoiTnfVjPP';
export const SOLANA_POOL_ADDRESS_BASE58 =
  'ALCZx3rtWd9sidBvKHSq38emNoPeyZ8VF8E21hp1hrqg';
export const SOLANA_TRADER_ADDRESS_BASE58 =
  'DQmogP12Cm2SEjBxFWo6RACVLRk2nrqFFQyyBSqGxR2U';
export const SOLANA_TOKEN_ADDRESS_BASE58 =
  '5u8sRTNDRTXxr5L4SeUDNregZyEgBQJdMM7GiCz1m6oR';

export const WORMHOLE_METADATA_FILE_PATH = 'wormhole_test_metadata.json';
export const WORMHOLE_CONTRACT_METADATA_FILE_PATH =
  'wormhole_test_contract_metadata.json';

export async function getSigners(hre: HardhatRuntimeEnvironment): Promise<{
  mainSigner: ethers.Signer;
  quoteSigner: ethers.Signer;
  traderSigner: ethers.Signer;
  permissionedRelayerSigner: ethers.Signer;
}> {
  const allSigners = await hre.ethers.getSigners();

  return {
    mainSigner: allSigners[0],
    quoteSigner: allSigners[1],
    traderSigner: allSigners[2],
    permissionedRelayerSigner: allSigners[3],
  };
}
