// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../interfaces/nft/IRenovaItem.sol';

import './RenovaItemBase.sol';

/// @title RenovaItem
/// @author Victor Ionescu
/// @notice See {IRenovaItem}
contract RenovaItem is IRenovaItem, RenovaItemBase {
    mapping(address => bool) internal _authorizedMinter;

    uint256 private _numMintedItems;

    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @inheritdoc IRenovaItem
    function initialize(
        address minter,
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external override initializer {
        __RenovaItemBase_init(wormhole, wormholeConsistencyLevel);

        _authorizedMinter[minter] = true;
        _numMintedItems = 0;

        emit UpdateMinterAuthorization(minter, true);
    }

    /// @inheritdoc IRenovaItem
    function mint(address tokenOwner, uint256 hashverseItemId) external {
        require(
            _authorizedMinter[_msgSender()],
            'RenovaItem::mint Unauthorized minter.'
        );

        _numMintedItems++;

        _mintItem(tokenOwner, _numMintedItems, hashverseItemId);
    }

    /// @inheritdoc IRenovaItem
    function updateMinterAuthorization(
        address minter,
        bool status
    ) external override onlyOwner {
        _authorizedMinter[minter] = status;

        emit UpdateMinterAuthorization(minter, status);
    }
}