import fs from 'fs';

import ISwapFacade from '../artifacts/contracts/interfaces/ISwapFacade.sol/ISwapFacade.json';

const abiDirectory = 'abi/';

if (!fs.existsSync(abiDirectory)) {
  fs.mkdirSync(abiDirectory);
}

const allArtifacts = [ISwapFacade];

for (const artifact of allArtifacts) {
  const contractName = artifact.contractName;
  const ABI = artifact.abi;

  const filename = `${contractName}.json`;

  const json = JSON.stringify(ABI, null, 2);

  const filePath = `${abiDirectory}${filename}`;
  fs.writeFileSync(filePath, json);

  console.log(`Wrote ${filePath}`);
}
