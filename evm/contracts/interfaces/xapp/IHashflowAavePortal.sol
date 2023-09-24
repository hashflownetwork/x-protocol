/**
 * SPDX-License-Identifier: UNLICENSED
 */

pragma solidity ^0.8.0;

import {IHashflowRouter} from '../IHashflowRouter.sol';

interface IHashflowAavePortal {
    /// @notice A subset of the Hashflow quote, without effectiveBaseTokenAmount.
    struct XChainQuote {
        /// @notice The Hashflow Chain ID of the source chain.
        uint16 srcChainId;
        /// @notice The Hashflow Chain ID of the destination chain.
        uint16 dstChainId;
        /// @notice The address of the HashflowPool to trade against on the source chain.
        address srcPool;
        /// @notice The HashflowPool to disburse funds on the destination chain.
        /// @dev This is bytes32 in order to anticipate non-EVM chains.
        bytes32 dstPool;
        /**
         * @notice The external account linked to the HashflowPool on the source chain.
         * If the HashflowPool holds funds, this should be address(0).
         */
        address srcExternalAccount;
        /**
         * @notice The external account linked to the HashflowPool on the destination chain.
         * If the HashflowPool holds funds, this should be bytes32(0).
         */
        bytes32 dstExternalAccount;
        /// @notice The recipient of the quoteToken on the destination chain.
        bytes32 dstTrader;
        /// @notice The token that the trader sells on the source chain.
        address baseToken;
        /// @notice The token that the trader buys on the destination chain.
        bytes32 quoteToken;
        /// @notice The amount of baseToken sold.
        uint256 baseTokenAmount;
        /// @notice The amount of quoteToken bought.
        uint256 quoteTokenAmount;
        /**
         * @notice The Unix timestamp (in seconds) when the quote expire. Only enforced
         * on the source chain.
         */
        /// @dev This gets checked against block.timestamp.
        uint256 quoteExpiry;
        /// @notice The nonce used by this trader.
        uint256 nonce;
        /// @notice Unique identifier for the quote.
        /// @dev Generated off-chain via a distributed UUID generator.
        bytes32 txid;
        /**
         * @notice The address of the IHashflowXChainMessenger contract used for
         * cross-chain communication.
         */
        address xChainMessenger;
        /// @notice Signature provided by the market maker (EIP-191).
        bytes signature;
    }

    /// @notice Emitted when a remote chain Portal is whitelisted.
    /// @param hashflowChainId The Hashflow Chain ID for the Portal.
    /// @param portal The address of the Portal on the remote chain.
    event UpdateRemotePortal(uint16 hashflowChainId, address portal);

    /// @notice Emitted when the Portal killswitch changes.
    /// @param killswitch Whether the Portal is enabled.
    event UpdateKillswitch(bool killswitch);

    /// @notice Emitted when the Portal is frozen.
    event Freeze();

    /// @notice Emitted when a transfer has been successfully submitted.
    /// @param asset The underlying asset.
    /// @param aToken The corresponding aToken.
    /// @param amount Amount of underlying asset withdrawn.
    /// @param dstHashflowChainId The Hashflow Chain ID of the destination chain.
    /// @param dstAsset The asset to supply on the destination chain.
    /// @param dstAmount Amount of underlying asset supplied on the destination chain.
    /// @param target The wallet that will receive aTokens on the destination chain.
    /// @param txid The unique TXID of the x-chain quote.
    event TransferAssetPosition(
        address asset,
        address aToken,
        uint256 amount,
        uint16 dstHashflowChainId,
        address dstAsset,
        uint256 dstAmount,
        address target,
        bytes32 txid,
        bytes32 dstContract,
        bytes dstCalldata
    );

    /// @notice Emitted when a position has been received on the destination chain.
    /// @param asset The underlying asset.
    /// @param aToken The corresponding aToken.
    /// @param amount The amount supplied.
    /// @param target The wallet that received the aTokens on the destination chain.
    /// @param txid The unique TXID of the x-chain quote.
    event ReceiveAssetPosition(
        address asset,
        address aToken,
        uint256 amount,
        address target,
        bytes32 txid
    );

    /// @notice Initiates a position transfer.
    /// @param quote The Quote used for bridging the position.
    /// @param underlyingAssetAmount Amount to transfer or type(uint256).max for whole balance.
    /// @param target The wallet to receive the aTokens on the destination chain.
    function transferAssetPosition(
        XChainQuote memory quote,
        uint256 underlyingAssetAmount,
        address target
    ) external;

    /// @notice Finishes the transfer on the destination chain. Called by the Router.
    /// @param asset The underlying asset being supplied.
    /// @param amount The amount of asset being supplied. This contract needs to hold this amount.
    /// @param onBehalfOf The wallet receiving the aTokens.
    /// @param txid The txid of the quote used for bridging.
    function receiveAssetPosition(
        address asset,
        uint256 amount,
        address onBehalfOf,
        bytes32 txid
    ) external;

    /// @notice Updates the Portal address on a remote chain.
    /// @param hashflowChainId The Hashflow Chain ID.
    /// @param portal The address of the Portal on the remote chain.
    function updateRemotePortal(
        uint16 hashflowChainId,
        address portal
    ) external;

    /// @notice Disallows any further changes in Portal trust relationships.
    function freeze() external;

    /// @notice Killswitches the Portal.
    /// @param killswitch Whether the Portal is turned on.
    function updateKillswitch(bool killswitch) external;

    /// @notice Returns the AAVE Pool address on this chain.
    /// @return The AAVE Pool address.
    function aavePool() external returns (address);

    /// @notice Returns the Hashflow Router address on this chain.
    /// @return The Hashflow Router address.
    function hashflowRouter() external returns (address);

    /// @notice Returns the Wormhole Messenger address on this chain.
    /// @return The Wormhole Messenger address.
    function wormholeMessenger() external returns (address);

    /// @notice Returns whether the Portal is enabled.
    /// @return Whether the Portal is enabled.
    function killswitch() external returns (bool);

    /// @notice Returns whether the Portal relationships have been frozen.
    /// @return Whether the Portal relationships have been frozen.
    function frozen() external returns (bool);
}
