// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol';

import '../interfaces/nft/IRenovaItemBase.sol';

import '../wormhole/WormholeBaseUpgradeable.sol';

/// @title RenovaItemBase
/// @author Victor Ionescu
/// @notice See {IRenovaItemBase}
abstract contract RenovaItemBase is
    IRenovaItemBase,
    WormholeBaseUpgradeable,
    ERC721RoyaltyUpgradeable
{
    string private _customBaseURI;
    mapping(uint256 => uint256) private _bridgeNonces;

    mapping(uint256 => uint256) internal _hashverseItemIds;

    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializer function.
    /// @param wormhole The Wormhole endpoint address.
    /// @param wormholeConsistencyLevel The Wormhole consistency level.
    function __RenovaItemBase_init(
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) internal onlyInitializing {
        __WormholeBaseUpgradeable_init(wormhole, wormholeConsistencyLevel);
        __ERC721_init('Renova Item', 'RNVI');
    }

    /// @inheritdoc IERC165Upgradeable
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721RoyaltyUpgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return
            interfaceId == bytes4(0x49064906) ||
            super.supportsInterface(interfaceId);
    }

    /// @inheritdoc IRenovaItemBase
    function wormholeBridgeIn(bytes memory wormholeVAA) external override {
        (
            uint16 emitterWormholeChainId,
            bytes memory payload
        ) = _wormholeReceive(wormholeVAA);

        (
            uint256 tokenId,
            address itemOwner,
            uint256 hashverseItemId,
            uint16 dstWormholeChainId,
            uint256 bridgeNonce
        ) = abi.decode(payload, (uint256, address, uint256, uint16, uint256));

        require(
            _wormholeChainId == dstWormholeChainId,
            'RenovaItemBase::wormholeBridgeIn Item sent to different chain.'
        );

        require(
            bridgeNonce > _bridgeNonces[tokenId],
            'RenovaItemBase::wormholeBridgeIn Invalid nonce.'
        );

        emit XChainBridgeIn(
            itemOwner,
            tokenId,
            hashverseItemId,
            emitterWormholeChainId
        );

        _bridgeNonces[tokenId] = bridgeNonce;

        _mintItem(itemOwner, tokenId, hashverseItemId);
    }

    /// @inheritdoc IRenovaItemBase
    function wormholeBridgeOut(
        uint256 tokenId,
        uint16 dstWormholeChainId,
        uint256 wormholeMessageFee
    ) external payable override {
        address itemOwner = _ownerOf(tokenId);
        require(
            _msgSender() == itemOwner,
            'RenovaItemBase::wormholeBridgeOut Only owner can bridge.'
        );

        require(
            msg.value >= wormholeMessageFee,
            'RenovaItemBase::wormholeBridgeOut msg.value does not cover fees.'
        );

        require(
            _wormholeRemotes[dstWormholeChainId] != bytes32(0),
            'RenovaItemBase::wormholeBridgeOut Unsupported dst chain.'
        );

        _burn(tokenId);

        _bridgeNonces[tokenId] += 1;

        uint256 bridgedHashverseItemId = _hashverseItemIds[tokenId];

        bytes memory payload = abi.encode(
            tokenId,
            itemOwner,
            bridgedHashverseItemId,
            dstWormholeChainId,
            _bridgeNonces[tokenId]
        );

        delete _hashverseItemIds[tokenId];

        uint64 sequence = _wormholeSend(0, payload, wormholeMessageFee);

        emit XChainBridgeOut(
            _msgSender(),
            tokenId,
            bridgedHashverseItemId,
            dstWormholeChainId,
            sequence,
            msg.value - wormholeMessageFee
        );
    }

    /// @inheritdoc IERC721MetadataUpgradeable
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        string memory tokenURIPrefix = ERC721Upgradeable.tokenURI(tokenId);

        return
            bytes(tokenURIPrefix).length > 0
                ? string(abi.encodePacked(tokenURIPrefix, '.json'))
                : '';
    }

    // Admin.

    /// @inheritdoc IRenovaItemBase
    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) external override onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /// @inheritdoc IRenovaItemBase
    function setCustomBaseURI(
        string memory customBaseURI
    ) external override onlyOwner {
        _customBaseURI = customBaseURI;

        emit UpdateCustomURI(_customBaseURI);

        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    /// @inheritdoc IRenovaItemBase
    function refreshMetadata(uint256 tokenId) external override onlyOwner {
        emit MetadataUpdate(tokenId);
    }

    /// @inheritdoc IRenovaItemBase
    function refreshAllMetadata() external override onlyOwner {
        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    /// @inheritdoc OwnableUpgradeable
    function renounceOwnership() public view override onlyOwner {
        revert('RenovaItemBase::renounceOwnership Cannot renounce ownership.');
    }

    /// @notice Mints an item.
    /// @param tokenOwner The owner of the item.
    /// @param tokenId The token ID.
    /// @param hashverseItemId The Hashverse Item ID.
    function _mintItem(
        address tokenOwner,
        uint256 tokenId,
        uint256 hashverseItemId
    ) internal virtual {
        _safeMint(tokenOwner, tokenId);

        _hashverseItemIds[tokenId] = hashverseItemId;

        emit Mint(tokenOwner, tokenId, hashverseItemId);
    }

    /// @notice Returns the custom base URI.
    /// @return The base URI.
    function _baseURI() internal view override returns (string memory) {
        return _customBaseURI;
    }
}
