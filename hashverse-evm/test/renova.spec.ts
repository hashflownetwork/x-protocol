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

  let soloQuestId: string;
  let multiplayerQuestId: string;

  let soloQuest: RenovaQuest;
  let multiplayerQuest: RenovaQuest;

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
    const stakingVaultFactory = await hre.ethers.getContractFactory(
      'StakingVault'
    );
    const renovaCommandDeckFactory = await hre.ethers.getContractFactory(
      'RenovaCommandDeck'
    );
    const renovaAvatarFactory = await hre.ethers.getContractFactory(
      'RenovaAvatar'
    );
    const renovaItemFactory = await hre.ethers.getContractFactory('RenovaItem');
    const mockHashflowRouterFactory = await hre.ethers.getContractFactory(
      'MockHashflowRouter'
    );
    const mockWormholeFactory = await hre.ethers.getContractFactory(
      'MockWormhole'
    );
    const testERC20Factory = await hre.ethers.getContractFactory('TestERC20');

    const mockWormhole = await mockWormholeFactory.deploy();

    hft = await hftFactory.deploy();

    stakingVault = await stakingVaultFactory.deploy(await hft.getAddress());

    renovaCommandDeck = (await hre.upgrades.deployProxy(
      renovaCommandDeckFactory,
      [],
      { initializer: false }
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
      await questOwner.getAddress()
    );
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
      await expect(
        renovaAvatar.connect(playerA).mint(0, 1, 0)
      ).to.be.revertedWith('RenovaAvatar::mint Insufficient stake.');
      await renovaAvatar.updateMinStakePower(0);

      await renovaAvatar.connect(playerA).mint(0, 1, 0);
      await renovaAvatar.connect(playerB).mint(0, 0, 0);
      await renovaAvatar.connect(playerC).mint(1, 0, 0);
      await renovaAvatar.connect(playerE).mint(1, 1, 0);

      expect(await renovaAvatar.balanceOf(await playerA.getAddress())).to.equal(
        1
      );
      expect(
        await renovaAvatar.tokenIds(await playerA.getAddress())
      ).to.not.equal(0);
      expect(await renovaAvatar.tokenIds(await playerD.getAddress())).to.equal(
        0
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
      await expect(
        renovaAvatar.connect(playerA).mint(0, 0, 0)
      ).to.be.revertedWith(
        'RenovaAvatarBase::_mintAvatar Cannot mint more than one Avatar.'
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
            tokenId
          )
      ).to.be.revertedWith(
        'RenovaAvatarBase::transferFrom Avatars are non-transferrable.'
      );
    });
  });

  describe('Command Deck', () => {
    it('should mint item via admin', async () => {
      expect(await renovaItem.balanceOf(await playerA.getAddress())).to.equal(
        0
      );

      await renovaCommandDeck.mintItemAdmin(await playerA.getAddress(), 205);

      expect(await renovaItem.balanceOf(await playerA.getAddress())).to.equal(
        1
      );
      expect(await renovaItem.ownerOf(1)).to.equal(await playerA.getAddress());
    });

    it('should mint item via Merkle root', async () => {
      const rootId = keccak256(Buffer.from('root'));

      const leaves = [
        solidityPackedKeccak256(
          ['address', 'uint256', 'uint256'],
          [await playerA.getAddress(), 0, 20]
        ),
        solidityPackedKeccak256(
          ['address', 'uint256', 'uint256'],
          [await playerB.getAddress(), 0, 23]
        ),
        solidityPackedKeccak256(
          ['address', 'uint256', 'uint256'],
          [await playerA.getAddress(), 1, 50]
        ),
        solidityPackedKeccak256(
          ['address', 'uint256', 'uint256'],
          [await playerA.getAddress(), 2, 60]
        ),
      ];

      const tree = new MerkleTree(leaves, keccak256, {
        hashLeaves: false,
        sort: true,
      });

      const root = tree.getRoot();

      await renovaCommandDeck
        .connect(questOwner)
        .uploadItemMerkleRoot(rootId, root);

      await renovaCommandDeck.mintItem(
        await playerA.getAddress(),
        20,
        rootId,
        0,
        tree.getHexProof(leaves[0])
      );
      await renovaCommandDeck.mintItem(
        await playerA.getAddress(),
        50,
        rootId,
        1,
        tree.getHexProof(leaves[2])
      );

      await expect(
        renovaCommandDeck.mintItem(
          await playerA.getAddress(),
          50,
          rootId,
          1,
          tree.getHexProof(leaves[2])
        )
      ).to.be.revertedWith('RenovaCommandDeck::mintItem Item already minted.');
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
        .createQuest(questId, 0, 0, 0, questStartTime, questEndTime);
    });

    it('should not double create quest', async () => {
      const questId = keccak256(Buffer.from('quest1'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 120;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(questId, 0, 0, 0, questStartTime, questEndTime)
      ).to.be.revertedWith(
        'RenovaCommandDeckBase::createQuest Quest already created.'
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
          .createQuest(questId, 0, 0, 0, questStartTime, questEndTime)
      ).to.be.revertedWith(
        'RenovaQuest::constructor Start time should be in the future.'
      );
    });

    it('should not create quest that ends before it starts', async () => {
      const questId = keccak256(Buffer.from('quest2'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 50;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(questId, 0, 0, 0, questStartTime, questEndTime)
      ).to.be.revertedWith(
        'RenovaQuest::constructor End time should be after start time.'
      );
    });

    it('should not create quest that lasts too long', async () => {
      const questId = keccak256(Buffer.from('quest2'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 24 * 3600 * 365;

      await expect(
        renovaCommandDeck
          .connect(questOwner)
          .createQuest(questId, 0, 0, 0, questStartTime, questEndTime)
      ).to.be.revertedWith('RenovaQuest::constructor Quest too long.');
    });

    it('should allow players to enter before quest starts', async () => {
      soloQuestId = keccak256(Buffer.from('questSolo'));
      multiplayerQuestId = keccak256(Buffer.from('questMultiplayer'));

      const questStartTime = baselineTimestamp + 60;
      const questEndTime = baselineTimestamp + 120;

      await renovaCommandDeck.connect(questOwner).createQuest(
        soloQuestId,
        0, // Solo
        2, // Player limit
        0, // Item limit
        questStartTime,
        questEndTime
      );

      await renovaCommandDeck.connect(questOwner).createQuest(
        multiplayerQuestId,
        1, // Multiplayer
        1, // Player limit
        2, // Item limit
        questStartTime,
        questEndTime
      );

      const soloQuestAddress = await renovaCommandDeck.questDeploymentAddresses(
        soloQuestId
      );

      const multiplayerQuestAddress =
        await renovaCommandDeck.questDeploymentAddresses(multiplayerQuestId);

      soloQuest = await hre.ethers.getContractAt(
        'RenovaQuest',
        soloQuestAddress
      );

      multiplayerQuest = await hre.ethers.getContractAt(
        'RenovaQuest',
        multiplayerQuestAddress
      );

      await soloQuest.connect(playerA).enter();
    });

    it('should not allow players without an avatar to enter', async () => {
      await expect(soloQuest.connect(playerD).enter()).to.be.revertedWith(
        'RenovaQuest::_enter Player has not minted Avatar.'
      );

      await renovaAvatar.connect(playerD).mint(1, 0, 1);

      await soloQuest.connect(playerD).enter();
    });

    it('should not allow players to enter twice', async () => {
      await expect(soloQuest.connect(playerD).enter()).to.be.revertedWith(
        'RenovaQuest::_enter Player already registered.'
      );
    });

    it('should respect player caps', async () => {
      await expect(soloQuest.connect(playerB).enter()).to.be.revertedWith(
        'RenovaQuest::_enter Player cap reached.'
      );

      await multiplayerQuest.connect(playerA).enter();
      await expect(
        multiplayerQuest.connect(playerB).enter()
      ).to.be.revertedWith('RenovaQuest::_enter Player cap reached.');
    });

    it('should enter quest, load items, and deposit tokens', async () => {
      await multiplayerQuest
        .connect(questOwner)
        .updateTokenAuthorization(ZERO_ADDRESS, true);
      await multiplayerQuest.connect(playerE).enterLoadDeposit(
        [],
        [
          {
            token: ZERO_ADDRESS,
            amount: toWei(5),
          },
        ],
        {
          value: toWei(5),
        }
      );
    });

    it('should load items', async () => {
      // We first mint 3 items to player A.
      await renovaCommandDeck.mintItemAdmin(await playerA.getAddress(), 101);
      await renovaCommandDeck.mintItemAdmin(await playerA.getAddress(), 102);
      await renovaCommandDeck.mintItemAdmin(await playerA.getAddress(), 103);

      expect(await renovaItem.balanceOf(await playerA.getAddress())).to.equal(
        6
      );

      await renovaItem
        .connect(playerA)
        .setApprovalForAll(await renovaCommandDeck.getAddress(), true);

      await multiplayerQuest.connect(playerA).loadItems([1, 2]);

      expect(
        await multiplayerQuest.numLoadedItems(await playerA.getAddress())
      ).to.equal(2);

      await expect(
        multiplayerQuest.connect(playerA).loadItems([3])
      ).to.be.revertedWith('RenovaQuest::loadItems Too many items.');

      expect(await renovaItem.ownerOf(1)).to.equal(
        await multiplayerQuest.getAddress()
      );
      expect(await renovaItem.ownerOf(2)).to.equal(
        await multiplayerQuest.getAddress()
      );

      await expect(
        multiplayerQuest.connect(playerA).unloadItem(3)
      ).to.be.revertedWith('RenovaQuest::unloadItem Item not loaded.');
      await multiplayerQuest.connect(playerA).unloadItem(1);

      expect(await renovaItem.ownerOf(1)).to.equal(await playerA.getAddress());
      expect(await renovaItem.ownerOf(2)).to.equal(
        await multiplayerQuest.getAddress()
      );

      expect(
        await multiplayerQuest.numLoadedItems(await playerA.getAddress())
      ).to.equal(1);

      await multiplayerQuest.connect(playerA).unloadAllItems();

      expect(
        await multiplayerQuest.numLoadedItems(await playerA.getAddress())
      ).to.equal(0);

      expect(await renovaItem.ownerOf(1)).to.equal(await playerA.getAddress());
      expect(await renovaItem.ownerOf(2)).to.equal(await playerA.getAddress());

      await multiplayerQuest.connect(playerA).loadItems([2]);

      expect(
        await multiplayerQuest.numLoadedItems(await playerA.getAddress())
      ).to.equal(1);
    });

    it('should deposit assets', async () => {
      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(1_000)
      );

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress()
        )
      ).to.equal(0);

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          ZERO_ADDRESS
        )
      ).to.equal(0);

      await testERC20A
        .connect(playerA)
        .approve(await renovaCommandDeck.getAddress(), toWei(10));

      await soloQuest
        .connect(questOwner)
        .updateTokenAuthorization(ZERO_ADDRESS, true);
      await soloQuest
        .connect(questOwner)
        .updateTokenAuthorization(await testERC20A.getAddress(), true);

      await soloQuest.connect(playerA).depositTokens(
        [
          { token: await testERC20A.getAddress(), amount: toWei(10) },
          { token: ZERO_ADDRESS, amount: toWei(5) },
        ],
        { value: toWei(5) }
      );

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(990)
      );

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress()
        )
      ).to.equal(toWei(10));

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          ZERO_ADDRESS
        )
      ).to.equal(toWei(5));

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20B.getAddress()
        )
      ).to.equal(toWei(0));
    });

    it('should trade', async () => {
      await soloQuest
        .connect(questOwner)
        .updateTokenAuthorization(await testERC20B.getAddress(), true);

      const quote1 = {
        pool: ZERO_ADDRESS,
        externalAccount: ZERO_ADDRESS,
        trader: await soloQuest.getAddress(),
        effectiveTrader: await playerA.getAddress(),
        baseToken: await testERC20A.getAddress(),
        maxBaseTokenAmount: toWei(1),
        quoteToken: await testERC20B.getAddress(),
        maxQuoteTokenAmount: toWei(2),
        effectiveBaseTokenAmount: toWei(1),
        quoteExpiry: baselineTimestamp + 3600,
        nonce: 0,
        txid: zeroPad(Buffer.from(''), 32),
        signature: zeroPad(Buffer.from(''), 65),
      };

      const quote2 = {
        pool: ZERO_ADDRESS,
        externalAccount: ZERO_ADDRESS,
        trader: await soloQuest.getAddress(),
        effectiveTrader: await playerA.getAddress(),
        baseToken: ZERO_ADDRESS,
        maxBaseTokenAmount: toWei(1),
        quoteToken: await testERC20B.getAddress(),
        maxQuoteTokenAmount: toWei(2),
        effectiveBaseTokenAmount: toWei(1),
        quoteExpiry: baselineTimestamp + 3600,
        nonce: 0,
        txid: zeroPad(Buffer.from(''), 32),
        signature: zeroPad(Buffer.from(''), 65),
      };

      await expect(soloQuest.connect(playerA).trade(quote1)).to.be.revertedWith(
        'RenovaQuest::trade Quest is not ongoing.'
      );

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + 100,
      ]);

      await soloQuest.connect(playerA).trade(quote1);

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress()
        )
      ).to.equal(toWei(9));

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20B.getAddress()
        )
      ).to.equal(toWei(2));

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          ZERO_ADDRESS
        )
      ).to.equal(toWei(5));

      await soloQuest.connect(playerA).trade(quote2);

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20A.getAddress()
        )
      ).to.equal(toWei(9));

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          await testERC20B.getAddress()
        )
      ).to.equal(toWei(4));

      expect(
        await soloQuest.portfolioTokenBalances(
          await playerA.getAddress(),
          ZERO_ADDRESS
        )
      ).to.equal(toWei(4));
    });

    it('should withdraw assets', async () => {
      await expect(
        soloQuest.connect(playerA).withdrawTokens([ZERO_ADDRESS])
      ).to.be.revertedWith('RenovaQuest::withdrawTokens Quest is ongoing.');

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + 150,
      ]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(990)
      );

      const ethBalanceBefore = await playerA.provider!.getBalance(
        await playerA.getAddress()
      );

      await soloQuest.connect(playerA).withdrawTokens([ZERO_ADDRESS]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(990)
      );

      const ethBalanceAfter = await playerA.provider!.getBalance(
        await playerA.getAddress()
      );

      expect(ethBalanceAfter - toWei(3)).gt(ethBalanceBefore);

      await soloQuest
        .connect(playerA)
        .withdrawTokens([
          await testERC20A.getAddress(),
          await testERC20B.getAddress(),
        ]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(999)
      );

      expect(await testERC20B.balanceOf(await playerA.getAddress())).to.equal(
        toWei(1004)
      );

      await soloQuest
        .connect(playerA)
        .withdrawTokens([
          await testERC20A.getAddress(),
          await testERC20B.getAddress(),
          ZERO_ADDRESS,
        ]);

      expect(await testERC20A.balanceOf(await playerA.getAddress())).to.equal(
        toWei(999)
      );

      expect(await testERC20B.balanceOf(await playerA.getAddress())).to.equal(
        toWei(1004)
      );
    });

    it('should unload items', async () => {
      expect(await renovaItem.ownerOf(2)).to.equal(
        await multiplayerQuest.getAddress()
      );

      await multiplayerQuest.connect(playerA).unloadAllItems();

      expect(await renovaItem.ownerOf(2)).to.equal(await playerA.getAddress());
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
