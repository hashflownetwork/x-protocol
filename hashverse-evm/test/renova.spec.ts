import { Signer, keccak256, solidityPackedKeccak256 } from 'ethers';

import * as hre from 'hardhat';
import { expect } from 'chai';
import { MerkleTree } from 'merkletreejs';

import {
  RenovaAvatar,
  RenovaItem,
  RenovaCommandDeck,
  MockHashflowRouter,
  RenovaQuest,
  TestERC20,
  StakingVault,
  HFT,
} from '../types';
import { sendETH, toWei, ZERO_ADDRESS } from './utils';
import { zeroPad } from '@ethersproject/bytes';

describe('Renova', () => {
  let stakingVault: StakingVault;
  let hft: HFT;
  let renovaCommandDeck: RenovaCommandDeck;
  let renovaAvatar: RenovaAvatar;
  let renovaItem: RenovaItem;

  let renovaQuestId: string;

  let renovaQuest: RenovaQuest;

  let testERC20A: TestERC20;
  let testERC20B: TestERC20;

  let mockHashflowRouter: MockHashflowRouter;

  let admin: Signer;
  let questOwner: Signer;

  let playerA: Signer;
  let playerB: Signer;
  let playerC: Signer;
  let playerD: Signer;
  let playerE: Signer;

  let baselineTimestamp: number;

  before(async () => {
    // Initialize players.
    const signers = await hre.ethers.getSigners();

    admin = signers[0];
    questOwner = signers[1];

    playerA = signers[2];
    playerB = signers[3];
    playerC = signers[4];
    playerD = signers[5];
    playerE = signers[6];

    baselineTimestamp = Math.floor(Date.now() / 1000) + 100;

    const hftFactory = await hre.ethers.getContractFactory('HFT');
    const stakingVaultFactory =
      await hre.ethers.getContractFactory('StakingVault');
    const renovaCommandDeckFactory =
      await hre.ethers.getContractFactory('RenovaCommandDeck');
    const renovaAvatarFactory =
      await hre.ethers.getContractFactory('RenovaAvatar');
    const renovaItemFactory = await hre.ethers.getContractFactory('RenovaItem');
    const mockHashflowRouterFactory =
      await hre.ethers.getContractFactory('MockHashflowRouter');
    const mockWormholeFactory =
      await hre.ethers.getContractFactory('MockWormhole');
    const testERC20Factory = await hre.ethers.getContractFactory('TestERC20');

    const mockWormhole = await mockWormholeFactory.deploy();

    hft = await hftFactory.deploy();

    stakingVault = await stakingVaultFactory.deploy(await hft.getAddress());

    renovaCommandDeck = (await hre.upgrades.deployProxy(
      renovaCommandDeckFactory,
      [],
      { initializer: false },
    )) as unknown as RenovaCommandDeck;

    renovaAvatar = (await hre.upgrades.deployProxy(renovaAvatarFactory, [
      await renovaCommandDeck.getAddress(),
      await stakingVault.getAddress(),
      toWei(10),
      await mockWormhole.getAddress(),
      1,
    ])) as unknown as RenovaAvatar;

    renovaItem = (await hre.upgrades.deployProxy(renovaItemFactory, [
      await renovaCommandDeck.getAddress(),
      await mockWormhole.getAddress(),
      1,
    ])) as unknown as RenovaItem;
    mockHashflowRouter = await mockHashflowRouterFactory.deploy();

    await sendETH(admin, toWei(10), await mockHashflowRouter.getAddress());

    testERC20A = await testERC20Factory.deploy('Test ERC20 A', 'ERA');

    await testERC20A.mint(await mockHashflowRouter.getAddress(), toWei(1_000));
    await testERC20A.mint(await playerA.getAddress(), toWei(1_000));
    await testERC20A.mint(await playerE.getAddress(), toWei(1_000));

    testERC20B = await testERC20Factory.deploy('Test ERC20 B', 'ERB');

    await testERC20B.mint(await mockHashflowRouter.getAddress(), toWei(1_000));
    await testERC20B.mint(await playerA.getAddress(), toWei(1_000));

    await renovaCommandDeck.initialize(
      await renovaAvatar.getAddress(),
      await renovaItem.getAddress(),
      await mockHashflowRouter.getAddress(),
      await questOwner.getAddress(),
    );

    await renovaAvatar.updateMaxCharacterId(0, 2);
    await renovaAvatar.updateMaxCharacterId(1, 2);
  });

  describe('Avatar', () => {
    it('should support appropriate interfaces', async () => {
      const interfaceIdERC721 = Buffer.from('80ac58cd', 'hex');
      expect(await renovaAvatar.supportsInterface(interfaceIdERC721)).to.be
        .true;

      const interfaceIdERC4906 = Buffer.from('49064906', 'hex');
      expect(await renovaAvatar.supportsInterface(interfaceIdERC4906)).to.be
        .true;
    });

    it('should mint avatar', async () => {
      await expect(renovaAvatar.connect(playerA).mint(0, 1)).to.be.revertedWith(
        'RenovaAvatar::mint Insufficient stake.',
      );
      await renovaAvatar.updateMinStakePower(0);

      await renovaAvatar.connect(playerA).mint(0, 1);
      await renovaAvatar.connect(playerB).mint(0, 0);
      await renovaAvatar.connect(playerC).mint(1, 0);
      await renovaAvatar.connect(playerE).mint(1, 1);

      expect(await renovaAvatar.balanceOf(await playerA.getAddress())).to.equal(
        1,
      );
      expect(
        await renovaAvatar.tokenIds(await playerA.getAddress()),
      ).to.not.equal(0);
      expect(await renovaAvatar.tokenIds(await playerD.getAddress())).to.equal(
        0,
      );
    });

    it('should render correct metadata link', async () => {
      const emptyLink = await renovaAvatar.tokenURI(1);
      expect(emptyLink).to.equal('');

      await renovaAvatar.setCustomBaseURI('http://test/uri/');

      const populatedLink = await renovaAvatar.tokenURI(1);

      expect(populatedLink).to.equal('http://test/uri/1.json');
    });

    it('should not double-mint', async () => {
      await expect(renovaAvatar.connect(playerA).mint(0, 0)).to.be.revertedWith(
        'RenovaAvatarBase::_mintAvatar Cannot mint more than one Avatar.',
      );
    });

    it('should be soul-bound', async () => {
      const tokenId = await renovaAvatar.tokenIds(await playerA.getAddress());
      await expect(
        renovaAvatar
          .connect(playerA)
          .transferFrom(
            await playerA.getAddress(),
            await playerB.getAddress(),
            tokenId,
          ),
      ).to.be.revertedWith(
        'RenovaAvatarBase::transferFrom Avatars are non-transferrable.',
      );
    });
  });

  describe('Command Deck', () => {
    it('should mint item via admin', async () => {
      expect(await renovaItem.balanceOf(await playerA.getAddress())).to.equal(
        0,
      );

      await renovaCommandDeck.mintItemAdmin(await playerA.getAddress(), 205);

      expect(await renovaItem.balanceOf(await playerA.getAddress())).to.equal(
        1,
      );
      expect(await renovaItem.ownerOf(1)).to.equal(await playerA.getAddress());
    });

    it('should mint item via Merkle root', async () => {
      const rootIdA = keccak256(Buffer.from('rootA'));
      const rootIdB = keccak256(Buffer.from('rootB'));

      const leavesA = [
        solidityPackedKeccak256(
          ['address', 'uint256[]'],
          [await playerA.getAddress(), [50]],
        ),
        solidityPackedKeccak256(
          ['address', 'uint256[]'],
          [await playerB.getAddress(), [23]],
        ),
      ];

      const leavesB = [
        solidityPackedKeccak256(
          ['address', 'uint256[]'],
          [await playerA.getAddress(), [20]],
        ),
      ];

      const treeA = new MerkleTree(leavesA, keccak256, {
        hashLeaves: false,
        sort: true,
      });

      const treeB = new MerkleTree(leavesB, keccak256, {
        hashLeaves: false,
        sort: true,
      });

      const rootA = treeA.getRoot();
      const rootB = treeB.getRoot();

      await renovaCommandDeck
        .connect(questOwner)
        .uploadItemMerkleRoot(rootIdA, rootA);

      await renovaCommandDeck
        .connect(questOwner)
        .uploadItemMerkleRoot(rootIdB, rootB);

      await renovaCommandDeck.mintItems(await playerA.getAddress(), [
        {
          hashverseItemIds: [50],
          rootId: rootIdA,
          proof: treeA.getHexProof(leavesA[0]),
        },
        {
          hashverseItemIds: [20],
          rootId: rootIdB,
          proof: treeB.getHexProof(leavesB[0]),
        },
      ]);

      await expect(
        renovaCommandDeck.mintItems(await playerA.getAddress(), [
          {
            hashverseItemIds: [50],
            rootId: rootIdA,
            proof: treeA.getHexProof(leavesA[0]),
          },
        ]),
      ).to.be.revertedWith('RenovaCommandDeck::mintItems Already minted.');
    });

    it('should create quest', async () => {
      const questId = keccak256(Buffer.from('quest1'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 120;

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp,
      ]);

      await renovaCommandDeck
        .connect(questOwner)
        .createQuest(
          questId,
          questStartTime,
          questEndTime,
          await testERC20A.getAddress(),
          toWei(1),
        );
    });

    it('should not double create quest', async () => {
      const questId = keccak256(Buffer.from('quest1'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 120;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(
            questId,
            questStartTime,
            questEndTime,
            await testERC20A.getAddress(),
            toWei(1),
          ),
      ).to.be.revertedWith(
        'RenovaCommandDeckBase::createQuest Quest already created.',
      );
    });
  });

  describe('Quest', () => {
    it('should not create quest that starts in the past', async () => {
      const questId = keccak256(Buffer.from('quest2'));

      const questStartTime = baselineTimestamp;
      const questEndTime = baselineTimestamp + 120;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(
            questId,
            questStartTime,
            questEndTime,
            await testERC20A.getAddress(),
            toWei(1),
          ),
      ).to.be.revertedWith(
        'RenovaQuest::constructor Start time should be in the future.',
      );
    });

    it('should not create quest that ends before it starts', async () => {
      const questId = keccak256(Buffer.from('quest2'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 50;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(
            questId,
            questStartTime,
            questEndTime,
            await testERC20A.getAddress(),
            1000000,
          ),
      ).to.be.revertedWith(
        'RenovaQuest::constructor End time should be after start time.',
      );
    });

    it('should not create quest that lasts too long', async () => {
      const questId = keccak256(Buffer.from('quest2'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 24 * 3600 * 365;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(
            questId,
            questStartTime,
            questEndTime,
            await testERC20A.getAddress(),
            toWei(1),
          ),
      ).to.be.revertedWith('RenovaQuest::constructor Quest too long.');
    });

    it('should allow players to enter before quest starts', async () => {
      renovaQuestId = keccak256(Buffer.from('renovaQuest'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 120;

      await renovaCommandDeck
        .connect(questOwner)
        .createQuest(
          renovaQuestId,
          questStartTime,
          questEndTime,
          await testERC20A.getAddress(),
          toWei(2),
        );

      const renovaQuestAddress =
        await renovaCommandDeck.questDeploymentAddresses(renovaQuestId);

      renovaQuest = await hre.ethers.getContractAt(
        'RenovaQuest',
        renovaQuestAddress,
      );

      await testERC20A
        .connect(playerA)
        .approve(await renovaCommandDeck.getAddress(), toWei(1_000));

      await expect(
        renovaQuest.connect(playerA).depositAndEnter(toWei(1)),
      ).to.be.rejectedWith(
        'RenovaQuest::_depositAndEnter Deposit amount too low.',
      );

      await renovaQuest.connect(playerA).depositAndEnter(toWei(2));

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress(),
        ),
      ).to.equal(toWei(2));

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20B.getAddress(),
        ),
      ).to.equal(toWei(0));

      expect(await renovaQuest.registered(await playerA.getAddress())).to.be
        .true;

      expect(await renovaQuest.numRegisteredPlayers()).to.equal(BigInt(1));
    });

    it('should not allow players without an avatar to enter', async () => {
      await expect(
        renovaQuest.connect(playerD).depositAndEnter(toWei(2)),
      ).to.be.revertedWith(
        'RenovaQuest::_depositAndEnter Player has not minted Avatar.',
      );
    });

    it('should not allow players to enter twice', async () => {
      await expect(
        renovaQuest.connect(playerA).depositAndEnter(toWei(2)),
      ).to.be.revertedWith(
        'RenovaQuest::_depositAndEnter Player has already entered the quest.',
      );
    });

    it('should trade', async () => {
      const quote1 = {
        pool: ZERO_ADDRESS,
        externalAccount: ZERO_ADDRESS,
        trader: await renovaQuest.getAddress(),
        effectiveTrader: await playerA.getAddress(),
        baseToken: await testERC20A.getAddress(),
        baseTokenAmount: toWei(1),
        quoteToken: await testERC20B.getAddress(),
        quoteTokenAmount: toWei(2),
        effectiveBaseTokenAmount: toWei(1),
        quoteExpiry: baselineTimestamp + 3600,
        nonce: 0,
        txid: zeroPad(Buffer.from(''), 32),
        signature: zeroPad(Buffer.from(''), 65),
      };

      await expect(
        renovaQuest.connect(playerA).trade(quote1),
      ).to.be.revertedWith('RenovaQuest::trade Quest is not ongoing.');

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + 100,
      ]);

      await expect(
        renovaQuest.connect(playerA).trade(quote1),
      ).to.be.revertedWith('RenovaQuest::trade Quote Token not allowed.');

      await renovaQuest
        .connect(questOwner)
        .updateTokenAuthorization(await testERC20B.getAddress(), true);

      await renovaQuest.connect(playerA).trade(quote1);

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress(),
        ),
      ).to.equal(toWei(1));

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20B.getAddress(),
        ),
      ).to.equal(toWei(2));

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          ZERO_ADDRESS,
        ),
      ).to.equal(toWei(0));

      const quote2 = {
        pool: ZERO_ADDRESS,
        externalAccount: ZERO_ADDRESS,
        trader: await renovaQuest.getAddress(),
        effectiveTrader: await playerA.getAddress(),
        baseToken: await testERC20B.getAddress(),
        baseTokenAmount: toWei(1),
        quoteToken: ZERO_ADDRESS,
        quoteTokenAmount: toWei(1),
        effectiveBaseTokenAmount: toWei(1),
        quoteExpiry: baselineTimestamp + 3600,
        nonce: 0,
        txid: zeroPad(Buffer.from(''), 32),
        signature: zeroPad(Buffer.from(''), 65),
      };

      await expect(
        renovaQuest.connect(playerA).trade(quote2),
      ).to.be.revertedWith('RenovaQuest::trade Quote Token not allowed.');

      await renovaQuest
        .connect(questOwner)
        .updateTokenAuthorization(ZERO_ADDRESS, true);

      await renovaQuest.connect(playerA).trade(quote2);

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress(),
        ),
      ).to.equal(toWei(1));

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20B.getAddress(),
        ),
      ).to.equal(toWei(1));

      expect(
        await renovaQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          ZERO_ADDRESS,
        ),
      ).to.equal(toWei(1));
    });

    it('should withdraw assets', async () => {
      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(998),
      );

      const ethBalanceBefore = await playerA.provider!.getBalance(
        await playerA.getAddress(),
      );

      await renovaQuest.connect(playerA).withdrawTokens([ZERO_ADDRESS]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(998),
      );

      const ethBalanceAfter = await playerA.provider!.getBalance(
        await playerA.getAddress(),
      );

      expect(ethBalanceAfter - ethBalanceBefore).to.be.greaterThan(
        toWei(1) / BigInt(2),
      );

      await renovaQuest
        .connect(playerA)
        .withdrawTokens([
          await testERC20A.getAddress(),
          await testERC20B.getAddress(),
        ]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(999),
      );

      expect(await testERC20B.balanceOf(await playerA.getAddress())).to.equal(
        toWei(1001),
      );

      await renovaQuest
        .connect(playerA)
        .withdrawTokens([
          await testERC20A.getAddress(),
          await testERC20B.getAddress(),
          ZERO_ADDRESS,
        ]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(999),
      );

      expect(await testERC20B.balanceOf(await playerA.getAddress())).to.equal(
        toWei(1001),
      );
    });
  });

  describe('Item', () => {
    it('should support appropriate interfaces', async () => {
      const interfaceIdERC721 = Buffer.from('80ac58cd', 'hex');
      expect(await renovaItem.supportsInterface(interfaceIdERC721)).to.be.true;

      const interfaceIdERC2981 = Buffer.from('2a55205a', 'hex');
      expect(await renovaItem.supportsInterface(interfaceIdERC2981)).to.be.true;

      const interfaceIdERC4906 = Buffer.from('49064906', 'hex');
      expect(await renovaItem.supportsInterface(interfaceIdERC4906)).to.be.true;
    });

    it('should correctly handle royalties', async () => {
      await renovaItem.setDefaultRoyalty(await admin.getAddress(), 100);
      const royaltyInfo = await renovaItem.royaltyInfo(1, 1_000);
      expect(royaltyInfo[0]).to.equal(await admin.getAddress());
      expect(royaltyInfo[1]).to.equal(10);
    });

    it('should render correct metadata link', async () => {
      const emptyLink = await renovaItem.tokenURI(1);
      expect(emptyLink).to.equal('');

      await renovaItem.setCustomBaseURI('http://test/uri2/');

      const populatedLink = await renovaItem.tokenURI(1);

      expect(populatedLink).to.equal('http://test/uri2/1.json');
    });
  });
});
