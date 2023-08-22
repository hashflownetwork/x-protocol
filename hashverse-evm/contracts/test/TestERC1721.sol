// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts/interfaces/IERC1271.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import '../interfaces/staking/IStakingVault.sol';

contract TestERC1271 is IERC1271 {
    using ECDSA for bytes32;

    address internal immutable _signer;

    constructor(address signer) {
        _signer = signer;
    }

    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) external view override returns (bytes4) {
        address recoveredSigner = hash.recover(signature);

        if (recoveredSigner == _signer) {
            return 0x1626ba7e;
        } else {
            return 0x00000000;
        }
    }

    function boostHFTStake(
        address vault,
        uint128 amount,
        uint16 daysToStake
    ) external {
        IStakingVault(vault).boostHFTStake(amount, daysToStake);
    }

    function transferHFTStake(address vault, address targetVault) external {
        IStakingVault(vault).transferHFTStake(targetVault);
    }

    function approve(address token, address spender, uint256 amount) external {
        IERC20(token).approve(spender, amount);
    }
}