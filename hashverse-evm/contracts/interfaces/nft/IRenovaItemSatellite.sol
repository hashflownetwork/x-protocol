// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import './IRenovaItemBase.sol';

/// @title IRenovaItemSatellite
/// @author Victor Ionescu
/// @notice See {IRenovaItemBase}
/// @dev Deployed on the satellite chain.
interface IRenovaItemSatellite is IRenovaItemBase {
    /// @notice Initializer function.
    /// @param wormhole The Wormhole Endpoint address. See {IWormholeBaseUpgradeable}.
    /// @param wormholeConsistencyLevel The Wormhole Consistency Level. See {IWormholeBaseUpgradeable}.
    function initialize(
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external;
}
