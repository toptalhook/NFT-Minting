import {ethers, run} from 'hardhat';

/**
 * Deploys an MockToken contract. Constructor arguments are given from {constants}.
 * @returns address of the deployed contract
 */
export default async function main() {
  console.log('\n[SoulBoundTicketNFT Contract]');
  const factory = await ethers.getContractFactory('SoulBoundTicketNFT');
  const contract = await factory.deploy();
  await contract.deployed();

  console.log(`\SoulBoundTicketNFT is deployed at ${contract.address}`);
  
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
