import '@nomicfoundation/hardhat-toolbox';
import { task } from 'hardhat/config';
import {
  ETHEREUM,
  POLYGON,
  padAddressTo32Bytes,
  sendETH,
  ZERO_ADDRESS,
} from '../../src/utils';
import { IERC20__factory, IHashflowPool__factory } from '../../types';
import { XChainQuoteData, signQuoteXChain } from '../../test/utils';
import { keccak256 } from 'ethers';

const AAVE_POOL_ADDRESS = {
  1: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
  137: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
} as const;
const AAVE_ACL_MANAGER_ADDRESS = {
  1: '0xc2aaCf6553D20d1e9d78E365AAba8032af9c85b0',
  137: '0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B',
} as const;
const AAVE_ADMIN_ADDRESS = {
  1: '0xee56e2b3d491590b5b31738cc34d5232f378a8d5',
  137: '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772',
} as const;
const PORTAL_ADDRESS = {
  1: '0xfaE849108F2A63Abe3BaB17E21Be077d07e7a9A2',
  137: '0xEa57Cb09D2E57440Fb27BB235159EE2E961142eb',
} as const;
const ROUTER_ADDRESS = {
  1: '0x4ea0Be853219be8C9cE27200Bdeee36881612FF2',
  137: '0x0c8A72d89AA40B71Ee5F430E89E1681f944DAAc0',
} as const;
const MESSENGER_ADDRESS = {
  1: '0x46d4674578a2daBbD0CEAB0500c6c7867999db34',
  137: '0xC2100780F828810bAaeCD3039111006E12B26CF8',
} as const;
const POOL_ADDRESS = {
  1: '0xa635fD1c2e67d2e6551b3037699DF2AB5B8Dba09',
  137: '0xcDA39537971E7203C0486957de43c7Fd83AE06b2',
} as const;
const USDC_ADDRESS = {
  1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
};
const USDC_OWNER_ADDRESS = {
  1: '0xf976d0d0464725157933d94E14Abe548aB5709B6',
  137: '0x43ff6965250df51415b88f0438b45edfcfe34276',
};
const WORMHOLE_ADDRESS = {
  1: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  137: '0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7',
};
const ATOKEN_ADDRESS = {
  1: '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c',
  137: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
};

const ACCOUNT_WITH_POSITION = '0xE8bc44AE4bA6EDDB88C8c087fD9b479Dff729850';

