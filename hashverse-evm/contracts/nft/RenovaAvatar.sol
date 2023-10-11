// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../interfaces/nft/IRenovaAvatar.sol';
import '../interfaces/staking/IStakingVault.sol';

import './RenovaAvatarBase.sol';

/// @title RenovaAvatar
/// @author Victor Ionescu
/// @notice See {IRenovaAvatar}
contract RenovaAvatar is IRenovaAvatar, RenovaAvatarBase {
    address private _stakingVault;
    uint256 private _minStakePower;
    uint256 private _numMintedAvatars;
    mapping(RenovaFaction => uint256) private _maxCharacterId;

    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @inheritdoc IRenovaAvatar
    function initialize(
        address renovaCommandDeck,
        address stakingVault,
        uint256 minStakePower,
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) external override initializer {
        __RenovaAvatarBase_init(
            renovaCommandDeck,
            wormhole,
            wormholeConsistencyLevel
        );

        require(
            stakingVault != address(0),
            'RenovaAvatar::initalize stakingVault cannot be 0 address.'
        );

        _stakingVault = stakingVault;
        _minStakePower = minStakePower;
        _numMintedAvatars = 0;
    }

    /// @inheritdoc IRenovaAvatar
    function updateStakingVault(
        address stakingVault
    ) external override onlyOwner {
        require(
            stakingVault != address(0),
            'RenovaAvatar::updateStakingVault StakingVault cannot be 0 address.'
        );

        emit UpdateStakingVault(stakingVault, _stakingVault);

        _stakingVault = stakingVault;
    }

    /// @inheritdoc IRenovaAvatar
    function updateMinStakePower(
        uint256 minStakePower
    ) external override onlyOwner {
        _minStakePower = minStakePower;

        emit UpdateMinStakePower(_minStakePower);
    }

    function updateMaxCharacterId(
        RenovaFaction faction,
        uint256 maxCharacterId
    ) external override onlyOwner {
        require(
            _maxCharacterId[faction] < maxCharacterId,
            'RenovaAvatar::updateMaxCharacterId Max Character ID should be increasing.'
        );

        _maxCharacterId[faction] = maxCharacterId;

        emit UpdateMaxCharacterId(faction, maxCharacterId);
    }

    /// @inheritdoc IRenovaAvatar
    function mint(
        RenovaFaction faction,
        uint256 characterId
    ) external override {
        uint256 currentStakePower = IStakingVault(_stakingVault).getStakePower(
            _msgSender()
        );
        require(
            currentStakePower >= _minStakePower,
            'RenovaAvatar::mint Insufficient stake.'
        );
        require(
            characterId < _maxCharacterId[faction],
            'RenovaAvatar::mint Character ID not available.'
        );

        _numMintedAvatars++;

        _mintAvatar(_numMintedAvatars, _msgSender(), faction, characterId);
    }

    /// @inheritdoc IRenovaAvatar
    function wormholeMintSend(
        uint16 dstWormholeChainId,
        uint256 wormholeMessageFee
    ) external payable override {
        require(
            balanceOf(_msgSender()) == 1,
            'RenovaAvatar::wormholeMintSend Avatar not minted.'
        );

        require(
            dstWormholeChainId != _wormholeChainId,
            'RenovaAvatar::wormholeMintSend Dst chain should be different than Src chain.'
        );

        require(
            _wormholeRemotes[dstWormholeChainId] != bytes32(0),
            'RenovaAvatar::wormholeMintSend Unsupported Dst chain.'
        );

        require(
            msg.value >= wormholeMessageFee,
            'RenovaAvatar::wormholeMintSend msg.value does not cover fees.'
        );

        bytes memory payload = abi.encode(
            tokenIds[_msgSender()],
            _msgSender(),
            factions[_msgSender()],
            characterIds[_msgSender()],
            dstWormholeChainId
        );

        uint64 sequence = _wormholeSend(0, payload, wormholeMessageFee);

        emit XChainMintOut(
            _msgSender(),
            factions[_msgSender()],
            characterIds[_msgSender()],
            dstWormholeChainId,
            sequence,
            msg.value - wormholeMessageFee
        );
    }
}
