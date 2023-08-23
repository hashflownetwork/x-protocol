// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import './IRenovaQuest.sol';

/// @title IRenovaCommandDeckBase
/// @author Victor Ionescu
/**

The Command Deck contract is a central point of command in the Hashverse.
It handles:
- official contract addresses for the Item and the Avatar
- minting of Hashverse Items post Quest completion
- creation of Quests

The Command Deck exists on every chain, however only the main chain
Command Deck can mint items.
*/
interface IRenovaCommandDeckBase {
    /// @notice Emitted every time the Hashflow Router is updated.
    /// @param newRouter The address of the new Hashflow Router.
    /// @param oldRouter The address of the old Hashflow Router.
    event UpdateHashflowRouter(address newRouter, address oldRouter);

    /// @notice Emitted every time the Quest Owner changes.
    /// @param newQuestOwner The address of the new Quest Owner.
    /// @param oldQuestOwner The address of the old Quest Owner.
    event UpdateQuestOwner(address newQuestOwner, address oldQuestOwner);

    /// @notice Emitted every time a Quest is created.
    /// @param questId The Quest ID.
    /// @param questAddress The address of the contract handling the Quest logic.
    /// @param questMode The Mode of the Quest (e.g. Multiplayer).
    /// @param maxPlayers The max number of players (0 for infinite).
    /// @param maxItemsPerPlayer The max number of items (0 for infinite) each player can equip.
    /// @param startTime The quest start time, in unix seconds.
    /// @param endTime The quest end time, in unix seconds.
    event CreateQuest(
        bytes32 questId,
        address questAddress,
        IRenovaQuest.QuestMode questMode,
        uint256 maxPlayers,
        uint256 maxItemsPerPlayer,
        uint256 startTime,
        uint256 endTime
    );

    /// @notice Returns the Avatar contract address.
    /// @return The address of the Avatar contract.
    function renovaAvatar() external view returns (address);

    /// @notice Returns the Item contract address.
    /// @return The address of the Item contract.
    function renovaItem() external view returns (address);

    /// @notice Returns the Router contract address.
    /// @return The address of the Router contract.
    function hashflowRouter() external view returns (address);

    /// @notice Returns the Quest Owner address.
    /// @return The address of the Quest Owner.
    function questOwner() external view returns (address);

    /// @notice Returns the deployment contract address for a quest ID.
    /// @param questId The Quest ID.
    /// @return The deployed contract address if the quest ID is valid.
    function questDeploymentAddresses(
        bytes32 questId
    ) external view returns (address);

    /// @notice Returns the ID of a quest deployed at a particular address.
    /// @param questAddress The address of the Quest contract.
    /// @return The quest ID.
    function questIdsByDeploymentAddress(
        address questAddress
    ) external view returns (bytes32);

    /// @notice Loads items into a Quest.
    /// @param player The address of the player loading the items.
    /// @param tokenIds The Token IDs of the items to load.
    /// @dev This function helps save gas by only setting allowance to this contract.
    function loadItemsForQuest(
        address player,
        uint256[] memory tokenIds
    ) external;

    /// @notice Deposits tokens into a Quest.
    /// @param player The address of the player depositing the tokens.
    /// @param tokenDeposits The tokens and their amounts.
    /// @dev This function helps save gas by only setting allowance to this contract.
    function depositTokensForQuest(
        address player,
        IRenovaQuest.TokenDeposit[] memory tokenDeposits
    ) external;

    /// @notice Creates a Quest in the Hashverse.
    /// @param questId The Quest ID.
    /// @param questMode The mode of the Quest (e.g. SOLO).
    /**
     * @param maxPlayers The max number of players or 0 if uncapped. If the quest is
     * a multiplayer quest, this will be the max number of players for each Faction.
     */
    /// @param maxItemsPerPlayer The max number of items per player or 0 if uncapped.
    /// @param startTime The quest start time, in Unix seconds.
    /// @param endTime The quest end time, in Unix seconds.
    function createQuest(
        bytes32 questId,
        IRenovaQuest.QuestMode questMode,
        uint256 maxPlayers,
        uint256 maxItemsPerPlayer,
        uint256 startTime,
        uint256 endTime
    ) external;

    /// @notice Updates the Hashflow Router contract address.
    /// @param hashflowRouter The new Hashflow Router contract address.
    function updateHashflowRouter(address hashflowRouter) external;

    /// @notice Updates the Quest Owner address.
    /// @param questOwner The new Quest Owner address.
    function updateQuestOwner(address questOwner) external;
}
