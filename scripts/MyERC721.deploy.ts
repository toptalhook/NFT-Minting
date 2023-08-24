import {ethers} from 'hardhat';
import type {MyERC721__factory} from '../types/typechain';
import constants from '../constants';

/**
 * Deploys an ERC721 contract. Constructor arguments are given from {constants}.
 * @returns address of the deployed contract
 */
export default async function main(): Promise<string> {
  console.log('\n[MyERC721 Contract]');
  const factory = (await ethers.getContractFactory('MyERC721')) as MyERC721__factory;
  const contract = await factory.deploy(
    constants.MyERC721.name,
    constants.MyERC721.symbol,
    constants.MyERC721.supply,
    constants.MyERC721.baseURI
  );
  await contract.deployed();

  console.log(`\tContract is deployed at ${contract.address}`);
  return contract.address;
}

if (require.main === module) {
  main();
}
