import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  isHardhatMainnet,
  isHardhatTestnet,
  isWormholeTestnet,
  registerDeployedContract,
} from './utils';
import {
  HARDHAT_NETWORK_CONFIG_BY_NAME,
  MAIN_NETWORK_NAMES,
  TEST_NETWORK_NAMES,
  WORMHOLE_NETWORK_NAMES,
  padAddressTo32Bytes,
} from '../src/utils';

task('pool:deploy', 'Deploys the HashflowPool implementation').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    if (networkConfig.zksync) {
      return;
    }

    const { weth } = networkConfig;

    if (!weth) {
      throw new Error(`Missing WETH address for network ${networkConfig.name}`);
    }

    const contractFactory = await hre.ethers.getContractFactory('HashflowPool');

    const contract = await contractFactory.deploy(weth);
    await contract.waitForDeployment();

    registerDeployedContract(contract, 'IHashflowPool', networkConfig.name);
  },
);

task('factory:deploy', 'Deploys the HashflowFactory').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const contractFactory =
      await hre.ethers.getContractFactory('HashflowFactory');
    const contract = await contractFactory.deploy();

    await contract.waitForDeployment();

    registerDeployedContract(contract, 'IHashflowFactory', networkConfig.name);
  },
);

task('factory:initialize', 'Initializes the HashflowFactory').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const routerMetadata = getDeployedContractMetadata(
      'IHashflowRouter',
      networkConfig.name,
    );

    if (!routerMetadata) {
      throw new Error(`Could not find IHashflowRouter metadata`);
    }

    const factoryMetadata = getDeployedContractMetadata(
      'IHashflowFactory',
      networkConfig.name,
    );

    if (!factoryMetadata) {
      throw new Error(`Could not find IHashflowFactory metadata`);
    }

    const factoryContract = await hre.ethers.getContractAt(
      'IHashflowFactory',
      factoryMetadata.address,
    );

    const tx = await factoryContract.initialize(routerMetadata.address);
    await tx.wait();

    console.log(`Initialized HashflowFactory: ${tx.hash}`);
  },
);

task(
  'factory:initialize:pool',
  'Initializes the Pool Implementation Contract',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { zksync } = networkConfig;
  if (zksync) {
    return;
  }

  const factoryMetadata = getDeployedContractMetadata(
    'IHashflowFactory',
    networkConfig.name,
  );

  if (!factoryMetadata) {
    throw new Error(`Could not find IHashflowFactory metadata`);
  }

  const factoryContract = await hre.ethers.getContractAt(
    'HashflowFactory',
    factoryMetadata.address,
  );

  const poolMetadata = getDeployedContractMetadata(
    'IHashflowPool',
    networkConfig.name,
  );

  if (!poolMetadata) {
    throw new Error(`Could not find IHashflowPool metadata`);
  }

  const currentPoolAddress = await factoryContract._poolImpl();

  if (currentPoolAddress.toLowerCase() !== poolMetadata.address.toLowerCase()) {
    await (await factoryContract.updatePoolImpl(poolMetadata.address)).wait();
    console.log(`Updated Pool Implementation to ${poolMetadata.address}`);
  }
});

task('router:deploy', 'Deploys the HashflowRouter').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const contractFactory =
      await hre.ethers.getContractFactory('HashflowRouter');

    const { weth } = networkConfig;

    if (!weth) {
      throw new Error(`Missing WETH address for network ${networkConfig.name}`);
    }

    const contract = await contractFactory.deploy(weth);

    await contract.waitForDeployment();

    registerDeployedContract(contract, 'IHashflowRouter', networkConfig.name);
  },
);

task('router:initialize', 'Initializes the HashflowRouter').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const factoryMetadata = getDeployedContractMetadata(
      'IHashflowFactory',
      networkConfig.name,
    );

    if (!factoryMetadata) {
      throw new Error(`Could not find IHashflowFactory metadata`);
    }

    const routerMetadata = getDeployedContractMetadata(
      'IHashflowRouter',
      networkConfig.name,
    );

    if (!routerMetadata) {
      throw new Error(`Could not find IHashflowRouter metadata`);
    }

    const routerContract = await hre.ethers.getContractAt(
      'IHashflowRouter',
      routerMetadata.address,
    );

    const tx = await routerContract.initialize(factoryMetadata.address);
    await tx.wait();

    console.log(`Initialized HashflowRouter: ${tx.hash}`);
  },
);

task(
  'wormhole-messenger:deploy',
  'Deploys the HashflowWormholeMessenger',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const contractFactory = await hre.ethers.getContractFactory(
    'HashflowWormholeMessenger',
  );

  const routerMetadata = getDeployedContractMetadata(
    'IHashflowRouter',
    networkConfig.name,
  );

  if (!routerMetadata) {
    throw new Error(`Could not find IHashflowRouter metadata`);
  }

  const contract = await contractFactory.deploy(
    networkConfig.hashflowChainId,
    routerMetadata.address,
  );

  await contract.waitForDeployment();

  registerDeployedContract(
    contract,
    'IHashflowWormholeMessenger',
    networkConfig.name,
  );
});

