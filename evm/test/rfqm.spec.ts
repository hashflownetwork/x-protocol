import { expect } from 'chai';
import { ethers } from 'hardhat';
import { hashMessage, sendETH } from './utils';
import {
  expandTo18Decimals,
  RFQMQuoteData,
  signERC20Permit,
  signQuoteRFQMTaker,
  signQuoteRFQMMaker,
  ZERO_ADDRESS,
} from './utils';
import { HashflowPool } from '../types/index';
import { Contracts, ContractFactory } from './contracts';

let contracts: Contracts;
let privPoolAddress: string;
let privPoolContract: HashflowPool;

describe('RFQ-M', () => {
  before(async () => {
    contracts = await ContractFactory.deployContracts();
    const { factory, signer, owner, tt1, tt2, signers } = contracts;
    await factory.updatePoolCreatorAuthorization(owner, true);
    await factory.createPool('Hash Capital', signer);
    const createPoolEvents = await factory.queryFilter(
      factory.filters.CreatePool()
    );
    const pools = createPoolEvents
      .filter((evt) => evt.args.operations === owner)
      .map((evt) => evt.args.pool);
    privPoolAddress = pools[0];

    privPoolContract = await ethers.getContractAt(
      'HashflowPool',
      privPoolAddress
    );

    // Deposit assets into the pool
    await sendETH(signers[0], expandTo18Decimals(10), privPoolAddress);

    await tt1.transfer(privPoolAddress, expandTo18Decimals(10));
    await tt2.transfer(privPoolAddress, expandTo18Decimals(20));
  });

  describe('RFQM', async () => {
    it('should trade', async () => {
      const { router, signers, trader, tt1, tt2 } = contracts;
      const relayerRouter = router.connect(signers[5]);

      const latestBlock = await ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const txid = hashMessage('dgsgevav');

      const quoteData: RFQMQuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        baseToken: await tt1.getAddress(),
        quoteToken: await tt2.getAddress(),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(5),
        quoteExpiry: now + 60 * 60,
        txid,
      };
      const quote = {
        ...quoteData,
        takerSignature: await signQuoteRFQMTaker(
          quoteData,
          31337,
          await router.getAddress(),
          signers[3]
        ),
        makerSignature: await signQuoteRFQMMaker(quoteData, signers[2]),
      };

      await tt1
        .connect(signers[3])
        .approve(await router.getAddress(), expandTo18Decimals(2));

      await relayerRouter.tradeRFQM(quote);
      await expect(relayerRouter.tradeRFQM(quote)).to.be.revertedWith(
        'HashflowRouter::_validateRFQMQuote txid has already been used.'
      );

      expect(await tt1.balanceOf(trader)).to.equal(expandTo18Decimals(98));

      expect(await tt2.balanceOf(trader)).to.equal(expandTo18Decimals(105));

      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(12));
      expect(
        await privPoolContract.getReserves(await tt2.getAddress())
      ).to.equal(expandTo18Decimals(15));
    });

    it('should trade with permit', async () => {
      const { router, signers, trader, tt1, tt2 } = contracts;
      const relayerRouter = router.connect(signers[5]);
      const latestBlock = await ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const txid = hashMessage('lhsdfljhf');

      const quoteData: RFQMQuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        baseToken: await tt1.getAddress(),
        quoteToken: await tt2.getAddress(),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(5),
        quoteExpiry: now + 60 * 60,
        txid,
      };
      const quote = {
        ...quoteData,
        takerSignature: await signQuoteRFQMTaker(
          quoteData,
          31337,
          await router.getAddress(),
          signers[3]
        ),
        makerSignature: await signQuoteRFQMMaker(quoteData, signers[2]),
      };

      const permitDeadline = now + 60 * 60;
      const permitNonce = 0;

      const signature = await signERC20Permit(
        trader,
        await router.getAddress(),
        permitNonce,
        quote.baseTokenAmount,
        permitDeadline,
        await tt1.getAddress(),
        await tt1.name(),
        '1',
        31337,
        signers[3]
      );

      if (signature.length !== 132) {
        throw new Error('Invalid signature.');
      }

      const r = '0x' + signature.slice(2, 2 + 64);
      const s = '0x' + signature.slice(2 + 64, 2 + 128);
      const v = parseInt(signature.slice(2 + 128, 132), 16);

      await relayerRouter.tradeRFQMWithPermit(
        quote,
        permitDeadline,
        v,
        r,
        s,
        quote.baseTokenAmount
      );

      expect(await tt1.balanceOf(trader)).to.equal(expandTo18Decimals(96));

      expect(await tt2.balanceOf(trader)).to.equal(expandTo18Decimals(110));

      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(14));
      expect(
        await privPoolContract.getReserves(await tt2.getAddress())
      ).to.equal(expandTo18Decimals(10));

      const quoteData2: RFQMQuoteData = {
        ...quoteData,
        txid: hashMessage(txid),
      };
      const quote2 = {
        ...quoteData2,
        takerSignature: await signQuoteRFQMTaker(
          quoteData2,
          31337,
          await router.getAddress(),
          signers[3]
        ),
        makerSignature: await signQuoteRFQMMaker(quoteData2, signers[2]),
      };

      const signature2 = await signERC20Permit(
        trader,
        await router.getAddress(),
        permitNonce + 1,
        BigInt(2) ** BigInt(256) - BigInt(1),
        permitDeadline,
        await tt1.getAddress(),
        await tt1.name(),
        '1',
        31337,
        signers[3]
      );

      const r2 = '0x' + signature2.slice(2, 2 + 64);
      const s2 = '0x' + signature2.slice(2 + 64, 2 + 128);
      const v2 = parseInt(signature2.slice(2 + 128, 132), 16);

      await relayerRouter.tradeRFQMWithPermit(
        quote2,
        permitDeadline,
        v2,
        r2,
        s2,
        BigInt(2) ** BigInt(256) - BigInt(1)
      );

      expect(await tt1.balanceOf(trader)).to.equal(expandTo18Decimals(94));

      expect(await tt2.balanceOf(trader)).to.equal(expandTo18Decimals(115));
    });
  });
});
