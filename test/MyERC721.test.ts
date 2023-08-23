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
      expect(await myERC721.owner()).to.eq(owner.address);
    });
  });

  describe('minting', async () => {
    const numTokens = 5;
    const ownerTokensMint = Array(numTokens)
      .fill(undefined)
      .map((_, i) => i);
    const aliceTokensMint = ownerTokensMint.map(v => v + ownerTokensMint.length);

    // mint [0, 1, ..., n-1] to Owner
    it('should mint for Owner', async () => {
      await Promise.all(
        ownerTokensMint.map(expectedtokenId =>
          expect(myERC721.safeMint(owner.address))
            .to.emit(myERC721, 'Transfer')
            .withArgs(ethers.constants.AddressZero, owner.address, expectedtokenId)
        )
      );
      // correct balance
      expect(await myERC721.balanceOf(owner.address)).to.eq(ownerTokensMint.length);
      // correct tokenURIs
      expect(await myERC721.tokenURI(ownerTokensMint[0])).to.eq(constants.baseURI + ownerTokensMint[0]);
    });

    // mint [n, n+1, ..., n+n-1] to Alice
    it('should mint for Alice via Owner', async () => {
      await Promise.all(
        aliceTokensMint.map(expectedtokenId =>
          expect(myERC721.safeMint(alice.address))
            .to.emit(myERC721, 'Transfer')
            .withArgs(ethers.constants.AddressZero, alice.address, expectedtokenId)
        )
      );
      // correct balance
      expect(await myERC721.balanceOf(alice.address)).to.eq(aliceTokensMint.length);
      // correct tokenURIs
      expect(await myERC721.tokenURI(aliceTokensMint[0])).to.eq(constants.baseURI + aliceTokensMint[0]);
    });

    it('should NOT mint for Alice via Alice', async () => {
      await expect(myERC721.connect(alice).safeMint(alice.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
  });

  describe('transferring', async () => {
    const tokenId = 0; // this test will use the first token

    it('should allow transfer of an owned NFT', async () => {
      // transfer from owner to alice
      await expect(myERC721['safeTransferFrom(address,address,uint256)'](owner.address, alice.address, tokenId))
        .to.emit(myERC721, 'Transfer')
        .withArgs(owner.address, alice.address, tokenId);
      expect(await myERC721.ownerOf(tokenId)).to.eq(alice.address);

      // transfer back
      await expect(
        myERC721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, owner.address, tokenId)
      )
        .to.emit(myERC721, 'Transfer')
        .withArgs(alice.address, owner.address, tokenId);
      expect(await myERC721.ownerOf(tokenId)).to.eq(owner.address);
    });

    it('should NOT allow transfer of an NFT that is not owned', async () => {
      await expect(
        myERC721.connect(alice)['safeTransferFrom(address,address,uint256)'](owner.address, alice.address, tokenId)
      ).to.be.revertedWith('ERC721: caller is not token owner nor approved');
    });

    it('should allow approval & transferFrom of an owned NFT', async () => {
      // owner approves alice for the transfer
      await expect(myERC721.approve(alice.address, tokenId))
        .to.emit(myERC721, 'Approval')
        .withArgs(owner.address, alice.address, tokenId);

      // alice calls transfer-from
      await expect(
        myERC721.connect(alice)['safeTransferFrom(address,address,uint256)'](owner.address, alice.address, tokenId)
      )
        .to.emit(myERC721, 'Transfer')
        .withArgs(owner.address, alice.address, tokenId);
      expect(await myERC721.ownerOf(tokenId)).to.eq(alice.address);

      // transfer back
      await expect(
        myERC721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, owner.address, tokenId)
      )
        .to.emit(myERC721, 'Transfer')
        .withArgs(alice.address, owner.address, tokenId);
      expect(await myERC721.ownerOf(tokenId)).to.eq(owner.address);
    });
  });
});