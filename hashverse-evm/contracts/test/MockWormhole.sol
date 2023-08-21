// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract MockWormhole {
    function chainId() external pure returns (uint16) {
        return 1000;
    }
}