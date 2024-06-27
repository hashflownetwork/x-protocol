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
import * as anchor from '@coral-xyz/anchor';
import { HASHFLOW_PROGRAM_ADDRESS } from '@hashflow/contracts-solana';
import { PublicKey } from '@solana/web3.js';

task('usdc-usdt:deploy', 'Deploys test USDC / USDT').setAction(
  async (taskArgs, hre) => {
    const usdcFactory = await hre.ethers.getContractFactory('USDC');
    const usdc = await usdcFactory.deploy('1000000000000000');
    await usdc.waitForDeployment();

    console.log(`Deployed USDC to ${await usdc.getAddress()}`);

    const usdtFactory = await hre.ethers.getContractFactory('USDT');
    const usdt = await usdtFactory.deploy('1000000000000000');
    await usdt.waitForDeployment();

    console.log(`Deployed USDT to ${await usdt.getAddress()}`);
  },
);

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

task(
  'wormhole-messenger:initialize:chain-id-mapping:solana',
  'Initializes Hashflow <-> Wormhole Chain ID pairs for this chain and its peers',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  if (
    !isHardhatMainnet(networkConfig.name) &&
    !isHardhatTestnet(networkConfig.name)
  ) {
    throw new Error(`Incorrect network`);
  }

  const solanaCluster = isHardhatMainnet(networkConfig.name)
    ? 'mainnet'
    : 'devnet';

  const hashflowChainId = solanaCluster === 'mainnet' ? 20 : 100;

  const wormholeChainId = 1;

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

  const currentWormholeChainId = Number(
    await messengerContract.hChainIdToWormholeChainId(hashflowChainId),
  );

  if (currentWormholeChainId !== wormholeChainId) {
    const tx = await messengerContract.updateWormholeChainIdForHashflowChainId(
      hashflowChainId,
      wormholeChainId,
    );

    await tx.wait();
    console.log(
      `Set Wormhole Chain ID ${wormholeChainId} for Solana Hashflow Chain ID ${hashflowChainId}: ${tx.hash}`,
    );
  } else {
    console.log(
      `Wormhole Chain ID ${wormholeChainId} already initialized for Solana Hashflow Chain ID ${hashflowChainId}`,
    );
  }
});

task(
  'wormhole-messenger:initialize:remotes:solana',
  'Initializes Remote Wormhole messengers',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  if (
    !isHardhatMainnet(networkConfig.name) &&
    !isHardhatTestnet(networkConfig.name)
  ) {
    throw new Error(`Incorrect network`);
  }

  const solanaCluster = isHardhatMainnet(networkConfig.name)
    ? 'mainnet'
    : 'devnet';

  const hashflowProgramAddress = HASHFLOW_PROGRAM_ADDRESS[solanaCluster];

  if (!hashflowProgramAddress) {
    throw new Error(`Hashflow not deployed on cluster`);
  }

  const hashflowProgramPublicKey = new PublicKey(hashflowProgramAddress);

  const [emitterPDA] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('emitter')],
    hashflowProgramPublicKey,
  );

  const emitterAddressHex = `0x${Buffer.from(emitterPDA.toBytes())
    .toString('hex')
    .toLowerCase()}`;

  const hashflowChainId = solanaCluster === 'mainnet' ? 20 : 100;

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

  const currentRemote = await messengerContract.xChainRemotes(hashflowChainId);

  if (currentRemote.toLowerCase() !== emitterAddressHex) {
    const tx = await messengerContract.updateXChainRemoteAddress(
      hashflowChainId,
      emitterPDA.toBytes(),
    );

    await tx.wait();

    console.log(`Initialized Solana Remote`, tx.hash);
  } else {
    console.log('Solana remote already initialized');
  }
});

task(
  'wormhole-messenger:initialize:fast-relayer:evm',
  'Initializes Fast Relayer on target EVM chain',
)
  .addParam('dstHashflowChainId', 'Destination Hashflow Chain ID')
  .addParam('relayerAddress', 'Relayer Address')
  .setAction(async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

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

    const dstHashflowChainId = Number(taskArgs.dstHashflowChainId);
    const relayerAddress = taskArgs.relayerAddress;

    const relayerAddressPadded = `0x${padAddressTo32Bytes(relayerAddress)
      .toString('hex')
      .toLowerCase()}`;

    const wormholeChainId =
      await messengerContract.hChainIdToWormholeChainId(dstHashflowChainId);

    if (wormholeChainId !== BigInt(0)) {
      const existingFastRelayer =
        await messengerContract.permissionedRelayers(dstHashflowChainId);

      if (
        existingFastRelayer.toLowerCase() !== relayerAddressPadded.toLowerCase()
      ) {
        const tx = await messengerContract.updatePermissionedRelayer(
          dstHashflowChainId,
          relayerAddressPadded,
        );

        await tx.wait();

        console.log(
          `Set relayer to ${relayerAddress} for Hashflow Chain ID ${dstHashflowChainId}: ${tx.hash}`,
        );
      } else {
        console.log(`Fast relayer already set`);
      }
    }
  });

task(
  'wormhole-messenger:initialize:fast-relayer:solana',
  'Initializes Fast Relayer on target EVM chain',
)
  .addParam('relayerAddress', 'Relayer Address')
  .setAction(async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    if (
      !isHardhatMainnet(networkConfig.name) &&
      !isHardhatTestnet(networkConfig.name)
    ) {
      throw new Error(`Incorrect network`);
    }
    const solanaCluster = isHardhatMainnet(networkConfig.name)
      ? 'mainnet'
      : 'devnet';

    const hashflowChainId = solanaCluster === 'mainnet' ? 20 : 100;

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

    const relayerAddress = new PublicKey(taskArgs.relayerAddress);

    const relayerAddressHex = `0x${Buffer.from(relayerAddress.toBytes())
      .toString('hex')
      .toLowerCase()}`;

    const wormholeChainId =
      await messengerContract.hChainIdToWormholeChainId(hashflowChainId);

    if (wormholeChainId !== BigInt(0)) {
      const existingFastRelayer =
        await messengerContract.permissionedRelayers(hashflowChainId);

      if (
        existingFastRelayer.toLowerCase() !== relayerAddressHex.toLowerCase()
      ) {
        const tx = await messengerContract.updatePermissionedRelayer(
          hashflowChainId,
          relayerAddressHex,
        );

        await tx.wait();

        console.log(
          `Set relayer to ${relayerAddress} for Hashflow Chain ID ${hashflowChainId}: ${tx.hash}`,
        );
      } else {
        console.log(`Fast relayer already set`);
      }
    }
  });