task(
  'wormhole-messenger:initialize:wormhole',
  'Initializes the Wormhole Endpoint',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  if (!networkConfig.wormholeEndpoint) {
    console.log(`Wormhole not defined for ${networkConfig.name}. Skipping.`);
    return;
  }

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkConfig.name,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  const tx = await messengerContract.updateWormhole(
    networkConfig.wormholeEndpoint,
  );
  await tx.wait();

  console.log(`Initialized Wormhole Endpoint: ${tx.hash}`);
});

task(
  'wormhole-messenger:initialize:consistency',
  'Initializes the Wormhole Endpoint',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  if (!networkConfig.wormholeConsistency) {
    console.log(
      `Wormhole Consistency not defined for ${networkConfig.name}. Skipping.`,
    );
    return;
  }

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkConfig.name,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  const tx = await messengerContract.updateWormholeConsistencyLevel(
    networkConfig.wormholeConsistency,
  );
  await tx.wait();

  console.log(`Initialized Wormhole Consistency: ${tx.hash}`);
});

task(
  'wormhole-messenger:initialize:fast-consistency',
  'Initializes the Wormhole Endpoint',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  if (!networkConfig.wormholeFastConsistency) {
    console.log(
      `Wormhole Fast Consistency not defined for ${networkConfig.name}. Skipping.`,
    );
    return;
  }

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkConfig.name,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  const tx = await messengerContract.updateWormholeConsistencyLevelFast(
    networkConfig.wormholeFastConsistency,
  );
  await tx.wait();

  console.log(`Initialized Wormhole Fast Consistency: ${tx.hash}`);
});

task(
  'wormhole-messenger:initialize:chain-id-mapping',
  'Initializes Hashflow <-> Wormhole Chain ID pairs for this chain and its peers',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { name: networkName } = networkConfig;

  const peerNetworksToInitialize = isHardhatMainnet(networkName)
    ? MAIN_NETWORK_NAMES
    : isHardhatTestnet(networkName)
    ? TEST_NETWORK_NAMES
    : isWormholeTestnet(networkName)
    ? WORMHOLE_NETWORK_NAMES
    : [networkName];

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkConfig.name,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  for (const peerNetworkName of peerNetworksToInitialize) {
    const peerHashflowChainId =
      HARDHAT_NETWORK_CONFIG_BY_NAME[peerNetworkName].hashflowChainId;

    const peerWormholeChainId =
      HARDHAT_NETWORK_CONFIG_BY_NAME[peerNetworkName].wormholeChainId;

    const currentWormholeChainId = Number(
      await messengerContract.hChainIdToWormholeChainId(peerHashflowChainId),
    );

    if (peerWormholeChainId && currentWormholeChainId !== peerWormholeChainId) {
      await (
        await messengerContract.updateWormholeChainIdForHashflowChainId(
          peerHashflowChainId,
          peerWormholeChainId,
        )
      ).wait();
      console.log(
        `Set Wormhole Chain ID ${peerWormholeChainId} for Hashflow Chain ID ${peerHashflowChainId}`,
      );
    } else {
      console.log(
        `Skipping Wormhole Chain ID initialization to ${peerHashflowChainId}`,
      );
    }
  }
});

task(
  'wormhole-messenger:initialize:remotes',
  'Initializes Remote Wormhole messengers',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { name: networkName } = networkConfig;

  const peerNetworksToInitialize = isHardhatMainnet(networkName)
    ? MAIN_NETWORK_NAMES
    : isHardhatTestnet(networkName)
    ? TEST_NETWORK_NAMES
    : isWormholeTestnet(networkName)
    ? WORMHOLE_NETWORK_NAMES
    : [networkName];

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkConfig.name,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  for (const peerNetworkName of peerNetworksToInitialize) {
    if (peerNetworkName === networkName) {
      continue;
    }
    const peerMessengerMetadata = getDeployedContractMetadata(
      'IHashflowWormholeMessenger',
      peerNetworkName,
    );
    if (!peerMessengerMetadata) {
      continue;
    }
    const paddedPeerMessengerAddress =
      '0x' + padAddressTo32Bytes(peerMessengerMetadata.address).toString('hex');

    const peerHashflowChainId =
      HARDHAT_NETWORK_CONFIG_BY_NAME[peerNetworkName].hashflowChainId;

    const currentRemote =
      await messengerContract.xChainRemotes(peerHashflowChainId);

    if (currentRemote.toLowerCase() !== paddedPeerMessengerAddress) {
      await (
        await messengerContract.updateXChainRemoteAddress(
          peerHashflowChainId,
          paddedPeerMessengerAddress,
        )
      ).wait();
      console.log(
        'Initialized remote',
        peerNetworkName,
        paddedPeerMessengerAddress,
      );
    } else {
      console.log(`Remote already set`, peerNetworkName);
    }
  }
});
