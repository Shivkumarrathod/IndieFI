// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IIndieToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract Treasury {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function triggerMint(address token, address to, uint256 amount) external onlyOwner {
        IIndieToken(token).mint(to, amount);
    }

    function triggerBurn(address token, address from, uint256 amount) external onlyOwner {
        IIndieToken(token).burn(from, amount);
    }
}
