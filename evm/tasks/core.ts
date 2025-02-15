import { task } from 'hardhat/config';

task('core:transfer-eth', 'Tranfers ETH to an account')
  .addParam('account', 'Account to send ETH to')
  .addParam('amount', 'Amount of ETH to end', '0')
  .setAction(async (taskArgs, hre) => {
    const allSigners = await hre.ethers.getSigners();
    const mainSigner = allSigners[0];

    const tx = {
      to: taskArgs.account,
      value: BigInt(taskArgs.amount) ** BigInt(18),
    };

    await (await mainSigner.sendTransaction(tx)).wait();
  });

task('core:fast-forward-nonce')
  .addParam('targetNonce', 'The nonce to fast-forward to')
  .setAction(async (taskArgs, hre) => {
    const targetNonce = Number(taskArgs.targetNonce);

    if (Number.isNaN(targetNonce) || !Number.isInteger(targetNonce)) {
      throw new Error(`Invalid target nonce ${taskArgs.targetNonce}`);
    }

    const allSigners = await hre.ethers.getSigners();
    const mainSigner = allSigners[0];
    const mainSignerAddress = await mainSigner.getAddress();

    let signerNonce = await mainSigner.getNonce();

    while (signerNonce < targetNonce) {
      console.log(`Signer nonce is at ${signerNonce}. Bumping.`);
      await hre.run('core:transfer-eth', { account: mainSignerAddress });
      signerNonce = await mainSigner.getNonce();
    }
  });
