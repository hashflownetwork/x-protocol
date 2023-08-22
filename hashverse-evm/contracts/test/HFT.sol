// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';

contract HFT is ERC20('Hashflow', 'HFT'), ERC20Permit('Hashflow') {
    function mint(address user, uint256 amount) public {
        _mint(user, amount);
    }
}