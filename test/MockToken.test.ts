import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {MyERC1155, MyERC1155__factory} from '../types/typechain';
import allConstants from '../constants';
import {BigNumber} from 'ethers';
import {MyERC1155Recipient} from '../types/typechain/contracts/MyERC1155.sol';
import {MyERC1155Recipient__factory} from '../types/typechain/factories/contracts/MyERC1155.sol';
const constants = allConstants.MyERC1155;

describe('ERC1155', () => {
  let myERC1155: MyERC1155;
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;

  before(async () => {
    [owner, alice] = await ethers.getSigners();
    const erc1155Factory = (await ethers.getContractFactory('MyERC1155', owner)) as MyERC1155__factory;
    myERC1155 = await erc1155Factory.deploy(constants.URI);
    await myERC1155.deployed();
  });

  describe('deployment', async () => {
    it('should have correct URI & balance at owner', async () => {
      // 0 does not mean anything here, as it requires same URI with {id} to be replaced on client
      expect(await myERC1155.uri(0)).to.eq(constants.URI);
    });
  });

  describe('minting', async () => {
    it('should mint for Owner', async () => {
      // mint nfts
      await Promise.all(
        constants.supplies.map((s, i) =>
          expect(myERC1155.safeMint(owner.address, s, '0x'))
            .to.emit(myERC1155, 'TransferSingle')
            .withArgs(owner.address, ethers.constants.AddressZero, owner.address, i, s)
        )
      );

      // single balance check
      expect(await myERC1155.balanceOf(owner.address, 0)).to.eql(constants.supplies[0]);

      // batch balance check
      expect(
        await myERC1155.balanceOfBatch(
          new Array(constants.supplies.length).fill(owner.address), // owner for each token
          constants.supplies.map((_, i) => i) // map supply array to tokenIDs via index
        )
      ).to.eql(constants.supplies);
    });
  });

  describe('transferring', async () => {
    it('should transfer single', async () => {
      const tokenId = 0;
      const amount = constants.supplies[tokenId].div(2);

      // check initial balances
      expect(await myERC1155.balanceOf(owner.address, tokenId)).to.eq(constants.supplies[tokenId]);
      expect(await myERC1155.balanceOf(alice.address, tokenId)).to.eq(0);

      // transfer
      myERC1155.safeTransferFrom(owner.address, alice.address, tokenId, amount, '0x');

      // check new balances
      expect(await myERC1155.balanceOf(owner.address, tokenId)).to.eq(constants.supplies[tokenId].sub(amount));
      expect(await myERC1155.balanceOf(alice.address, tokenId)).to.eq(amount);
    });

    it('should transfer batch', async () => {
      const tokenIds = [1, 2];
      const amounts = [constants.supplies[tokenIds[0]].div(2), constants.supplies[tokenIds[1]]];

      // check initial balances
      expect(await myERC1155.balanceOfBatch([owner.address, owner.address], tokenIds)).to.eql(
        tokenIds.map(id => constants.supplies[id])
      );
      expect(await myERC1155.balanceOfBatch([alice.address, alice.address], tokenIds)).to.eql(
        tokenIds.map(() => BigNumber.from(0))
      );

      // transfer
      myERC1155.safeBatchTransferFrom(owner.address, alice.address, tokenIds, amounts, '0x');

      // check new balances
      expect(await myERC1155.balanceOfBatch([owner.address, owner.address], tokenIds)).to.eql(
        tokenIds.map((id, i) => constants.supplies[id].sub(amounts[i]))
      );
      expect(await myERC1155.balanceOfBatch([alice.address, alice.address], tokenIds)).to.eql(
        tokenIds.map((_, i) => amounts[i])
      );
    });
  });

  describe('can notify a recipient contract', () => {
    const tokenId = 0;
    const amount = constants.supplies[tokenId].div(4);
    let erc1155recipient: MyERC1155Recipient;

    before(async () => {
      const erc1155recipientFactory = (await ethers.getContractFactory(
        'MyERC1155Recipient',
        owner
      )) as MyERC1155Recipient__factory;
      erc1155recipient = await erc1155recipientFactory.deploy();
      await erc1155recipient.deployed();
    });

    it('should be notified on recieve', async () => {
      expect(await erc1155recipient.numTimesReceived()).to.eq(0);

      await myERC1155.safeTransferFrom(owner.address, erc1155recipient.address, tokenId, amount, '0x');
      expect(await myERC1155.balanceOf(erc1155recipient.address, tokenId)).to.eq(amount);

      expect(await erc1155recipient.numTimesReceived()).to.eq(1);
      expect(await erc1155recipient.lastReceivedFrom()).to.eq(owner.address);
    });
  });
});
