// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Context.sol';

import '../interfaces/core/IRenovaCommandDeckBase.sol';
import '../interfaces/core/IRenovaQuest.sol';
import '../interfaces/nft/IRenovaAvatarBase.sol';

/// @title RenovaQuest
/// @author Victor Ionescu
/// @notice See {IRenovaQuest}
contract RenovaQuest is
    IRenovaQuest,
    IERC721Receiver,
    Context,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;
    using Address for address payable;

    address private immutable _renovaCommandDeck;
    address private immutable _renovaAvatar;
    address private immutable _renovaItem;
    address private immutable _hashflowRouter;

    QuestMode private immutable _questMode;
    uint256 private immutable _maxPlayers;
    uint256 private immutable _maxItemsPerPlayer;

    uint256 public immutable startTime;
    uint256 public immutable endTime;

    /// @inheritdoc IRenovaQuest
    address public questOwner;

    /// @inheritdoc IRenovaQuest
    mapping(address => bool) public registered;

    /// @inheritdoc IRenovaQuest
    mapping(address => bool) public allowedTokens;

    /// @inheritdoc IRenovaQuest
    uint256 public numRegisteredPlayers;

    /// @inheritdoc IRenovaQuest
    mapping(IRenovaAvatarBase.RenovaFaction => uint256)
        public numRegisteredPlayersPerFaction;

    /// @inheritdoc IRenovaQuest
    mapping(address => uint256[]) public loadedItems;

    /// @inheritdoc IRenovaQuest
    mapping(address => uint256) public numLoadedItems;

    /// @inheritdoc IRenovaQuest
    mapping(address => mapping(address => uint256))
        public portfolioTokenBalances;

    constructor(
        QuestMode questMode,
        address renovaAvatar,
        address renovaItem,
        address hashflowRouter,
        uint256 maxPlayers,
        uint256 maxItemsPerPlayer,
        uint256 _startTime,
        uint256 _endTime,
        address _questOwner
    ) {
        _renovaCommandDeck = _msgSender();

        _questMode = questMode;

        _maxPlayers = maxPlayers;
        _maxItemsPerPlayer = maxItemsPerPlayer;

        require(
            _startTime > block.timestamp,
            'RenovaQuest::constructor Start time should be in the future.'
        );
        require(
            _endTime > _startTime,
            'RenovaQuest::constructor End time should be after start time.'
        );
        require(
            (_endTime - _startTime) <= (1 days) * 31,
            'RenovaQuest::constructor Quest too long.'
        );

        startTime = _startTime;
        endTime = _endTime;

        questOwner = _questOwner;

        _renovaAvatar = renovaAvatar;
        _renovaItem = renovaItem;
        _hashflowRouter = hashflowRouter;
    }

    /// @inheritdoc IRenovaQuest
    function updateTokenAuthorization(
        address token,
        bool status
    ) external override {
        require(
            _msgSender() == questOwner,
            'RenovaQuest::updateTokenAuthorization Sender must be quest owner.'
        );

        allowedTokens[token] = status;

        emit UpdateTokenAuthorizationStatus(token, status);
    }

    /// @inheritdoc IERC721Receiver
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    /// @inheritdoc IRenovaQuest
    function enterLoadDeposit(
        uint256[] memory tokenIds,
        TokenDeposit[] memory tokenDeposits
    ) external payable override {
        _enter(_msgSender());

        if (tokenIds.length > 0) {
            _loadItems(_msgSender(), tokenIds);
        }

        if (tokenDeposits.length > 0) {
            _depositTokens(_msgSender(), tokenDeposits);
        }
    }

    /// @inheritdoc IRenovaQuest
    function enter() external override nonReentrant {
        _enter(_msgSender());
    }

    /// @inheritdoc IRenovaQuest
    function loadItems(uint256[] memory tokenIds) external override {
        _loadItems(_msgSender(), tokenIds);
    }

    /// @inheritdoc IRenovaQuest
    function depositTokens(
        TokenDeposit[] memory tokenDeposits
    ) external payable override nonReentrant {
        _depositTokens(_msgSender(), tokenDeposits);
    }

    function unloadItem(uint256 tokenId) external override {
        uint256 idx = 0;
        uint256 numLoadedItemsForPlayer = loadedItems[_msgSender()].length;

        while (
            idx < numLoadedItemsForPlayer &&
            loadedItems[_msgSender()][idx] != tokenId
        ) {
            idx++;
        }

        require(
            idx < numLoadedItemsForPlayer,
            'RenovaQuest::unloadItem Item not loaded.'
        );

        loadedItems[_msgSender()][idx] = loadedItems[_msgSender()][
            numLoadedItemsForPlayer - 1
        ];
        loadedItems[_msgSender()].pop();

        numLoadedItems[_msgSender()] -= 1;

        emit UnloadItem(_msgSender(), tokenId);
        IERC721(_renovaItem).safeTransferFrom(
            address(this),
            _msgSender(),
            tokenId
        );
    }

    /// @inheritdoc IRenovaQuest
    function unloadAllItems() external override {
        require(
            block.timestamp < startTime || block.timestamp >= endTime,
            'RenovaQuest::unloadAllItems Quest is ongoing.'
        );

        uint256[] memory allLoadedItems = loadedItems[_msgSender()];

        for (uint256 i = 0; i < allLoadedItems.length; i++) {
            emit UnloadItem(_msgSender(), allLoadedItems[i]);
            IERC721(_renovaItem).safeTransferFrom(
                address(this),
                _msgSender(),
                allLoadedItems[i]
            );
        }

        uint256[] memory empty;

        loadedItems[_msgSender()] = empty;
        numLoadedItems[_msgSender()] = 0;
    }

    /// @inheritdoc IRenovaQuest
    function withdrawTokens(
        address[] memory tokens
    ) external override nonReentrant {
        require(
            block.timestamp < startTime || block.timestamp >= endTime,
            'RenovaQuest::withdrawTokens Quest is ongoing.'
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 amount = portfolioTokenBalances[_msgSender()][tokens[i]];
            if (amount == 0) {
                continue;
            }
            portfolioTokenBalances[_msgSender()][tokens[i]] = 0;

            emit WithdrawToken(_msgSender(), tokens[i], amount);

            if (tokens[i] == address(0)) {
                payable(_msgSender()).sendValue(amount);
            } else {
                IERC20(tokens[i]).safeTransfer(_msgSender(), amount);
            }
        }
    }

    /// @inheritdoc IRenovaQuest
    function trade(
        IHashflowRouter.RFQTQuote memory quote
    ) external payable override nonReentrant {
        require(
            block.timestamp >= startTime && block.timestamp < endTime,
            'RenovaQuest::trade Quest is not ongoing.'
        );
        require(
            allowedTokens[quote.quoteToken],
            'RenovaQuest::trade Quote Token not allowed.'
        );

        require(
            registered[_msgSender()],
            'RenovaQuest::trade Player not registered.'
        );

        require(
            portfolioTokenBalances[_msgSender()][quote.baseToken] >=
                quote.effectiveBaseTokenAmount,
            'RenovaQuest::trade Insufficient balance'
        );

        require(
            quote.trader == address(this),
            'RenovaQuest::trade Trader should be Quest contract.'
        );

        require(
            quote.effectiveTrader == _msgSender(),
            'RenovaQuest::trade Effective Trader should be player.'
        );

        uint256 quoteTokenAmount = quote.quoteTokenAmount;
        if (quote.effectiveBaseTokenAmount < quote.baseTokenAmount) {
            quoteTokenAmount =
                (quote.effectiveBaseTokenAmount * quote.quoteTokenAmount) /
                quote.baseTokenAmount;
        }

        portfolioTokenBalances[_msgSender()][quote.baseToken] -= quote
            .effectiveBaseTokenAmount;
        portfolioTokenBalances[_msgSender()][
            quote.quoteToken
        ] += quoteTokenAmount;

        emit Trade(
            _msgSender(),
            quote.baseToken,
            quote.quoteToken,
            quote.effectiveBaseTokenAmount,
            quoteTokenAmount
        );

        uint256 msgValue = 0;

        if (quote.baseToken == address(0)) {
            msgValue = quote.effectiveBaseTokenAmount;
        } else {
            require(
                IERC20(quote.baseToken).approve(
                    _hashflowRouter,
                    quote.effectiveBaseTokenAmount
                ),
                'RenovaQuest::trade Could not approve token.'
            );
        }

        uint256 balanceBefore = _questBalanceOf(quote.quoteToken);

        IHashflowRouter(_hashflowRouter).tradeRFQT{value: msgValue}(quote);

        uint256 balanceAfter = _questBalanceOf(quote.quoteToken);

        require(
            balanceBefore + quoteTokenAmount == balanceAfter,
            'RenovaQuest::trade Did not receive enough quote token.'
        );
    }

    /// @notice Registers a player for the quest.
    /// @param player The address of the player.
    function _enter(address player) internal {
        require(
            block.timestamp < startTime,
            'RenovaQuest::_enter Can only enter before the quest starts.'
        );

        require(
            !registered[player],
            'RenovaQuest::_enter Player already registered.'
        );

        uint256 avatarTokenId = IRenovaAvatarBase(_renovaAvatar).tokenIds(
            player
        );
        require(
            avatarTokenId != 0,
            'RenovaQuest::_enter Player has not minted Avatar.'
        );

        IRenovaAvatarBase.RenovaFaction faction = IRenovaAvatarBase(
            _renovaAvatar
        ).factions(_msgSender());

        if (_questMode == QuestMode.SOLO) {
            require(
                _maxPlayers == 0 || numRegisteredPlayers < _maxPlayers,
                'RenovaQuest::_enter Player cap reached.'
            );
        } else {
            require(
                _maxPlayers == 0 ||
                    numRegisteredPlayersPerFaction[faction] < _maxPlayers,
                'RenovaQuest::_enter Player cap reached.'
            );
        }

        emit RegisterPlayer(player);

        numRegisteredPlayers++;
        numRegisteredPlayersPerFaction[faction]++;

        registered[player] = true;
    }

    /// @notice Loads items into the Quest.
    /// @param player The address of the player loading the items.
    /// @param tokenIds The Token IDs of the loaded items.
    function _loadItems(address player, uint256[] memory tokenIds) internal {
        require(
            block.timestamp < startTime,
            'RenovaQuest::loadItems Can only load item before the quest starts.'
        );

        require(
            registered[player],
            'RenovaQuest::loadItems Player not registered.'
        );

        uint256 _numLoadedItems = numLoadedItems[player];

        require(
            (_numLoadedItems + tokenIds.length) <= _maxItemsPerPlayer,
            'RenovaQuest::loadItems Too many items.'
        );

        IRenovaCommandDeckBase(_renovaCommandDeck).loadItemsForQuest(
            player,
            tokenIds
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            loadedItems[player].push(tokenIds[i]);

            emit LoadItem(player, tokenIds[i]);
        }

        _numLoadedItems += tokenIds.length;

        numLoadedItems[player] = _numLoadedItems;
    }

    /// @notice Deposits tokens prior to the beginning of the Quest.
    /// @param player The address of the player depositing tokens.
    /// @param tokenDeposits The addresses and amounts of tokens to deposit.
    function _depositTokens(
        address player,
        TokenDeposit[] memory tokenDeposits
    ) internal {
        require(
            block.timestamp < startTime,
            'RenovaQuest::depositToken Can only deposit before the quest starts.'
        );
        require(
            registered[player],
            'RenovaQuest::depositToken Player not registered.'
        );

        uint256 totalNativeToken = 0;

        for (uint256 i = 0; i < tokenDeposits.length; i += 1) {
            require(
                allowedTokens[tokenDeposits[i].token],
                'RenovaQuest::_depositTokens Token not allowed.'
            );
            if (tokenDeposits[i].token == address(0)) {
                totalNativeToken += tokenDeposits[i].amount;
            }

            emit DepositToken(
                player,
                tokenDeposits[i].token,
                tokenDeposits[i].amount
            );

            portfolioTokenBalances[player][
                tokenDeposits[i].token
            ] += tokenDeposits[i].amount;
        }

        require(
            msg.value == totalNativeToken,
            'RenovaQuest::depositToken msg.value should equal amount.'
        );

        IRenovaCommandDeckBase(_renovaCommandDeck).depositTokensForQuest(
            player,
            tokenDeposits
        );
    }

    /// @notice Returns the amount of token that this Quest currently holds.
    /// @param token The token to return the balance for.
    /// @return The balance.
    function _questBalanceOf(address token) internal view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(token).balanceOf(address(this));
        }
    }
}
