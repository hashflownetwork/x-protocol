import { task } from 'hardhat/config';
import {
  getDeployedContractMetadata,
  getNetworkConfigFromHardhatRuntimeEnvironment,
} from './utils';

task(
  'factory:update-pool-creator-authorization',
  'Updates Pool Creator Authorization',
)
  .addParam('poolCreator', 'The address of the Pool creator')
  .addFlag('revoke', 'Whether to revoke authorization')
  .setAction(async (taskArgs, hre) => {
    const networkConfig = getNetworkConfigFromHardhatRuntimeEnvironment(hre);

    const factoryContractMetadata = getDeployedContractMetadata(
      'IHashflowFactory',
      networkConfig.name,
    );

    if (!factoryContractMetadata) {
      throw new Error(
        `Could not find Factory deployment metadata for ${networkConfig.name}`,
      );
    }

    const hashflowFactoryContract = await hre.ethers.getContractAt(
      'IHashflowFactory',
      factoryContractMetadata.address,
    );

    const { poolCreator } = taskArgs;
    const authorizationStatus = !taskArgs.revoke;

    const tx = await hashflowFactoryContract.updatePoolCreatorAuthorization(
      poolCreator,
      authorizationStatus,
    );
    await tx.wait();

    console.log(
      `Updated authorization for ${poolCreator} to ${authorizationStatus}`,
    );
  });
