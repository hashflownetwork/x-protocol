// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

import '../interfaces/staking/IStakingVault.sol';

contract StakingVault is IStakingVault, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Permit;
    using Address for address;

    address public immutable hft;

    uint16 public maxDaysToStake;

    mapping(address => Stake) public stakes;

    mapping(address => bool) public sourceVaultAuthorization;
    mapping(address => bool) public targetVaultAuthorization;

    constructor(address _hft) {
        require(
            _hft != address(0),
            'StakingVault::constructor HFT is 0 address.'
        );
        hft = _hft;

        // 4 years by default.
        maxDaysToStake = 4 * 365;
    }

    function getStakePower(
        address user
    ) external view override returns (uint256) {
        uint256 timeUntilExpiry = 0;

        Stake memory stake = stakes[user];
        if (stake.lockExpiry > block.timestamp) {
            timeUntilExpiry = uint256(stake.lockExpiry) - block.timestamp;
        }

        /**
         * @dev We give 1 power for every 4 years of HFT collectively locked
         * in the vault by the user.
         */
        return (stake.amount * timeUntilExpiry) / (4 * (365 days));
    }

    function boostHFTStake(
        uint128 amount,
        uint16 daysToStake
    ) external override {
        _boostHFTStake(msg.sender, amount, daysToStake);

        emit BoostHFTStake(msg.sender, amount, daysToStake);

        IERC20(hft).safeTransferFrom(msg.sender, address(this), amount);
    }

    function boostHFTStakeWithPermit(
        uint128 amount,
        uint16 daysToStake,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        uint256 approvalAmount
    ) external override {
        _boostHFTStake(msg.sender, amount, daysToStake);

        emit BoostHFTStake(msg.sender, amount, daysToStake);

        IERC20Permit(hft).safePermit(
            msg.sender,
            address(this),
            approvalAmount,
            deadline,
            v,
            r,
            s
        );

        IERC20(hft).safeTransferFrom(msg.sender, address(this), amount);
    }

    function increaseHFTStakeAmountFor(
        address user,
        uint128 amount
    ) external override {
        require(
            msg.sender.isContract(),
            'StakingVault::increaseHFTStakeAmountFor Caller should be contract.'
        );

        _boostHFTStake(user, amount, 0);

        emit BoostHFTStake(user, amount, 0);

        IERC20(hft).safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdrawHFT(
        uint128 amountToRestake,
        uint16 daysToRestake
    ) external override {
        Stake memory currentStake = stakes[msg.sender];

        require(
            currentStake.lockExpiry <= block.timestamp,
            'StakingVault::withdrawHFT HFT is locked.'
        );
        require(
            currentStake.amount > 0,
            'StakingVault::withdrawHFT No HFT staked.'
        );

        uint128 amountToWithdraw = currentStake.amount;

        if (amountToRestake > 0) {
            require(
                daysToRestake > 0,
                'StakingVault::withdrawHFT Time lock not specified.'
            );
            require(
                amountToRestake <= currentStake.amount,
                'StakingVault::withdrawHFT Re-stake amount too high.'
            );

            amountToWithdraw -= amountToRestake;
        }

        currentStake.amount = 0;

        stakes[msg.sender] = currentStake;

        emit StakeChanged(
            msg.sender,
            currentStake.amount,
            currentStake.lockExpiry
        );

        if (amountToRestake > 0) {
            _boostHFTStake(msg.sender, amountToRestake, daysToRestake);
        }

        emit WithdrawHFT(msg.sender, amountToWithdraw, amountToRestake);

        if (amountToWithdraw > 0) {
            IERC20(hft).safeTransfer(msg.sender, amountToWithdraw);
        }
    }

    function transferHFTStake(
        address targetVault
    ) external override nonReentrant {
        require(
            targetVaultAuthorization[targetVault],
            'StakingVault::transferHFTStake Target Vault not authorized.'
        );

        Stake memory currentStake = stakes[msg.sender];

        require(
            currentStake.amount > 0,
            'StakingVault::transferHFTStake No HFT locked.'
        );

        uint128 amountToTransfer = currentStake.amount;
        uint64 lockExpiryToTransfer = currentStake.lockExpiry;

        currentStake.amount = 0;
        currentStake.lockExpiry = 0;

        stakes[msg.sender] = currentStake;

        emit StakeChanged(
            msg.sender,
            currentStake.amount,
            currentStake.lockExpiry
        );

        emit TransferHFTStake(msg.sender, targetVault, amountToTransfer);

        IERC20(hft).safeIncreaseAllowance(
            targetVault,
            uint256(amountToTransfer)
        );

        IStakingVault(targetVault).receiveHFTStakeTransfer(
            msg.sender,
            amountToTransfer,
            lockExpiryToTransfer
        );

        require(
            IERC20(hft).allowance(address(this), targetVault) == 0,
            'StakingVault::transferHFTStake HFT not spent.'
        );
    }

    function receiveHFTStakeTransfer(
        address user,
        uint128 amount,
        uint64 lockExpiry
    ) external override nonReentrant {
        require(
            sourceVaultAuthorization[msg.sender],
            'StakingVault::receiveHFTStakeTransfer Source Vault not authorized.'
        );
        uint64 newExpiry = lockExpiry;

        Stake memory currentStake = stakes[user];

        if (currentStake.lockExpiry > newExpiry) {
            newExpiry = currentStake.lockExpiry;
        }

        require(
            newExpiry <=
                (uint64(block.timestamp) +
                    uint64(maxDaysToStake) *
                    uint64(1 days)),
            'StakingVault::receiveHFTStakeTransfer Time lock too high.'
        );

        currentStake.lockExpiry = newExpiry;

        require(
            type(uint128).max - amount > currentStake.amount,
            'StakingVault::receiveHFTStakeTransfer amount too high.'
        );

        currentStake.amount += amount;

        stakes[user] = currentStake;

        IERC20(hft).safeTransferFrom(msg.sender, address(this), amount);
    }

    // Admin

    function updateMaxDaysToStake(
        uint16 newMaxDaysToStake
    ) external override onlyOwner {
        require(
            newMaxDaysToStake != maxDaysToStake,
            'StakingVault::updateMaxDaysToStake Number has not changed.'
        );
        maxDaysToStake = newMaxDaysToStake;

        emit UpdateMaxDaysToStake(maxDaysToStake);
    }

    function updateSourceVaultAuthorization(
        address vault,
        bool isAuthorized
    ) external override onlyOwner {
        require(
            vault != address(this),
            'StakingVault::updateSourceVaultAuthorization Cannot self-authorize.'
        );
        require(
            sourceVaultAuthorization[vault] != isAuthorized,
            'StakingVault::updateSourceVaultAuthorization No-op.'
        );
        sourceVaultAuthorization[vault] = isAuthorized;

        emit UpdateSourceVaultAuthorization(vault, isAuthorized);
    }

    function updateTargetVaultAuthorization(
        address vault,
        bool isAuthorized
    ) external override onlyOwner {
        require(
            vault != address(this),
            'StakingVault::updateTargetVaultAuthorization Cannot self-authorize.'
        );
        require(
            targetVaultAuthorization[vault] != isAuthorized,
            'StakingVault::updateTargetVaultAuthorization No-op.'
        );
        targetVaultAuthorization[vault] = isAuthorized;

        emit UpdateTargetVaultAuthorization(vault, isAuthorized);
    }

    function renounceOwnership() public view override onlyOwner {
        revert('StakingVault::renounceOwnership Cannot renounce ownership.');
    }

    // Internal functions.

    function _boostHFTStake(
        address user,
        uint128 amount,
        uint16 daysToStake
    ) internal {
        require(
            amount > 0 || daysToStake > 0,
            'StakingVault::_boostHFTStake Amount or days have to be > 0'
        );
        Stake memory currentStake = stakes[user];

        if (daysToStake > 0) {
            uint64 timeUntilExpiry = 0;
            if (currentStake.lockExpiry > block.timestamp) {
                timeUntilExpiry =
                    currentStake.lockExpiry -
                    uint64(block.timestamp);
            }

            uint64 extraLockTime = uint64(daysToStake) * uint64(1 days);

            require(
                extraLockTime + timeUntilExpiry <=
                    uint64(maxDaysToStake) * uint64(1 days),
                'StakingVault::_boostHFTStake Time lock too high'
            );

            if (timeUntilExpiry > 0) {
                currentStake.lockExpiry += extraLockTime;
            } else {
                currentStake.lockExpiry =
                    uint64(block.timestamp) +
                    extraLockTime;
            }
        }

        if (amount > 0) {
            require(
                type(uint128).max - currentStake.amount > amount,
                'StakingVault::_boostHFTStake amount too high.'
            );
            currentStake.amount += amount;
        }

        stakes[user] = currentStake;

        emit StakeChanged(user, currentStake.amount, currentStake.lockExpiry);
    }
}
