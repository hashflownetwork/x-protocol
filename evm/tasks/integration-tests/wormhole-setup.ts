import { task } from 'hardhat/config';
import { PublicKey } from '@solana/web3.js';

import {
  HARDHAT_NETWORK_CONFIG_BY_NAME,
  WORMHOLE1,
  WORMHOLE2,
  WORMHOLE_NETWORK_NAMES,
  padAddressTo32Bytes,
} from '../../src/utils';
import {
  SOLANA_HASHFLOW_CHAIN_ID,
  SOLANA_EMITTER_ADDRESS_BASE58,
  SOLANA_WORMHOLE_CHAIN_ID,
  SOLANA_POOL_ADDRESS_BASE58,
  EVM_POOL_ADDRESS_HEX,
  EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX,
  EVM_TEST_TOKEN_1_ADDRESS_HEX,
  EVM_TEST_TOKEN_2_ADDRESS_HEX,
  getSigners,
} from './wormhole-config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  isWormholeTestnet,
} from '../utils';

task('test:wormhole:full-setup', 'Bootstraps the entire environment').setAction(
  async (taskArgs, hre) => {
    // Deploy contracts.
    await hre.run('core:fast-forward-nonce', { targetNonce: '60' });
    await hre.run('router:deploy');
    await hre.run('factory:deploy');
    await hre.run('pool:deploy');
    await hre.run('wormhole-messenger:deploy');
    await hre.run('test:wormhole:test-tokens:deploy');

    // Initialize contracts.
    await hre.run('core:fast-forward-nonce', { targetNonce: '70' });
    await hre.run('factory:initialize');
    await hre.run('factory:initialize:pool');
    await hre.run('router:initialize');
    await hre.run('wormhole-messenger:initialize:wormhole');
    await hre.run('wormhole-messenger:initialize:consistency');
    await hre.run('wormhole-messenger:initialize:fast-consistency');
    await hre.run('wormhole-messenger:initialize:chain-id-mapping');
    await hre.run('test:wormhole-messenger:initialize:peer-networks:solana');

    await hre.run('test:wormhole-messenger:initialize:remotes');
    await hre.run('test:wormhole-messenger:initialize:remotes:solana');

    // Create Pool.
    await hre.run('test:wormhole:authorize-creator');
    await hre.run('core:fast-forward-nonce', { targetNonce: '85' });
    await hre.run('test:wormhole:create-pool');

    // Deploy Dummy X-App.
    await hre.run('test:wormhole:dummy-x-app:deploy');

    // Set up X-Chain authorization.
    await hre.run('test:wormhole:authorize-x-chain-pool');
    await hre.run('test:wormhole:authorize-x-chain-pool:solana');
    await hre.run('test:wormhole:authorize-x-chain-caller');
    await hre.run('test:wormhole:authorize-x-chain-messenger');
    await hre.run('test:wormhole:authorize-x-chain-messenger:caller');

    // Set up Funding.
    await hre.run('test:wormhole:fund-pool');
    await hre.run('test:wormhole:fund-trader');
    await hre.run('test:wormhole:set-trader-allowance');
  },
);

task(
  'test:wormhole-messenger:initialize:remotes',
  'Initializes the Messenger Remotes',
).setAction(async (taskArgs, hre) => {
  const networkConfig =
    await getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { name: networkName } = networkConfig;

  if (!isWormholeTestnet(networkName)) {
    throw new Error(`Not a Wormhole localnet.`);
  }
  const peerNetworksToInitialize = WORMHOLE_NETWORK_NAMES;

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
    const config = hre.config.networks[peerNetworkName];
    if (!config) {
      throw new Error(
        `Could not find Hardhat Config for network ${peerNetworkName}`,
      );
    }

    const peerHashflowChainId =
      HARDHAT_NETWORK_CONFIG_BY_NAME[peerNetworkName].hashflowChainId;

    // For Wormhole Local Validator networks, we expect the Messenger
    // address to be the same.
    const peerMessengerAddress = await messengerContract.getAddress();
    const peerMessengerAddressPadded =
      '0x' + padAddressTo32Bytes(peerMessengerAddress).toString('hex');

    const currentRemote =
      await messengerContract.xChainRemotes(peerHashflowChainId);

    if (
      currentRemote.toLowerCase() !== peerMessengerAddressPadded.toLowerCase()
    ) {
      await (
        await messengerContract.updateXChainRemoteAddress(
          peerHashflowChainId,
          peerMessengerAddressPadded,
        )
      ).wait();
      console.log(
        `Set Wormhole X-Chain authorization to ${peerHashflowChainId}:${peerMessengerAddressPadded}`,
      );
    } else {
      console.log(`Chain ${peerHashflowChainId} remote already set. Skipping.`);
    }
  }
});

