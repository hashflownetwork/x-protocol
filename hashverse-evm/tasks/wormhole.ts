import fs from 'fs';
import axios from 'axios';

import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import {
  IRenovaAvatar,
  IRenovaCommandDeck,
  IRenovaCommandDeckSatellite,
} from '../types';
import { sendETH, toWei, padAddressTo32Bytes } from '../test/utils';
import { Signer } from 'ethers';

const WORMHOLE_CHAIN_IDS = {
  wormhole1: 2,
  wormhole2: 4,
} as const;

const WORMHOLE_DEPLOYMENT_METADATA_FILE =
  'wormhole_test_contract_deployment.json';
const WORMHOLE_VAAS_FILE = 'wormhole_vaas.json';

const WORMHOLE_CONTRACT_ADDRESS = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';

type DeploymentAddresses = Record<
  string,
  { commandDeck: string; avatar: string; item: string }
>;

type WormholeVAAs = Partial<
  Record<'item' | 'avatar', Partial<Record<'wormhole1' | 'wormhole2', string>>>
>;

async function getSigners(hre: HardhatRuntimeEnvironment): Promise<{
  admin: Signer;
  playerA: Signer;
  playerB: Signer;
}> {
  const allSigners = await hre.ethers.getSigners();

  return {
    admin: allSigners[0],
    playerA: allSigners[1],
    playerB: allSigners[2],
  };
}

task('test:wormhole:initial-setup', 'Sets up contracts').setAction(
  async (taskArgs, hre) => {
    const networkName = hre.network.name;

    await hre.run('test:wormhole:init');
    await hre.run('test:wormhole:send-eth');

    if (networkName === 'wormhole1') {
      await hre.run('test:wormhole:avatar-source-mint');
      await hre.run('test:wormhole:item-source-mint');
    }
  },
);

