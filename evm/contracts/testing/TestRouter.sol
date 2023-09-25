/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '../HashflowRouter.sol';

contract TestRouter is HashflowRouter {
    constructor(address weth) HashflowRouter(weth) {}

    /// @dev Fallback function to receive native token.
    receive() external payable {}
}
