import { expect } from 'chai';
import { ethers } from 'hardhat';
import { hashMessage, sendETH } from './utils';
import {
  expandTo18Decimals,
  XChainQuoteData,
  signQuoteXChain,
  signQuoteXChainRFQMTaker,
  signQuoteXChainRFQMMaker,
  XChainRFQMQuoteData,
  signERC20Permit,
  padAddressTo32Bytes,
  ZERO_ADDRESS,
} from './utils';
import { HashflowPool, IHashflowLayerZeroMessenger } from '../types/index';
import { Contracts, ContractFactory } from './contracts';

const eth = ZERO_ADDRESS;

let contracts: Contracts;
let privPoolAddress1: string;
let privPoolAddress2: string;
let privPoolContract1: HashflowPool;
let privPoolContract2: HashflowPool;

describe('X-Chain', () => {
  before(async () => {
    contracts = await ContractFactory.deployContracts();
    const { factory, owner, signer, tt1, tt2, signers } = contracts;
    await factory.updatePoolCreatorAuthorization(owner, true);
    await factory.createPool('Hash Capital 1', signer);
    await factory.createPool('Hash Capital 2', signer);
    const createPoolEvents = await factory.queryFilter(
      factory.filters.CreatePool(),
    );
    const pools = createPoolEvents
      .filter((evt) => evt.args.operations === owner)
      .map((evt) => evt.args.pool);
    privPoolAddress1 = pools[0];
    privPoolAddress2 = pools[1];

    privPoolContract1 = await ethers.getContractAt(
      'HashflowPool',
      privPoolAddress1,
    );
    privPoolContract2 = await ethers.getContractAt(
      'HashflowPool',
      privPoolAddress2,
    );

    await sendETH(signers[0], expandTo18Decimals(10), privPoolAddress1);
    await sendETH(signers[0], expandTo18Decimals(10), privPoolAddress2);

    await tt1.transfer(privPoolAddress1, expandTo18Decimals(10));
    await tt1.transfer(privPoolAddress2, expandTo18Decimals(10));

    await tt2.transfer(privPoolAddress1, expandTo18Decimals(10));
    await tt2.transfer(privPoolAddress2, expandTo18Decimals(10));
  });

  describe('Trade', async () => {
    it('should trade x-chain', async () => {
      const { router, signers, trader, tt1, xChainMessenger, lzEndpoint } =
        contracts;
      const traderRouter = router.connect(signers[3]);

      const latestBlock = await ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const txid1 = hashMessage('dgsgevav');
      const quote1: XChainQuoteData = {
        srcChainId: 1,
        dstChainId: 1,
        srcPool: privPoolAddress1,
        dstPool: '0x' + padAddressTo32Bytes(privPoolAddress2).toString('hex'),
        srcExternalAccount: ZERO_ADDRESS,
        dstExternalAccount:
          '0x' + padAddressTo32Bytes(ZERO_ADDRESS).toString('hex'),
        dstTrader: '0x' + padAddressTo32Bytes(trader).toString('hex'),
        baseToken: eth,
        quoteToken:
          '0x' + padAddressTo32Bytes(await tt1.getAddress()).toString('hex'),
        effectiveBaseTokenAmount: expandTo18Decimals(1),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(10),
        quoteExpiry: now + 60 * 60,
        nonce: now,
        txid: txid1,
        xChainMessenger: await xChainMessenger.getAddress(),
      };

      expect(await privPoolContract1.getReserves(eth)).to.equal(
        expandTo18Decimals(10),
      );
      expect(
        await privPoolContract2.getReserves(await tt1.getAddress()),
      ).to.equal(expandTo18Decimals(10));
      await privPoolContract1.updateXChainMessengerAuthorization(
        await xChainMessenger.getAddress(),
        true,
      );
      await privPoolContract2.updateXChainMessengerAuthorization(
        await xChainMessenger.getAddress(),
        true,
      );
      await privPoolContract1.updateXChainPoolAuthorization(
        [
          {
            chainId: 1,
            pool: padAddressTo32Bytes(privPoolAddress2),
          },
        ],
        true,
      );

      const { blockNumber: tradeBlockNumber } =
        await traderRouter.tradeXChainRFQT(
          {
            ...quote1,
            signature: await signQuoteXChain(quote1, signers[2]),
          },
          padAddressTo32Bytes(ZERO_ADDRESS),
          Buffer.from(''),
          {
            value: expandTo18Decimals(2),
          },
        );

      if (!tradeBlockNumber) {
        throw new Error('Could not determine trade block number.');
      }

      expect(await privPoolContract1.getReserves(eth)).to.equal(
        expandTo18Decimals(11),
      );
      expect(
        await privPoolContract2.getReserves(await tt1.getAddress()),
      ).to.equal(expandTo18Decimals(10));

      await privPoolContract2.updateXChainPoolAuthorization(
        [
          {
            chainId: 1,
            pool: padAddressTo32Bytes(privPoolAddress1),
          },
        ],
        true,
      );

      // We check for a stored payload.

      const filter = (
        xChainMessenger as IHashflowLayerZeroMessenger
      ).filters.LayerZeroPayloadStored();
      const events = await (
        xChainMessenger as IHashflowLayerZeroMessenger
      ).queryFilter(filter, tradeBlockNumber, tradeBlockNumber);

      expect(events.length).to.equal(1);

      const path =
        (await xChainMessenger.getAddress()) +
        (await xChainMessenger.getAddress()).slice(2);
      const nonce = await lzEndpoint.inboundNonce(5555, path);
      const payload = events[0].args.payload;

      // We retry the payload.

      await (xChainMessenger as IHashflowLayerZeroMessenger).retryPayload(
        5555,
        path,
        nonce,
        payload,
      );

      expect(
        await privPoolContract2.getReserves(await tt1.getAddress()),
      ).to.equal(expandTo18Decimals(5));

      // Payload cannot be retried again.
      await expect(
        (xChainMessenger as IHashflowLayerZeroMessenger).retryPayload(
          5555,
          path,
          nonce,
          payload,
        ),
      ).to.be.revertedWith(
        'HashflowLayerZeroMessenger::retryPayload Payload not found.',
      );
    });

    it('should trade x-chain RFQ-m', async () => {
      const { router, signers, trader, xChainMessenger, tt1, tt2 } = contracts;
      const relayerRouter = router.connect(signers[2]);

      const latestBlock = await ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const txid = hashMessage('vvvvvv');
      const quote: XChainRFQMQuoteData = {
        srcChainId: 1,
        dstChainId: 1,
        srcPool: privPoolAddress1,
        dstPool: '0x' + padAddressTo32Bytes(privPoolAddress2).toString('hex'),
        srcExternalAccount: ZERO_ADDRESS,
        dstExternalAccount:
          '0x' + padAddressTo32Bytes(ZERO_ADDRESS).toString('hex'),
        trader,
        dstTrader: '0x' + padAddressTo32Bytes(trader).toString('hex'),
        baseToken: await tt1.getAddress(),
        quoteToken:
          '0x' + padAddressTo32Bytes(await tt2.getAddress()).toString('hex'),
        baseTokenAmount: expandTo18Decimals(5),
        quoteTokenAmount: expandTo18Decimals(5),
        quoteExpiry: now + 60 * 60,
        txid,
        xChainMessenger: await xChainMessenger.getAddress(),
      };

      expect(
        await privPoolContract1.getReserves(await tt1.getAddress()),
      ).to.equal(expandTo18Decimals(10));
      expect(
        await privPoolContract2.getReserves(await tt2.getAddress()),
      ).to.equal(expandTo18Decimals(10));

      // Set allowance for TT1, so that it can be traded.
      await tt1
        .connect(signers[3])
        .approve(await router.getAddress(), expandTo18Decimals(10));

      await relayerRouter.tradeXChainRFQM(
        {
          ...quote,
          takerSignature: await signQuoteXChainRFQMTaker(
            quote,
            31337,
            await router.getAddress(),
            signers[3],
          ),
          makerSignature: await signQuoteXChainRFQMMaker(quote, signers[2]),
        },
        padAddressTo32Bytes(ZERO_ADDRESS),
        Buffer.from(''),
        {
          value: expandTo18Decimals(1),
        },
      );

      expect(
        await privPoolContract1.getReserves(await tt1.getAddress()),
      ).to.equal(expandTo18Decimals(15));

      expect(
        await privPoolContract2.getReserves(await tt2.getAddress()),
      ).to.equal(expandTo18Decimals(5));

      expect(await tt1.balanceOf(trader)).to.equal(expandTo18Decimals(100));
      expect(await tt2.balanceOf(trader)).to.equal(expandTo18Decimals(105));

      const quote2: XChainRFQMQuoteData = {
        ...quote,
        txid: hashMessage(txid),
      };

      const permitDeadline = now + 60 * 60;
      const permitNonce = 0;

      const permit = await signERC20Permit(
        trader,
        await router.getAddress(),
        permitNonce,
        BigInt(2) ** BigInt(256) - BigInt(1),
        permitDeadline,
        await tt1.getAddress(),
        await tt1.name(),
        '1',
        31337,
        signers[3],
      );

      const r = '0x' + permit.slice(2, 2 + 64);
      const s = '0x' + permit.slice(2 + 64, 2 + 128);
      const v = parseInt(permit.slice(2 + 128, 132), 16);

      await relayerRouter.tradeXChainRFQMWithPermit(
        {
          ...quote2,
          takerSignature: await signQuoteXChainRFQMTaker(
            quote2,
            31337,
            await router.getAddress(),
            signers[3],
          ),
          makerSignature: await signQuoteXChainRFQMMaker(quote2, signers[2]),
        },
        padAddressTo32Bytes(ZERO_ADDRESS),
        Buffer.from(''),
        permitDeadline,
        v,
        r,
        s,
        BigInt(2) ** BigInt(256) - BigInt(1),
        {
          value: expandTo18Decimals(1),
        },
      );

      expect(await tt1.balanceOf(trader)).to.equal(expandTo18Decimals(95));
      expect(await tt2.balanceOf(trader)).to.equal(expandTo18Decimals(110));
    });

    it('should trade x-chain with external accounts', async () => {
      const {
        mmExternalAccount,
        mmExternalAccount2,
        router,
        trader,
        tt1,
        signers,
        xChainMessenger,
        weth,
      } = contracts;

      const traderRouter = router.connect(signers[3]);

      const latestBlock = await ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;

      const provider = signers[0].provider;
      if (!provider) {
        throw new Error('Could not get provider.');
      }

      const txid1 = hashMessage('adfhkjl');
      const quote1: XChainQuoteData = {
        srcChainId: 1,
        dstChainId: 1,
        srcPool: privPoolAddress1,
        dstPool: '0x' + padAddressTo32Bytes(privPoolAddress2).toString('hex'),
        srcExternalAccount: mmExternalAccount,
        dstExternalAccount:
          '0x' + padAddressTo32Bytes(mmExternalAccount2).toString('hex'),
        dstTrader: '0x' + padAddressTo32Bytes(trader).toString('hex'),
        baseToken: eth,
        quoteToken:
          '0x' + padAddressTo32Bytes(await tt1.getAddress()).toString('hex'),
        effectiveBaseTokenAmount: expandTo18Decimals(1),
        baseTokenAmount: expandTo18Decimals(1),
        quoteTokenAmount: expandTo18Decimals(5),
        quoteExpiry: now + 60 * 60,
        nonce: now,
        txid: txid1,
        xChainMessenger: await xChainMessenger.getAddress(),
      };

      const traderEthBalance1 = await provider.getBalance(trader);

      const externalAccount1EthBalance1 =
        await provider.getBalance(mmExternalAccount);
      const externalAccount1WethBalance1 =
        await weth.balanceOf(mmExternalAccount);
      const externalAccount2Tt1Balance1 =
        await tt1.balanceOf(mmExternalAccount2);

      // We set allowance for 5 TT1.
      await tt1
        .connect(signers[6]) // mmExternalAccount2
        .approve(privPoolAddress2, expandTo18Decimals(5));

      await traderRouter.tradeXChainRFQT(
        {
          ...quote1,
          signature: await signQuoteXChain(quote1, signers[2]),
        },
        padAddressTo32Bytes(ZERO_ADDRESS),
        Buffer.from(''),
        {
          value: expandTo18Decimals(2),
        },
      );
      const traderEthBalance2 = await provider.getBalance(trader);
      const traderTt1Balance2 = await tt1.balanceOf(trader);
      const externalAccount1EthBalance2 =
        await provider.getBalance(mmExternalAccount);
      const externalAccount1WethBalance2 =
        await weth.balanceOf(mmExternalAccount);
      const externalAccount2Tt1Balance2 =
        await tt1.balanceOf(mmExternalAccount2);

      // externalAccount does not receive ETH, but receives WETH instead.
      expect(externalAccount1EthBalance1).to.equal(externalAccount1EthBalance2);
      expect(
        externalAccount1WethBalance2 - externalAccount1WethBalance1,
      ).to.equal(expandTo18Decimals(1));

      // Trader received 5 TT1.
      expect(traderTt1Balance2).to.equal(expandTo18Decimals(100));

      // Trader was deducted the ETH.
      expect(traderEthBalance1 - traderEthBalance2).to.be.greaterThanOrEqual(
        expandTo18Decimals(2),
      );

      // Nothing was deducted from externalAccount 2.
      expect(
        externalAccount2Tt1Balance1 - externalAccount2Tt1Balance2,
      ).to.equal(expandTo18Decimals(5));
    });

    it('should withdraw funds', async () => {
      const { xChainMessenger, signers } = contracts;
      const provider = signers[0].provider;

      if (!provider) {
        throw new Error(`Missing provider`);
      }
      const balanceUa1 = await provider.getBalance(
        await xChainMessenger.getAddress(),
      );

      await signers[0].sendTransaction({
        to: await xChainMessenger.getAddress(),
        value: 1000000,
      });

      const balanceUa2 = await provider.getBalance(
        await xChainMessenger.getAddress(),
      );

      await xChainMessenger.withdrawFunds();

      const balanceUa3 = await provider.getBalance(
        await xChainMessenger.getAddress(),
      );

      expect(balanceUa2 - balanceUa1).to.equal(BigInt(1000000));
      expect(balanceUa3).to.equal(0);
    });
  });
});
