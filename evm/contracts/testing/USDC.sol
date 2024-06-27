/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';

contract USDC is ERC20Permit {
    constructor(uint256 _totalSupply)
    ERC20('USDC', 'USDC')
    ERC20Permit('USDC')
    {
        _mint(msg.sender, _totalSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(uint256 value) external returns (bool) {
        _mint(msg.sender, value);
        return true;
    }
}
