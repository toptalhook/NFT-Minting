// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulBoundTicketNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("SoulboundTickt", "STN") {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only the owner of the token can burn it"
        );
        _burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            "This is a Soulbound Token. It can't be transferred. It can only be burned by the token owner."
        );
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
