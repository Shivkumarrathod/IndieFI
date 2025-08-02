// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IndieFi - All-in-One Token + Fundraise + Treasury Contract
 */
contract IndieFi is ERC20  {
    address public owner;
    // --- Fundraising ---
    uint256 public fundraiseCap;
    uint256 public totalRaised;
    bool public fundraiseFinalized;
    mapping(address => uint256) public contributions;

    // --- Token Utility Tracking (optional analytics) ---
    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    // --- Events ---
    event ContributionReceived(address indexed from, uint256 amount);
    event FundraiseFinalized(address indexed creator, uint256 totalRaised);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _fundraiseCap
    )
      ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        fundraiseCap = _fundraiseCap;
        owner = msg.sender;
      }  
        
    
    // --- Modifier Functions ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    // --- Fundraise ---

    function contribute() external payable {
        require(!fundraiseFinalized, "Fundraise is finalized");
        require(totalRaised + msg.value <= fundraiseCap, "Cap exceeded");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);
    }

    function finalizeFundraise() external onlyOwner {
        require(!fundraiseFinalized, "Already finalized");
        require(totalRaised >= fundraiseCap, "Cap not yet reached");

        fundraiseFinalized = true;
        payable(owner).transfer(address(this).balance);

        emit FundraiseFinalized(owner, totalRaised);
    }

    function refund() external {
        require(!fundraiseFinalized, "Already finalized");
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contribution found");

        contributions[msg.sender] = 0;
        totalRaised -= amount;
        payable(msg.sender).transfer(amount);
    }

    // --- Minting/Burning (by Owner/Treasury Logic) ---

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    // --- Staking (Simple Lock Logic) ---

    function stake(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Not enough tokens");
        _burn(msg.sender, amount);
        staked[msg.sender] += amount;
        totalStaked += amount;

        emit TokensStaked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(staked[msg.sender] >= amount, "Not enough staked");
        staked[msg.sender] -= amount;
        totalStaked -= amount;
        _mint(msg.sender, amount);

        emit TokensUnstaked(msg.sender, amount);
    }
}