task(
  'test:wormhole-messenger:initialize:remotes:solana',
  'Initializes the Solana Messenger Remote',
).setAction(async (taskArgs, hre) => {
  const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { name: networkName } = networkConfig;
  if (!isWormholeTestnet(networkName)) {
    throw new Error(`Not a Wormhole localnet.`);
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

  const peerHashflowChainId = SOLANA_HASHFLOW_CHAIN_ID;

  const peerMessengerAddress = new PublicKey(
    SOLANA_EMITTER_ADDRESS_BASE58,
  ).toBuffer();
  const peerMessengerAddressPadded =
    '0x' + peerMessengerAddress.toString('hex');

  const currentRemote =
    await messengerContract.xChainRemotes(peerHashflowChainId);

  if (
    currentRemote.toLowerCase() !== peerMessengerAddressPadded.toLowerCase()
  ) {
    await (
      await messengerContract.updateXChainRemoteAddress(
        peerHashflowChainId,
        peerMessengerAddressPadded,
      )
    ).wait();
    console.log(
      `Set Wormhole X-Chain authorization to ${peerHashflowChainId}:${peerMessengerAddressPadded}`,
    );
  } else {
    console.log(`Chain ${peerHashflowChainId} remote already set. Skipping.`);
  }
});

task('test:wormhole:create-pool', 'Creates a Pool For Trading').setAction(
  async (taskArgs, hre) => {
    const { name: networkName } =
      getNetworkConfigFromHardhatRuntimeEnvironment(hre);
    const { mainSigner, quoteSigner } = await getSigners(hre);

    const factoryMetadata = getDeployedContractMetadata(
      'IHashflowFactory',
      networkName,
    );

    if (!factoryMetadata) {
      throw new Error(`Could not find IHashflowFactory metadata`);
    }

    const factoryContract = await hre.ethers.getContractAt(
      'IHashflowFactory',
      factoryMetadata.address,
      mainSigner,
    );

    const createPoolEventsBefore = await factoryContract.queryFilter(
      factoryContract.filters.CreatePool(),
    );
    let pools = createPoolEventsBefore.map((evt) => evt.args.pool);

    const signer = await quoteSigner.getAddress();

    console.log('Pool signer', signer);

    if (pools.length > 0) {
      console.log('Skipping pool creation');
      return;
    }

    await (await factoryContract.createPool('Hashflow Capital', signer)).wait();

    const createPoolEventsAfter = await factoryContract.queryFilter(
      factoryContract.filters.CreatePool(),
    );

    pools = createPoolEventsAfter.map((evt) => evt.args.pool);

    if (pools.length !== 1) {
      throw new Error(`Incorrect number of pools ${pools.length}`);
    }
    const poolContractAddress = pools[0];

    if (
      poolContractAddress.toLowerCase() !== EVM_POOL_ADDRESS_HEX.toLowerCase()
    ) {
      throw new Error(`Incorrect Pool Address: ${poolContractAddress}`);
    }

    console.log(`Pool deployed to ${poolContractAddress}`);
  },
);

task(
  'test:wormhole:dummy-x-app:deploy',
  'Deploys a Dummy X-Chain App',
).setAction(async (taskArgs, hre) => {
  const contractFactory = await hre.ethers.getContractFactory('DummyXChainApp');

  const contract = await contractFactory.deploy();

  await contract.waitForDeployment();

  if (
    (await contract.getAddress()).toLowerCase() !=
    EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX.toLowerCase()
  ) {
    throw new Error(
      `Unexpected Dummy X-App address: ${await contract.getAddress()}`,
    );
  }
});

task(
  'test:wormhole-messenger:initialize:peer-networks:solana',
  'Initializes the Solana Hashflow Chain ID',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkName,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  const peerHashflowChainId = SOLANA_HASHFLOW_CHAIN_ID;

  const peerWormholeChainId = SOLANA_WORMHOLE_CHAIN_ID;

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
});

