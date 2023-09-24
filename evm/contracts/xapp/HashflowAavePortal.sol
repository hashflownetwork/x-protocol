/**
 * SPDX-License-Identifier: UNLICENSED
 */

pragma solidity 0.8.18;

import {IAToken} from '@aave/core-v3/contracts/interfaces/IAToken.sol';
import {IPool} from '@aave/core-v3/contracts/interfaces/IPool.sol';
import {IACLManager} from '@aave/core-v3/contracts/interfaces/IACLManager.sol';
import {IAccessControl} from '@openzeppelin/contracts/access/IAccessControl.sol';
import {IPoolConfigurator} from '@aave/core-v3/contracts/interfaces/IPoolConfigurator.sol';
import {DataTypes} from '@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import '../interfaces/xapp/IHashflowAavePortal.sol';

/// @title HashflowAavePortal
/// @author Hashflow Foundation
/// @notice AAVE v3 Portal implementation leveraging Hashflow X-Chain RFQ.
contract HashflowAavePortal is IHashflowAavePortal, Ownable2Step {
    using SafeERC20 for IERC20;
    using Address for address;

    address public aavePool;
    address public hashflowRouter;
    address public wormholeMessenger;
    bool public killswitch;
    bool public frozen;

    mapping(uint16 => address) public remotePortals;

    constructor(
        address _aavePool,
        address _hashflowRouter,
        address _wormholeMessenger
    ) {
        require(
            _aavePool != address(0),
            'HashflowAavePortal::constructor Aave Pool cannot be 0 address.'
        );
        require(
            _aavePool.isContract(),
            'HashflowAavePortal::constructor Aave Pool must be a contract.'
        );

        require(
            _hashflowRouter != address(0),
            'HashflowAavePortal::constructor Hashflow Router cannot be 0 address.'
        );
        require(
            _hashflowRouter.isContract(),
            'HashflowAavePortal::constructor Hashflow Router must be a contract.'
        );

        aavePool = _aavePool;
        hashflowRouter = _hashflowRouter;
        wormholeMessenger = _wormholeMessenger;

        killswitch = true;
        emit UpdateKillswitch(true);
    }

    /// @inheritdoc IHashflowAavePortal
    function transferAssetPosition(
        XChainQuote memory quote,
        uint256 underlyingAssetAmount,
        address target
    ) external override {
        require(
            killswitch,
            'HashflowAavePortal::transferAssetPosition Portal is off.'
        );

        require(
            remotePortals[quote.dstChainId] != address(0),
            'HashflowAavePortal::transferAssetPosition Invalid destination chain.'
        );

        require(
            quote.xChainMessenger == wormholeMessenger,
            'HashflowAavePortal::transferAssetPosition Invalid messenger.'
        );

        require(
            bytes32(uint256(uint160(uint256(quote.dstTrader)))) ==
                quote.dstTrader,
            'HashflowAavePortal::transferAssetPosition dstTrader is not EVM address.'
        );

        require(
            _bytes32ToAddress(quote.dstTrader) ==
                remotePortals[quote.dstChainId],
            'HashflowAavePortal::transferAssetPosition dstTrader should == remotePortal.'
        );
        require(
            bytes32(uint256(uint160(uint256(quote.quoteToken)))) ==
                quote.quoteToken,
            'HashflowAavePortal::transferAssetPosition quoteToken it not EVM address.'
        );

        address aToken = IPool(aavePool)
            .getReserveData(quote.baseToken)
            .aTokenAddress;
        require(
            aToken != address(0),
            'HashflowAavePortal::transferAssetPosition aToken not found.'
        );

        IAToken(aToken).transferFrom(
            _msgSender(),
            address(this),
            IAToken(aToken).balanceOf(_msgSender())
        );

        IHashflowRouter.XChainRFQTQuote memory hashflowRFQTQuote;

        hashflowRFQTQuote.srcChainId = quote.srcChainId;
        hashflowRFQTQuote.dstChainId = quote.dstChainId;
        hashflowRFQTQuote.srcPool = quote.srcPool;
        hashflowRFQTQuote.dstPool = quote.dstPool;
        hashflowRFQTQuote.srcExternalAccount = quote.srcExternalAccount;
        hashflowRFQTQuote.dstExternalAccount = quote.dstExternalAccount;
        hashflowRFQTQuote.dstTrader = quote.dstTrader;
        hashflowRFQTQuote.baseToken = quote.baseToken;
        hashflowRFQTQuote.quoteToken = quote.quoteToken;
        hashflowRFQTQuote.baseTokenAmount = quote.baseTokenAmount;
        hashflowRFQTQuote.quoteTokenAmount = quote.quoteTokenAmount;
        hashflowRFQTQuote.quoteExpiry = quote.quoteExpiry;
        hashflowRFQTQuote.nonce = quote.nonce;
        hashflowRFQTQuote.txid = quote.txid;
        hashflowRFQTQuote.xChainMessenger = quote.xChainMessenger;
        hashflowRFQTQuote.signature = quote.signature;

        {
            uint256 effectiveBaseTokenAmount = IPool(aavePool).withdraw(
                quote.baseToken,
                underlyingAssetAmount,
                address(this)
            );
            uint256 currentBalance = IERC20(quote.baseToken).balanceOf(
                address(this)
            );
            if (effectiveBaseTokenAmount > currentBalance) {
                effectiveBaseTokenAmount = currentBalance;
            }
            /// @dev This check should never fail if AAVE Pool works correctly.
            require(
                effectiveBaseTokenAmount <= quote.baseTokenAmount,
                'HashflowAavePortal::transferAssetPosition Withdrew more than the quote supports.'
            );

            hashflowRFQTQuote
                .effectiveBaseTokenAmount = effectiveBaseTokenAmount;
        }

        uint256 effectiveQuoteTokenAmount = quote.quoteTokenAmount;
        if (
            hashflowRFQTQuote.effectiveBaseTokenAmount < quote.baseTokenAmount
        ) {
            effectiveQuoteTokenAmount =
                (quote.quoteTokenAmount *
                    hashflowRFQTQuote.effectiveBaseTokenAmount) /
                quote.baseTokenAmount;
        }

        IERC20(quote.baseToken).forceApprove(
            hashflowRouter,
            hashflowRFQTQuote.effectiveBaseTokenAmount
        );

        bytes32 dstContract = _addressToBytes32(
            remotePortals[quote.dstChainId]
        );
        bytes memory dstCalldata = abi.encodeWithSelector(
            IHashflowAavePortal.receiveAssetPosition.selector,
            _bytes32ToAddress(quote.quoteToken),
            effectiveQuoteTokenAmount,
            target,
            quote.txid
        );

        IHashflowRouter(hashflowRouter).tradeXChainRFQT(
            hashflowRFQTQuote,
            dstContract,
            dstCalldata
        );

        IERC20(aToken).safeTransfer(
            _msgSender(),
            IAToken(aToken).balanceOf(address(this))
        );

        emit TransferAssetPosition(
            quote.baseToken,
            aToken,
            hashflowRFQTQuote.effectiveBaseTokenAmount,
            quote.dstChainId,
            _bytes32ToAddress(quote.quoteToken),
            effectiveQuoteTokenAmount,
            target,
            quote.txid,
            dstContract,
            dstCalldata
        );
    }

    /// @inheritdoc IHashflowAavePortal
    function receiveAssetPosition(
        address asset,
        uint256 amount,
        address onBehalfOf,
        bytes32 txid
    ) external override {
        require(
            killswitch,
            'HashflowAavePortal::receiveAssetPosition Portal is off.'
        );

        require(
            msg.sender == hashflowRouter,
            'HashflowAavePortal::receiveAssetPosition Sender must be router.'
        );

        DataTypes.ReserveData memory reserveData = IPool(aavePool)
            .getReserveData(asset);
        address aToken = reserveData.aTokenAddress;

        // If this is not a supported AAVE V3 asset, we simply send the token to the user.
        if (aToken == address(0)) {
            IERC20(asset).transfer(onBehalfOf, amount);
            return;
        }

        IPool(aavePool).mintUnbacked(asset, amount, onBehalfOf, 0);

        IERC20(asset).forceApprove(aavePool, amount);

        IPool(aavePool).backUnbacked(asset, amount, 0);

        emit ReceiveAssetPosition(asset, aToken, amount, onBehalfOf, txid);
    }

    /// @inheritdoc IHashflowAavePortal
    function updateRemotePortal(
        uint16 hashflowChainId,
        address portal
    ) external onlyOwner {
        require(!frozen, 'HashflowAavePortal::updateRemotePortal Frozen.');
        address previousPortal = remotePortals[hashflowChainId];
        remotePortals[hashflowChainId] = portal;

        emit UpdateRemotePortal(hashflowChainId, portal);

        if (previousPortal != address(0)) {
            IHashflowRouter(hashflowRouter).updateXChainCallerAuthorization(
                hashflowChainId,
                _addressToBytes32(previousPortal),
                false
            );
        }
        IHashflowRouter(hashflowRouter).updateXChainCallerAuthorization(
            hashflowChainId,
            _addressToBytes32(portal),
            true
        );
    }

    /// @inheritdoc IHashflowAavePortal
    function updateKillswitch(bool _killswitch) external override onlyOwner {
        killswitch = _killswitch;

        emit UpdateKillswitch(killswitch);
    }

    /// @inheritdoc IHashflowAavePortal
    function freeze() external override onlyOwner {
        require(!frozen, 'HashflowAavePortal::freeze Already frozen.');

        frozen = true;

        emit Freeze();
    }

    /// @dev We do not allow the owner to renounce ownership.
    function renounceOwnership() public view override onlyOwner {
        revert(
            'HashflowAavePortal::renounceOwnership Renouncing ownership not allowed.'
        );
    }

    function _addressToBytes32(
        address _address
    ) private pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function _bytes32ToAddress(
        bytes32 _bytes32
    ) private pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }
}
