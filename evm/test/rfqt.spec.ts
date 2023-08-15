import { expect } from 'chai';
import hre from 'hardhat';
import { hashMessage, mineBlock, sendETH } from './utils';
import {
  ZERO_ADDRESS,
  expandTo18Decimals,
  signQuote,
  QuoteData,
} from './utils';
import { ContractFactory, Contracts } from './contracts';
import { HashflowPool } from '../types/index';
const eth = ZERO_ADDRESS;
let contracts: Contracts;
let privPoolAddress: string;
let privPoolContract: HashflowPool;

describe('RFQ-T', () => {
  before(async () => {
    contracts = await ContractFactory.deployContracts();
  });

  describe('Ownership', async () => {
    it('should not renounce ownership', async () => {
      const { factory, router } = contracts;

      await expect(factory.renounceOwnership()).to.be.revertedWith(
        'HashflowFactory: Renouncing ownership not allowed.'
      );
      await expect(router.renounceOwnership()).to.be.revertedWith(
        'HashflowRouter: Renouncing ownership not allowed.'
      );
    });
  });

  describe('Pool creation', async () => {
    it('should create a private pool', async () => {
      const { factory, signer, owner } = contracts;
      const poolName = 'Hash Capital';

      await factory.updatePoolCreatorAuthorization(owner, true);

      await factory.createPool(poolName, signer);

      const createPoolEvents = await factory.queryFilter(
        factory.filters.CreatePool()
      );
      const pools = createPoolEvents
        .filter((evt) => evt.args.operations === owner)
        .map((evt) => evt.args.pool);
      privPoolAddress = pools[0];

      privPoolContract = await hre.ethers.getContractAt(
        'HashflowPool',
        privPoolAddress
      );
    });

    it('should have correct WETH value', async () => {
      const weth = await privPoolContract._WETH();

      expect(weth.toLowerCase()).to.equal(
        (await contracts.weth.getAddress()).toLowerCase()
      );
    });
  });

  describe('Add liquidity', async () => {
    it('should deposit Eth', async () => {
      const { signers } = contracts;
      const value = expandTo18Decimals(10);

      await sendETH(signers[0], value, privPoolAddress);

      expect(await privPoolContract.getReserves(eth)).to.equal(value);
    });

    it('should deposit test token 1', async () => {
      const { tt1 } = contracts;
      const value = expandTo18Decimals(10);
      await tt1.transfer(privPoolAddress, value);

      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(value);
    });
  });

  describe('Trade', async () => {
    it('should trade ETH for ERC-20 token', async () => {
      const { router, signers, trader, effectiveTrader, tt1 } = contracts;
      const traderRouter = router.connect(signers[3]);
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;

      const nonce = Date.now();
      const txid = hashMessage('dgsgevav');

      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: eth,
        quoteToken: await tt1.getAddress(),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(5),
        nonce,
        quoteExpiry: now + 60 * 60,
        txid,
      };

      const quoteData2: QuoteData = {
        ...quoteData,
        nonce: nonce + 1,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(1),
        signature: await signQuote(quoteData, signers[2]),
      };
      const quote2 = {
        ...quoteData2,
        effectiveBaseTokenAmount: expandTo18Decimals(1),
        signature: await signQuote(quoteData2, signers[2]),
      };

      await expect(
        traderRouter.tradeRFQT(quote, { value: expandTo18Decimals(0) })
      ).to.be.revertedWith(
        'HashflowRouter::tradeRFQT msg.value should equal effectiveBaseTokenAmount.'
      );
      const traderBalanceBefore = await signers[3].provider.getBalance(
        signers[3].address
      );
      const traderTokenBalanceBefore = await tt1.balanceOf(trader);

      await traderRouter.tradeRFQT(quote, {
        value: expandTo18Decimals(1),
      });
      await traderRouter.tradeRFQT(quote2, {
        value: expandTo18Decimals(1),
      });

      const traderBalanceAfter = await signers[3].provider.getBalance(
        signers[3].address
      );
      const traderTokenBalanceAfter = await tt1.balanceOf(trader);

      // We use a gt equality check here, to account for gas spent.
      // eslint-disable-next-line no-unused-expressions
      expect(traderBalanceBefore - traderBalanceAfter > expandTo18Decimals(2))
        .to.be.true;

      expect(traderTokenBalanceAfter - traderTokenBalanceBefore).to.equal(
        expandTo18Decimals(5)
      );

      // test for re-submission of the same quote
      await expect(
        traderRouter.tradeRFQT(quote, { value: expandTo18Decimals(1) })
      ).to.be.revertedWith('HashflowPool::_updateNonce Invalid nonce.');
      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(10) - expandTo18Decimals(5));
      expect(await privPoolContract.getReserves(eth)).to.equal(
        expandTo18Decimals(10) + expandTo18Decimals(2)
      );
    });

    it('should fail if user has insufficient allowance or balance', async () => {
      const { router, signers, trader, effectiveTrader, tt1 } = contracts;
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const nonce = Date.now();
      const txid = hashMessage('dgsgevav');

      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: await tt1.getAddress(),
        quoteToken: eth,
        baseTokenAmount: expandTo18Decimals(1000),
        quoteTokenAmount: expandTo18Decimals(5),
        nonce,
        quoteExpiry: now + 60 * 60,
        txid,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(1000),
        signature: await signQuote(quoteData, signers[2]),
      };

      await expect(
        router.connect(signers[3]).tradeRFQT(quote)
      ).to.be.revertedWith('ERC20: insufficient allowance');

      await tt1
        .connect(signers[3])
        .approve(await router.getAddress(), expandTo18Decimals(10000));
      await expect(
        router.connect(signers[3]).tradeRFQT(quote)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });

    it('should trade ERC-20 token for ETH', async () => {
      const { router, signers, trader, effectiveTrader, tt1 } = contracts;
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const nonce = Date.now();
      const txid = hashMessage('dgsgevav');

      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: await tt1.getAddress(),
        quoteToken: eth,
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(5),
        nonce,
        quoteExpiry: now + 60 * 60,
        txid,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(2),
        signature: await signQuote(quoteData, signers[2]),
      };

      await expect(
        router
          .connect(signers[3])
          .tradeRFQT(quote, { value: expandTo18Decimals(2) })
      ).to.be.revertedWith('HashflowRouter::tradeRFQT msg.value should be 0.');

      await router.connect(signers[3]).tradeRFQT(quote);

      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(5) + expandTo18Decimals(2));
      expect(await privPoolContract.getReserves(eth)).to.equal(
        expandTo18Decimals(12) - expandTo18Decimals(5)
      );
    });

    it('should fail if the quote expires', async () => {
      const { router, trader, effectiveTrader, tt1, signers } = contracts;
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const nonce = Date.now();
      const txid = hashMessage('dgsgevav');
      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: await tt1.getAddress(),
        quoteToken: eth,
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(5),
        nonce,
        quoteExpiry: now + 5,
        txid,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(2),
        signature: await signQuote(quoteData, signers[2]),
      };

      mineBlock(hre, now + 20);
      await expect(router.tradeRFQT(quote)).to.be.revertedWith(
        'HashflowRouter::_validateRFQTQuote Quote has expired.'
      );
    });

    it('should trade ERC-20 for ERC-20 token', async () => {
      const { router, signers, trader, effectiveTrader, tt1, tt2 } = contracts;
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const nonce = Date.now();
      const txid = hashMessage('dgsgevav');
      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: await tt2.getAddress(),
        quoteToken: await tt1.getAddress(),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(1),
        nonce,
        quoteExpiry: now + 60 * 60,
        txid,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(2),
        signature: await signQuote(quoteData, signers[2]),
      };

      await tt2
        .connect(signers[3])
        .approve(await router.getAddress(), expandTo18Decimals(10000));

      await router.connect(signers[3]).tradeRFQT(quote);
      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(7) - expandTo18Decimals(1));
      expect(
        await privPoolContract.getReserves(await tt2.getAddress())
      ).to.equal(expandTo18Decimals(2));
    });

    it('should fail if effective base token exceeds max', async () => {
      const { router, signers, trader, effectiveTrader, tt1, tt2 } = contracts;
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const nonce = Date.now();
      const txid = hashMessage('fggae');

      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: await tt2.getAddress(),
        quoteToken: await tt1.getAddress(),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(1),
        nonce,
        quoteExpiry: now + 60 * 60,
        txid,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(3),
        signature: await signQuote(quoteData, signers[2]),
      };

      await expect(
        router.connect(signers[3]).tradeRFQT(quote)
      ).to.be.revertedWith(
        'HashflowRouter::_validateRFQTQuote effectiveBaseTokenAmount too high.'
      );
    });

    it('should trade if effective base token less than max', async () => {
      const { router, signers, trader, effectiveTrader, tt1, tt2 } = contracts;
      const latestBlock = await hre.ethers.provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error(`Could not get latest block`);
      }
      const { timestamp: now } = latestBlock;
      const nonce = Date.now();
      const txid = hashMessage('fggae');

      const quoteData: QuoteData = {
        pool: privPoolAddress,
        externalAccount: ZERO_ADDRESS,
        trader,
        effectiveTrader,
        baseToken: await tt2.getAddress(),
        quoteToken: await tt1.getAddress(),
        baseTokenAmount: expandTo18Decimals(2),
        quoteTokenAmount: expandTo18Decimals(1),
        nonce,
        quoteExpiry: now + 60 * 60,
        txid,
      };

      const quote = {
        ...quoteData,
        effectiveBaseTokenAmount: expandTo18Decimals(1),
        signature: await signQuote(quoteData, signers[2]),
      };

      await router.connect(signers[3]).tradeRFQT(quote);

      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(6) - expandTo18Decimals(5) / BigInt(10));
      expect(
        await privPoolContract.getReserves(await tt2.getAddress())
      ).to.equal(expandTo18Decimals(2) + expandTo18Decimals(1));
    });
  });

  describe('Remove liquidity', async () => {
    it('should remove eth', async () => {
      const { signers } = contracts;
      await privPoolContract.removeLiquidity(
        eth,
        ZERO_ADDRESS,
        expandTo18Decimals(1)
      );

      await expect(
        privPoolContract
          .connect(signers[3])
          .removeLiquidity(eth, ZERO_ADDRESS, expandTo18Decimals(1))
      ).to.be.revertedWith(
        'HashflowPool:authorizedOperations Sender must be operator.'
      );

      expect(await privPoolContract.getReserves(eth)).to.equal(
        expandTo18Decimals(7) - expandTo18Decimals(1)
      );
    });

    it('should remove tt1', async () => {
      const { tt1, signers } = contracts;
      await privPoolContract.removeLiquidity(
        await tt1.getAddress(),
        ZERO_ADDRESS,
        expandTo18Decimals(1)
      );
      await expect(
        privPoolContract
          .connect(signers[3])
          .removeLiquidity(
            await tt1.getAddress(),
            ZERO_ADDRESS,
            expandTo18Decimals(1)
          )
      ).to.be.revertedWith(
        'HashflowPool:authorizedOperations Sender must be operator.'
      );

      expect(
        await privPoolContract.getReserves(await tt1.getAddress())
      ).to.equal(expandTo18Decimals(55) / BigInt(10) - expandTo18Decimals(1));
    });
  });
});