task(
  'test:wormhole-messenger:set-permissioned-relayer',
  'Sets the permissioned relayer for a target chain',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { quoteSigner } = await getSigners(hre);

  const wormholeNetworks = [WORMHOLE1, WORMHOLE2];
  const otherWormholeNetwork = wormholeNetworks.filter(
    (n) => n.name !== networkName,
  )[0];

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkName,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const messengerContract = await hre.ethers.getContractAt(
    'IHashflowWormholeMessenger',
    messengerMetadata.address,
  );

  const relayerAddressBytes32 =
    '0x' + padAddressTo32Bytes(await quoteSigner.getAddress()).toString('hex');

  const tx = await messengerContract.updatePermissionedRelayer(
    otherWormholeNetwork.hashflowChainId,
    relayerAddressBytes32,
  );

  await tx.wait();

  console.log(
    `Updated permissioned relayer to chain ${otherWormholeNetwork.hashflowChainId} to ${relayerAddressBytes32}`,
  );
});

task(
  'test:wormhole:authorize-creator',
  'Authorizes an address for creating a pool',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { mainSigner } = await getSigners(hre);

  const factoryMetadata = getDeployedContractMetadata(
    'IHashflowFactory',
    networkName,
  );

  if (!factoryMetadata) {
    throw new Error(`Could not find IHashflowFactory metadata`);
  }

  const factoryContract = await hre.ethers.getContractAt(
    'IHashflowFactory',
    factoryMetadata.address,
    mainSigner,
  );

  await (
    await factoryContract.updatePoolCreatorAuthorization(
      await mainSigner.getAddress(),
      true,
    )
  ).wait();

  console.log(`Authorized ${await mainSigner.getAddress()} to create pools`);
});

task(
  'test:wormhole:fund-pool',
  'Funds pool with Test Token 1 and Test Token 2',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { mainSigner } = await getSigners(hre);

  const poolAddress = EVM_POOL_ADDRESS_HEX;

  const tt1Contract = await hre.ethers.getContractAt(
    'TestToken1',
    EVM_TEST_TOKEN_1_ADDRESS_HEX,
    mainSigner,
  );

  const tt2Contract = await hre.ethers.getContractAt(
    'TestToken2',
    EVM_TEST_TOKEN_2_ADDRESS_HEX,
    mainSigner,
  );

  const tt1Balance = await tt1Contract.balanceOf(poolAddress);
  if (tt1Balance === BigInt(0)) {
    await (await tt1Contract.transfer(poolAddress, 1000000000)).wait();

    console.log(networkName, 'Pool funded with Test Token 1.');
  } else {
    console.log(
      networkName,
      'Pool already funded with Test Token 1. Skipping transfer.',
    );
  }

  const tt2Balance = await tt2Contract.balanceOf(poolAddress);
  if (tt2Balance === BigInt(0)) {
    await (await tt2Contract.transfer(poolAddress, 1000000000)).wait();

    console.log(networkName, 'Pool funded with Test Token 2.');
  } else {
    console.log(
      networkName,
      'Pool already funded with Test Token 2. Skipping transfer.',
    );
  }
});

task(
  'test:wormhole:authorize-x-chain-messenger',
  'Authorizes the Wormhole X-Chain Messenger',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { mainSigner } = await getSigners(hre);

  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkName,
  );

  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
  }

  const poolAddress = EVM_POOL_ADDRESS_HEX;

  const pool = await hre.ethers.getContractAt(
    'HashflowPool',
    poolAddress,
    mainSigner,
  );

  await (
    await pool.updateXChainMessengerAuthorization(
      messengerMetadata.address,
      true,
    )
  ).wait();

  console.log(
    `Authorized X-Chain Messenger ${
      messengerMetadata.address
    } for Pool ${await pool.getAddress()}`,
  );
});

task(
  'test:wormhole:authorize-x-chain-caller',
  'Authorizes an X-Chain caller.',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { mainSigner, traderSigner } = await getSigners(hre);

  if (networkName !== 'wormhole2') {
    return;
  }

  const dummyXApp = await hre.ethers.getContractAt(
    'DummyXChainApp',
    EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX,
    mainSigner,
  );

  const routerMetadata = getDeployedContractMetadata(
    'IHashflowRouter',
    networkName,
  );

  if (!routerMetadata) {
    throw new Error(`Could not find IHashflowRouter metadata.`);
  }

  await (
    await dummyXApp.authorizeXChainCaller(
      routerMetadata.address,
      WORMHOLE1.hashflowChainId,
      padAddressTo32Bytes(await traderSigner.getAddress()),
    )
  ).wait();

  console.log('X-Chain Caller authorized.');
});

