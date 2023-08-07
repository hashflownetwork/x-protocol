import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expandTo18Decimals } from './utils';

import {
  HashflowRouter,
  HashflowFactory,
  TestToken1,
  TestToken2,
  LZEndpointMock,
  HashflowPool,
  WETH9,
  IHashflowXChainMessenger,
} from '../types/index';

export class ContractFactory {
  static async deployContracts(): Promise<Contracts> {
    const signers = await ethers.getSigners();

    const lzEndpointMock = await ethers.getContractFactory('LZEndpointMock');

    const hashflowFactory = await ethers.getContractFactory('HashflowFactory');
    const hashflowXChainMessengerFactory = await ethers.getContractFactory(
      'HashflowLayerZeroMessenger'
    );
    const hashflowRouter = await ethers.getContractFactory('HashflowRouter');
    const hashflowPool = await ethers.getContractFactory('HashflowPool');
    const hashflowWeth = await ethers.getContractFactory('WETH9');

    const testToken1 = await ethers.getContractFactory('TestToken1');
    const testToken2 = await ethers.getContractFactory('TestToken2');

    const weth = await hashflowWeth.deploy();

    const lzEndpoint = await lzEndpointMock.deploy(5555);

    const router = await hashflowRouter.deploy(await weth.getAddress());

    const factory = await hashflowFactory.deploy();

    await router.initialize(await factory.getAddress());
    await factory.initialize(await router.getAddress());

    const xChainMessenger = await hashflowXChainMessengerFactory.deploy(
      1,
      await router.getAddress()
    );

    const poolImpl = await hashflowPool.deploy(await weth.getAddress());

    const tt1 = await testToken1.deploy(expandTo18Decimals(100000000));
    const tt2 = await testToken2.deploy(expandTo18Decimals(100000000));

    await factory.updatePoolImpl(await poolImpl.getAddress());

    await lzEndpoint.setDestLzEndpoint(
      await xChainMessenger.getAddress(),
      await lzEndpoint.getAddress()
    );
    await xChainMessenger.updateXChainRemoteAddress(
      1,
      await xChainMessenger.getAddress()
    );
    await xChainMessenger.updateLzChainIdForHashflowChainId(1, 5555);
    await xChainMessenger.updateLzEndpoint(await lzEndpoint.getAddress());
    await xChainMessenger.updateLzGasEstimate(100_000);

    // Mint to the trader,
    await tt1.connect(signers[3]).mint(expandTo18Decimals(100));
    await tt2.connect(signers[3]).mint(expandTo18Decimals(100));

    // Mint to the effectiveTrader.,
    await tt1.connect(signers[4]).mint(expandTo18Decimals(100));
    await tt2.connect(signers[4]).mint(expandTo18Decimals(100));

    // Mint to the market maker externalAccount.
    await tt1.connect(signers[5]).mint(expandTo18Decimals(100));
    await tt2.connect(signers[5]).mint(expandTo18Decimals(100));
    await tt1.connect(signers[6]).mint(expandTo18Decimals(100));
    await tt2.connect(signers[6]).mint(expandTo18Decimals(100));

    return new Contracts(
      signers,
      factory,
      xChainMessenger,
      router,
      poolImpl,
      lzEndpoint,
      tt1,
      tt2,
      weth
    );
  }
}

export class Contracts {
  signers: SignerWithAddress[];
  factory: HashflowFactory;
  xChainMessenger: IHashflowXChainMessenger;
  router: HashflowRouter;
  poolImpl: HashflowPool;
  lzEndpoint: LZEndpointMock;
  tt1: TestToken1;
  tt2: TestToken2;
  weth: WETH9;

  owner: string;
  signer: string;
  trader: string;
  effectiveTrader: string;
  mmExternalAccount: string;
  mmExternalAccount2: string;

  constructor(
    signers: SignerWithAddress[],
    factory: HashflowFactory,
    xChainMessenger: IHashflowXChainMessenger,
    router: HashflowRouter,
    poolImpl: HashflowPool,
    lzEndpoint: LZEndpointMock,
    tt1: TestToken1,
    tt2: TestToken2,
    weth: WETH9
  ) {
    this.signers = signers;
    this.factory = factory;
    this.xChainMessenger = xChainMessenger;
    this.lzEndpoint = lzEndpoint;
    this.router = router;
    this.poolImpl = poolImpl;
    this.tt1 = tt1;
    this.tt2 = tt2;
    this.weth = weth;

    this.owner = this.signers[0].address;
    this.signer = this.signers[2].address;
    this.trader = this.signers[3].address;
    this.effectiveTrader = this.signers[4].address;
    this.mmExternalAccount = this.signers[5].address;
    this.mmExternalAccount2 = this.signers[6].address;
  }
}
