import fs from 'fs';

import IRenovaAvatar from '../artifacts/contracts/interfaces/nft/IRenovaAvatar.sol/IRenovaAvatar.json';
import IRenovaAvatarBase from '../artifacts/contracts/interfaces/nft/IRenovaAvatarBase.sol/IRenovaAvatarBase.json';
import IRenovaAvatarSatellite from '../artifacts/contracts/interfaces/nft/IRenovaAvatarSatellite.sol/IRenovaAvatarSatellite.json';

import IRenovaItem from '../artifacts/contracts/interfaces/nft/IRenovaItem.sol/IRenovaItem.json';
import IRenovaItemBase from '../artifacts/contracts/interfaces/nft/IRenovaItemBase.sol/IRenovaItemBase.json';
import IRenovaItemSatellite from '../artifacts/contracts/interfaces/nft/IRenovaItemSatellite.sol/IRenovaItemSatellite.json';

import IRenovaCommandDeck from '../artifacts/contracts/interfaces/core/IRenovaCommandDeck.sol/IRenovaCommandDeck.json';
import IRenovaCommandDeckBase from '../artifacts/contracts/interfaces/core/IRenovaCommandDeckBase.sol/IRenovaCommandDeckBase.json';
import IRenovaCommandDeckSatellite from '../artifacts/contracts/interfaces/core/IRenovaCommandDeckSatellite.sol/IRenovaCommandDeckSatellite.json';

import IRenovaQuest from '../artifacts/contracts/interfaces/core/IRenovaQuest.sol/IRenovaQuest.json';

import IStakingVault from '../artifacts/contracts/interfaces/staking/IStakingVault.sol/IStakingVault.json';

const abiDirectory = 'abi/';

if (!fs.existsSync(abiDirectory)) {
  fs.mkdirSync(abiDirectory);
}

const allArtifacts = [
  IRenovaAvatar,
  IRenovaAvatarBase,
  IRenovaAvatarSatellite,
  IRenovaItem,
  IRenovaItemBase,
  IRenovaItemSatellite,
  IRenovaCommandDeck,
  IRenovaCommandDeckBase,
  IRenovaCommandDeckSatellite,
  IRenovaQuest,
  IStakingVault,
];

for (const artifact of allArtifacts) {
  const contractName = artifact.contractName;
  const ABI = artifact.abi;

  const filename = `${contractName}.json`;

  const json = JSON.stringify(ABI, null, 4);

  const filePath = `${abiDirectory}${filename}`;
  fs.writeFileSync(filePath, json);

  console.log(`Wrote ${filePath}`);
}
