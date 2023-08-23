// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';

interface IMockHashflowRouter {
    /// @notice Used for intra-chain RFQ-T trades.
    struct RFQTQuote {
        /// @notice The address of the HashflowPool to trade against.
        address pool;
        /**
         * @notice The external account linked to the HashflowPool.
         * If the HashflowPool holds funds, this should be address(0).
         */
        address externalAccount;
        /// @notice The recipient of the quoteToken at the end of the trade.
        address trader;
        /**
         * @notice The account "effectively" making the trade (ultimately receiving the funds).
         * This is commonly used by aggregators, where a proxy contract (the 'trader')
         * receives the quoteToken, and the effective trader is the user initiating the call.
         *
         * This field DOES NOT influence movement of funds. However, it is used to check against
         * quote replay.
         */
        address effectiveTrader;
        /// @notice The token that the trader sells.
        address baseToken;
        /// @notice The token that the trader buys.
        address quoteToken;
        /**
         * @notice The amount of baseToken sold in this trade. The exchange rate
         * is going to be preserved as the quoteTokenAmount / baseTokenAmount ratio.
         *
         * Most commonly, effectiveBaseTokenAmount will == baseTokenAmount.
         */
        uint256 effectiveBaseTokenAmount;
        /// @notice The max amount of baseToken sold.
        uint256 baseTokenAmount;
        /// @notice The amount of quoteToken bought when baseTokenAmount is sold.
        uint256 quoteTokenAmount;
        /// @notice The Unix timestamp (in seconds) when the quote expires.
        /// @dev This gets checked against block.timestamp.
        uint256 quoteExpiry;
        /// @notice The nonce used by this effectiveTrader. Nonces are used to protect against replay.
        uint256 nonce;
        /// @notice Unique identifier for the quote.
        /// @dev Generated off-chain via a distributed UUID generator.
        bytes32 txid;
        /// @notice Signature provided by the market maker (EIP-191).
        bytes signature;
    }

    /// @notice Executes an intra-chain RFQ-T trade.
    /// @param quote The quote data to be executed.
    function tradeRFQT(RFQTQuote memory quote) external payable;
}

contract MockHashflowRouter is IMockHashflowRouter {
    using SafeERC20 for IERC20;

    using Address for address payable;

    receive() external payable {}

    function tradeRFQT(RFQTQuote memory quote) external payable override {
        if (quote.baseToken == address(0)) {
            require(
                msg.value == quote.effectiveBaseTokenAmount,
                'MockHashflowRouter::tradeSingleHop msg.value should equal traded amount.'
            );
        } else {
            IERC20(quote.baseToken).safeTransferFrom(
                msg.sender,
                address(this),
                quote.effectiveBaseTokenAmount
            );
        }

        uint256 effectiveQuoteTokenAmount = quote.quoteTokenAmount;

        if (quote.effectiveBaseTokenAmount < quote.baseTokenAmount) {
            effectiveQuoteTokenAmount =
                (quote.quoteTokenAmount * quote.effectiveBaseTokenAmount) /
                quote.baseTokenAmount;
        }

        if (quote.quoteToken == address(0)) {
            payable(msg.sender).sendValue(effectiveQuoteTokenAmount);
        } else {
            IERC20(quote.quoteToken).safeTransfer(
                msg.sender,
                effectiveQuoteTokenAmount
            );
        }
    }
}