task(
  'test:wormhole:authorize-x-chain-messenger:caller',
  'Authorizes an X-Chain Messenger for contract calls.',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { mainSigner } = await getSigners(hre);

  if (networkName !== 'wormhole2') {
    return;
  }

  const dummyXApp = await hre.ethers.getContractAt(
    'DummyXChainApp',
    EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX,
    mainSigner,
  );

  const routerMetadata = getDeployedContractMetadata(
    'IHashflowRouter',
    networkName,
  );
  const messengerMetadata = getDeployedContractMetadata(
    'IHashflowWormholeMessenger',
    networkName,
  );

  if (!routerMetadata) {
    throw new Error(`Could not find IHashflowRouter metadata.`);
  }
  if (!messengerMetadata) {
    throw new Error(`Could not find IHashflowWormholeMessenger metadata.`);
  }

  await (
    await dummyXApp.authorizeXChainMessengerCaller(
      routerMetadata.address,
      messengerMetadata.address,
    )
  ).wait();

  console.log('X-Chain Messenger Caller authorized.');
});

task(
  'test:wormhole:authorize-x-chain-pool',
  'Authorizes the pool for Wormhole X-Chain trading',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    await getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { mainSigner } = await getSigners(hre);

  const poolAddress = EVM_POOL_ADDRESS_HEX;
  const currentChainPoolBytes32 = padAddressTo32Bytes(poolAddress);

  const pool = await hre.ethers.getContractAt(
    'HashflowPool',
    poolAddress,
    mainSigner,
  );

  const routerMetadata = getDeployedContractMetadata(
    'IHashflowRouter',
    networkName,
  );

  if (!routerMetadata) {
    throw new Error(`Could not find IHashflowRouter metadata`);
  }

  const routerContract = await hre.ethers.getContractAt(
    'IHashflowRouter',
    routerMetadata.address,
    mainSigner,
  );

  const wormholeNetworks = [WORMHOLE1, WORMHOLE2];

  for (const wormholeNetwork of wormholeNetworks) {
    if (wormholeNetwork.name !== networkName) {
      const peerPoolBytes32 = padAddressTo32Bytes(EVM_POOL_ADDRESS_HEX);

      const existingAuth = await routerContract.authorizedXChainPools(
        currentChainPoolBytes32,
        wormholeNetwork.hashflowChainId,
        peerPoolBytes32,
      );

      if (!existingAuth) {
        await (
          await pool.updateXChainPoolAuthorization(
            [
              {
                chainId: wormholeNetwork.hashflowChainId,
                pool: peerPoolBytes32,
              },
            ],
            true,
          )
        ).wait();
        console.log(
          networkName,
          `Authorized pool ${peerPoolBytes32.toString('hex')} on ${
            wormholeNetwork.hashflowChainId
          }`,
        );
      } else {
        console.log(networkName, 'Pool already authorized.');
      }
    }
  }
});

task(
  'test:wormhole:authorize-x-chain-pool:solana',
  'Authorizes the Solana Pool for Wormhole X-Chain trading',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);
  const { mainSigner } = await getSigners(hre);

  const poolAddress = EVM_POOL_ADDRESS_HEX;
  const currentChainPoolBytes32 = padAddressTo32Bytes(poolAddress);

  const pool = await hre.ethers.getContractAt(
    'HashflowPool',
    poolAddress,
    mainSigner,
  );

  const routerMetadata = getDeployedContractMetadata(
    'IHashflowRouter',
    networkName,
  );

  if (!routerMetadata) {
    throw new Error(`Could not find IHashflowRouter metadata`);
  }

  const routerContract = await hre.ethers.getContractAt(
    'IHashflowRouter',
    routerMetadata.address,
    mainSigner,
  );

  const peerPoolBytes32 = new PublicKey(SOLANA_POOL_ADDRESS_BASE58).toBuffer();

  const existingAuth = await routerContract.authorizedXChainPools(
    currentChainPoolBytes32,
    SOLANA_HASHFLOW_CHAIN_ID,
    peerPoolBytes32,
  );

  if (!existingAuth) {
    await (
      await pool.updateXChainPoolAuthorization(
        [
          {
            chainId: SOLANA_HASHFLOW_CHAIN_ID,
            pool: peerPoolBytes32,
          },
        ],
        true,
      )
    ).wait();
    console.log(
      networkName,
      `Authorized pool ${peerPoolBytes32.toString(
        'hex',
      )} on ${SOLANA_HASHFLOW_CHAIN_ID}`,
    );
  } else {
    console.log(networkName, 'Pool already authorized.');
  }
});

