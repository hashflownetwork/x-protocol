// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';

import '../interfaces/nft/IRenovaAvatarBase.sol';

import '../wormhole/WormholeBaseUpgradeable.sol';

/// @title RenovaAvatarBase
/// @author Victor Ionescu
/// @notice See {IRenovaAvatarBase}
abstract contract RenovaAvatarBase is
    IRenovaAvatarBase,
    WormholeBaseUpgradeable,
    ERC721Upgradeable
{
    using AddressUpgradeable for address;

    string private _customBaseURI;

    address private _renovaCommandDeck;

    /// @inheritdoc IRenovaAvatarBase
    mapping(address => RenovaFaction) public factions;

    /// @inheritdoc IRenovaAvatarBase
    mapping(address => uint256) public characterIds;

    /// @inheritdoc IRenovaAvatarBase
    mapping(address => uint256) public tokenIds;

    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Base initializer function.
    /// @param renovaCommandDeck The Renova Command Deck.
    /// @param wormhole The Wormhole endpoint address.
    /// @param wormholeConsistencyLevel The Wormhole consistency level.
    function __RenovaAvatarBase_init(
        address renovaCommandDeck,
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) internal onlyInitializing {
        __WormholeBaseUpgradeable_init(wormhole, wormholeConsistencyLevel);

        __ERC721_init('Renova Avatar', 'RNVA');

        require(
            renovaCommandDeck != address(0),
            'RenovaAvatarBase::initalize renovaCommandDeck cannot be 0 address.'
        );

        _renovaCommandDeck = renovaCommandDeck;
    }

    /// @inheritdoc IERC165Upgradeable
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return
            interfaceId == bytes4(0x49064906) ||
            super.supportsInterface(interfaceId);
    }

    /// @inheritdoc IERC721Upgradeable
    function transferFrom(
        address,
        address,
        uint256
    ) public pure override(ERC721Upgradeable, IERC721Upgradeable) {
        revert('RenovaAvatarBase::transferFrom Avatars are non-transferrable.');
    }

    /// @inheritdoc IERC721Upgradeable
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override(ERC721Upgradeable, IERC721Upgradeable) {
        revert(
            'RenovaAvatarBase::safeTransferFrom Avatars are non-transferrable.'
        );
    }

    function approve(
        address,
        uint256
    ) public pure override(ERC721Upgradeable, IERC721Upgradeable) {
        revert('RenovaAvatarBase::approve Avatars are non-transferrable.');
    }

    function setApprovalForAll(
        address,
        bool
    ) public pure override(ERC721Upgradeable, IERC721Upgradeable) {
        revert(
            'RenovaAvatarBase::setApprovalForAll Avatars are non-transferrable.'
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

    /// @inheritdoc IRenovaAvatarBase
    function setCustomBaseURI(
        string memory customBaseURI
    ) external override onlyOwner {
        _customBaseURI = customBaseURI;

        emit UpdateCustomURI(_customBaseURI);

        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    /// @inheritdoc IRenovaAvatarBase
    function refreshMetadata(uint256 tokenId) external override onlyOwner {
        emit MetadataUpdate(tokenId);
    }

    /// @inheritdoc IRenovaAvatarBase
    function refreshAllMetadata() external override onlyOwner {
        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    /// @inheritdoc OwnableUpgradeable
    function renounceOwnership() public view override onlyOwner {
        revert(
            'RenovaAvatarBase::renounceOwnership Cannot renounce ownership.'
        );
    }

    /// @notice Mints an avatar.
    /// @param tokenId The Token ID.
    /// @param tokenOwner The owner of the Avatar.
    /// @param faction The faction of the Avatar.
    /// @param characterId The Character ID of the Avatar.
    function _mintAvatar(
        uint256 tokenId,
        address tokenOwner,
        RenovaFaction faction,
        uint256 characterId
    ) internal {
        require(
            balanceOf(tokenOwner) == 0,
            'RenovaAvatarBase::_mintAvatar Cannot mint more than one Avatar.'
        );
        require(
            !_msgSender().isContract(),
            'RenovaAvatarBase::_mintAvatar Contracts cannot mint.'
        );

        factions[tokenOwner] = faction;
        characterIds[tokenOwner] = characterId;
        tokenIds[tokenOwner] = tokenId;

        _safeMint(tokenOwner, tokenId);

        emit Mint(tokenOwner, tokenId, faction, characterId);
    }

    /// @notice Returns the custom base URI.
    /// @return The base URI.
    function _baseURI() internal view override returns (string memory) {
        return _customBaseURI;
    }
}