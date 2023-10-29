import '@nomicfoundation/hardhat-toolbox';
import { keccak256, Interface } from 'ethers';
import { task } from 'hardhat/config';
import axios from 'axios';
import fs from 'fs';
import { PublicKey } from '@solana/web3.js';

import { IQuote } from '../../types/contracts/interfaces/IHashflowRouter';
import {
  HARDHAT_NETWORK_CONFIG_BY_NAME,
  WORMHOLE1,
  WORMHOLE2,
  ZERO_ADDRESS,
  padAddressTo32Bytes,
} from '../../src/utils';
import { XChainQuoteData, signQuoteXChain } from '../../test/utils';
import {
  EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX,
  EVM_TEST_TOKEN_2_ADDRESS_HEX,
  getSigners,
} from './wormhole-config';
import {
  SOLANA_POOL_ADDRESS_BASE58,
  SOLANA_TRADER_ADDRESS_BASE58,
  SOLANA_TOKEN_ADDRESS_BASE58,
  SOLANA_HASHFLOW_CHAIN_ID,
  EVM_POOL_ADDRESS_HEX,
  WORMHOLE_METADATA_FILE_PATH,
  EVM_TEST_TOKEN_1_ADDRESS_HEX,
} from './wormhole-config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  isWormholeTestnet,
} from '../utils';

interface WormholeMetadata {
  vaaBytes: string;
  trader: string;
  dstTrader: string;
  txid: string;
  quoteToken: string;
  quoteTokenAmount: string;
  srcPool: string;
  dstPool: string;
}

const SUPPORTED_CHAIN_TYPES = new Set(['evm', 'solana']);

