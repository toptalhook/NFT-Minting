import {BigNumber} from 'ethers';
import {parseEther} from 'ethers/lib/utils';

const contractConstants = {
  MyERC721: {
    supply: 100,
    name: 'My ERC721 Token',
    symbol: 'M721',
    baseURI: 'https://localhost:8080/721tokens/',
  },
};

export default contractConstants as Readonly<typeof contractConstants>;
