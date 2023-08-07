import fs from 'fs';

import IHashflowFactory from '../artifacts/contracts/interfaces/IHashflowFactory.sol/IHashflowFactory.json';
import IHashflowRouter from '../artifacts/contracts/interfaces/IHashflowRouter.sol/IHashflowRouter.json';
import IHashflowLayerZeroMessenger from '../artifacts/contracts/interfaces/xchain/IHashflowLayerZeroMessenger.sol/IHashflowLayerZeroMessenger.json';
import IHashflowWormholeMessenger from '../artifacts/contracts/interfaces/xchain/IHashflowWormholeMessenger.sol/IHashflowWormholeMessenger.json';
import IHashflowPool from '../artifacts/contracts/interfaces/IHashflowPool.sol/IHashflowPool.json';

import IWormhole from '../artifacts/contracts/interfaces/external/IWormhole.sol/IWormhole.json';
import ILayerZeroEndpoint from '../artifacts/contracts/interfaces/external/ILayerZeroEndpoint.sol/ILayerZeroEndpoint.json';
import ILayerZeroNonceContract from '../artifacts/contracts/interfaces/external/ILayerZeroNonceContract.sol/ILayerZeroNonceContract.json';
import IWeth from '../artifacts/contracts/interfaces/external/IWETH.sol/IWETH.json';

const abiDirectory = 'abi/';

if (!fs.existsSync(abiDirectory)) {
  fs.mkdirSync(abiDirectory);
}

const allArtifacts = [
  IHashflowFactory,
  IHashflowRouter,
  IHashflowPool,
  IHashflowLayerZeroMessenger,
  IHashflowWormholeMessenger,
  IWormhole,
  ILayerZeroEndpoint,
  ILayerZeroNonceContract,
  IWeth,
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
