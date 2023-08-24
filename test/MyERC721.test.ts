import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {MyERC721, MyERC721__factory} from '../types/typechain';
import allConstants from '../constants';
const constants = allConstants.MyERC721;

describe('ERC721', () => {
  let myERC721: MyERC721;
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;

  before(async () => {
    [owner, alice] = await ethers.getSigners();
    const factory = (await ethers.getContractFactory('MyERC721', owner)) as MyERC721__factory;
    myERC721 = await factory.deploy(constants.name, constants.symbol, constants.supply, constants.baseURI);
    await myERC721.deployed();
  });

  describe('deployment', async () => {
    it('should have correct name, symbol and owner', async () => {
      expect(await myERC721.name()).to.eq(constants.name);
      expect(await myERC721.symbol()).to.eq(constants.symbol);
      expect(await myERC721.maxSupply()).to.eq(constants.supply);
      expect(await myERC721.publicSalePrice()).to.eq(ethers.utils.parseEther('0.001'));
    });
  });

  describe('minting', async () => {
    const numTokens = 5;

    it('should mint', async () => {
      const price = await myERC721.publicSalePrice();
      const val = price.mul(numTokens);
      await myERC721.clientMint(numTokens, {value: val});
      expect(await myERC721.balanceOf(owner.address)).to.eq(numTokens);
    });

    it('should revert for too many amounts', async () => {
      const maxSupply = await myERC721.maxSupply();
      const amount = maxSupply.add(1);
      const price = await myERC721.publicSalePrice();
      const val = price.mul(amount);
      await expect(myERC721.clientMint(maxSupply.add(1), {value: val})).to.be.revertedWith('Max Supply Reached');
    });

    it('should revert for insufficient balance', async () => {
      const price = await myERC721.publicSalePrice();
      const val = price.mul(numTokens).sub(1);
      await expect(myERC721.clientMint(numTokens, {value: val})).to.be.revertedWith('Insufficient money');
    });
  });
});
