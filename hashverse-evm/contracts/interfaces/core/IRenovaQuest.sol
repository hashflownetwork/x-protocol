// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../external/IHashflowRouter.sol';
import '../nft/IRenovaAvatarBase.sol';

/// @title IRenovaQuest
/// @author Victor Ionescu
/**
@notice Contract that represents one Quest. Every Quest gets deployed by the Command Deck.

Quests can be Solo (every player for themselves), or multiplayer (Faction vs Faction).

Quests have a start time and end time. Players can deposit assets and load items before the
Quest starts. They can unload items and withdraw assets after the quest ends.

Players need to first register for a Quest.

There can be a cap on how many players can enter a quest. There can also be a cap on how many
items a player can load for a quest.
*/
interface IRenovaQuest {
    enum QuestMode {
        SOLO,
        TEAM
    }

    struct TokenDeposit {
        address token;
        uint256 amount;
    }

    /// @notice Emitted when a token authorization status changes.
    /// @param token The address of the token.
    /// @param status Whether the token is allowed for trading.
    event UpdateTokenAuthorizationStatus(address token, bool status);

    /// @notice Emitted when a player registers for a quest.
    /// @param player The player registering for the quest.
    event RegisterPlayer(address indexed player);

    /// @notice Emitted when a player loads an item.
    /// @param player The player who loads the item.
    /// @param tokenId The Token ID of the loaded item.
    event LoadItem(address indexed player, uint256 tokenId);

    /// @notice Emitted when a player unloads an item.
    /// @param player The player who unloads the item.
    /// @param tokenId The Token ID of the unloaded item.
    event UnloadItem(address indexed player, uint256 tokenId);

    /// @notice Emitted when a player deposits a token for a Quest.
    /// @param player The player who deposits the token.
    /// @param token The address of the token (0x0 for native token).
    /// @param amount The amount of token being deposited.
    event DepositToken(address indexed player, address token, uint256 amount);

    /// @notice Emitted when a player withdraws a token from a Quest.
    /// @param player The player who withdraws the token.
    /// @param token The address of the token (0x0 for native token).
    /// @param amount The amount of token being withdrawn.
    event WithdrawToken(address indexed player, address token, uint256 amount);

    /// @notice Emitted when a player trades as part of the Quest.
    /// @param player The player who traded.
    /// @param baseToken The address of the token the player sold.
    /// @param quoteToken The address of the token the player bought.
    /// @param baseTokenAmount The amount sold.
    /// @param quoteTokenAmount The amount bought.
    event Trade(
        address indexed player,
        address baseToken,
        address quoteToken,
        uint256 baseTokenAmount,
        uint256 quoteTokenAmount
    );

    /// @notice Returns the Quest start time.
    /// @return The Quest start time.
    function startTime() external returns (uint256);

    /// @notice Returns the Quest end time.
    /// @return The Quest end time.
    function endTime() external returns (uint256);

    /// @notice Returns the address that has authority over the quest.
    /// @return The address that has authority over the quest.
    function questOwner() external returns (address);

    /// @notice Returns whether a player has registered for the Quest.
    /// @param player The address of the player.
    /// @return Whether the player has registered.
    function registered(address player) external returns (bool);

    /// @notice Used by the owner to allow / disallow a token for trading.
    /// @param token The address of the token.
    /// @param status The authorization status.
    function updateTokenAuthorization(address token, bool status) external;

    /// @notice Returns whether a token is allowed for deposits / trading.
    /// @param token The address of the token.
    /// @return Whether the token is allowed for trading.
    function allowedTokens(address token) external returns (bool);

    /// @notice Returns the number of registered players.
    /// @return The number of registered players.
    function numRegisteredPlayers() external returns (uint256);

    /// @notice Returns the number of registered players by faction.
    /// @param faction The faction.
    /// @return The number of registered players in the faction.
    function numRegisteredPlayersPerFaction(
        IRenovaAvatarBase.RenovaFaction faction
    ) external returns (uint256);

    /// @notice Returns the number of loaded items for a player.
    /// @param player The address of the player.
    /// @return The number of currently loaded items.
    function numLoadedItems(address player) external returns (uint256);

    /// @notice Returns the Token IDs for the loaded items for a player.
    /// @param player The address of the player.
    /// @param idx The index of the item in the array of loaded items.
    /// @return The Token ID of the item.
    function loadedItems(
        address player,
        uint256 idx
    ) external returns (uint256);

    /// @notice Returns the token balance for each token the player has in the Quest.
    /// @param player The address of the player.
    /// @param token The address of the token.
    /// @return The player's token balance for this Quest.
    function portfolioTokenBalances(
        address player,
        address token
    ) external returns (uint256);

    /// @notice Registers a player for the quests, loads items, and deposits tokens.
    /// @param tokenIds The token IDs for the items to load.
    /// @param tokenDeposits The tokens and amounts to deposit.
    function enterLoadDeposit(
        uint256[] memory tokenIds,
        TokenDeposit[] memory tokenDeposits
    ) external payable;

    /// @notice Registers a player for the quest.
    function enter() external;

    /// @notice Loads items into the Quest.
    /// @param tokenIds The Token IDs of the loaded items.
    function loadItems(uint256[] memory tokenIds) external;

    /// @notice Unloads an item.
    /// @param tokenId the Token ID of the item to unload.
    function unloadItem(uint256 tokenId) external;

    /// @notice Unloads all loaded items for the player.
    function unloadAllItems() external;

    /// @notice Deposits tokens prior to the beginning of the Quest.
    /// @param tokenDeposits The addresses and amounts of tokens to deposit.
    function depositTokens(
        TokenDeposit[] memory tokenDeposits
    ) external payable;

    /// @notice Withdraws the full balance of the selected tokens from the Quest.
    /// @param tokens The addresses of the tokens to withdraw.
    function withdrawTokens(address[] memory tokens) external;

    /// @notice Trades within the Quest.
    /// @param quote The Hashflow Quote.
    function trade(IHashflowRouter.RFQTQuote memory quote) external payable;
}