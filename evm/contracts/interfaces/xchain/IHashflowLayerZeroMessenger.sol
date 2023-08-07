/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '../external/ILayerZeroReceiver.sol';
import '../external/ILayerZeroUserApplicationConfig.sol';

import './IHashflowXChainMessenger.sol';

interface IHashflowLayerZeroMessenger is
    IHashflowXChainMessenger,
    ILayerZeroReceiver,
    ILayerZeroUserApplicationConfig
{
    /// @notice Used to store potentially temporary unsuccessful payloads.
    struct RetryableLayerZeroPayload {
        uint64 payloadLength;
        bytes32 payloadHash;
    }

    /// @notice Emitted when the LayerZero endpoint changes.
    /// @param lzEndpoint The new LayerZero endpoint.
    /// @param prevLzEndpoint The previous LayerZero endpoint.
    event UpdateLzEndpoint(address lzEndpoint, address prevLzEndpoint);

    /// @notice Emitted when the LayerZero gas estimate is updated.
    /// @param gasEstimate The new gas estimate.
    event UpdateLzGasEstimate(uint256 gasEstimate);

    /// @notice Emitted when a LayerZero Chain ID is updated.
    /// @param hChainId The Hashflow Chain ID.
    /// @param lzChainId The Wormhole Chain ID.
    event UpdateLzChainId(uint256 hChainId, uint256 lzChainId);

    /// @notice Emitted when a cross-chain fill fails silently due to authorization.
    /// @param srcChainId Source LayerZero Chain ID.
    /// @param srcAddress LayerZero inbound path.
    /// @param nonce LayerZero message nonce.
    event LayerZeroMessageUnauthorized(
        uint16 srcChainId,
        bytes srcAddress,
        uint64 nonce
    );

    /// @notice Emitted when a LayerZero trade fill message is malformed.
    /// @param srcChainId Source LayerZero Chain ID.
    /// @param srcAddress LayerZero inbound path.
    /// @param nonce LayerZero message nonce.
    /// @param payload The LayerZero payload.
    event LayerZeroMessageMalformed(
        uint16 srcChainId,
        bytes srcAddress,
        uint64 nonce,
        bytes payload
    );

    /// @notice Emitted when a LayerZero trade fill message fails to execute.
    /// @param srcChainId Source LayerZero Chain ID.
    /// @param srcAddress LayerZero inbound path.
    /// @param nonce LayerZero message nonce.
    event LayerZeroMessageFailed(
        uint16 srcChainId,
        bytes srcAddress,
        uint64 nonce
    );

    /// @notice Emitted when a LayerZero payload is stored
    /// @param srcChainId Source LayerZero Chain ID.
    /// @param srcAddress LayerZero inbound path.
    /// @param nonce LayerZero message nonce.
    /// @param payload The LayerZero payload.
    event LayerZeroPayloadStored(
        uint16 srcChainId,
        bytes srcAddress,
        uint64 nonce,
        bytes payload
    );

    /// @notice Emmitted when a LayerZero message has been sent.
    /// @param txid The unique quote TXID.
    event LayerZeroMessageSend(bytes32 txid);

    /// @notice Emmitted when a LayerZero message has been successfully received.
    /// @param txid The unique quote TXID.
    event LayerZeroMessageReceive(bytes32 txid);

    /// @notice Returns the currently set LayerZero endpoint.
    function lzEndpoint() external view returns (address);

    /// @notice Returns the associated Hashflow Chain ID to a LayerZero Chain ID.
    /// @param lzChainId The LayerZero Chain ID.
    function lzChainIdToHChainId(uint16 lzChainId)
        external
        view
        returns (uint16);

    /// @notice Returns the associated LayerZero Chain ID to a Hashflow Chain ID.
    /// @param hChainId The Hashflow Chain Id.
    function hChainIdToLzChainId(uint16 hChainId)
        external
        view
        returns (uint16);

    /// @notice Returns stored retryable payloads.
    /// @param srcChainId The source LayerZero chain ID.
    /// @param srcAddress The LZ source address path.
    /// @param nonce LayerZero nonce.
    /// @return the RetryableLayerZeroPayload struct fields.
    function retryableLayerZeroPayloads(
        uint16 srcChainId,
        bytes memory srcAddress,
        uint64 nonce
    ) external view returns (uint64, bytes32);

    /// @notice Returns the currently set LayerZero Gas estimate for the destination chain.
    function lzGasEstimate() external view returns (uint256);

    /// @notice Retries a stored payload.
    /// @param srcChainId The source LayerZero chain ID.
    /// @param srcAddress The LZ source address path.
    /// @param payload The message payload.
    /// @param nonce LayerZero nonce.
    function retryPayload(
        uint16 srcChainId,
        bytes memory srcAddress,
        uint64 nonce,
        bytes memory payload
    ) external;

    /// @notice Updates the LayerZero endpoint.
    /// @param lzEndpoint The new LayerZero endpoint.
    function updateLzEndpoint(address lzEndpoint) external;

    /// @notice Updates the LayerZero gas estimate.
    /// @param lzGasEstimate The new LayerZero gas estimate.
    function updateLzGasEstimate(uint256 lzGasEstimate) external;

    /// @notice Sets the LayerZero Chain ID for a Hashflow Chain ID.
    /// @param hChainId The Hashflow Chain ID.
    /// @param lzChainId The LayerZero Chain ID.
    function updateLzChainIdForHashflowChainId(
        uint16 hChainId,
        uint16 lzChainId
    ) external;
}
