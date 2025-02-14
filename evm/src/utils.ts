import { Signer, BigNumberish, TransactionResponse } from 'ethers';

export const MAIN_NETWORK_NAMES = [
  'ethereum',
  'optimism',
  'arbitrum',
  'polygon',
  'bnb',
  'avalanche',
  'base',
] as const;

export const TEST_NETWORK_NAMES = [
  'mumbai',
  'goerli',
  'bnb-testnet',
  'zksync-testnet',
  'sepolia',
  'monad-testnet',
] as const;

export const WORMHOLE_NETWORK_NAMES = ['wormhole1', 'wormhole2'] as const;

export const NETWORK_NAMES = [
  ...MAIN_NETWORK_NAMES,
  ...TEST_NETWORK_NAMES,
] as const;

export const NETWORK_NAMES_EXTENDED = [
  ...NETWORK_NAMES,
  ...WORMHOLE_NETWORK_NAMES,
  'localhost',
] as const;

export type NetworkName = (typeof NETWORK_NAMES)[number];

export type NetworkNameExtended =
  | NetworkName
  | (typeof WORMHOLE_NETWORK_NAMES)[number]
  | 'localhost';

type MainnetChainId = 1 | 137 | 56 | 42161 | 10 | 43114 | 8453;
type TestnetChainId = 5 | 80001 | 97 | 280 | 11155111 | 10143;

export type ChainId = MainnetChainId | TestnetChainId;

export type ChainIdExtended = ChainId | 1337 | 31337 | 1397 | 1338;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface NetworkConfigBase {
  nativeTokenSymbol: string;
  nativeTokenName: string;
  nativeTokenDecimals: number;
  hashflowChainId: number;
  testTokens: boolean;
  weth?: string;
  wormholeEndpoint?: string;
  wormholeChainId?: number;
  wormholeConsistency?: number;
  wormholeFastConsistency?: number;
  layerZeroEndpoint?: string;
  layerZeroChainId?: number;
  layerZeroNonceContract?: string;

  // Used currently to avoid the Clones pattern and to use a different
  // compiler.
  zksync: boolean;
}

export type NetworkConfig = NetworkConfigBase & {
  name: NetworkName;
  chainId: ChainId;
};

export type NetworkConfigExtended = NetworkConfigBase & {
  name: NetworkNameExtended;
  chainId: ChainIdExtended;
};

export const LOCALHOST = {
  chainId: 31337,
  name: 'localhost',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 31337,
  testTokens: true,
  zksync: false,
} as const;

// Mainnets.

export const ETHEREUM = {
  chainId: 1,
  name: 'ethereum',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 1,
  testTokens: false,
  weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  layerZeroEndpoint: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
  layerZeroChainId: 101,
  layerZeroNonceContract: '0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068',
  wormholeChainId: 2,
  wormholeEndpoint: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  wormholeConsistency: 1,
  wormholeFastConsistency: 200,
  zksync: false,
} as const;

export const ARBITRUM = {
  chainId: 42161,
  name: 'arbitrum',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 2,
  testTokens: false,
  weth: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  layerZeroEndpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
  layerZeroChainId: 110,
  layerZeroNonceContract: '0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068',
  wormholeChainId: 23,
  wormholeEndpoint: '0xa5f208e072434bC67592E4C49C1B991BA79BCA46',
  wormholeConsistency: 1,
  wormholeFastConsistency: 200,
  zksync: false,
} as const;

export const OPTIMISM = {
  chainId: 10,
  name: 'optimism',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 3,
  testTokens: false,
  weth: '0x4200000000000000000000000000000000000006',
  layerZeroEndpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
  layerZeroChainId: 111,
  layerZeroNonceContract: '0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068',
  zksync: false,
  wormholeChainId: 24,
  wormholeConsistency: 1,
  wormholeEndpoint: '0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722',
} as const;

export const AVALANCHE = {
  chainId: 43114,
  name: 'avalanche',
  nativeTokenSymbol: 'AVAX',
  nativeTokenName: 'Avax',
  nativeTokenDecimals: 18,
  hashflowChainId: 4,
  testTokens: false,
  weth: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  layerZeroEndpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
  layerZeroChainId: 106,
  layerZeroNonceContract: '0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068',
  wormholeChainId: 6,
  wormholeEndpoint: '0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c',
  wormholeConsistency: 1,
  zksync: false,
} as const;

export const POLYGON = {
  chainId: 137,
  name: 'polygon',
  nativeTokenSymbol: 'MATIC',
  nativeTokenName: 'Matic',
  nativeTokenDecimals: 18,
  hashflowChainId: 5,
  testTokens: false,
  weth: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  layerZeroEndpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
  layerZeroChainId: 109,
  layerZeroNonceContract: '0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068',
  wormholeChainId: 5,
  wormholeEndpoint: '0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7',
  wormholeConsistency: 1,

  // For Polygon, there is no "safe" value. We use "instant".
  wormholeFastConsistency: 200,
  zksync: false,
} as const;

export const BNB = {
  chainId: 56,
  name: 'bnb',
  nativeTokenSymbol: 'BNB',
  nativeTokenName: 'BNB',
  nativeTokenDecimals: 18,
  hashflowChainId: 6,
  testTokens: false,
  weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  layerZeroEndpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
  layerZeroChainId: 102,
  layerZeroNonceContract: '0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068',
  wormholeChainId: 4,
  wormholeEndpoint: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  wormholeConsistency: 15,
  zksync: false,
} as const;

export const BASE = {
  chainId: 8453,
  name: 'base',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 7,
  testTokens: false,
  weth: '0x4200000000000000000000000000000000000006',
  wormholeChainId: 30,
  wormholeEndpoint: '0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6',
  wormholeConsistency: 1,
  wormholeFastConsistency: 200,
  zksync: false,
} as const;

