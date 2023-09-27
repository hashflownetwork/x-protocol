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
import IERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';
import IERC1155 from '../artifacts/@openzeppelin/contracts/token/ERC1155/IERC1155.sol/IERC1155.json';
import ERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import IHashflowAavePortal from '../artifacts/contracts/interfaces/xapp/IHashflowAavePortal.sol/IHashflowAavePortal.json';

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
  IHashflowAavePortal,
  IWeth,
  IERC20,
  ERC20,
  IERC1155
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
