import { task } from 'hardhat/config';
import {
  getNetworkConfigFromHardhatRuntimeEnvironment,
  registerDeployedContract,
} from './utils';

task('facade:deploy', 'Deploys the SwapFacade')
  .addParam('feeCollector', 'Fee collector address')
  .setAction(async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const facadeFactory = await hre.ethers.getContractFactory('SwapFacade');
    const facade = await facadeFactory.deploy(taskArgs.feeCollector);
    await facade.waitForDeployment();

    registerDeployedContract(facade, 'ISwapFacade', networkConfig.name);
  });
