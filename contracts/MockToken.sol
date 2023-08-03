// SPDX-License-Identifier: BUSL-1.1

// pragma solidity 0.7.6;
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, 100000000000000000 * (10**6));
    }

    bool paused;

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        // need to mock some failed transfer events
        require(!paused, "Failed transfer due to pause");

        return super.transfer(recipient, amount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        // need to mock some failed transfer events
        require(!paused, "Failed transfer due to pause");
        return super.transferFrom(sender, recipient, amount);
    }

    function pauseTransfers(bool _paused) external {
        paused = _paused;
    }
}
