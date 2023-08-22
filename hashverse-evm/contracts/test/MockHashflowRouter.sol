// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import '../interfaces/external/IHashflowRouter.sol';

contract MockHashflowRouter is IHashflowRouter {
    using SafeERC20 for IERC20;
    using Address for address payable;

    receive() external payable {}

    function tradeSingleHop(RFQTQuote memory quote) external payable override {
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

        uint256 effectiveQuoteTokenAmount = quote.maxQuoteTokenAmount;

        if (quote.effectiveBaseTokenAmount < quote.maxBaseTokenAmount) {
            effectiveQuoteTokenAmount =
                (quote.maxQuoteTokenAmount * quote.effectiveBaseTokenAmount) /
                quote.maxBaseTokenAmount;
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