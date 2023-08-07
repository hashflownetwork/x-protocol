/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';

import './HashflowFactory.sol';
import './pools/HashflowPool.sol';

contract HashflowFactoryZkSync is HashflowFactory {
    address public immutable WETH;

    constructor(address _weth) {
        require(
            _weth != address(0),
            'HashflowFactoryZkSync::constructor WETH cannot be 0 address.'
        );
        WETH = _weth;
    }

    function _createPoolInternal(
        string memory name,
        address signer,
        address operations
    ) internal override returns (address) {
        HashflowPool newPool = new HashflowPool(WETH);
        newPool.initialize(name, signer, operations, router);

        return address(newPool);
    }
}
