import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  isRenovaHub,
} from './utils';

task(
  'command-deck:upgrade',
  'Upgrades the RenovaCommandDeck / RenovaCommandDeckBase',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const contractName = isRenovaHub(networkConfig.name)
    ? 'IRenovaCommandDeck'
    : 'IRenovaCommandDeckSatellite';

  const contractImplName = isRenovaHub(networkConfig.name)
    ? 'RenovaCommandDeck'
    : 'RenovaCommandDeckSatellite';

  const contractMetadata = getDeployedContractMetadata(
    contractName,
    networkConfig.name,
  );

  if (!contractMetadata) {
    throw new Error(
      `Could not find ${contractName} deployment on ${networkConfig.name}`,
    );
  }

  const factory = await hre.ethers.getContractFactory(contractImplName);

  await hre.upgrades.upgradeProxy(contractMetadata.address, factory);

  console.log(`${contractName} upgraded`);
});
