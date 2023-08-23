// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

/// @title IWormholeBaseUpgradeable
/// @author Victor Ionescu
/**
 * @notice Base contract that allows for cross-chain communication via Wormhole.
 * This contract contains the necessary boilerplate to send authenticated messages
 * between contracts on different chains.
 */
/**
 * @dev There are 4 important settings:
 * - The Wormhole Endpoint: gets called to publish / verify VAAs
 * - The Wormhole Chain ID: this is set by the Wormhole protocol andused to identify
 *   the chains to send to / from; it is queried from the Wormhole Endpoint
 * - The Wormhole Consistency Level: tells the Wormhole Guardians when to determine finality
 * - The Authorized Remotes: the contracts that are allowed to send x-chain messages to this
 *   contract; remote addresses are represented as 32-byte words; for EVM-chains, 20-byte
 *   addresses are padded with 12 0-bytes at the beginning
 */
/// @notice Wormhole infrastructure layer for multi-chain contracts.
interface IWormholeBaseUpgradeable {
    /// @notice Emitted when the Wormhole Endpoin is updated.
    /// @param newWormhole The new Wormhole Endpoin address.
    /// @param oldWormhole The previous Wormhole Endpoin address.
    event UpdateWormhole(address newWormhole, address oldWormhole);

    /// @notice Emitted when the Wormhole Chain ID is updated.
    /// @param newWormholeChainId The new Wormhole Chain ID.
    /// @param oldWormholeChainId The previous Wormhole Chain ID.
    event UpdateWormholeChainId(
        uint16 newWormholeChainId,
        uint16 oldWormholeChainId
    );

    /// @notice Emitted when the Wormhle Consistency Level is updated.
    /// @param newConsistencyLevel The new Consistency Level.
    /// @param oldConsistencyLevel The previous consistency Level.
    event UpdateWormholeConsistencyLevel(
        uint8 newConsistencyLevel,
        uint8 oldConsistencyLevel
    );

    /// @notice Emitted when a trusted Wormhole x-chain remote is updated.
    /// @param wormholeChainId The Wormhole Chain ID for which the remote is updated.
    /// @param remote The remote address, 0-padded to 32 bytes.
    event UpdateWormholeRemote(uint16 wormholeChainId, bytes32 remote);

    /// @notice Emitted when a Wormhole message has been sent (published).
    /// @param sequence The Sequence Number of the message.
    event WormholeSend(uint64 sequence);

    /// @notice Emitted when a Wormhole message has been received (relayed).
    /// @param emitterChainId The source Wormhole Chain ID.
    /// @param emitterAddress The address of the emitting contract, 0-padded to 32 bytes.
    /// @param sequence The Sequence Number of the message.
    event WormholeReceive(
        uint16 emitterChainId,
        bytes32 emitterAddress,
        uint64 sequence
    );

    /// @notice Updates the Wormhole Endpoint address.
    /// @param wormhole The address of the new Wormhole endpoint.
    /// @dev This also sets a new Wormhole Chain ID.
    function updateWormhole(address wormhole) external;

    /// @notice Updates the Wormhole Consistency Level.
    /// @param wormholeConsistencyLevel The new Wormhole Consistency Level.
    function updateWormholeConsistencyLevel(
        uint8 wormholeConsistencyLevel
    ) external;

    /// @notice Updates the trusted Wormhole x-chain remote for a particular Wormhole Chain ID.
    /// @param wormholeChainId The Wormhole Chain ID to update the trusted remote for.
    /// @param authorizedRemote The trusted remote address, 0-padded to 32 bytes.
    function updateWormholeRemote(
        uint16 wormholeChainId,
        bytes32 authorizedRemote
    ) external;

    /// @notice Allows the owner to withdraw fees collected for the Relayer.
    function withdrawRelayerFees() external;
}