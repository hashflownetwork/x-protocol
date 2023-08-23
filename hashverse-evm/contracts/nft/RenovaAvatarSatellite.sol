// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../interfaces/nft/IRenovaAvatarSatellite.sol';

import './RenovaAvatarBase.sol';

/// @title RenovaAvatarSatellite
/// @author Victor Ionescu
/// @notice See {IRenovaAvatarSatellite}
contract RenovaAvatarSatellite is IRenovaAvatarSatellite, RenovaAvatarBase {
    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @inheritdoc IRenovaAvatarSatellite
    function initialize(
        address renovaCommandDeck,
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external override initializer {
        __RenovaAvatarBase_init(
            renovaCommandDeck,
            wormhole,
            wormholeConsistencyLevel
        );
    }

    /// @inheritdoc IRenovaAvatarSatellite
    function wormholeMintReceive(bytes memory vaa) external override {
        (
            uint16 emitterWormholeChainId,
            bytes memory payload
        ) = _wormholeReceive(vaa);

        (
            uint256 tokenId,
            address tokenOwner,
            RenovaFaction faction,
            uint256 characterId,
            uint16 dstWormholeChainId
        ) = abi.decode(
                payload,
                (uint256, address, RenovaFaction, uint256, uint16)
            );

        require(
            _wormholeChainId == dstWormholeChainId,
            'RenovaAvatarSatellite::wormholeMintReceive Avatar should be minted on a different chain.'
        );

        _mintAvatar(tokenId, tokenOwner, faction, characterId);

        emit XChainMintIn(
            tokenOwner,
            faction,
            characterId,
            emitterWormholeChainId
        );
    }
}