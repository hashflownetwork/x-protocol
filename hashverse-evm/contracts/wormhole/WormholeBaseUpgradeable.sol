// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';

import '../interfaces/external/IWormhole.sol';

import '../interfaces/wormhole/IWormholeBaseUpgradeable.sol';

/// @title WormholeBaseUpgradeable
/// @author Victor Ionescu
/// @notice See {IWormholeBaseUpgradeable}
abstract contract WormholeBaseUpgradeable is
    IWormholeBaseUpgradeable,
    OwnableUpgradeable
{
    using AddressUpgradeable for address payable;

    address private _wormhole;
    uint8 private _wormholeConsistencyLevel;
    mapping(bytes32 => bool) private _processedMessageHashes;

    mapping(uint16 => bytes32) internal _wormholeRemotes;

    uint16 internal _wormholeChainId;

    /// @dev Reserved for future upgrades.
    uint256[16] private __gap;

    /// @notice Base initializer.
    /// @param wormhole The address of the Wormhole endpoint.
    /// @param wormholeConsistencyLevel The Wormhole consistency level.
    function __WormholeBaseUpgradeable_init(
        address wormhole,
        uint8 wormholeConsistencyLevel
    ) internal {
        __Ownable_init();

        _updateWormhole(wormhole);
        _updateWormholeConsistencyLevel(wormholeConsistencyLevel);
    }

    /// @inheritdoc IWormholeBaseUpgradeable
    function updateWormhole(address wormhole) external override onlyOwner {
        _updateWormhole(wormhole);
    }

    /// @inheritdoc IWormholeBaseUpgradeable
    function updateWormholeConsistencyLevel(
        uint8 wormholeConsistencyLevel
    ) external override onlyOwner {
        _updateWormholeConsistencyLevel(wormholeConsistencyLevel);
    }

    /// @inheritdoc IWormholeBaseUpgradeable
    function updateWormholeRemote(
        uint16 wormholeChainId,
        bytes32 authorizedRemote
    ) external override onlyOwner {
        require(
            wormholeChainId != 0,
            'WormholeBaseUpgradeable::updateWormholeRemote wormholeChainId cannot be 0.'
        );
        require(
            authorizedRemote != bytes32(0),
            'WormholeBaseUpgradeable::updateWormholeRemote Remote cannot be 0.'
        );
        _wormholeRemotes[wormholeChainId] = authorizedRemote;

        emit UpdateWormholeRemote(wormholeChainId, authorizedRemote);
    }

    /// @inheritdoc IWormholeBaseUpgradeable
    function withdrawRelayerFees() external override onlyOwner {
        require(
            address(this).balance > 0,
            'WormholeBaseUpgradeable::withdrawRelayerFees No fees collected.'
        );

        payable(msg.sender).sendValue(address(this).balance);
    }

    /// @notice Sends a Wormhole message.
    /// @param nonce The nonce of the message.
    /// @param payload The payload to send.
    function _wormholeSend(
        uint32 nonce,
        bytes memory payload,
        uint256 wormholeMessageFee
    ) internal virtual returns (uint64 sequence) {
        require(
            _wormhole != address(0),
            'WormholeBaseUpgradeable::_wormholeSend Wormhole is not defined.'
        );
        require(
            _wormholeConsistencyLevel > 0,
            'WormholeBaseUpgradeable:: _wormholeSend Wormhole consistency level is not defined.'
        );

        sequence = IWormhole(_wormhole).publishMessage{
            value: wormholeMessageFee
        }(nonce, payload, _wormholeConsistencyLevel);

        emit WormholeSend(sequence);
    }

    /// @notice Called when a Wormhole message is received.
    /// @param encodedVM The Wormhole VAA.
    function _wormholeReceive(
        bytes memory encodedVM
    ) internal virtual returns (uint16 emitterChainId, bytes memory payload) {
        require(
            _wormhole != address(0),
            'WormholeBaseUpgradeable::_wormholeReceive Wormhole is not defined.'
        );
        require(
            _wormholeChainId > 0,
            'WormholeBaseUpgradeable::_wormholeReceive Wormhole Chain ID is not defined.'
        );

        (
            IWormholeStructs.VM memory vm,
            bool valid,
            string memory reason
        ) = IWormhole(_wormhole).parseAndVerifyVM(encodedVM);

        require(valid, reason);
        require(
            !_processedMessageHashes[vm.hash],
            'WormholeBaseUpgradeable::_wormholeReceive Message already processed.'
        );

        _processedMessageHashes[vm.hash] = true;

        emitterChainId = vm.emitterChainId;

        require(
            _wormholeRemotes[emitterChainId] != bytes32(0),
            'WormholeBaseUpgradeable::_wormholeReceive Wormhole remote not defined on emitted chain.'
        );
        require(
            _wormholeRemotes[emitterChainId] == vm.emitterAddress,
            'WormholeBaseUpgradeable::_wormholeReceive Emitter not authorized.'
        );

        emit WormholeReceive(vm.emitterChainId, vm.emitterAddress, vm.sequence);

        payload = vm.payload;
    }

    /// @notice Updates The wormhole endpoint.
    /// @param wormhole The new Wormhole endpoint.
    function _updateWormhole(address wormhole) internal {
        require(
            wormhole != address(0),
            'WormholeBaseUpgradeable::_updateWormhole Address cannot be 0.'
        );

        emit UpdateWormhole(wormhole, _wormhole);

        _wormhole = wormhole;

        uint16 wormholeChainId = IWormhole(_wormhole).chainId();

        emit UpdateWormholeChainId(wormholeChainId, _wormholeChainId);

        _wormholeChainId = wormholeChainId;
    }

    /// @notice Updates the Wormhole consistency level.
    /// @param wormholeConsistencyLevel The new consistency level.
    function _updateWormholeConsistencyLevel(
        uint8 wormholeConsistencyLevel
    ) internal {
        require(
            wormholeConsistencyLevel > 0,
            'WormholeBaseUpgradeable::updateWormholeConsistencyLevel Consistency level cannot be set to 0.'
        );

        emit UpdateWormholeConsistencyLevel(
            wormholeConsistencyLevel,
            _wormholeConsistencyLevel
        );

        _wormholeConsistencyLevel = wormholeConsistencyLevel;
    }
}