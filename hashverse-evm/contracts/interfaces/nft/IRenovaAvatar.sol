// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import './IRenovaAvatarBase.sol';

/// @title IRenovaAvatar
/// @author Victor Ionescu
/// @notice See {IRenovaAvatarBase}
/// @dev Deployed on the main chain.
interface IRenovaAvatar is IRenovaAvatarBase {
    /// @notice Emitted when the Avatar is minted to another chain.
    /// @param player The owner of the Avatar.
    /// @param faction The faction of the Avatar.
    /// @param race The race of the Avatar.
    /// @param gender The gender of the Avatar.
    /// @param dstWormholeChainId The Wormhole Chain ID of the destination chain.
    /// @param sequence The Sequence number of the Wormhole message.
    event XChainMintOut(
        address indexed player,
        RenovaFaction faction,
        RenovaRace race,
        RenovaGender gender,
        uint16 dstWormholeChainId,
        uint256 sequence,
        uint256 relayerFee
    );

    /// @notice Emitted when the StakingVault contract that tracks veHFT is updated.
    /// @param stakingVault The address of the new StakingVault contract.
    /// @param prevStakingVault The address of the previous StakingVault contract.
    event UpdateStakingVault(address stakingVault, address prevStakingVault);

    /// @notice Emitted when the minimum stake power required to mint changes.
    /// @param minStakePower The new required minimum stake power.
    event UpdateMinStakePower(uint256 minStakePower);

    /// @notice Initializer function.
    /// @param renovaCommandDeck The Renova Command Deck.
    /// @param stakingVault The address of the StakingVault contract.
    /// @param minStakePower The minimum amount of stake power required to mint an Avatar.
    /// @param wormhole The Wormhole Endpoint. See {IWormholeBaseUpgradeable}.
    /// @param wormholeConsistencyLevel The Wormhole Consistency Level. See {IWormholeBaseUpgradeable}.
    function initialize(
        address renovaCommandDeck,
        address stakingVault,
        uint256 minStakePower,
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external;

    /// @notice Updates the StakingVault contract used to track veHFT.
    /// @param stakingVault The address of the new StakingVault contract.
    function updateStakingVault(address stakingVault) external;

    /// @notice Updates the minimum stake power required to mint an Avatar.
    /// @param minStakePower The new minimum stake power required.
    function updateMinStakePower(uint256 minStakePower) external;

    /// @notice Mints an Avatar. Requires a minimum amount of stake power.
    /// @param faction The faction of the Avatar.
    /// @param race The race of the Avatar.
    /// @param gender The gender of the Avatar.
    function mint(
        RenovaFaction faction,
        RenovaRace race,
        RenovaGender gender
    ) external;

    /// @notice Mints the Avatar cross-chain, via Wormhole.
    /// @param dstWormholeChainId The Wormhole Chain ID of the chain to mint on. See {IWormholeBaseUpgradeable}.
    function wormholeMintSend(
        uint16 dstWormholeChainId,
        uint256 wormholeMessageFee
    ) external payable;
}