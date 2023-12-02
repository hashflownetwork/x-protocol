// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
pragma abicoder v1;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@1inch/solidity-utils/contracts/libraries/SafeERC20.sol';

/**
 * @title TokenLibrary
 * @notice Library for basic interactions with tokens (such as deposits, withdrawals, transfers)
 */
library TokenLibrary {
    using SafeERC20 for IERC20;

    function isEth(IERC20 token) internal pure returns (bool) {
        return
            address(token) == address(0) ||
            address(token) ==
            address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    }

    function universalBalanceOf(
        IERC20 token,
        address account
    ) internal view returns (uint256) {
        if (isEth(token)) {
            return account.balance;
        } else {
            return token.balanceOf(account);
        }
    }

    function universalTransfer(
        IERC20 token,
        address payable to,
        uint256 amount
    ) internal {
        if (amount == 0) {
            return;
        }
        if (isEth(token)) {
            to.transfer(amount);
        } else {
            token.safeTransfer(to, amount);
        }
    }
}