task('wormhole:trade', 'Trades the first leg of X-Chain.')
  .addParam('dstChain', 'Whether to send the trade to EVM or Solana')
  .addFlag('fastFinality', 'Whether we should pull the VAA with Fast Finality.')
  .addFlag('xCall', 'Wether to include a cross-chain app call')
  .setAction(async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);
    const { name: networkName } = networkConfig;

    if (networkName !== 'wormhole1') {
      // We only run tests from the Wormhole - Ethereum box.
      throw new Error(`Wrong network`);
    }
    const { mainSigner, traderSigner, quoteSigner } = await getSigners(hre);

    const provider = mainSigner.provider;
    if (!provider) {
      throw new Error(`Could not get provider.`);
    }

    const { dstChain, xCall } = taskArgs;

    if (!SUPPORTED_CHAIN_TYPES.has(dstChain)) {
      throw new Error(`Unsupported Chain Type: ${dstChain}`);
    }

    if (dstChain !== 'evm' && xCall) {
      throw new Error(`X-Calls to non-EVM chains are not supported.`);
    }

    const latestBlock = await provider.getBlock('latest');
    if (!latestBlock) {
      throw new Error(`Latest block is null`);
    }
    const nonce = latestBlock.timestamp + 10_000;
    const quoteExpiry = latestBlock.timestamp + 60 * 5; // 5 minutes

    const wormholeBridgeAddress =
      HARDHAT_NETWORK_CONFIG_BY_NAME[networkName].wormholeEndpoint;
    if (!wormholeBridgeAddress) {
      throw new Error(`Wormhole endpoint not configured.`);
    }

    const wormholeChainId =
      HARDHAT_NETWORK_CONFIG_BY_NAME[networkName].wormholeChainId;
    if (!wormholeChainId) {
      throw new Error(`Wormhole chain ID not configured.`);
    }

    const routerMetadata = getDeployedContractMetadata(
      'IHashflowRouter',
      networkName,
    );

    if (!routerMetadata) {
      throw new Error(`Could not find IHashflowRouter metadata`);
    }

    const routerContract = await hre.ethers.getContractAt(
      'HashflowRouter',
      routerMetadata.address,
      traderSigner,
    );

    const txid =
      '0x' +
      Buffer.from(
        keccak256(Buffer.from(`abcdef${Date.now()}`)).slice(2),
        'hex',
      ).toString('hex');

    const srcPool = EVM_POOL_ADDRESS_HEX;
    const dstPool =
      '0x' +
      (dstChain === 'solana'
        ? new PublicKey(SOLANA_POOL_ADDRESS_BASE58).toBuffer()
        : padAddressTo32Bytes(EVM_POOL_ADDRESS_HEX)
      ).toString('hex');

    const dstTrader =
      '0x' +
      (dstChain === 'solana'
        ? new PublicKey(SOLANA_TRADER_ADDRESS_BASE58).toBuffer()
        : padAddressTo32Bytes(await traderSigner.getAddress())
      ).toString('hex');

    const messengerMetadata = getDeployedContractMetadata(
      'IHashflowWormholeMessenger',
      networkName,
    );

    if (!messengerMetadata) {
      throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
    }

    const messengerContract = await hre.ethers.getContractAt(
      'HashflowWormholeMessenger',
      messengerMetadata.address,
      mainSigner,
    );

    const baseToken = EVM_TEST_TOKEN_1_ADDRESS_HEX;
    const quoteToken =
      '0x' +
      (dstChain === 'solana'
        ? new PublicKey(SOLANA_TOKEN_ADDRESS_BASE58).toBuffer()
        : padAddressTo32Bytes(EVM_TEST_TOKEN_2_ADDRESS_HEX)
      ).toString('hex');

    const xChainQuoteData: XChainQuoteData = {
      srcChainId: WORMHOLE1.hashflowChainId,
      dstChainId:
        dstChain === 'solana'
          ? SOLANA_HASHFLOW_CHAIN_ID
          : WORMHOLE2.hashflowChainId,
      srcPool,
      dstPool,
      srcExternalAccount: ZERO_ADDRESS,
      dstExternalAccount:
        '0x' + padAddressTo32Bytes(ZERO_ADDRESS).toString('hex'),
      dstTrader,
      baseToken,
      quoteToken,
      effectiveBaseTokenAmount: 2000000,
      baseTokenAmount: 2000000,
      quoteTokenAmount: 1000000,
      quoteExpiry,
      nonce,
      txid,
      xChainMessenger: messengerMetadata.address,
    };

    const signature = await signQuoteXChain(xChainQuoteData, quoteSigner);

    const quote: IQuote.XChainRFQTQuoteStruct = {
      ...xChainQuoteData,
      signature,
    };

    const sleep = (timeoutMs: number): Promise<void> =>
      new Promise((resolve) => {
        setTimeout(() => resolve(), timeoutMs);
      });

    try {
      const dstContract =
        '0x' +
        padAddressTo32Bytes(
          xCall ? EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX : ZERO_ADDRESS,
        ).toString('hex');

      let dstContractCalldata = '0x';
      if (xCall) {
        const ABI = ['function xChainReceive(uint256 increment)'];
        const iface = new Interface(ABI);
        dstContractCalldata = iface.encodeFunctionData('xChainReceive', [4]);
      }

      const tx = await (
        await routerContract.tradeXChainRFQT(
          quote,
          dstContract,
          dstContractCalldata,
        )
      ).wait();
      if (!tx) {
        throw new Error(`Could not resolve transaction receipt.`);
      }

      const emitterAddr = padAddressTo32Bytes(
        await messengerContract.getAddress(),
      ).toString('hex');

      const filter = taskArgs.fastFinality
        ? messengerContract.filters.WormholeSendFast()
        : messengerContract.filters.WormholeSend();

      const logs = await messengerContract.queryFilter(
        filter,
        tx.blockNumber,
        tx.blockNumber,
      );

      const txnLogs = logs.filter((l) => l.transactionHash === tx.hash);

      if (txnLogs.length !== 1) {
        throw new Error(`Incorrect number of logs ${txnLogs.length}`);
      }

      const seq = txnLogs[0].args.sequence.toString();

      console.log(`Sequence ${seq}`);
      console.log(`Waiting 5 seconds`);

      await sleep(5_000);

      const url = `http://localhost:7071/v1/signed_vaa/${wormholeChainId}/${emitterAddr}/${seq}`;

      const vaaResponse = await axios.get(url);

      if (!vaaResponse?.data) {
        throw new Error(`Could not fetch VAA from Guardians.`);
      }

      const vaaBytes = vaaResponse.data.vaaBytes;

      if (!vaaBytes) {
        throw new Error(`Could not extract VAA`);
      }

      const payload: WormholeMetadata = {
        vaaBytes,
        txid,
        trader: await traderSigner.getAddress(),
        dstTrader,
        quoteToken,
        quoteTokenAmount: quote.quoteTokenAmount.toString(),
        srcPool,
        dstPool,
      };

      fs.writeFileSync(
        WORMHOLE_METADATA_FILE_PATH,
        JSON.stringify(payload, null, 4),
      );

      console.log('Gas Used', tx.gasUsed.toString());

      console.log(`Wrote`, JSON.stringify(payload, null, 4));
    } catch (err) {
      console.log((err as Error).message);
      throw err;
    }
  });

