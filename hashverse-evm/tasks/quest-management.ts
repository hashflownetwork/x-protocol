import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  isRenovaHub,
} from './utils';

task('command-deck:update-quest-owner', 'Updates the Quest Owner address')
  .addParam('newOwner', 'The new owner address')
  .setAction(async (taskArgs, hre) => {
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

    const commandDeck = await hre.ethers.getContractAt(
      'IRenovaCommandDeckBase',
      contractMetadata.address,
    );

    const tx = await commandDeck.updateQuestOwner(taskArgs.newOwner);
    await tx.wait();

    console.log(`Updated quest owner to ${taskArgs.newOwner}`);
  });

task('command-deck:create-quest', 'Creates a Quest')
  .addParam('startTime', 'The start time of the Quest, in UTC seconds')
  .addParam('endTime', 'The end time of the Quest, in UTC seconds')
  .addParam(
    'depositToken',
    'The token to be deposited in order to enter the Quest',
  )
  .addParam(
    'minDepositAmount',
    'The minimum amount to be deposited in order to enter the quest',
  )
  .setAction(async (taskArgs, hre) => {
    const questId = hre.ethers.keccak256(Buffer.from(`${Math.random()}`));

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

    const commandDeck = await hre.ethers.getContractAt(
      'IRenovaCommandDeckBase',
      contractMetadata.address,
    );

    const tx = await commandDeck.createQuest(
      questId,
      Number(taskArgs.startTime),
      Number(taskArgs.endTime),
      taskArgs.depositToken,
      taskArgs.minDepositAmount,
    );

    await tx.wait();

    console.log(`Created Quest ${questId}`);
  });
