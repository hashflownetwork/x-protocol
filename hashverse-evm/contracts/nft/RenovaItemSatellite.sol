// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../interfaces/nft/IRenovaItemSatellite.sol';

import './RenovaItemBase.sol';

/// @title RenovaItemSatellite
/// @author Victor Ionescu
/// @notice See {IRenovaItemSatellite}
contract RenovaItemSatellite is IRenovaItemSatellite, RenovaItemBase {
    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @inheritdoc IRenovaItemSatellite
    function initialize(
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external override initializer {
        __RenovaItemBase_init(wormhole, wormholeConsistencyLevel);
    }
}