task('test:wormhole:deploy', 'Deploys contracts.').setAction(
  async (taskArgs, hre) => {
    const sleep = (timeoutMs: number): Promise<void> =>
      new Promise((resolve) => {
        console.log('Sleeping', timeoutMs);
        setTimeout(() => resolve(), timeoutMs);
      });
    const networkName = hre.network.name;

    if (networkName !== 'wormhole1' && networkName !== 'wormhole2') {
      throw new Error('Wrong network.');
    }

    const networkType = networkName === 'wormhole1' ? 'main' : 'satellite';

    const hftFactory = await hre.ethers.getContractFactory('HFT');
    const hft = await hftFactory.deploy();

    console.log('Deployed HFT');

    await sleep(2_000);

    const stakingVaultFactory =
      await hre.ethers.getContractFactory('StakingVault');
    const stakingVault = await stakingVaultFactory.deploy(
      await hft.getAddress(),
    );

    console.log('Deployed StakingVault');

    const renovaCommandDeckFactory =
      networkType === 'main'
        ? await hre.ethers.getContractFactory('RenovaCommandDeck')
        : await hre.ethers.getContractFactory('RenovaCommandDeckSatellite');

    const renovaAvatarFactory =
      networkType === 'main'
        ? await hre.ethers.getContractFactory('RenovaAvatar')
        : await hre.ethers.getContractFactory('RenovaAvatarSatellite');

    const renovaItemFactory =
      networkType === 'main'
        ? await hre.ethers.getContractFactory('RenovaItem')
        : await hre.ethers.getContractFactory('RenovaItemSatellite');

    const mockHashflowRouterFactory =
      await hre.ethers.getContractFactory('MockHashflowRouter');

    await sleep(2_000);

    const renovaCommandDeckContract = await hre.upgrades.deployProxy(
      renovaCommandDeckFactory,
      [],
      { initializer: false },
    );

    const renovaCommandDeck = await hre.ethers.getContractAt(
      networkType === 'main'
        ? 'IRenovaCommandDeck'
        : 'IRenovaCommandDeckSatellite',
      await renovaCommandDeckContract.getAddress(),
    );

    console.log('Deployed Command Deck', await renovaCommandDeck.getAddress());

    await sleep(2_000);

    const renovaAvatarContract = await hre.upgrades.deployProxy(
      renovaAvatarFactory,
      networkType === 'main'
        ? [
            await renovaCommandDeck.getAddress(),
            await stakingVault.getAddress(),
            0,
            WORMHOLE_CONTRACT_ADDRESS,
            1,
          ]
        : [await renovaCommandDeck.getAddress(), WORMHOLE_CONTRACT_ADDRESS, 1],
    );

    const renovaAvatar = await hre.ethers.getContractAt(
      networkType === 'main' ? 'IRenovaAvatar' : 'IRenovaAvatarSatellite',
      await renovaAvatarContract.getAddress(),
    );

    console.log('Deployed Avatar', await renovaAvatar.getAddress());

    await sleep(2_000);

    const renovaItemContract = await hre.upgrades.deployProxy(
      renovaItemFactory,
      networkType === 'main'
        ? [await renovaCommandDeck.getAddress(), WORMHOLE_CONTRACT_ADDRESS, 1]
        : [WORMHOLE_CONTRACT_ADDRESS, 1],
    );

    const renovaItem = await hre.ethers.getContractAt(
      networkType === 'main' ? 'IRenovaItem' : 'IRenovaItemSatellite',
      await renovaItemContract.getAddress(),
    );

    console.log('Deployed Item', await renovaItem.getAddress());

    await sleep(2_000);

    const mockHashflowRouter = await mockHashflowRouterFactory.deploy();

    console.log('Deployed Mock Router', await mockHashflowRouter.getAddress());

    const signers = await getSigners(hre);

    await sleep(2_000);

    const tx = await (networkType === 'main'
      ? (renovaCommandDeck as unknown as IRenovaCommandDeck)
      : (renovaCommandDeck as unknown as IRenovaCommandDeckSatellite)
    ).initialize(
      await renovaAvatar.getAddress(),
      await renovaItem.getAddress(),
      await mockHashflowRouter.getAddress(),
      await signers.admin.getAddress(),
    );

    await tx.wait();

    console.log('Initialized Command Deck');

    if (networkType === 'main') {
      const tx1 = await (
        renovaAvatar as unknown as IRenovaAvatar
      ).updateMaxCharacterId(0, 100);
      await tx1.wait();

      console.log('Initialized max Character ID for faction 0 to 100');

      const tx2 = await (
        renovaAvatar as unknown as IRenovaAvatar
      ).updateMaxCharacterId(1, 100);
      await tx2.wait();

      console.log('Initialized max Character ID for faction 1 to 100');
    }

    const deploymentAddresses: DeploymentAddresses = fs.existsSync(
      WORMHOLE_DEPLOYMENT_METADATA_FILE,
    )
      ? JSON.parse(
          fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
        )
      : {};

    deploymentAddresses[networkName] = {
      avatar: await renovaAvatar.getAddress(),
      item: await renovaItem.getAddress(),
      commandDeck: await renovaCommandDeck.getAddress(),
    };

    fs.writeFileSync(
      WORMHOLE_DEPLOYMENT_METADATA_FILE,
      JSON.stringify(deploymentAddresses, undefined, 2),
    );
  },
);

