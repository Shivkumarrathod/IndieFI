// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FundraiseVault {
    address public owner;
    address public tokenAddress;
    uint256 public cap;
    uint256 public deadline;
    uint256 public totalRaised;
    bool public claimed;

    mapping(address => uint256) public contributions;

    constructor(address _tokenAddress, uint256 _cap, uint256 _durationInDays) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        cap = _cap;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    receive() external payable {
        require(block.timestamp < deadline, "Expired");
        require(totalRaised < cap, "Cap reached");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    function claimFunds() external {
        require(msg.sender == owner, "Not owner");
        require(block.timestamp >= deadline, "Too early");
        require(totalRaised >= cap, "Cap not met");
        require(!claimed, "Already claimed");

        claimed = true;
        payable(owner).transfer(address(this).balance);
    }

    function refund() external {
        require(block.timestamp >= deadline, "Too early");
        require(totalRaised < cap, "Cap met");

        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No funds");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
