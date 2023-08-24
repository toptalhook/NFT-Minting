import {run} from 'hardhat';
import constants from '../constants';

export default async function main() {
  const contractAddress = "0x2d69DF9d72E52f5901fFe8eE40136Fb059c43E43"
  await run(`verify:verify`, {
    address: contractAddress,
    constructorArguments: [
      constants.MyERC721.name,
      constants.MyERC721.symbol,
      constants.MyERC721.supply,
      constants.MyERC721.baseURI
    ],
  })
}

if (require.main === module) {
  main();
}



