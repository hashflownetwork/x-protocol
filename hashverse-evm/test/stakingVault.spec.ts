import { Signer } from 'ethers';
import * as hre from 'hardhat';
import { expect } from 'chai';

import { HFT, StakingVault, TestERC1271 } from '../types';
import { signERC20Permit, toWei } from './utils';

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

describe('StakingVault', () => {
  let hft: HFT;
  let stakingVault: StakingVault;
  let stakingVaultForMigration: StakingVault;

  let user: Signer;
  let contractUser: Signer;

  let erc1271Contract: TestERC1271;

  let baselineTimestamp: number;

  before(async () => {
    // Initialize HFT.
    const hftFactory = await hre.ethers.getContractFactory('HFT');
    hft = await hftFactory.deploy();

    // Initialize vaults.
    const stakingVaultFactory = await hre.ethers.getContractFactory(
      'StakingVault'
    );
    stakingVault = await stakingVaultFactory.deploy(await hft.getAddress());

    stakingVaultForMigration = await stakingVaultFactory.deploy(
      await hft.getAddress()
    );

    // Initialize users.
    const signers = await hre.ethers.getSigners();
    user = signers[0];
    contractUser = signers[1];

    // Deploy Test ERC1271
    const erc1271Factory = await hre.ethers.getContractFactory('TestERC1271');
    erc1271Contract = await erc1271Factory.deploy(
      await contractUser.getAddress()
    );

    // Mint HFT to users.
    await hft.mint(await user.getAddress(), toWei(1000));
    await hft.mint(await erc1271Contract.getAddress(), toWei(1000));

    baselineTimestamp = Math.floor(Date.now()) + 100;
  });

  describe('Stake', () => {
    it('should stake', async () => {
      await expect(
        stakingVault.connect(user).boostHFTStake(toWei(10), 2 * 365)
      ).to.be.revertedWith('ERC20: insufficient allowance');

      await hft
        .connect(user)
        .approve(await stakingVault.getAddress(), toWei(20));

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp,
      ]);

      await stakingVault.connect(user).boostHFTStake(toWei(10), 2 * 365);

      const power = await stakingVault.getStakePower(await user.getAddress());

      expect(power).to.equal(toWei(5));
    });

    // Stake: 10 HFT for 2 years.

    it('should increase HFT staked', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + ONE_YEAR_SECONDS,
      ]);

      await stakingVault.connect(user).boostHFTStake(toWei(10), 0);

      const power = await stakingVault.getStakePower(await user.getAddress());

      expect(power).to.equal(toWei(5));
    });

    // Stake: 20 HFT for 1 year.

    it('should extend HFT lock', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + ONE_YEAR_SECONDS + ONE_YEAR_SECONDS / 2,
      ]);

      await stakingVault.connect(user).boostHFTStake(0, 365);

      const power = await stakingVault.getStakePower(await user.getAddress());

      expect(power).to.equal(toWei(5) + toWei(5) / BigInt(2));

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + ONE_YEAR_SECONDS + ONE_YEAR_SECONDS / 2 + 1,
      ]);

      await expect(
        stakingVault.connect(user).boostHFTStake(0, 3 * 365)
      ).to.be.revertedWith('StakingVault::_boostHFTStake Time lock too high');
    });

    // Stake: 20HFT for 1.5 years.

    it('should stake with permit', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + ONE_YEAR_SECONDS + ONE_YEAR_SECONDS / 2 + 2,
      ]);

      await expect(
        stakingVault.connect(user).boostHFTStake(toWei(10), 0)
      ).to.be.revertedWith('ERC20: insufficient allowance');

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp + ONE_YEAR_SECONDS + ONE_YEAR_SECONDS,
      ]);

      const approvalDeadline =
        baselineTimestamp + ONE_YEAR_SECONDS + ONE_YEAR_SECONDS + 1;

      const { r, s, v } = await signERC20Permit(
        user,
        await stakingVault.getAddress(),
        hft,
        '1',
        toWei(20),
        approvalDeadline
      );

      await stakingVault
        .connect(user)
        .boostHFTStakeWithPermit(
          toWei(10),
          0,
          approvalDeadline,
          v,
          r,
          s,
          toWei(20)
        );

      const power = await stakingVault.getStakePower(await user.getAddress());

      expect(power).to.equal(toWei(5) + toWei(5) / BigInt(2));
    });

    // Stake: 30 HFT for 1 year.

    it('should stake from ERC1271', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 -
          1,
      ]);

      await erc1271Contract.approve(
        await hft.getAddress(),
        await stakingVault.getAddress(),
        toWei(100)
      );

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2,
      ]);
      await erc1271Contract.boostHFTStake(
        await stakingVault.getAddress(),
        toWei(10),
        2 * 365
      );

      const power = await stakingVault.getStakePower(
        await erc1271Contract.getAddress()
      );

      expect(power).to.equal(toWei(5));
    });

    // Stake: 30 HFT for 0.5 years.
    // Contract Stake: 10 HFT for 2 years.
  });

  describe('Withdraw', () => {
    it('should withdraw HFT', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 +
          1,
      ]);

      await expect(
        stakingVault.connect(user).withdrawHFT(toWei(10), 0)
      ).to.be.revertedWith('StakingVault::withdrawHFT HFT is locked.');

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS,
      ]);

      await expect(
        stakingVault.connect(user).withdrawHFT(toWei(10), 0)
      ).to.be.revertedWith(
        'StakingVault::withdrawHFT Time lock not specified.'
      );

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2,
      ]);

      await stakingVault.connect(user).withdrawHFT(toWei(10), 365);

      expect(await hft.balanceOf(await user.getAddress())).to.equal(toWei(990));

      const power = await stakingVault.getStakePower(await user.getAddress());
      const contractPower = await stakingVault.getStakePower(
        await erc1271Contract.getAddress()
      );

      expect(power).to.equal(toWei(10) / BigInt(4));
      expect(contractPower).to.equal(toWei(10) / BigInt(4));
    });

    // Stake: 10 HFT for 1 year.
    // Contract Stake: 10 HFT for 1 year.
  });

  describe('Transfer', () => {
    it('should transfer stake', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 +
          1,
      ]);

      await expect(
        stakingVault
          .connect(user)
          .transferHFTStake(await stakingVaultForMigration.getAddress())
      ).to.be.revertedWith(
        'StakingVault::transferHFTStake Target Vault not authorized.'
      );
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 +
          2,
      ]);

      await stakingVault.updateTargetVaultAuthorization(
        await stakingVaultForMigration.getAddress(),
        true
      );

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 +
          3,
      ]);

      await expect(
        stakingVault
          .connect(user)
          .transferHFTStake(await stakingVaultForMigration.getAddress())
      ).to.be.revertedWith(
        'StakingVault::receiveHFTStakeTransfer Source Vault not authorized.'
      );

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 +
          4,
      ]);

      await stakingVaultForMigration.updateSourceVaultAuthorization(
        await stakingVault.getAddress(),
        true
      );

      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS / 2 +
          ONE_YEAR_SECONDS / 4,
      ]);

      await stakingVault
        .connect(user)
        .transferHFTStake(await stakingVaultForMigration.getAddress());
      const userPowerSource = await stakingVault.getStakePower(
        await user.getAddress()
      );

      expect(userPowerSource).to.eq(0);

      const userPowerTarget = await stakingVaultForMigration.getStakePower(
        await user.getAddress()
      );

      expect(userPowerTarget).to.eq(
        ((toWei(10) / BigInt(4)) * BigInt(3)) / BigInt(4)
      );
    });

    // Stake: 10 HFT for 0.75 years.
    // Contract Stake: 10 HFT for 0.75 years.

    it('should transfer ERC1271 stake', async () => {
      await hre.ethers.provider.send('evm_setNextBlockTimestamp', [
        baselineTimestamp +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS +
          ONE_YEAR_SECONDS,
      ]);

      await erc1271Contract.transferHFTStake(
        await stakingVault.getAddress(),
        await stakingVaultForMigration.getAddress()
      );

      const contractPowerSource = await stakingVault.getStakePower(
        await erc1271Contract.getAddress()
      );

      expect(contractPowerSource).to.eq(0);

      const contractPowerTarget = await stakingVaultForMigration.getStakePower(
        await erc1271Contract.getAddress()
      );

      expect(contractPowerTarget).to.eq(toWei(10) / BigInt(4) / BigInt(2));
    });
  });
});
