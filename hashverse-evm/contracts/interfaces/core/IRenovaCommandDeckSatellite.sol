// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import './IRenovaCommandDeckBase.sol';

/// @title IRenovaCommandDeck
/// @author Victor Ionescu
/// @notice See {IRenovaCommandDeckBase}
/// @dev Deployed on the satellite chain.
interface IRenovaCommandDeckSatellite is IRenovaCommandDeckBase {
    /// @notice Initializer function.
    /// @param renovaAvatar The address of the ERC721 Avatar contract.
    /// @param renovaItem The address of the ERC721 Item contract.
    /// @param hashflowRouter The address of the Hashflow Router.
    /// @param questOwner The address of the Quest Owner.
    function initialize(
        address renovaAvatar,
        address renovaItem,
        address hashflowRouter,
        address questOwner
    ) external;
}