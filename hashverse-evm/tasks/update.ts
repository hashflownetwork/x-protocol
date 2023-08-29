import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  isRenovaHub,
} from './utils';
import routerDeploymentMetadata from '@hashflow/contracts-evm/deployed-contracts/IHashflowRouter.json';
import { NetworkNameExtended } from '@hashflow/contracts-evm/dist/src/utils';

task(
  'command-deck:update-router',
  'Updates the Hashflow Router address',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const contractName = isRenovaHub(networkConfig.name)
    ? 'IRenovaCommandDeck'
    : 'IRenovaCommandDeckSatellite';

  const contractMetadata = getDeployedContractMetadata(
    contractName,
    networkConfig.name,
  );

  if (!contractMetadata) {
    throw new Error(
      `Could not find ${contractName} deployment on ${networkConfig.name}`,
    );
  }

  const routerContractMetadata = (
    routerDeploymentMetadata as Partial<
      Record<NetworkNameExtended, (typeof routerDeploymentMetadata)['goerli']>
    >
  )[networkConfig.name];

  if (!routerContractMetadata) {
    throw new Error(`Could not find router contract metadata`);
  }

  const commandDeck = await hre.ethers.getContractAt(
    'IRenovaCommandDeckBase',
    contractMetadata.address,
  );

  const tx = await commandDeck.updateHashflowRouter(
    routerContractMetadata.address,
  );
  await tx.wait();

  console.log(
    `Router updated to ${routerContractMetadata.address}. Transaction Hash: ${tx.hash}`,
  );
});
