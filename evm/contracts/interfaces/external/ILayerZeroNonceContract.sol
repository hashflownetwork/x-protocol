// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.7.6;

interface ILayerZeroNonceContract {
    function outboundNonce(uint16 dstChainId, bytes calldata path)
        external
        view
        returns (uint64);
}
