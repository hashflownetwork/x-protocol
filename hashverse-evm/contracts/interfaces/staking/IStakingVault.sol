// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

/// @title A vault used for staking tokens (HFT) for periods of time.
/// @author Victor Ionescu
/**
 * @notice Users can stake HFT for specified periods of time. Once the initial stake
 * has been performed, a user can increase either the amount staked or the stake time lock
 * arbitrarily.
 *
 * Once the lock expires, tokens can be withdrawn in full or partially re-staked.
 *
 * A user can transfer their stake to a different vault. When that happens, the lock
 * expiry that is at a later point in time takes precedence.
 */
interface IStakingVault {
    /// @notice Represents the stake a user has in the vault.
    struct Stake {
        uint128 amount;
        uint64 lockExpiry;
    }

    // Events.

    /// @notice Emitted every time a user's stake changes.
    event StakeChanged(
        address indexed account,
        uint128 amount,
        uint64 lockExpiry
    );

    /// @notice Emitted when a user boosts either the value or the lock of their stake.
    event BoostHFTStake(
        address indexed account,
        uint128 amount,
        uint64 daysStaked
    );

    /// @notice Emitted when HFT is withdrawn.
    event WithdrawHFT(
        address indexed account,
        uint128 amountWithdrawn,
        uint128 amountRestaked
    );

    /// @notice Emitted when a stake is transferred to a different vault.
    event TransferHFTStake(
        address indexed account,
        address targetVault,
        uint128 amount
    );

    /// @notice Emitted when the max number of staking days is updated.
    event UpdateMaxDaysToStake(uint16 maxDaysToStake);

    /// @notice Emitted when a source vault authorization status changes.
    event UpdateSourceVaultAuthorization(address vault, bool isAuthorized);

    /// @notice Emitted when a target vault authorization status changes.
    event UpdateTargetVaultAuthorization(address vault, bool isAuthorized);

    // Auto-generated functions.

    /// @notice Returns the stake that a user has.
    function stakes(address user) external returns (uint128, uint64);

    /// @notice Returns the authorization status of a vault to receive HFT from.
    /// @param vault The source vault.
    /// @return The authorization status.
    function sourceVaultAuthorization(address vault) external returns (bool);

    /// @notice Returns the authorization status of a vault to send HFT to.
    /// @param vault The source vault.
    /// @return The authorization status.
    function targetVaultAuthorization(address vault) external returns (bool);

    // Functions.

    /// @notice The total (voting) power of a user's stake.
    /// @param user The user to compute the power for.
    /// @return Total stake power.
    function getStakePower(address user) external view returns (uint256);

    /// @notice Increases the amount or the lock of a stake, or both.
    /// @param amount Amount to increase the stake by.
    /// @param daysToStake Days to increase the stake lock by.
    function boostHFTStake(uint128 amount, uint16 daysToStake) external;

    /**
     * @notice Increases the amount or the lock of a stake, or both.
     *
     * Uses an ERC-721 permit for HFT allowance.
     */
    /// @param amount Amount to increase the stake by.
    /// @param daysToStake Days to increase the stake lock by.
    /// @param deadline Deadline of permit.
    /// @param v v-part of the permit signature.
    /// @param r r-part of the permit signature.
    /// @param s s-part of the permit signature.
    /// @param approvalAmount Amount of HFT to spend that the permit approves.
    function boostHFTStakeWithPermit(
        uint128 amount,
        uint16 daysToStake,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        uint256 approvalAmount
    ) external;

    /// @notice Increases the HFT amount of a user's stake.
    /// @param user The user to increase the stake for.
    /// @param amount Amount by which the stake needs to be increased.
    /// @dev Can only be called by a contract.
    function increaseHFTStakeAmountFor(address user, uint128 amount) external;

    /// @notice Withdraws HFT to the user.
    /// @param amountToRestake Amount of HFT to re-stake instead of withdrawing.
    /// @param daysToRestake Number of days to lock the re-staked portion.
    function withdrawHFT(
        uint128 amountToRestake,
        uint16 daysToRestake
    ) external;

    /// @notice Transfers a user's stake to another vault.
    /// @param targetVault The address of the target vault.
    function transferHFTStake(address targetVault) external;

    /// @notice Receives a stake transfer that is issued via transferHFTStake.
    /// @param user The user to receive the transfer for.
    /// @param amount Amount of stake to receive.
    /// @param lockExpiry Lock expiry in the source vault.
    function receiveHFTStakeTransfer(
        address user,
        uint128 amount,
        uint64 lockExpiry
    ) external;

    // Admin.

    /// @notice Updates the max staking period, in days.
    /// @param maxDaysToStake The new max number of days a user is allowed to stake.
    function updateMaxDaysToStake(uint16 maxDaysToStake) external;

    /// @notice Updates the authorization status of a source vault, for stake transfer.
    /// @param vault The vault to update the authorization for.
    /// @param isAuthorized The new authorization status.
    function updateSourceVaultAuthorization(
        address vault,
        bool isAuthorized
    ) external;

    /// @notice Updates the authorization status of a target vault, for stake transfer.
    /// @param vault The vault to update the authorization for.
    /// @param isAuthorized The new authorization status.
    function updateTargetVaultAuthorization(
        address vault,
        bool isAuthorized
    ) external;
}
