// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// A simple ERC721 token, gives the owner ability to mint tokens one at a time.
contract MyERC721 is ERC721, ReentrancyGuard {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;
	uint256 public maxSupply;
	string private baseURI;
	uint256 public publicSalePrice = 0.001 ether;

	constructor(
		string memory name_,
		string memory symbol_,
		uint256 supply_,
		string memory baseURI_
	) ERC721(name_, symbol_) {
		maxSupply = supply_;
		baseURI = baseURI_;
	}

	modifier notContract() {
        require(!_isContract(msg.sender), "Contract not allowed");
        require(msg.sender == tx.origin, "Proxy contract not allowed");
        _;
    }

	function clientMint(uint256 amount) public payable nonReentrant notContract {
		require(_tokenIdCounter.current() + amount <= maxSupply, "Max Supply Reached");
		require(publicSalePrice * amount <= msg.value, "Insufficient money");
		uint256 tokenId;
		for (uint256 i = 0; i < amount; ++i) {
			tokenId = _tokenIdCounter.current();
			_tokenIdCounter.increment();
			_safeMint(msg.sender, tokenId);
		}
	}

	function getTotalMintNumber() public view returns (uint256) {
		return _tokenIdCounter.current();
	}

	// override baseURI with user input
	function _baseURI() internal view override returns (string memory) {
		return baseURI;
	}

	function _isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}