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

task('airdrop:items:parallel')
  .addParam(
    'airdropFilePath',
    'The path to the CSV file containing the aidrop params',
  )
  .setAction(async (taskArgs, hre) => {
    const signer = (await hre.ethers.getSigners())[0]!;

    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const commandDeckMetadata = getDeployedContractMetadata(
      'IRenovaCommandDeck',
      networkConfig.name,
    );

    if (!commandDeckMetadata) {
      throw new Error(`Could not resolve Command Deck metadata`);
    }

    const renovaCommandDeck = await hre.ethers.getContractAt(
      'RenovaCommandDeck',
      commandDeckMetadata?.address,
    );

    const renovaCommandDeckOwner = await renovaCommandDeck.owner();
    if (renovaCommandDeckOwner.toLowerCase() !== signer.address.toLowerCase()) {
      throw new Error('Wrong owner');
    }

    const rows = fs
      .readFileSync(taskArgs.airdropFilePath)
      .toString()
      .split('\n')
      .map((r) => r.trim())
      .filter((p) => p.split(',').length === 2);

    let currentNonce = await signer.getNonce();

    for (const row of rows) {
      const parts = row.split(',');
      const wallet = parts[0];
      const hashverseItemId = Number(parts[1]);

      await renovaCommandDeck.mintItemAdmin(wallet, hashverseItemId);

      console.log(
        'Sent mint transaction',
        wallet,
        hashverseItemId,
        currentNonce,
      );

      currentNonce += 1;
    }
  });