task(
  'test:wormhole:fund-trader',
  'Funds account used by trader to swap',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { traderSigner, mainSigner } = await getSigners(hre);
  const trader = await traderSigner.getAddress();

  const tt1Contract = await hre.ethers.getContractAt(
    'TestToken1',
    EVM_TEST_TOKEN_1_ADDRESS_HEX,
    mainSigner,
  );

  const tt2Contract = await hre.ethers.getContractAt(
    'TestToken2',
    EVM_TEST_TOKEN_2_ADDRESS_HEX,
    mainSigner,
  );

  const traderBalance = await traderSigner.provider?.getBalance(trader);

  if (traderBalance === BigInt(0)) {
    const tx = {
      to: trader,
      value: BigInt(10) ** BigInt(18),
    };

    await (await mainSigner.sendTransaction(tx)).wait();

    console.log(`Sent 10 ETH to ${trader}`);
  } else {
    console.log('Trader has already been funded with ETH.');
  }

  if ((await tt1Contract.balanceOf(trader)) === BigInt(0)) {
    await (await tt1Contract.transfer(trader, 1000000000)).wait();
    console.log(networkName, 'Transferred Test Token 1 to trader');
  } else {
    console.log(networkName, 'Trader already has Test Token 1');
  }

  if ((await tt2Contract.balanceOf(trader)) === BigInt(0)) {
    await (await tt2Contract.transfer(trader, 1000000000)).wait();
    console.log(networkName, 'Transferred Test Token 2 to trader');
  } else {
    console.log(networkName, 'Trader already has Test Token 2');
  }
});

task(
  'test:wormhole:set-trader-allowance',
  'Sets Test Token allowance to the Router',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  const { traderSigner } = await getSigners(hre);
  const trader = await traderSigner.getAddress();

  const tt1Contract = await hre.ethers.getContractAt(
    'TestToken1',
    EVM_TEST_TOKEN_1_ADDRESS_HEX,
    traderSigner,
  );

  const tt2Contract = await hre.ethers.getContractAt(
    'TestToken2',
    EVM_TEST_TOKEN_2_ADDRESS_HEX,
    traderSigner,
  );

  const routerMetadata = getDeployedContractMetadata(
    'IHashflowRouter',
    networkName,
  );

  if (!routerMetadata) {
    throw new Error(`Could not find IHashflowRouter metadata`);
  }

  const tt1Allowance = await tt1Contract.allowance(
    trader,
    routerMetadata.address,
  );
  const tt2Allowance = await tt2Contract.allowance(
    trader,
    routerMetadata.address,
  );

  if (tt1Allowance === BigInt(0)) {
    await (
      await tt1Contract.approve(routerMetadata.address, 1000000000000)
    ).wait();
    console.log(networkName, `Approved Test Token 1`);
  } else {
    console.log('Test Token 1 allowance already set.');
  }

  if (tt2Allowance === BigInt(0)) {
    await (
      await tt2Contract.approve(routerMetadata.address, 1000000000000)
    ).wait();
    console.log(networkName, `Approved Test Token 2`);
  } else {
    console.log('Test Token 2 allowance already set.');
  }
});

task(
  'test:wormhole:test-tokens:deploy',
  'Deploys the test ERC-20 tokens',
).setAction(async (taskArgs, hre) => {
  const contractFactoryTT1 = await hre.ethers.getContractFactory('TestToken1');

  const contractFactoryTT2 = await hre.ethers.getContractFactory('TestToken2');

  const contractTT1 = await contractFactoryTT1.deploy(1000000000000);
  await contractTT1.waitForDeployment();

  const contractTT2 = await contractFactoryTT2.deploy(1000000000000);
  await contractTT2.waitForDeployment();

  if (
    (await contractTT1.getAddress()).toLowerCase() !==
    EVM_TEST_TOKEN_1_ADDRESS_HEX.toLowerCase()
  ) {
    throw new Error(
      `Incorrect Test Token 1 address ${await contractTT1.getAddress()}`,
    );
  }

  if (
    (await contractTT2.getAddress()).toLowerCase() !==
    EVM_TEST_TOKEN_2_ADDRESS_HEX.toLowerCase()
  ) {
    throw new Error(
      `Incorrect Test Token 2 address ${await contractTT2.getAddress()}`,
    );
  }
});