// Testnets.

// DEPRECATED
export const GOERLI = {
  chainId: 5,
  name: 'goerli',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 101,
  testTokens: false,
  weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  layerZeroChainId: 10121,
  layerZeroEndpoint: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
  layerZeroNonceContract: '0xe931419cE7f9Ad7Bf9ec8e2657eF6C805A92089c',
  wormholeChainId: 2,
  wormholeEndpoint: '0x706abc4E45D419950511e474C7B9Ed348A4a716c',
  wormholeConsistency: 1,
  wormholeFastConsistency: 200,
  zksync: false,
} as const;

// DEPRECATED
export const MUMBAI = {
  chainId: 80001,
  name: 'mumbai',
  nativeTokenSymbol: 'MATIC',
  nativeTokenName: 'Matic',
  nativeTokenDecimals: 18,
  hashflowChainId: 103,
  testTokens: false,
  weth: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  layerZeroEndpoint: '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8',
  layerZeroChainId: 10109,
  layerZeroNonceContract: '0xB3b1f3dB03f7f3A0E49e0F4EEd0fb175B8A2cE15',
  wormholeChainId: 5,
  wormholeEndpoint: '0x0CBE91CF822c73C2315FB05100C2F714765d5c20',
  wormholeConsistency: 1,
  zksync: false,
} as const;

export const BNB_TESTNET = {
  chainId: 97,
  name: 'bnb-testnet',
  nativeTokenSymbol: 'BNB',
  nativeTokenName: 'BNB',
  nativeTokenDecimals: 18,
  hashflowChainId: 104,
  testTokens: false,
  weth: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
  layerZeroEndpoint: '0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1',
  layerZeroChainId: 10102,
  layerZeroNonceContract: '0x318b10788404E23dE2e02d52fA1329BDf6efD1FE',
  wormholeChainId: 4,
  wormholeEndpoint: '0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D',
  wormholeConsistency: 1,
  zksync: false,
} as const;

// DEPRECATED
export const ZKSYNC_TESTNET = {
  chainId: 280,
  name: 'zksync-testnet',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 105,
  testTokens: false,
  weth: '0x2da10a1e27bf85cedd8ffb1abbe97e53391c0295',
  zksync: true,
} as const;

export const SEPOLIA = {
  chainId: 11155111,
  name: 'sepolia',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 106,
  testTokens: false,
  wormholeChainId: 10002,
  wormholeEndpoint: '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78',
  wormholeConsistency: 1,
  wormholeFastConsistency: 200,
  weth: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  zksync: false,
} as const;

export const MONAD_TESTNET = {
  chainId: 10143,
  name: 'monad-testnet',
  nativeTokenSymbol: 'MON',
  nativeTokenName: 'Monad',
  nativeTokenDecimals: 18,
  hashflowChainId: 107,
  testTokens: false,
  weth: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  zksync: false,
} as const;

// Wormhole

export const WORMHOLE1 = {
  chainId: 1338,
  name: 'wormhole1',
  nativeTokenSymbol: 'ETH',
  nativeTokenName: 'Ether',
  nativeTokenDecimals: 18,
  hashflowChainId: 20001,
  testTokens: true,
  weth: '0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E',
  wormholeEndpoint: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  wormholeChainId: 2,
  wormholeConsistency: 1,
  wormholeFastConsistency: 1,
  zksync: false,
} as const;

export const WORMHOLE2 = {
  chainId: 1397,
  name: 'wormhole2',
  nativeTokenSymbol: 'BNB',
  nativeTokenName: 'BNB',
  nativeTokenDecimals: 18,
  hashflowChainId: 20002,
  testTokens: true,
  weth: '0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E',
  wormholeEndpoint: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  wormholeChainId: 4,
  wormholeConsistency: 1,
  wormholeFastConsistency: 1,
  zksync: false,
} as const;

export const NETWORK_CONFIG_BY_NAME: Record<NetworkName, NetworkConfig> = {
  ethereum: ETHEREUM,
  arbitrum: ARBITRUM,
  optimism: OPTIMISM,
  avalanche: AVALANCHE,
  polygon: POLYGON,
  bnb: BNB,
  base: BASE,
  goerli: GOERLI,
  sepolia: SEPOLIA,
  mumbai: MUMBAI,
  'bnb-testnet': BNB_TESTNET,
  'monad-testnet': MONAD_TESTNET,
  'zksync-testnet': ZKSYNC_TESTNET,
} as const;

export const HARDHAT_NETWORK_CONFIG_BY_NAME: Record<
  NetworkNameExtended,
  NetworkConfigExtended
> = {
  ...NETWORK_CONFIG_BY_NAME,
  localhost: LOCALHOST,
  wormhole1: WORMHOLE1,
  wormhole2: WORMHOLE2,
} as const;

export function padAddressTo32Bytes(address: string | Buffer): Buffer {
  const strAddress = address.toString();
  let paddedAddress =
    strAddress.indexOf('0x') === -1 ? strAddress : strAddress.slice(2);

  while (paddedAddress.length < 64) {
    paddedAddress = `00${paddedAddress}`;
  }

  return Buffer.from(paddedAddress, 'hex');
}

export async function sendETH(
  signer: Signer,
  value: BigNumberish,
  recipient: string,
): Promise<TransactionResponse> {
  const tx = {
    from: await signer.getAddress(),
    to: recipient,
    value,
    nonce: await signer.getNonce(),
    gasLimit: '50000',
    gasPrice: '100000000000',
    type: 0,
  };

  return await signer.sendTransaction(tx);
}
