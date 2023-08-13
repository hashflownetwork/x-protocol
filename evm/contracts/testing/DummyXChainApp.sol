/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import '../interfaces/IHashflowRouter.sol';

contract DummyXChainApp {
    uint256 public xCounter;
    address public xCaller;

    function xChainReceive(uint256 increment) external {
        xCaller = msg.sender;
        xCounter += increment;
    }

    function xChainCall(
        address router,
        address dstContract,
        IHashflowRouter.XChainRFQTQuote memory quote
    ) external {
        IERC20(quote.baseToken).approve(router, quote.effectiveBaseTokenAmount);
        IHashflowRouter(router).tradeXChainRFQT(
            quote,
            bytes32(uint256(uint160(dstContract))),
            abi.encodeWithSelector(DummyXChainApp.xChainReceive.selector, 4)
        );
    }

    function authorizeXChainMessengerCaller(address router, address messenger)
        external
    {
        IHashflowRouter(router).updateXChainMessengerCallerAuthorization(
            messenger,
            true
        );
    }

    function authorizeXChainCaller(
        address router,
        uint16 hashflowChainId,
        bytes32 caller
    ) external {
        IHashflowRouter(router).updateXChainCallerAuthorization(
            hashflowChainId,
            caller,
            true
        );
    }

    function debugXCalldata(address dstContract)
        external
        pure
        returns (bytes32, bytes memory)
    {
        return (
            bytes32(uint256(uint160(dstContract))),
            abi.encodeWithSelector(DummyXChainApp.xChainReceive.selector, 4)
        );
    }
}
