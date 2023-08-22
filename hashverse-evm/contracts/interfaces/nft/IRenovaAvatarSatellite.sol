// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import './IRenovaAvatarBase.sol';

/// @title IRenovaAvatarSatellite
/// @author Victor Ionescu
/// @notice See {IRenovaAvatarBase}
/// @dev Deployed on the satellite chain.
interface IRenovaAvatarSatellite is IRenovaAvatarBase {
    /// @notice Emitted when an Avatar is minted from a cross-chain call.
    /// @param player The owner of the Avatar.
    /// @param faction The faction of the Avatar.
    /// @param race The race of the Avatar.
    /// @param gender The gender of the Avatar.
    /// @param srcWormholeChainId The source chain that minted the Avatar.
    event XChainMintIn(
        address indexed player,
        RenovaFaction faction,
        RenovaRace race,
        RenovaGender gender,
        uint16 srcWormholeChainId
    );

    /// @notice Initializer function.
    /// @param renovaCommandDeck The Renova Command Deck.
    /// @param wormhole The Wormhole Endpoint. See {IWormholeBaseUpgradeable}.
    /// @param wormholeConsistencyLevel The Wormhole Consistency Level. See {IWormholeBaseUpgradeable}.
    function initialize(
        address renovaCommandDeck,
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external;

    /// @notice Mints an Avatar on a satellite chain, via Wormhole.
    /// @param vaa The Wormhole VAA.
    function wormholeMintReceive(bytes memory vaa) external;
}