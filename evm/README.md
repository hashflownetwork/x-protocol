# Hashflow EVM Protocol

This package contains Solidity Smart Contract code for the Hashflow protocol. This code is compatible with EVM chains (e.g. Ethereum, Arbitrum).

Compiling the code:

```shell
yarn hardhat compile
```

Running unit tests:

```shell
yarn hardhat test
```

# Initializing the Wormhole Messenger

## Contract Deployment

The `HashflowWormholeMessenger` contract takes the following two parameters for deployment:

- the Hashflow Chain ID (this is different from the EVM Chain ID and the Wormhole Chain ID)
- the `HashflowRouter` address on the specific chain

Hashflow Chain IDs should be configured as such:

| Chain           | Hashflow Chain ID |
| --------------- | ----------------- |
| Ethereum        | 1                 |
| Arbitrum        | 2                 |
| Optimism        | 3                 |
| Avalanche       | 4                 |
| Polygon         | 5                 |
| BSC             | 6                 |
| Solana          | 30                |
| Ethereum Goerli | 101               |
| Polygon Mumbai  | 103               |
| BSC Testnet     | 104               |
| Solana Devnet   | 130               |

The `wormhole-messenger:deploy` task can be used to deploy the contract.

## Initializing the Wormhole Endpoint

Every Wormhole message is created by making a call to an endpoint contract deployed by Wormhole.
The address of the endpoint contract for each chain is as follows:

| Chain           | Wormhole Endpoint                          |
| --------------- | ------------------------------------------ |
| Ethereum        | 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B |
| Arbitrum        | 0xa5f208e072434bC67592E4C49C1B991BA79BCA46 |
| Optimism        | 0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722 |
| Avalanche       | 0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c |
| Polygon         | 0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7 |
| BSC             | 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B |
| Ethereum Goerli | 0x706abc4E45D419950511e474C7B9Ed348A4a716c |
| Polygon Mumbai  | 0x0CBE91CF822c73C2315FB05100C2F714765d5c20 |
| BSC Testnet     | 0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D |

The `wormhole-messenger:initialize:wormhole` task can be used to initialize the Wormhole contract.

## Initializing the Consistency Level

Wormhole Guardians use the consistency level to determine when to emit the VAA.
Different consistency levels come with different risks / guarantees.
We set the consistency levels to the safest possible values in order to avoid running the risk of re-orgs.

For the following chains, safe levels are often too long for a good user experience:

- Ethereum
- Polygon

For those chains, we set a "fast" consistency level, which emits VAAs much faster, while running the risk of re-orgs.

In order to mitigate that risk, relaying "fast" messages is only possible via specific relayers, which are configured at the contract level.
These relayers use heuristics to decide which messages are safe to relay faster than usual.

Relaying regular ("slow") messages can be done by anyone.

The `wormhole-messenger:initialize:consistency` task can be used to initialize the consistency level.

The `wormhole-messenger:initialize:fast-consistency` task can be used to initialize the "fast" consistency level.

## Initializing the Hashflow <-> Wormhole Chain ID mapping

Hashflow Chain IDs differ from Wormhole Chain IDs. This is because Hashflow is agnostic to the interoperability protocol it uses under the hood (i.e. Wormhole).

In order to properly send cross-chain trades, we need to initialize the mapping between Hashflow and Wormhole Chain IDs for both the current chain and its peer chains.

The `wormhole-messenger:initialize:chain-id-mapping` task can be used to initialize these mappings.

## Initializing Remotes

The messenger needs to know what its peers (remotes) on other chains are.
This is very important when verifying the messages it receives.
Only authenticated senders should be allowed to communicate with this messenger.

Remotes are updated based on their Hashflow Chain ID (and NOT Wormhole Chain ID).
Their addresses must be prepended with 0 bytes up to 32 bytes. This is especially important for EVM remote addresses, which are 20 bytes on their native chains.

The `wormhole-messenger:initialize:remotes` task can be used to initialize the remotes.
