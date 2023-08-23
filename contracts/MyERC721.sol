// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// A simple ERC721 token, gives the owner ability to mint tokens one at a time.
contract MyERC721 is ERC721, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  uint256 public maxSupply;
  string private baseURI;

  constructor(
    string memory name_,
    string memory symbol_,
    uint256 supply_,
    string memory baseURI_
  ) ERC721(name_, symbol_) {
    maxSupply = supply_;
    baseURI = baseURI_;
  }

  function safeMint(address to) public onlyOwner {
    require(_tokenIdCounter.current() <= maxSupply, "Max Supply Reached");
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  // override baseURI with user input
  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }
}