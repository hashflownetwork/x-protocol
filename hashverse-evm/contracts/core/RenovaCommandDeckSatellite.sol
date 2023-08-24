// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../interfaces/core/IRenovaCommandDeckSatellite.sol';

import './RenovaCommandDeckBase.sol';

/// @title RenovaCommandDeckSatellite
/// @author Victor Ionescu
/// @notice See {IRenovaCommandDeckSatellite}
contract RenovaCommandDeckSatellite is
    IRenovaCommandDeckSatellite,
    RenovaCommandDeckBase
{
    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @inheritdoc IRenovaCommandDeckSatellite
    function initialize(
        address _renovaAvatar,
        address _renovaItem,
        address _hashflowRouter,
        address _questOwner
    ) external override initializer {
        __RenovaCommandDeckBase_init(
            _renovaAvatar,
            _renovaItem,
            _hashflowRouter,
            _questOwner
        );
    }
}