task('wormhole:relay', 'Relays the VAA on the destination chain').setAction(
  async (taskArgs, hre) => {
    const { name: networkName } =
      getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    if (networkName !== 'wormhole2') {
      throw new Error(`Incorrect network: ${networkName}`);
    }

    const { mainSigner, quoteSigner } = await getSigners(hre);
    const metadata = JSON.parse(
      fs.readFileSync(WORMHOLE_METADATA_FILE_PATH).toString(),
    ) as WormholeMetadata;

    const quoteTokenAddress = '0x' + metadata.quoteToken.slice(2 + 12 * 2);
    const dstPoolAddress = '0x' + metadata.dstPool.slice(2 + 12 * 2);
    const dstTraderAddress = '0x' + metadata.dstTrader.slice(2 + 12 * 2);

    const quoteToken = await hre.ethers.getContractAt(
      'IERC20',
      quoteTokenAddress,
      mainSigner,
    );

    const dummyXApp = await hre.ethers.getContractAt(
      'DummyXChainApp',
      EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX,
      mainSigner,
    );

    const traderBalanceBefore = await quoteToken.balanceOf(dstTraderAddress);

    console.log('Trader Balance Before', traderBalanceBefore.toString());

    const poolBalanceBefore = await quoteToken.balanceOf(dstPoolAddress);

    console.log('Pool Balance Before', poolBalanceBefore.toString());

    console.log(
      'X-Chain App Counter Before',
      (await dummyXApp.xCounter()).toString(),
    );

    const messengerMetadata = getDeployedContractMetadata(
      'IHashflowWormholeMessenger',
      networkName,
    );

    if (!messengerMetadata) {
      throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
    }

    const messengerContract = await hre.ethers.getContractAt(
      'HashflowWormholeMessenger',
      messengerMetadata.address,
      quoteSigner,
    );

    try {
      const tx = await (
        await messengerContract.wormholeReceive(
          Buffer.from(metadata.vaaBytes, 'base64'),
        )
      ).wait();
      if (!tx) {
        throw new Error(`Could not resolve transaction receipt.`);
      }

      const traderBalanceAfter = await quoteToken.balanceOf(dstTraderAddress);
      const poolBalanceAfter = await quoteToken.balanceOf(dstPoolAddress);

      if (
        traderBalanceAfter !=
        traderBalanceBefore + BigInt(metadata.quoteTokenAmount)
      ) {
        throw new Error(`Incorrect amount trader`);
      }

      if (
        poolBalanceAfter !=
        poolBalanceBefore - BigInt(metadata.quoteTokenAmount)
      ) {
        throw new Error(`Incorrect amount pool`);
      }

      console.log('Pool Balance After', poolBalanceAfter.toString());
      console.log('Trader Balance After', traderBalanceAfter.toString());
      console.log(
        'X-Chain App Counter After',
        (await dummyXApp.xCounter()).toString(),
      );

      console.log('Gas Used', tx.gasUsed.toString());
    } catch (err) {
      console.log((err as Error).message);
      throw err;
    }
  },
);

task('wormhole:relay:solana', 'Relays a Solana X-Chain trade')
  .addParam('vaa', 'The Solana VAA')
  .setAction(async (taskArgs, hre) => {
    const { vaa } = taskArgs;
    console.log(vaa);

    const { name: networkName } =
      getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    if (networkName !== 'wormhole1') {
      throw new Error(`Incorrect network: ${networkName}`);
    }

    const { mainSigner, quoteSigner, traderSigner } = await getSigners(hre);

    const quoteTokenAddress = EVM_TEST_TOKEN_1_ADDRESS_HEX;
    const dstPoolAddress = EVM_POOL_ADDRESS_HEX;
    const dstTraderAddress = await traderSigner.getAddress();

    console.log('TRADER', dstTraderAddress);

    const quoteToken = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      quoteTokenAddress,
      mainSigner,
    );

    const traderBalanceBefore = await quoteToken.balanceOf(dstTraderAddress);

    console.log('Trader Balance Before', traderBalanceBefore.toString());

    const poolBalanceBefore = await quoteToken.balanceOf(dstPoolAddress);

    console.log('Pool Balance Before', poolBalanceBefore.toString());

    const messengerMetadata = getDeployedContractMetadata(
      'IHashflowWormholeMessenger',
      networkName,
    );

    if (!messengerMetadata) {
      throw new Error(`Could not find IHashflowWormholeMessenger metadata`);
    }

    const messengerContract = await hre.ethers.getContractAt(
      'HashflowWormholeMessenger',
      messengerMetadata.address,
      quoteSigner,
    );

    try {
      const tx = await (
        await messengerContract.wormholeReceive(Buffer.from(vaa, 'base64'))
      ).wait();
      if (!tx) {
        throw new Error(`Could not resolve transaction receipt.`);
      }

      const traderBalanceAfter = await quoteToken.balanceOf(dstTraderAddress);
      const poolBalanceAfter = await quoteToken.balanceOf(dstPoolAddress);

      console.log('Pool Balance After', poolBalanceAfter.toString());
      console.log('Trader Balance After', traderBalanceAfter.toString());

      console.log('Gas Used', tx.gasUsed.toString());
    } catch (err) {
      console.log((err as Error).message);
      throw err;
    }
  });

task(
  'wormhole:x-app:check-value',
  'Prints out the counter and caller',
).setAction(async (taskArgs, hre) => {
  const { name: networkName } =
    getNetworkConfigFromHardhatRuntimeEnvironment(hre);

  if (!isWormholeTestnet(networkName)) {
    throw new Error(`Incorrect network.`);
  }

  const xApp = await hre.ethers.getContractAt(
    'DummyXChainApp',
    EVM_DUMMY_X_CHAIN_APP_ADDRESS_HEX,
  );

  const xCaller = await xApp.xCaller();
  const xCounter = await xApp.xCounter();

  console.log('XCaller', xCaller);
  console.log('XCounter', xCounter.toString());
});
