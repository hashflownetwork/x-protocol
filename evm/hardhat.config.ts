import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-verify';
import '@nomicfoundation/hardhat-chai-matchers';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/config';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';

import dotenv from 'dotenv';

import {
  HARDHAT_NETWORK_CONFIG_BY_NAME,
  NETWORK_NAMES_EXTENDED,
  NetworkNameExtended,
} from './src/utils';
import { NetworkUserConfig } from 'hardhat/types';

import './tasks/core';
import './tasks/deploy';
import './tasks/operations';
import './tasks/integration-tests/wormhole-setup';
import './tasks/integration-tests/wormhole-trade';
import './tasks/integration-tests/aave-xapp-test';

dotenv.config();

const providedAccounts = process.env.PRIVATE_KEY
  ? [process.env.PRIVATE_KEY]
  : [];

const networks: Partial<
  Record<Exclude<NetworkNameExtended, 'localhost'>, NetworkUserConfig>
> = NETWORK_NAMES_EXTENDED.filter((networkName: NetworkNameExtended) => {
  const rpcURL =
    process.env[`${networkName.replace('-', '_').toUpperCase()}_RPC_URL`];

  return !!rpcURL && networkName !== 'localhost';
})
  .map((networkName: NetworkNameExtended) => {
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

// These networks are used to test Wormhole x-calls locally.
// They are run in two different Ganache EVM processes

networks['wormhole1'] = {
  chainId: 1,
  url: 'http://localhost:8545',
  accounts: [
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', // Main address
    '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1', // Signer
    '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c', // Trader
  ],
};

networks['wormhole2'] = {
  chainId: 1397,
  url: 'http://localhost:8546',
  accounts: [
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', // Main address
    '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1', // Signer
    '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c', // Trader
  ],
};

const blockscanApiKeys: Record<string, string> = {};

if (process.env.ETHERSCAN_API_KEY) {
  blockscanApiKeys['mainnet'] = process.env.ETHERSCAN_API_KEY;
  blockscanApiKeys['goerli'] = process.env.ETHERSCAN_API_KEY;
  blockscanApiKeys['sepolia'] = process.env.ETHERSCAN_API_KEY;
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

blockscanApiKeys['monadTestnet'] = 'DUMMY';

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
  sourcify: {
    enabled: false,
    apiUrl: 'https://sourcify-api-monad.blockvision.org/',
    browserUrl: 'https://testnet.monadexplorer.com/',
  },
  etherscan: {
    enabled: false,
    apiKey: blockscanApiKeys,
    customChains: [
      {
        network: 'monadTestnet',
        chainId: 10143,
        urls: {
          apiURL: 'https://explorer.monad-testnet.category.xyz/api',
          browserURL: 'https://explorer.monad-testnet.category.xyz',
        },
      },
    ],
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