task(
  'aave:bootstrap-contracts',
  'Bootstraps Core Protocol and Portal contracts',
).setAction(async (taskArgs, hre) => {
  const { chainId } = await hre.ethers.provider.getNetwork();

  console.log('Chain ID', chainId);

  if (chainId !== BigInt(1)) {
    throw new Error(`Invalid chain ID ${chainId}`);
  }

  const factoryFactory = await hre.ethers.getContractFactory('HashflowFactory');
  const poolImplFactory = await hre.ethers.getContractFactory('HashflowPool');
  const routerFactory = await hre.ethers.getContractFactory('TestRouter');
  const messengerFactory = await hre.ethers.getContractFactory(
    'HashflowWormholeMessenger',
  );
  const portalFactory =
    await hre.ethers.getContractFactory('HashflowAavePortal');

  const expectedRouterAddress = ROUTER_ADDRESS[ETHEREUM.chainId];
  const expectedMessengerAddress = MESSENGER_ADDRESS[ETHEREUM.chainId];
  const expectedPortalAddress = PORTAL_ADDRESS[ETHEREUM.chainId];
  const expectedPoolAddress = POOL_ADDRESS[ETHEREUM.chainId];

  const factory = await factoryFactory.deploy();

  const poolImpl = await poolImplFactory.deploy(ETHEREUM.weth);

  const router = await routerFactory.deploy(ETHEREUM.weth);

  if (
    (await router.getAddress()).toLowerCase() !==
    expectedRouterAddress.toLowerCase()
  ) {
    throw new Error(
      `Expected Router address ${expectedRouterAddress} got ${await router.getAddress()}`,
    );
  }

  const messenger = await messengerFactory.deploy(
    ETHEREUM.hashflowChainId,
    await router.getAddress(),
  );

  if (
    (await messenger.getAddress()).toLowerCase() !==
    expectedMessengerAddress.toLowerCase()
  ) {
    throw new Error(
      `Expected Messenger address ${expectedMessengerAddress} got ${await messenger.getAddress()}`,
    );
  }

  await factory.initialize(await router.getAddress());
  await router.initialize(await factory.getAddress());
  await factory.updatePoolImpl(await poolImpl.getAddress());

  await messenger.updateWormholeChainIdForHashflowChainId(
    POLYGON.hashflowChainId,
    POLYGON.wormholeChainId,
  );

  const portal = await portalFactory.deploy(
    AAVE_POOL_ADDRESS[ETHEREUM.chainId],
    await router.getAddress(),
    await messenger.getAddress(),
  );

  if (
    (await portal.getAddress()).toLowerCase() !==
    expectedPortalAddress.toLowerCase()
  ) {
    throw new Error(
      `Expected Portal address ${expectedPortalAddress} got ${await portal.getAddress()}`,
    );
  }

  await portal.updateRemotePortal(
    POLYGON.hashflowChainId,
    PORTAL_ADDRESS[POLYGON.chainId],
  );

  const signers = await hre.ethers.getSigners();

  await factory.updatePoolCreatorAuthorization(signers[0].address, true);
  const transaction = await factory.createPool(
    'Test AAVE Portal',
    signers[0].address,
  );

  if (!transaction.blockNumber) {
    throw new Error(`Could not resolve transaction block number.`);
  }

  const filter = factory.filters.CreatePool();

  const events = await factory.queryFilter(
    filter,
    transaction.blockNumber,
    transaction.blockNumber,
  );

  if (events.length !== 1) {
    throw new Error('Incorrect number of events.');
  }

  const poolAddress = events[0].args.pool;
  if (poolAddress.toLowerCase() !== expectedPoolAddress.toLowerCase()) {
    throw new Error(
      `Expected Pool address ${expectedPoolAddress} got ${poolAddress}`,
    );
  }

  const pool = IHashflowPool__factory.connect(poolAddress, signers[0]);
  await pool.updateXChainMessengerAuthorization(
    await messenger.getAddress(),
    true,
  );
  await pool.updateXChainPoolAuthorization(
    [
      {
        chainId: POLYGON.hashflowChainId,
        pool:
          '0x' +
          padAddressTo32Bytes(POOL_ADDRESS[POLYGON.chainId]).toString('hex'),
      },
    ],
    true,
  );

  const usdcImpersonator = await hre.ethers.getImpersonatedSigner(
    USDC_OWNER_ADDRESS[ETHEREUM.chainId],
  );

  const usdcToken = IERC20__factory.connect(
    USDC_ADDRESS[ETHEREUM.chainId],
    usdcImpersonator,
  );

  await usdcToken.transfer(await pool.getAddress(), '1000000', {
    gasLimit: BigInt(200_000),
  });

  const aaveAdminImpersonator = await hre.ethers.getImpersonatedSigner(
    AAVE_ADMIN_ADDRESS[ETHEREUM.chainId],
  );
  const aaveAclManager = await hre.ethers.getContractAt(
    'IACLManager',
    AAVE_ACL_MANAGER_ADDRESS[ETHEREUM.chainId],
    aaveAdminImpersonator,
  );

  await sendETH(
    signers[0],
    '1000000000000000000',
    aaveAdminImpersonator.address,
  );

  await aaveAclManager.addBridge(await portal.getAddress(), {
    gasLimit: BigInt(200_000),
  });

  const aavePoolConfigurator = await hre.ethers.getContractAt(
    'IPoolConfigurator',
    '0x64b761D848206f447Fe2dd461b0c635Ec39EbB27',
    aaveAdminImpersonator,
  );

  await aavePoolConfigurator.setUnbackedMintCap(
    USDC_ADDRESS[ETHEREUM.chainId],
    '1000000000',
    {
      gasLimit: BigInt(200_000),
    },
  );

  await messenger.updateWormhole(WORMHOLE_ADDRESS[ETHEREUM.chainId]);
  await messenger.updateWormholeConsistencyLevel(1);
  await messenger.updateXChainRemoteAddress(
    POLYGON.hashflowChainId,
    '0x' +
      padAddressTo32Bytes(MESSENGER_ADDRESS[POLYGON.chainId]).toString('hex'),
  );

  await sendETH(signers[0], '1000000000000000000', await router.getAddress());
});

