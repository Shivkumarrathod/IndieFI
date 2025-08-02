// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title YourContract - Multi-Project IndieFi System (Token + Fundraise + Stake)
 */
contract YourContract is ERC20 {
    address public masterOwner;

    // Struct for each project
    struct Project {
        string name;
        string symbol;
        address creator;
        uint256 fundraiseCap;
        uint256 totalRaised;
        bool fundraiseFinalized;
        uint256 totalStaked;
        uint256 initialSupply;
        mapping(address => uint256) contributions;
        mapping(address => uint256) staked;
    }

    // All deployed projects
    Project[] public projects;
    mapping(uint256 => mapping(address => uint256)) public balances;

    event ProjectCreated(uint256 indexed projectId, string name, address creator);
    event ContributionReceived(uint256 indexed projectId, address indexed from, uint256 amount);
    event FundraiseFinalized(uint256 indexed projectId, address indexed creator, uint256 totalRaised);
    event TokensStaked(uint256 indexed projectId, address indexed user, uint256 amount);
    event TokensUnstaked(uint256 indexed projectId, address indexed user, uint256 amount);
    event TokensBurned(uint256 indexed projectId, address indexed from, uint256 amount);
    event TokensMinted(uint256 indexed projectId, address indexed to, uint256 amount);

    constructor() ERC20("BaseToken", "BASE") {
        masterOwner = msg.sender;
    }

    modifier onlyProjectCreator(uint256 projectId) {
        require(msg.sender == projects[projectId].creator, "Not project creator");
        _;
    }

    // Create a new project
    function createProject(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 fundraiseCap
    ) external {
        Project storage newProject = projects.push();
        newProject.name = name;
        newProject.symbol = symbol;
        newProject.creator = msg.sender;
        newProject.initialSupply = initialSupply;
        newProject.fundraiseCap = fundraiseCap;

        balances[projects.length - 1][msg.sender] = initialSupply;

        emit ProjectCreated(projects.length - 1, name, msg.sender);
    }

    // Fundraising
    function contribute(uint256 projectId) external payable {
        Project storage project = projects[projectId];
        require(!project.fundraiseFinalized, "Fundraise finalized");
        require(project.totalRaised + msg.value <= project.fundraiseCap, "Cap exceeded");

        project.contributions[msg.sender] += msg.value;
        project.totalRaised += msg.value;

        emit ContributionReceived(projectId, msg.sender, msg.value);
    }

    function finalizeFundraise(uint256 projectId) external onlyProjectCreator(projectId) {
        Project storage project = projects[projectId];
        require(!project.fundraiseFinalized, "Already finalized");
        require(project.totalRaised >= project.fundraiseCap, "Cap not reached");

        project.fundraiseFinalized = true;
        payable(project.creator).transfer(project.totalRaised);

        emit FundraiseFinalized(projectId, project.creator, project.totalRaised);
    }

    function refund(uint256 projectId) external {
        Project storage project = projects[projectId];
        require(!project.fundraiseFinalized, "Already finalized");

        uint256 amount = project.contributions[msg.sender];
        require(amount > 0, "No contribution");

        project.contributions[msg.sender] = 0;
        project.totalRaised -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Mint/Burn
    function mint(uint256 projectId, address to, uint256 amount) external onlyProjectCreator(projectId) {
        balances[projectId][to] += amount;
        emit TokensMinted(projectId, to, amount);
    }

    function burn(uint256 projectId, address from, uint256 amount) external onlyProjectCreator(projectId) {
        require(balances[projectId][from] >= amount, "Not enough balance");
        balances[projectId][from] -= amount;
        emit TokensBurned(projectId, from, amount);
    }

    // Staking
    function stake(uint256 projectId, uint256 amount) external {
        require(balances[projectId][msg.sender] >= amount, "Not enough tokens");

        balances[projectId][msg.sender] -= amount;
        projects[projectId].staked[msg.sender] += amount;
        projects[projectId].totalStaked += amount;

        emit TokensStaked(projectId, msg.sender, amount);
    }

    function unstake(uint256 projectId, uint256 amount) external {
        require(projects[projectId].staked[msg.sender] >= amount, "Not enough staked");

        projects[projectId].staked[msg.sender] -= amount;
        projects[projectId].totalStaked -= amount;
        balances[projectId][msg.sender] += amount;

        emit TokensUnstaked(projectId, msg.sender, amount);
    }

    // View functions
    function getProjectCount() external view returns (uint256) {
        return projects.length;
    }

    function getMyBalance(uint256 projectId, address user) external view returns (uint256) {
        return balances[projectId][user];
    }

    function getStaked(uint256 projectId, address user) external view returns (uint256) {
        return projects[projectId].staked[user];
    }

    function getContribution(uint256 projectId, address user) external view returns (uint256) {
        return projects[projectId].contributions[user];
    }
    
    function getAllProjectsLite()external view
    returns (
        string[] memory names,
        string[] memory symbols,
        address[] memory creators,
        uint256[] memory fundraiseCaps,
        uint256[] memory totalRaisedList,
        bool[] memory finalizedList,
        uint256[] memory totalStakedList,
        uint256[] memory initialSupplies
    )
{
    uint256 len = projects.length;

    names = new string[](len);
    symbols = new string[](len);
    creators = new address[](len);
    fundraiseCaps = new uint256[](len);
    totalRaisedList = new uint256[](len);
    finalizedList = new bool[](len);
    totalStakedList = new uint256[](len);
    initialSupplies = new uint256[](len);

    for (uint256 i = 0; i < len; i++) {
        Project storage p = projects[i];
        names[i] = p.name;
        symbols[i] = p.symbol;
        creators[i] = p.creator;
        fundraiseCaps[i] = p.fundraiseCap;
        totalRaisedList[i] = p.totalRaised;
        finalizedList[i] = p.fundraiseFinalized;
        totalStakedList[i] = p.totalStaked;
        initialSupplies[i] = p.initialSupply;
    }
    }
    function getProjectInfo(uint256 projectId)external view
    returns (
        string memory name,
        string memory symbol,
        address creator,
        uint256 fundraiseCap,
        uint256 totalRaised,
        bool finalized,
        uint256 totalStaked,
        uint256 initialSupply
    )
    {
        Project storage p = projects[projectId];
        return (
            p.name,
            p.symbol,
            p.creator,
            p.fundraiseCap,
            p.totalRaised,
            p.fundraiseFinalized,
            p.totalStaked,
            p.initialSupply
        );
    }


}
