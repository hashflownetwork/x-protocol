import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getFireblocksSigner,
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
  .addFlag('fireblocks', 'Whether to use Fireblocks wallet')
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

    const signer = taskArgs.fireblocks
      ? await getFireblocksSigner(hre)
      : (await hre.ethers.getSigners())[0]!;

    const commandDeck = await hre.ethers.getContractAt(
      'IRenovaCommandDeckBase',
      contractMetadata.address,
      signer,
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

task(
  'quest:update-token-authorization',
  'Updates whether a token is tradeable within a Quest',
)
  .addParam('questAddress', 'The address of the quest')
  .addParam('tokenAddress', 'The address of the token')
  .addFlag('revoke', 'Whether we should revoke a token')
  .addFlag('fireblocks', 'Whether to use Fireblocks wallet')
  .setAction(async (taskArgs, hre) => {
    const { questAddress, tokenAddress, revoke } = taskArgs;

    const signer = taskArgs.fireblocks
      ? await getFireblocksSigner(hre)
      : (await hre.ethers.getSigners())[0]!;

    const quest = await hre.ethers.getContractAt(
      'IRenovaQuest',
      questAddress,
      signer,
    );

    const tx = await quest.updateTokenAuthorization(tokenAddress, !revoke);

    await tx.wait();

    console.log(`Updated token authorization for ${tokenAddress} ${!revoke}`);
  });
