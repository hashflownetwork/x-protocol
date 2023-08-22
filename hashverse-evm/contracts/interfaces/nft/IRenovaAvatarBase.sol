// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../external/erc/IERC4906Upgradeable.sol';

/// @title IRenovaAvatarBase
/// @author Victor Ionescu
/**
@notice NFT base contract holding Avatars. In order to play in the Hashverse players
have to mint an Avatar. Avatars are soul-bound (non-transferrable) and represent
the entirety of a player's journey in the Hashverse.

Avatars can be minted on multiple chains. Minting new Avatars can only happen on the
main chain. Once an Avatar is minted on the main chain, it can be minted on satellite
chains by making cross-chain calls.

Players have to mint Avatars on each chain if they want to enter a quest that is
occurring on that particular chain.
*/
interface IRenovaAvatarBase is IERC4906Upgradeable {
    enum RenovaFaction {
        RESISTANCE,
        SOLUS
    }

    enum RenovaRace {
        GUARDIAN,
        EX_GUARDIAN,
        WARDEN_DROID,
        HASHBOT
    }

    enum RenovaGender {
        MALE,
        FEMALE
    }

    /// @notice Emitted when an Avatar is minted.
    /// @param player The owner of the Avatar.
    /// @param faction The faction of the Avatar.
    /// @param race The race of the Avatar.
    /// @param gender The gender of the Avatar.
    event Mint(
        address indexed player,
        RenovaFaction faction,
        RenovaRace race,
        RenovaGender gender
    );

    /// @notice Emitted when the Custom Metadata URI is updated.
    /// @param uri The new URI.
    event UpdateCustomURI(string uri);

    /// @notice Returns the faction of a player.
    /// @param player The player.
    /// @return The faction.
    function factions(address player) external returns (RenovaFaction);

    /// @notice Returns the race of a player.
    /// @param player The player.
    /// @return The race.
    function races(address player) external returns (RenovaRace);

    /// @notice Returns the gender of a player.
    /// @param player The player.
    /// @return The gender.
    function genders(address player) external returns (RenovaGender);

    /// @notice Returns the token ID of a player.
    /// @param player The player.
    /// @return The token ID.
    function tokenIds(address player) external returns (uint256);

    /// @notice Sets a custom base URI for the token metadata.
    /// @param customBaseURI The new Custom URI.
    function setCustomBaseURI(string memory customBaseURI) external;

    /// @notice Emits a refresh metadata event for a token.
    /// @param tokenId The ID of the token.
    function refreshMetadata(uint256 tokenId) external;

    /// @notice Emits a refresh metadata event for all tokens.
    function refreshAllMetadata() external;
}