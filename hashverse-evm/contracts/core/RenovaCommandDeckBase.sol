// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';

import '../interfaces/core/IRenovaCommandDeckBase.sol';

import './RenovaQuest.sol';

import 'hardhat/console.sol';

abstract contract RenovaCommandDeckBase is
    IRenovaCommandDeckBase,
    OwnableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @inheritdoc IRenovaCommandDeckBase
    address public renovaAvatar;

    /// @inheritdoc IRenovaCommandDeckBase
    address public renovaItem;

    /// @inheritdoc IRenovaCommandDeckBase
    address public hashflowRouter;

    /// @inheritdoc IRenovaCommandDeckBase
    address public questOwner;

    /// @inheritdoc IRenovaCommandDeckBase
    mapping(bytes32 => address) public questDeploymentAddresses;

    /// @inheritdoc IRenovaCommandDeckBase
    mapping(address => bytes32) public questIdsByDeploymentAddress;

    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Base class initializer function.
    /// @param _renovaAvatar The address of the Avatar contract.
    /// @param _renovaItem The address of the Item contract.
    /// @param _hashflowRouter The address of the Hashflow Router.
    function __RenovaCommandDeckBase_init(
        address _renovaAvatar,
        address _renovaItem,
        address _hashflowRouter,
        address _questOwner
    ) internal onlyInitializing {
        __Ownable_init();

        require(
            _renovaAvatar != address(0),
            'RenovaCommandDeckBase::__RenovaCommandDeckBase_init RenovaAvatar not defined.'
        );

        require(
            _renovaItem != address(0),
            'RenovaCommandDeckBase::__RenovaCommandDeckBase_init RenovaItem not defined.'
        );

        require(
            _hashflowRouter != address(0),
            'RenovaCommandDeckBase::__RenovaCommandDeckBase_init HashflowRouter not defined.'
        );

        require(
            _questOwner != address(0),
            'RenovaCommandDeckBase::__RenovaCommandDeckBase_init Quest owner not defined.'
        );

        renovaAvatar = _renovaAvatar;
        renovaItem = _renovaItem;
        hashflowRouter = _hashflowRouter;
        questOwner = _questOwner;

        emit UpdateHashflowRouter(hashflowRouter, address(0));
        emit UpdateQuestOwner(questOwner, address(0));
    }

    /// @inheritdoc IRenovaCommandDeckBase
    function loadItemsForQuest(
        address player,
        uint256[] memory tokenIds
    ) external override {
        require(
            questIdsByDeploymentAddress[_msgSender()] != bytes32(0),
            'RenovaCommandDeckBase::loadItemsForQuest Quest not registered.'
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            IERC721(renovaItem).safeTransferFrom(
                player,
                _msgSender(),
                tokenIds[i]
            );
        }
    }

    function depositTokensForQuest(
        address player,
        IRenovaQuest.TokenDeposit[] memory tokenDeposits
    ) external override {
        require(
            questIdsByDeploymentAddress[_msgSender()] != bytes32(0),
            'RenovaCommandDeckBase::depositTokensForQuest Quest not registered.'
        );

        for (uint256 i = 0; i < tokenDeposits.length; i++) {
            if (tokenDeposits[i].token != address(0)) {
                IERC20Upgradeable(tokenDeposits[i].token).safeTransferFrom(
                    player,
                    _msgSender(),
                    tokenDeposits[i].amount
                );
            }
        }
    }

    /// @inheritdoc IRenovaCommandDeckBase
    function createQuest(
        bytes32 questId,
        IRenovaQuest.QuestMode questMode,
        uint256 maxPlayers,
        uint256 maxItemsPerPlayer,
        uint256 startTime,
        uint256 endTime
    ) external override {
        require(
            _msgSender() == questOwner,
            'RenovaCommandDeckBase::createQuest Sender must be Quest Owner.'
        );
        require(
            questDeploymentAddresses[questId] == address(0),
            'RenovaCommandDeckBase::createQuest Quest already created.'
        );

        RenovaQuest quest = new RenovaQuest(
            questMode,
            renovaAvatar,
            renovaItem,
            hashflowRouter,
            maxPlayers,
            maxItemsPerPlayer,
            startTime,
            endTime,
            questOwner
        );

        questDeploymentAddresses[questId] = address(quest);
        questIdsByDeploymentAddress[address(quest)] = questId;

        emit CreateQuest(
            questId,
            address(quest),
            questMode,
            maxPlayers,
            maxItemsPerPlayer,
            startTime,
            endTime
        );
    }

    /// @inheritdoc IRenovaCommandDeckBase
    function updateHashflowRouter(address _hashflowRouter) external onlyOwner {
        require(
            _hashflowRouter != address(0),
            'RenovaCommandDeckBase::updateHashflowRouter Cannot be 0 address.'
        );

        emit UpdateHashflowRouter(_hashflowRouter, hashflowRouter);

        hashflowRouter = _hashflowRouter;
    }

    function updateQuestOwner(address _questOwner) external onlyOwner {
        require(
            _questOwner != address(0),
            'RenovaCommandDeckBase::updateQuestOwner Cannot be 0 address.'
        );

        emit UpdateQuestOwner(_questOwner, questOwner);

        questOwner = _questOwner;
    }

    /// @inheritdoc OwnableUpgradeable
    function renounceOwnership() public view override onlyOwner {
        revert(
            'RenovaCommandDeckBase::renounceOwnership Cannot renounce ownership.'
        );
    }
}