task('test:wormhole:init', 'Initializes Wormhole Parameters').setAction(
  async (taskArgs, hre) => {
    const networkName = hre.network.name;

    if (networkName !== 'wormhole1' && networkName !== 'wormhole2') {
      throw new Error('Wrong network.');
    }

    const otherNetworkName =
      networkName === 'wormhole1' ? 'wormhole2' : 'wormhole1';

    if (!fs.existsSync(WORMHOLE_DEPLOYMENT_METADATA_FILE)) {
      throw new Error('Metadata file does not exist.');
    }

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const deploymentForOtherNetwork = deploymentAddresses[otherNetworkName];
    if (!deploymentForOtherNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${otherNetworkName}`,
      );
    }

    const avatar = await hre.ethers.getContractAt(
      'RenovaAvatarBase',
      deploymentForNetwork.avatar,
    );

    const item = await hre.ethers.getContractAt(
      'RenovaItemBase',
      deploymentForNetwork.item,
    );

    const txAvatarRemote = await avatar.updateWormholeRemote(
      WORMHOLE_CHAIN_IDS[otherNetworkName],
      '0x' +
        padAddressTo32Bytes(deploymentForOtherNetwork.avatar).toString('hex'),
    );
    await txAvatarRemote.wait();

    console.log('Initialized Avatar Remote');

    const txItemRemote = await item.updateWormholeRemote(
      WORMHOLE_CHAIN_IDS[otherNetworkName],
      '0x' +
        padAddressTo32Bytes(deploymentForOtherNetwork.item).toString('hex'),
    );
    await txItemRemote.wait();

    console.log('Initialized Item Remote');
  },
);

task('test:wormhole:send-eth', 'Sends ETH to players').setAction(
  async (taskArgs, hre) => {
    const signers = await getSigners(hre);

    const txa = await sendETH(
      signers.admin,
      toWei(1),
      await signers.playerA.getAddress(),
    );
    await txa.wait();

    console.log('Sent ETH to Player A');

    const txb = await sendETH(
      signers.admin,
      toWei(1),
      await signers.playerB.getAddress(),
    );
    await txb.wait();

    console.log('Sent ETH to Player B');
  },
);

task('test:wormhole:avatar-source-mint', 'Mints Avatar').setAction(
  async (taskArgs, hre) => {
    const networkName = hre.network.name;

    if (networkName !== 'wormhole1') {
      throw new Error('Incorrect network.');
    }

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const renovaAvatar = await hre.ethers.getContractAt(
      'RenovaAvatar',
      deploymentForNetwork.avatar,
    );

    const signers = await getSigners(hre);

    const txMint = await renovaAvatar.connect(signers.playerA).mint(0, 69);
    await txMint.wait();

    console.log('Avatar minted.');
  },
);

task('test:wormhole:item-source-mint', 'Mints Item').setAction(
  async (taskArgs, hre) => {
    const networkName = hre.network.name;

    if (networkName !== 'wormhole1') {
      throw new Error('Incorrect network.');
    }

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const renovaCommandDeck = await hre.ethers.getContractAt(
      'RenovaCommandDeck',
      deploymentForNetwork.commandDeck,
    );

    const signers = await getSigners(hre);

    const tx = await renovaCommandDeck.mintItemAdmin(
      await signers.playerA.getAddress(),
      5,
    );
    await tx.wait();

    console.log('Item minted');
  },
);

task('test:wormhole:avatar-mint-out', 'Sends Avatar Cross-Chain').setAction(
  async (taskArgs, hre) => {
    const sleep = (timeoutMs: number): Promise<void> =>
      new Promise((resolve) => {
        console.log('Sleeping', timeoutMs);
        setTimeout(() => resolve(), timeoutMs);
      });

    const networkName = hre.network.name;

    if (networkName !== 'wormhole1') {
      throw new Error('Incorrect network.');
    }

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const renovaAvatar = await hre.ethers.getContractAt(
      'RenovaAvatar',
      deploymentForNetwork.avatar,
    );

    const signers = await getSigners(hre);

    const txWormholeMintOut = await renovaAvatar
      .connect(signers.playerA)
      .wormholeMintSend(WORMHOLE_CHAIN_IDS['wormhole2'], 0);
    await txWormholeMintOut.wait();

    const { hash: transactionHash } = txWormholeMintOut;

    const transaction =
      await hre.ethers.provider.getTransaction(transactionHash);

    const blockNumber = transaction?.blockNumber;

    if (!blockNumber) {
      throw new Error(`Could not get transaction block number`);
    }

    console.log('X-Chain Mint Transaction Issued');

    const filter = renovaAvatar.filters.XChainMintOut();

    const mintEvents = await renovaAvatar.queryFilter(
      filter,
      blockNumber,
      blockNumber,
    );

    if (mintEvents.length < 1) {
      throw new Error('Error parsing mint events.');
    }

    const sequence = mintEvents[mintEvents.length - 1].args.sequence;

    await sleep(2_000);

    const currentVAAIndex: WormholeVAAs = fs.existsSync(WORMHOLE_VAAS_FILE)
      ? JSON.parse(fs.readFileSync(WORMHOLE_VAAS_FILE).toString())
      : {};

    const emitterAddr = padAddressTo32Bytes(
      deploymentForNetwork.avatar,
    ).toString('hex');

    console.log(
      'URL',
      `http://localhost:7071/v1/signed_vaa/${
        WORMHOLE_CHAIN_IDS.wormhole1
      }/${emitterAddr}/${sequence.toString()}`,
    );

    const vaaResponse = await axios.get(
      `http://localhost:7071/v1/signed_vaa/${
        WORMHOLE_CHAIN_IDS.wormhole1
      }/${emitterAddr}/${sequence.toString()}`,
    );

    if (!vaaResponse?.data) {
      throw new Error(`Could not fetch VAA from Guardians.`);
    }

    const vaaBytes = vaaResponse.data.vaaBytes;

    if (!vaaBytes) {
      throw new Error(`Could not extract VAA`);
    }

    if (!currentVAAIndex.avatar) {
      currentVAAIndex.avatar = {};
    }
    currentVAAIndex.avatar.wormhole1 = vaaBytes;

    fs.writeFileSync(
      WORMHOLE_VAAS_FILE,
      JSON.stringify(currentVAAIndex, undefined, 2),
    );

    console.log('Wrote VAA', vaaBytes, sequence.toString());
  },
);

task('test:wormhole:item-bridge-out', 'Sends Item Cross-Chain').setAction(
  async (taskArgs, hre) => {
    const sleep = (timeoutMs: number): Promise<void> =>
      new Promise((resolve) => {
        console.log('Sleeping', timeoutMs);
        setTimeout(() => resolve(), timeoutMs);
      });

    const networkName = hre.network.name;

    if (networkName !== 'wormhole1' && networkName !== 'wormhole2') {
      throw new Error('Incorrect Network');
    }

    const otherNetworkName =
      networkName === 'wormhole1' ? 'wormhole2' : 'wormhole1';

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const renovaItem = await hre.ethers.getContractAt(
      'RenovaItemBase',
      deploymentForNetwork.item,
    );

    const signers = await getSigners(hre);

    const itemOwner = await renovaItem.ownerOf(1);

    const playerAddress = await signers.playerA.getAddress();

    if (itemOwner.toLowerCase() !== playerAddress.toLowerCase()) {
      throw new Error('Item not owned by Player A');
    }

    const txWormholeBridgeOut = await renovaItem
      .connect(signers.playerA)
      .wormholeBridgeOut(1, WORMHOLE_CHAIN_IDS[otherNetworkName], 0);
    await txWormholeBridgeOut.wait();

    const { hash: transactionHash } = txWormholeBridgeOut;
    const transaction =
      await hre.ethers.provider.getTransaction(transactionHash);

    const blockNumber = transaction?.blockNumber;

    if (!blockNumber) {
      throw new Error(`Could not get block number`);
    }

    console.log('X-Chain Mint Transaction Issued');

    const filter = renovaItem.filters.XChainBridgeOut();

    const bridgeEvents = await renovaItem.queryFilter(
      filter,
      blockNumber,
      blockNumber,
    );

    if (bridgeEvents.length < 1) {
      throw new Error('Error parsing bridge events.');
    }

    const sequence = bridgeEvents[bridgeEvents.length - 1].args.sequence;

    const currentVAAIndex: WormholeVAAs = fs.existsSync(WORMHOLE_VAAS_FILE)
      ? JSON.parse(fs.readFileSync(WORMHOLE_VAAS_FILE).toString())
      : {};

    const emitterAddr = padAddressTo32Bytes(deploymentForNetwork.item).toString(
      'hex',
    );

    await sleep(2_000);

    const vaaResponse = await axios.get(
      `http://localhost:7071/v1/signed_vaa/${
        WORMHOLE_CHAIN_IDS[networkName]
      }/${emitterAddr}/${sequence.toString()}`,
    );

    if (!vaaResponse?.data) {
      throw new Error(`Could not fetch VAA from Guardians.`);
    }

    const vaaBytes = vaaResponse.data.vaaBytes;

    if (!vaaBytes) {
      throw new Error(`Could not extract VAA`);
    }

    if (!currentVAAIndex.item) {
      currentVAAIndex.item = {};
    }
    currentVAAIndex.item[networkName] = vaaBytes;

    fs.writeFileSync(
      WORMHOLE_VAAS_FILE,
      JSON.stringify(currentVAAIndex, undefined, 2),
    );

    console.log('Wrote VAA', vaaBytes, sequence.toString());
  },
);

task('test:wormhole:avatar-mint-in', 'Receives Avatar Cross-Chain').setAction(
  async (taskArgs, hre) => {
    const networkName = hre.network.name;

    if (networkName !== 'wormhole2') {
      throw new Error('Incorrect network.');
    }

    if (!fs.existsSync(WORMHOLE_VAAS_FILE)) {
      throw new Error('Sequence file does not exist.');
    }

    const currentVAAIndex: WormholeVAAs = JSON.parse(
      fs.readFileSync(WORMHOLE_VAAS_FILE).toString(),
    );

    const vaa = currentVAAIndex.avatar?.wormhole1;

    if (vaa === undefined) {
      throw new Error('VAA not found.');
    }

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const renovaAvatar = await hre.ethers.getContractAt(
      'RenovaAvatarSatellite',
      deploymentForNetwork.avatar,
    );

    const tx = await renovaAvatar.wormholeMintReceive(
      Buffer.from(vaa, 'base64'),
    );
    await tx.wait();

    const signers = await getSigners(hre);

    const faction = await renovaAvatar.factions(
      await signers.playerA.getAddress(),
    );
    const characterId = await renovaAvatar.characterIds(
      await signers.playerA.getAddress(),
    );

    console.log(
      'X-Chain Avatar Minted with faction and character ID:',
      faction,
      characterId.toString(),
    );
  },
);

task('test:wormhole:item-bridge-in', 'Receives Item Cross-Chain').setAction(
  async (taskArgs, hre) => {
    const networkName = hre.network.name;

    if (networkName !== 'wormhole1' && networkName !== 'wormhole2') {
      throw new Error('Incorrect network.');
    }

    const otherNetworkName =
      networkName === 'wormhole1' ? 'wormhole2' : 'wormhole1';

    if (!fs.existsSync(WORMHOLE_VAAS_FILE)) {
      throw new Error('VAA file does not exist.');
    }

    const currentVAAIndex: WormholeVAAs = JSON.parse(
      fs.readFileSync(WORMHOLE_VAAS_FILE).toString(),
    );

    const vaa = currentVAAIndex.item?.[otherNetworkName];

    if (vaa === undefined) {
      throw new Error('VAA not found.');
    }

    const deploymentAddresses: DeploymentAddresses = JSON.parse(
      fs.readFileSync(WORMHOLE_DEPLOYMENT_METADATA_FILE).toString(),
    ) as DeploymentAddresses;

    const deploymentForNetwork = deploymentAddresses[networkName];

    if (!deploymentForNetwork) {
      throw new Error(
        `Deployment addresses not found for network ${networkName}`,
      );
    }

    const renovaItem = await hre.ethers.getContractAt(
      'RenovaItemBase',
      deploymentForNetwork.item,
    );

    const tx = await renovaItem.wormholeBridgeIn(Buffer.from(vaa, 'base64'));
    await tx.wait();

    console.log('X-Chain Item Received');
  },
);
