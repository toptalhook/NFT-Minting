import {ethers, run} from 'hardhat';
import type {MockToken__factory} from '../types/typechain';
import constants from '../constants';

/**
 * Deploys an MockToken contract. Constructor arguments are given from {constants}.
 * @returns address of the deployed contract
 */
export default async function main() {
  console.log('\n[MockToken Contract]');
  const factory = (await ethers.getContractFactory('MockToken')) as MockToken__factory;
  const contract = await factory.deploy("USDT", "USDT");
  await contract.deployed();

  console.log(`\MockToken is deployed at ${contract.address}`);
  
  await run(`verify:verify`, {
    address: contract.address,
    constructorArguments: [
    ],
  });

  console.log("Completed verify");
}

if (require.main === module) {
  main();
}
