import { BaseContract } from 'ethers';
import fs from 'fs';
import path from 'path';
import {
  HARDHAT_NETWORK_CONFIG_BY_NAME,
  MAIN_NETWORK_NAMES,
  TEST_NETWORK_NAMES,
  WORMHOLE_NETWORK_NAMES,
  NetworkConfigExtended,
  NetworkNameExtended,
} from '../src/utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const CONTRACT_METADATA_DIR = '../deployed-contracts';

export type ContractName =
  | 'IHashflowFactory'
  | 'IHashflowRouter'
  | 'IHashflowWormholeMessenger'
  | 'IHashflowLayerZeroMessenger'
  | 'IHashflowPool';

export type SingleContractMetadata = {
  address: string;
  deploymentTransactionHash: string;
};

type ContractMetadata = Partial<
  Record<NetworkNameExtended, SingleContractMetadata>
>;

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
