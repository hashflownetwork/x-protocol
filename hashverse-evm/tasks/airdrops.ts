import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getFireblocksSigner,
  getNetworkConfigFromHardhatRuntimeEnvironment,
} from './utils';
import fs from 'fs';

task('airdrop:items', 'Airdrops Items')
  .addParam(
    'airdropFilePath',
    'The path to the CSV file containing the aidrop params',
  )
  .addFlag('fireblocks', 'Whether to use Fireblocks wallet')
  .setAction(async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);
    const signer = taskArgs.fireblocks
      ? await getFireblocksSigner(hre)
      : (await hre.ethers.getSigners())[0]!;

    const contractMetadata = getDeployedContractMetadata(
      'IRenovaCommandDeck',
      networkConfig.name,
    );

    if (!contractMetadata) {
      throw new Error(
        `Could not find IRenovaCommandDeck deployment on ${networkConfig.name}`,
      );
    }

    const commandDeck = await hre.ethers.getContractAt(
      'IRenovaCommandDeck',
      contractMetadata.address,
      signer,
    );

    const airdropRowsCSV = fs
      .readFileSync(taskArgs.airdropFilePath)
      .toString()
      .split('\n');

    for (const airdropRowCSV of airdropRowsCSV) {
      const wallet = airdropRowCSV.split(',')[0];
      const itemId = Number(airdropRowCSV.split(',')[1]);

      const tx = await commandDeck.mintItemAdmin(wallet, itemId);
      await tx.wait();

      console.log(`Minted Hashverse Item ID ${itemId} to ${wallet}`);
    }
  });
