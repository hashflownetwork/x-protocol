# Running Tests

## Unit Tests

1. Run `yarn` to install all dependencies.
2. [Optional] Run `yarn hardhat compile` to ensure that contracts compile.
3. Run `yarn hardhat test`.

## Wormhole Integration Tests

In order to test the x-chain capabilities of the Avatar and Item contracts, we need
to run integration tests that simulate Wormhole message relays.

1. Run `yarn` to install all dependencies.
2. Set up the Wormhole Local Validator, as outlined in the [documentation](https://book.wormhole.com/technical/env/wlv.html).
3. Run `npm run evm` and `npm run wormhole` to start the Wormhole Local Validator.
4. Run the following commands to deploy and initialize the contracts, as well as mint an Avatar and Item:

- `yarn hardhat test:wormhole:deploy --network wormhole1` -- deploys contracts on the main network
- `yarn hardhat test:wormhole:deploy --network wormhole2` -- deploys contracts on the satellite network
- `yarn hardhat test:wormhole:initial-setup --network wormhole1` -- initializes remotes and sprays ETH
- `yarn hardhat test:wormhole:initial-setup --network wormhole2` -- initializes remotes and sprays ETH

5. Run the following commands to mint the Avatar cross-chain:

- `yarn hardhat test:wormhole:avatar-mint-out --network wormhole1` -- emits a Wormhole message
- `yarn hardhat test:wormhole:avatar-mint-in --network wormhole2` -- mints the Avatar cross-chian

6. Run the following command again and expect an error:

- `yarn hardhat test:wormhole:avatar-mint-in --network wormhole2`

7. Run the following command to send the Item cross-chain:

- `yarn hardhat test:wormhole:item-bridge-out --network wormhole1` -- emits a Wormhole message and burns the Item
- `yarn hardhat test:wormhole:item-bridge-in --network wormhole2` -- mints the Item on the satellite chain
- `yarn hardhat test:wormhole:item-bridge-out --network wormhole2` -- emits a Wormhole message and burns the Item
- `yarn hardhat test:wormhole:item-bridge-in --network wormhole1` -- mints the Item on the main chain
- `yarn hardhat test:wormhole:item-bridge-out --network wormhole1` -- emits a Wormhole message and burns the Item
- `yarn hardhat test:wormhole:item-bridge-in --network wormhole2` -- mints the Item on the satellite chain
