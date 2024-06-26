import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import dotenv from 'dotenv';
import { NetworkName } from '@hashflow/contracts-evm';
import {
  NETWORK_NAMES,
  HARDHAT_NETWORK_CONFIG_BY_NAME,
} from '@hashflow/contracts-evm/dist/src/utils';

import { NetworkUserConfig } from 'hardhat/types';

import './tasks/deploy';

dotenv.config();

const providedAccounts = process.env.PRIVATE_KEY
  ? [process.env.PRIVATE_KEY]
  : [];

const networks: Partial<
  Record<Exclude<NetworkName, 'localhost'>, NetworkUserConfig>
> = NETWORK_NAMES.filter((networkName: NetworkName) => {
  const rpcURL =
    process.env[`${networkName.replace('-', '_').toUpperCase()}_RPC_URL`];

  return !!rpcURL;
})
  .map((networkName: NetworkName) => {
    const rpcURL =
      process.env[`${networkName.replace('-', '_').toUpperCase()}_RPC_URL`];

    if (!rpcURL) {
      throw new Error(`Could not find RPC URL for network ${networkName}`);
    }

    const networkConfig = HARDHAT_NETWORK_CONFIG_BY_NAME[networkName];

    return {
      [networkName]: {
        chainId: networkConfig.chainId,
        url: rpcURL,
        accounts: providedAccounts,
      },
    };
  })
  .reduce((acc, el) => ({ ...acc, ...el }), {});

const blockscanApiKeys: Record<string, string> = {};

if (process.env.ETHERSCAN_API_KEY) {
  blockscanApiKeys['mainnet'] = process.env.ETHERSCAN_API_KEY;
  blockscanApiKeys['goerli'] = process.env.ETHERSCAN_API_KEY;
}
if (process.env.POLYGONSCAN_API_KEY) {
  blockscanApiKeys['polygon'] = process.env.POLYGONSCAN_API_KEY;
  blockscanApiKeys['polygonMumbai'] = process.env.POLYGONSCAN_API_KEY;
}
if (process.env.BSCSCAN_API_KEY) {
  blockscanApiKeys['bsc'] = process.env.BSCSCAN_API_KEY;
  blockscanApiKeys['bscTestnet'] = process.env.BSCSCAN_API_KEY;
}
if (process.env.SNOWTRACE_API_KEY) {
  blockscanApiKeys['avalanche'] = process.env.SNOWTRACE_API_KEY;
}
if (process.env.OPTIMISTIC_ETHERSCAN_API_KEY) {
  blockscanApiKeys['optimisticEthereum'] =
    process.env.OPTIMISTIC_ETHERSCAN_API_KEY;
}
if (process.env.ARBISCAN_API_KEY) {
  blockscanApiKeys['arbitrumOne'] = process.env.ARBISCAN_API_KEY;
}
if (process.env.BASESCAN_API_KEY) {
  blockscanApiKeys['base'] = process.env.BASESCAN_API_KEY;
}

const config: HardhatUserConfig = {
  networks: {
    ...networks,
    hardhat: {
      chainId: Number(process.env.HARDHAT_CHAIN_ID ?? 31337),
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: blockscanApiKeys,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  typechain: {
    outDir: 'types',
  },
};

export default config;
