/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';

contract TestToken1 is ERC20Permit {
    constructor(uint256 _totalSupply)
        ERC20('Test Token 1', 'TT1')
        ERC20Permit('Test Token 1')
    {
        _mint(msg.sender, _totalSupply);
    }

    function mint(uint256 value) external returns (bool) {
        _mint(msg.sender, value);
        return true;
    }
}
