import { BaseContract, Signer } from 'ethers';
import fs from 'fs';
import path from 'path';
import {
  MAIN_NETWORK_NAMES,
  TEST_NETWORK_NAMES,
} from '@hashflow/contracts-evm';
import {
  HARDHAT_NETWORK_CONFIG_BY_NAME,
  WORMHOLE_NETWORK_NAMES,
  NetworkNameExtended,
  NetworkConfigExtended,
} from '@hashflow/contracts-evm/dist/src/utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import {
  FireblocksWeb3Provider,
  ChainId as FireblocksChainId,
  ApiBaseUrl,
} from '@fireblocks/fireblocks-web3-provider';

const CONTRACT_METADATA_DIR = '../deployed-contracts';

export type ContractName =
  | 'IRenovaAvatar'
  | 'IRenovaAvatarSatellite'
  | 'IRenovaCommandDeck'
  | 'IRenovaCommandDeckSatellite'
  | 'IRenovaItem'
  | 'IRenovaItemSatellite'
  | 'IStakingVault';

export type SingleContractMetadata = {
  address: string;
  deploymentTransactionHash: string;
};

type ContractMetadata = Partial<
  Record<NetworkNameExtended, SingleContractMetadata>
>;

export const RENOVA_HUB_NETWORK_NAMES = [
  'ethereum',
  'goerli',
  'wormhole1',
  'localhost',
] as const;

export function isRenovaHub(networkName: NetworkNameExtended): boolean {
  return (RENOVA_HUB_NETWORK_NAMES as unknown as string[]).includes(
    networkName,
  );
}

export function isHardhatMainnet(networkName: NetworkNameExtended): boolean {
  return (MAIN_NETWORK_NAMES as unknown as string[]).includes(networkName);
}

export function isHardhatTestnet(networkName: NetworkNameExtended): boolean {
  return (TEST_NETWORK_NAMES as unknown as string[]).includes(networkName);
}

export function isWormholeTestnet(networkName: NetworkNameExtended): boolean {
  return (WORMHOLE_NETWORK_NAMES as unknown as string[]).includes(networkName);
}

export function getDeployedContractMetadata(
  contractName: ContractName,
  networkName: NetworkNameExtended,
): SingleContractMetadata | undefined {
  const contractMetadata: ContractMetadata | undefined =
    getContractMetadata(contractName);

  return contractMetadata?.[networkName];
}

export async function registerDeployedContract(
  contract: BaseContract,
  contractName: ContractName,
  networkName: NetworkNameExtended,
): Promise<void> {
  const contractMetadata = getContractMetadata(contractName) ?? {};

  const address = await contract.getAddress();
  const deploymentTransaction = contract.deploymentTransaction();

  if (!deploymentTransaction) {
    throw new Error(
      `Could not find deployment transaction for ${contractName} on ${networkName}`,
    );
  }
  const deploymentTransactionHash = deploymentTransaction.hash;

  contractMetadata[networkName] = {
    address,
    deploymentTransactionHash,
  };

  const contractMetadataFilePath = getContractMetadataFilePath(contractName);

  fs.writeFileSync(
    contractMetadataFilePath,
    JSON.stringify(contractMetadata, null, 4),
  );

  console.log(`Deployed ${contractName} at ${address}`);
}

export function getNetworkConfigFromHardhatRuntimeEnvironment(
  hre: HardhatRuntimeEnvironment,
): NetworkConfigExtended {
  const networkName = hre.hardhatArguments.network as NetworkNameExtended;

  return HARDHAT_NETWORK_CONFIG_BY_NAME[networkName];
}

function getContractMetadata(
  contractName: ContractName,
): ContractMetadata | undefined {
  const metadataFilePath = getContractMetadataFilePath(contractName);

  if (!fs.existsSync(metadataFilePath)) {
    return undefined;
  }

  return JSON.parse(
    fs.readFileSync(metadataFilePath).toString(),
  ) as ContractMetadata;
}

function getContractMetadataFilePath(contractName: ContractName): string {
  return path.resolve(
    __dirname,
    `${CONTRACT_METADATA_DIR}/${contractName}.json`,
  );
}

export async function getFireblocksSigner(
  hre: HardhatRuntimeEnvironment,
): Promise<Signer> {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const chainId = networkConfig.chainId;

  const apiPrivateKeyPath = process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH;
  const apiKey = process.env.FIREBLOCKS_API_KEY;

  if (!apiPrivateKeyPath) {
    throw new Error(`FIREBLOCKS_API_PRIVATE_KEY_PATH not provided`);
  }
  if (!apiKey) {
    throw new Error(`FIREBLOCKS_API_KEY not provided`);
  }
  const fireblocksChainId: FireblocksChainId | undefined =
    chainId === 1
      ? FireblocksChainId.MAINNET
      : chainId === 42161
      ? FireblocksChainId.ARBITRUM
      : undefined;
  if (!fireblocksChainId) {
    throw new Error(`Unsupported Chain ID for Fireblocks: ${chainId}`);
  }
  const provider = new hre.ethers.BrowserProvider(
    new FireblocksWeb3Provider({
      apiBaseUrl: ApiBaseUrl.Production,
      privateKey: apiPrivateKeyPath,
      apiKey: apiKey,
      vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
      chainId: fireblocksChainId,
    }),
  );

  return await provider.getSigner();
}
