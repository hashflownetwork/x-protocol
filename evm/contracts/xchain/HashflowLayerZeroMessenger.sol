/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.18;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import '../interfaces/external/ILayerZeroEndpoint.sol';
import '../interfaces/external/IWormhole.sol';
import '../interfaces/xchain/IHashflowLayerZeroMessenger.sol';
import '../interfaces/IHashflowPool.sol';
import '../interfaces/IHashflowRouter.sol';

import './HashflowXChainMessengerBase.sol';

contract HashflowLayerZeroMessenger is
    HashflowXChainMessengerBase,
    IHashflowLayerZeroMessenger,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;
    using Address for address;

    address public lzEndpoint;

    uint256 public lzGasEstimate;

    // These mappings manage H-Chain ID <-> LayerZero Chain ID links.
    mapping(uint16 => uint16) public hChainIdToLzChainId;
    mapping(uint16 => uint16) public lzChainIdToHChainId;
    mapping(uint16 => mapping(bytes => mapping(uint64 => RetryableLayerZeroPayload)))
        public retryableLayerZeroPayloads;

    receive() external payable {}

    constructor(uint16 _hChainId, address _router)
        HashflowXChainMessengerBase(_hChainId, _router)
    {}

    /// @inheritdoc IHashflowLayerZeroMessenger
    function updateLzEndpoint(address newLzEndpoint)
        external
        override
        onlyOwner
    {
        require(
            newLzEndpoint.isContract(),
            'HashflowLayerZeroMessenger::updateLzEndpoint LayerZero endpoint must be a contract.'
        );
        emit UpdateLzEndpoint(newLzEndpoint, lzEndpoint);
        lzEndpoint = newLzEndpoint;

        if (lzGasEstimate == 0) {
            lzGasEstimate = uint256(200000);
            emit UpdateLzGasEstimate(200000);
        }
    }

    /// @inheritdoc IHashflowLayerZeroMessenger
    function updateLzGasEstimate(uint256 newGasEstimate)
        external
        override
        onlyOwner
    {
        require(
            newGasEstimate > 20000 && newGasEstimate < 300000,
            'HashflowLayerZeroMessenger::updateLzGasEstimate Gas Estimate is out of bounds.'
        );
        lzGasEstimate = newGasEstimate;
        emit UpdateLzGasEstimate(lzGasEstimate);
    }

    /// @inheritdoc IHashflowXChainMessenger
    function tradeXChain(
        XChainQuote memory quote,
        address caller,
        bytes32 dstContract,
        bytes memory
    ) external payable {
        require(
            _msgSender() == router,
            'HashflowLayerZeroMessenger::tradeXChain Unauthorized router.'
        );
        require(
            quote.srcChainId == hChainId,
            'HashflowLayerZeroMessenger::tradeXChain Incorrect srcChainId'
        );
        require(
            dstContract == bytes32(0),
            'HashflowLayerZeroMessenger::tradeXChain Additional calls not supported.'
        );

        _lzSend(quote, caller);
    }

    /// @dev Send message via LayerZero.
    function _lzSend(XChainQuote memory quote, address caller) private {
        uint16 lzDstChainId = hChainIdToLzChainId[quote.dstChainId];
        require(
            lzDstChainId != 0 && xChainRemotes[quote.dstChainId].length > 0,
            'HashflowLayerZeroMessenger::lzSend LayerZero destination chain ID not configured.'
        );

        bytes memory payload = _generateTradePayload(
            quote,
            caller,
            bytes32(0),
            bytes32(0),
            bytes('')
        );

        bytes memory adapterParamsV1 = abi.encodePacked(
            uint16(1),
            lzGasEstimate
        );

        // Get the fees we need to pay to LayerZero + Relayer to cover message delivery.
        (uint256 lzNativeFees, ) = ILayerZeroEndpoint(lzEndpoint).estimateFees(
            lzDstChainId,
            address(this),
            payload,
            false,
            adapterParamsV1
        );

        require(
            msg.value >= lzNativeFees,
            'HashflowLayerZeroMessenger::lzSend msg.value must satisfy fees.'
        );

        // Send LayerZero message.
        ILayerZeroEndpoint(lzEndpoint).send{value: lzNativeFees}(
            lzDstChainId,
            bytes.concat(
                xChainRemotes[quote.dstChainId],
                abi.encodePacked(address(this))
            ),
            payload,
            payable(quote.trader),
            address(0x0),
            adapterParamsV1
        );

        emit LayerZeroMessageSend(quote.txid);
    }

    /// @dev Receive message via LayerZero. It should come from the LayerZero endpoint.
    function lzReceive(
        uint16 srcChainId,
        bytes memory srcAddress,
        uint64 nonce,
        bytes memory payload
    ) external override {
        // This should always be the LayerZero endpoint. If that is not the case, either
        // someone else is calling this (OK to revert) or the config is broken (OK to revert and resume).
        require(
            _msgSender() == lzEndpoint,
            'HashflowLayerZeroMessenger::lzReceive Sender should be LayerZero endpoint.'
        );

        // We don't throw errors. Instead, we store retryable payloads.
        _lzReceive(srcChainId, srcAddress, nonce, payload, false);
    }

    function retryPayload(
        uint16 srcChainId,
        bytes memory srcAddress,
        uint64 nonce,
        bytes memory payload
    ) external override {
        RetryableLayerZeroPayload
            memory retryablePayload = retryableLayerZeroPayloads[srcChainId][
                srcAddress
            ][nonce];
        require(
            retryablePayload.payloadHash != bytes32(0),
            'HashflowLayerZeroMessenger::retryPayload Payload not found.'
        );

        require(
            payload.length == retryablePayload.payloadLength &&
                keccak256(payload) == retryablePayload.payloadHash,
            'HashflowLayerZeroMessenger::retryPayload Invalid payload.'
        );

        // We throw errors, since this is a retry.
        _lzReceive(srcChainId, srcAddress, nonce, payload, true);

        retryableLayerZeroPayloads[srcChainId][srcAddress][nonce]
            .payloadHash = bytes32(0);
        retryableLayerZeroPayloads[srcChainId][srcAddress][nonce]
            .payloadLength = 0;
    }

    function _lzReceive(
        uint16 srcChainId,
        bytes memory srcAddress,
        uint64 nonce,
        bytes memory payload,
        bool shouldThrow
    ) internal {
        uint16 srcHashflowChainId = lzChainIdToHChainId[srcChainId];
        if (srcHashflowChainId == 0) {
            if (shouldThrow) {
                revert(
                    'HashflowLayerZeroMessenger::_lzReceive Source Hashflow Chain ID not defined.'
                );
            }

            emit LayerZeroMessageUnauthorized(srcChainId, srcAddress, nonce);

            // This can mean that a message was sent too early. We allow retries.
            _storeRetryablePayload(srcChainId, srcAddress, nonce, payload);
            return;
        }

        // LayerZero ULN v2 appends the address of the destination remote (this contract)
        // to the address of the source remote (xchainRemotes[srcHChainId])
        if (
            (xChainRemotes[srcHashflowChainId].length + 20) !=
            srcAddress.length ||
            keccak256(
                bytes.concat(
                    xChainRemotes[srcHashflowChainId],
                    abi.encodePacked(address(this))
                )
            ) !=
            keccak256(srcAddress)
        ) {
            if (shouldThrow) {
                revert(
                    'HashflowLayerZeroMessenger::_lzReceive Unauthorized remote.'
                );
            }
            emit LayerZeroMessageUnauthorized(srcChainId, srcAddress, nonce);

            // This can mean that the Messenger is not yet authorized. We allow retries.
            _storeRetryablePayload(srcChainId, srcAddress, nonce, payload);
            return;
        }

        IHashflowRouter.XChainFillMessage memory fillMessage;

        {
            // This will not fail if an appropriate Messenger emitted the message.
            // If a bad messenger emitted the message, it is fine to block the current
            // cross-chain path. It can always be unblocked with forceResumeReceive().
            XChainTradePayload memory tradePayload = abi.decode(
                payload,
                (XChainTradePayload)
            );

            // If the message is malformed, we do not mark it up for retry,
            // as it will never succeed.
            // Two scenarios:
            // 1. Malformed messages are found during an initial call -> they don't get retried.
            // 2. Malformed messages are found during a retry -> the retry is marked as "success".
            if (
                bytes32(uint256(uint160(uint256(tradePayload.dstPool)))) !=
                tradePayload.dstPool
            ) {
                emit LayerZeroMessageMalformed(
                    srcChainId,
                    srcAddress,
                    nonce,
                    payload
                );
                return;
            }

            if (
                bytes32(
                    uint256(uint160(uint256(tradePayload.dstExternalAccount)))
                ) != tradePayload.dstExternalAccount
            ) {
                emit LayerZeroMessageMalformed(
                    srcChainId,
                    srcAddress,
                    nonce,
                    payload
                );
                return;
            }

            if (
                bytes32(uint256(uint160(uint256(tradePayload.dstTrader)))) !=
                tradePayload.dstTrader
            ) {
                emit LayerZeroMessageMalformed(
                    srcChainId,
                    srcAddress,
                    nonce,
                    payload
                );
                return;
            }

            if (
                bytes32(uint256(uint160(uint256(tradePayload.quoteToken)))) !=
                tradePayload.quoteToken
            ) {
                emit LayerZeroMessageMalformed(
                    srcChainId,
                    srcAddress,
                    nonce,
                    payload
                );
                return;
            }

            fillMessage.srcHashflowChainId = srcHashflowChainId;
            fillMessage.srcPool = tradePayload.srcPool;
            fillMessage.dstPool = address(
                uint160(uint256(tradePayload.dstPool))
            );
            fillMessage.dstExternalAccount = address(
                uint160(uint256(tradePayload.dstExternalAccount))
            );
            fillMessage.dstTrader = address(
                uint160(uint256(tradePayload.dstTrader))
            );
            fillMessage.quoteToken = address(
                uint160(uint256(tradePayload.quoteToken))
            );
            fillMessage.quoteTokenAmount = tradePayload.quoteTokenAmount;
            fillMessage.txid = tradePayload.txid;
        }

        try IHashflowRouter(router).fillXChain(fillMessage) {
            emit LayerZeroMessageReceive(fillMessage.txid);
        } catch Error(string memory reason) {
            if (shouldThrow) {
                revert(reason);
            }

            emit LayerZeroMessageFailed(srcChainId, srcAddress, nonce);

            _storeRetryablePayload(srcChainId, srcAddress, nonce, payload);
        } catch Panic(uint256) {
            if (shouldThrow) {
                revert('HashflowLayerZeroMessenger::_lzReceive Panic.');
            }

            emit LayerZeroMessageFailed(srcChainId, srcAddress, nonce);

            _storeRetryablePayload(srcChainId, srcAddress, nonce, payload);
        } catch (bytes memory) {
            if (shouldThrow) {
                revert(
                    'HashflowLayerZeroMessenger::_lzReceive Low-level error.'
                );
            }

            emit LayerZeroMessageFailed(srcChainId, srcAddress, nonce);

            _storeRetryablePayload(srcChainId, srcAddress, nonce, payload);
        }
    }

    /// @inheritdoc IHashflowLayerZeroMessenger
    function updateLzChainIdForHashflowChainId(
        uint16 hashflowChainId,
        uint16 lzChainId
    ) external override onlyOwner {
        require(hashflowChainId != 0 && lzChainId != 0, 'chainId cannot be 0');

        // If this LayerZero Chain ID is already assigned, we need to unassign it first.
        require(
            lzChainIdToHChainId[lzChainId] == 0,
            'HashflowLayerZeroMessenger::updateLzChainIdForHashflowChainId LayerZero Chain ID already assigned.'
        );

        uint16 previouslyAssignedLzChainId = hChainIdToLzChainId[
            hashflowChainId
        ];

        // We free up the previously assigned ID.
        if (previouslyAssignedLzChainId != 0) {
            lzChainIdToHChainId[previouslyAssignedLzChainId] = 0;
        }

        hChainIdToLzChainId[hashflowChainId] = lzChainId;
        lzChainIdToHChainId[lzChainId] = hashflowChainId;

        emit UpdateLzChainId(hashflowChainId, lzChainId);
    }

    function _storeRetryablePayload(
        uint16 srcChainId,
        bytes memory srcAddress,
        uint64 nonce,
        bytes memory payload
    ) internal {
        RetryableLayerZeroPayload memory retryablePayload;
        retryablePayload.payloadLength = uint64(payload.length);
        retryablePayload.payloadHash = keccak256(payload);

        retryableLayerZeroPayloads[srcChainId][srcAddress][
            nonce
        ] = retryablePayload;

        emit LayerZeroPayloadStored(srcChainId, srcAddress, nonce, payload);
    }

    /// @dev Function used to configure LayerZero send version.
    function setSendVersion(uint16 version) external override onlyOwner {
        ILayerZeroEndpoint(lzEndpoint).setSendVersion(version);
    }

    /// @dev Function used to configure LayerZero receive version.
    function setReceiveVersion(uint16 version) external override onlyOwner {
        ILayerZeroEndpoint(lzEndpoint).setReceiveVersion(version);
    }

    /// @dev Function used to set LayerZero configuration.
    function setConfig(
        uint16, /*_version*/
        uint16 _chainId,
        uint256 _configType,
        bytes calldata _config
    ) external override onlyOwner {
        ILayerZeroEndpoint(lzEndpoint).setConfig(
            ILayerZeroEndpoint(lzEndpoint).getSendVersion(address(this)),
            _chainId,
            _configType,
            _config
        );
    }

    /// @dev Used to forcefully skip the current LayerZero message in the queue and resume receiving.
    function forceResumeReceive(uint16 _srcChainId, bytes calldata _srcAddress)
        external
        override
        onlyOwner
    {
        ILayerZeroEndpoint(lzEndpoint).forceResumeReceive(
            _srcChainId,
            _srcAddress
        );
    }

    /// @dev We do not allow the owner to renounce ownership.
    function renounceOwnership() public view override onlyOwner {
        revert(
            'HashflowLayerZeroMessenger::renounceOwnership Renouncing ownership not allowed.'
        );
    }
}
