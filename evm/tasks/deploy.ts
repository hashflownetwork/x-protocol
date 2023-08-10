import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
  registerDeployedContract,
} from './utils';

task('factory:deploy', 'Deploys thes HashflowFactory').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const contractFactory = await hre.ethers.getContractFactory(
      'HashflowFactory'
    );
    const contract = await contractFactory.deploy();

    await contract.waitForDeployment();

    registerDeployedContract(contract, 'IHashflowFactory', networkConfig.name);
  }
);

task('factory:initialize', 'Initializes the HashflowFactory').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const routerMetadata = getDeployedContractMetadata(
      'IHashflowRouter',
      networkConfig.name
    );

    if (!routerMetadata) {
      throw new Error(`Could not find IHashflowRouter metadata`);
    }

    const factoryMetadata = getDeployedContractMetadata(
      'IHashflowFactory',
      networkConfig.name
    );

    if (!factoryMetadata) {
      throw new Error(`Could not find IHashflowFactory metadata`);
    }

    const factoryContract = await hre.ethers.getContractAt(
      'IHashflowFactory',
      factoryMetadata.address
    );

    const tx = await factoryContract.initialize(routerMetadata.address);
    await tx.wait();

    console.log(`Initialized HashflowFactory: ${tx.hash}`);
  }
);

task('router:deploy', 'Deploys the HashflowRouter').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const contractFactory = await hre.ethers.getContractFactory(
      'HashflowRouter'
    );

    const { weth } = networkConfig;

    if (!weth) {
      throw new Error(`Missing WETH address for network ${networkConfig.name}`);
    }

    const contract = await contractFactory.deploy(weth);

    await contract.waitForDeployment();

    registerDeployedContract(contract, 'IHashflowRouter', networkConfig.name);
  }
);

task('router:initialize', 'Initializes the HashflowRouter').setAction(
  async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const factoryMetadata = getDeployedContractMetadata(
      'IHashflowFactory',
      networkConfig.name
    );

    if (!factoryMetadata) {
      throw new Error(`Could not find IHashflowFactory metadata`);
    }

    const routerMetadata = getDeployedContractMetadata(
      'IHashflowRouter',
      networkConfig.name
    );

    if (!routerMetadata) {
      throw new Error(`Could not find IHashflowRouter metadata`);
    }

    const routerContract = await hre.ethers.getContractAt(
      'IHashflowRouter',
      routerMetadata.address
    );

    const tx = await routerContract.initialize(factoryMetadata.address);
    await tx.wait();

    console.log(`Initialized HashflowRouter: ${tx.hash}`);
  }
);