task('aave:check-position', 'Checks AAVE position').setAction(
  async (taskArgs, hre) => {
    const { chainId: chainIdBigInt } = await hre.ethers.provider.getNetwork();

    const chainId = Number(chainIdBigInt);
    console.log('Chain ID', chainId);

    if (chainId !== 1) {
      throw new Error(`Invalid chain ID ${chainId}`);
    }
    const aToken = await hre.ethers.getContractAt(
      'IAToken',
      ATOKEN_ADDRESS[chainId],
    );

    const unscaledBalance = await aToken.balanceOf(ACCOUNT_WITH_POSITION);

    console.log('Balance', unscaledBalance.toString());
  },
);

task('aave:source-leg', 'Runs the X-Chain trade on source chain').setAction(
  async (taskArgs, hre) => {
    const { chainId: chainIdBigInt } = await hre.ethers.provider.getNetwork();

    const chainId = Number(chainIdBigInt);
    console.log('Chain ID', chainId);

    if (chainId !== ETHEREUM.chainId) {
      throw new Error(`Invalid chain ID ${chainId}`);
    }

    const signers = await hre.ethers.getSigners();

    const positionImpersonator = await hre.ethers.getImpersonatedSigner(
      ACCOUNT_WITH_POSITION,
    );

    const aToken = await hre.ethers.getContractAt(
      'IAToken',
      '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c',
      positionImpersonator,
    );

    await aToken.approve(PORTAL_ADDRESS[ETHEREUM.chainId], '100000000000');

    const txid = getTxid();

    const xChainQuoteData: XChainQuoteData = {
      srcChainId: ETHEREUM.hashflowChainId,
      dstChainId: POLYGON.hashflowChainId,
      srcPool: POOL_ADDRESS[ETHEREUM.chainId],
      dstPool:
        '0x' +
        padAddressTo32Bytes(POOL_ADDRESS[POLYGON.chainId]).toString('hex'),
      srcExternalAccount: ZERO_ADDRESS,
      dstExternalAccount:
        '0x' + padAddressTo32Bytes(ZERO_ADDRESS).toString('hex'),
      dstTrader:
        '0x' +
        padAddressTo32Bytes(PORTAL_ADDRESS[POLYGON.chainId]).toString('hex'),
      baseToken: USDC_ADDRESS[ETHEREUM.chainId],
      quoteToken:
        '0x' +
        padAddressTo32Bytes(USDC_ADDRESS[POLYGON.chainId]).toString('hex'),
      effectiveBaseTokenAmount: BigInt('1000000'),
      baseTokenAmount: BigInt('1000000'),
      quoteTokenAmount: BigInt('1000000'),
      quoteExpiry: Math.floor(Date.now() / 1000) + 300,
      nonce: Math.floor(Date.now() / 1000),
      txid,
      xChainMessenger: MESSENGER_ADDRESS[ETHEREUM.chainId],
    };

    const signature = await signQuoteXChain(xChainQuoteData, signers[0]);

    const portal = await hre.ethers.getContractAt(
      'HashflowAavePortal',
      PORTAL_ADDRESS[ETHEREUM.chainId],
      positionImpersonator,
    );

    const usdc = IERC20__factory.connect(
      USDC_ADDRESS[ETHEREUM.chainId],
      signers[0],
    );

    console.log(
      'Pool USDC balance before transfer',
      (await usdc.balanceOf(POOL_ADDRESS[ETHEREUM.chainId])).toString(),
    );

    console.log(
      'Portal USDC balance before transfer',
      (await usdc.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
    );

    console.log(
      'Portal aUSDC balance before transfer',
      (await aToken.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
    );

    console.log(
      'User aUSDC balance before transfer',
      (await aToken.balanceOf(ACCOUNT_WITH_POSITION)).toString(),
    );

    const transaction = await portal.transferAssetPosition(
      { ...xChainQuoteData, signature },
      xChainQuoteData.baseTokenAmount,
      ACCOUNT_WITH_POSITION,
    );

    if (!transaction.blockNumber) {
      throw new Error(`Could not resolve transaction block number.`);
    }

    console.log(
      'Pool USDC balance after transfer',
      (await usdc.balanceOf(POOL_ADDRESS[ETHEREUM.chainId])).toString(),
    );

    console.log(
      'Portal USDC balance after transfer',
      (await usdc.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
    );

    console.log(
      'Portal aUSDC balance after transfer',
      (await aToken.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
    );

    console.log(
      'User aUSDC balance after transfer',
      (await aToken.balanceOf(ACCOUNT_WITH_POSITION)).toString(),
    );

    const filter = portal.filters.TransferAssetPosition();

    const events = await portal.queryFilter(
      filter,
      transaction.blockNumber,
      transaction.blockNumber,
    );

    if (events.length !== 1) {
      throw new Error(`Invalid number of events.`);
    }
    const event = events[0];

    console.log('Event asset', event.args.asset);
    console.log('Event destination asset', event.args.dstAsset);
    console.log('Event dst chain ID', event.args.dstHashflowChainId);
    console.log('Event target', event.args.target);
    console.log('Event asset amount', event.args.amount.toString());
    console.log('Event dst asset amount', event.args.dstAmount.toString());
    console.log('Event aToken', event.args.aToken);
    console.log('Event txid', event.args.txid);
    console.log('Event dstContract', event.args.dstContract);
    console.log('Event dstCalldata', event.args.dstCalldata);
  },
);

task(
  'aave:destination-leg',
  'Runs the X-Chain trade on the destination chain',
).setAction(async (taskArgs, hre) => {
  const { chainId: chainIdBigInt } = await hre.ethers.provider.getNetwork();

  const chainId = Number(chainIdBigInt);
  console.log('Chain ID', chainId);

  if (chainId !== ETHEREUM.chainId) {
    throw new Error(`Invalid chain ID ${chainId}`);
  }

  const positionImpersonator = await hre.ethers.getImpersonatedSigner(
    ACCOUNT_WITH_POSITION,
  );

  const aToken = await hre.ethers.getContractAt(
    'IAToken',
    '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c',
    positionImpersonator,
  );

  const usdcImpersonator = await hre.ethers.getImpersonatedSigner(
    USDC_OWNER_ADDRESS[chainId],
  );

  const usdc = IERC20__factory.connect(USDC_ADDRESS[chainId], usdcImpersonator);

  await usdc.transfer(PORTAL_ADDRESS[chainId], '1000000', {
    gasLimit: 200_000,
  });

  const routerImpersonator = await hre.ethers.getImpersonatedSigner(
    ROUTER_ADDRESS[chainId],
  );

  console.log(
    'Pool USDC balance before transfer',
    (await usdc.balanceOf(POOL_ADDRESS[ETHEREUM.chainId])).toString(),
  );

  console.log(
    'Portal USDC balance before transfer',
    (await usdc.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
  );

  console.log(
    'Portal aUSDC balance before transfer',
    (await aToken.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
  );

  console.log(
    'User aUSDC balance before transfer',
    (await aToken.balanceOf(ACCOUNT_WITH_POSITION)).toString(),
  );

  await routerImpersonator.sendTransaction({
    from: await routerImpersonator.getAddress(),
    to: PORTAL_ADDRESS[chainId],
    data: '0x6b2148f5000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000e8bc44ae4ba6eddb88c8c087fd9b479dff729850acd0c377fe36d5b209125185bc3ac41155ed1bf7103ef9f0c2aff4320460b6df',
    value: '0',
    nonce: await routerImpersonator.getNonce(),
    gasLimit: '500000',
    gasPrice: '100000000000',
    type: 0,
  });

  console.log(
    'Pool USDC balance after transfer',
    (await usdc.balanceOf(POOL_ADDRESS[ETHEREUM.chainId])).toString(),
  );

  console.log(
    'Portal USDC balance after transfer',
    (await usdc.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
  );

  console.log(
    'Portal aUSDC balance after transfer',
    (await aToken.balanceOf(PORTAL_ADDRESS[ETHEREUM.chainId])).toString(),
  );

  console.log(
    'User aUSDC balance after transfer',
    (await aToken.balanceOf(ACCOUNT_WITH_POSITION)).toString(),
  );
});

function getTxid(): string {
  return (
    '0x' +
    Buffer.from(keccak256(Buffer.from(`abcdef`)).slice(2), 'hex').toString(
      'hex',
    )
  );
}
