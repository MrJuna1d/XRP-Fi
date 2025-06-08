// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract XrpFiBridge {
    address payable public immutable CROSSCHAIN_WALLET;

    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();
    error Unauthorized();
    error InvalidBridge();
    error AlreadyProcessed();

    event Deposit(address indexed user, uint256 amount);
    event BridgeInitiated(uint256 indexed bridgeId, address indexed user, uint256 amount);
    event BridgeSettled(uint256 indexed bridgeId, address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    struct BridgeRequest {
        address user;
        uint256 amount;
        bool settled;
    }

    mapping(address => uint256) public userDeposits;
    mapping(uint256 => BridgeRequest) public bridgeRequests;
    uint256 public nextBridgeId;

    modifier onlyCrossChain() {
        if (msg.sender != CROSSCHAIN_WALLET) revert Unauthorized();
        _;
    }

    constructor(address payable _crosschainWallet) {
        CROSSCHAIN_WALLET = _crosschainWallet;
        nextBridgeId = 1;
    }

    /// @notice User deposits XRP (simulated via native token)
    function deposit() external payable {
        if (msg.value == 0) revert InvalidAmount();
        userDeposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice User requests to bridge XRP to Ethereum
    function initiateBridge(uint256 amount) external returns (uint256 bridgeId) {
        if (amount == 0) revert InvalidAmount();
        if (userDeposits[msg.sender] < amount) revert InsufficientBalance();

        userDeposits[msg.sender] -= amount;

        bridgeId = nextBridgeId++;
        bridgeRequests[bridgeId] = BridgeRequest({
            user: msg.sender,
            amount: amount,
            settled: false
        });
        
        (bool success, ) = CROSSCHAIN_WALLET.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit BridgeInitiated(bridgeId, msg.sender, amount);
    }

    /// @notice Called by cross-chain wallet to finalize the bridge (e.g., after Aave deposit)
    function settleBridge(uint256 bridgeId) external onlyCrossChain {
        BridgeRequest storage request = bridgeRequests[bridgeId];
        if (request.user == address(0)) revert InvalidBridge();
        if (request.settled) revert AlreadyProcessed();

        request.settled = true;

        emit BridgeSettled(bridgeId, request.user, request.amount);
    }


    /// @notice User withdraws unbridged or refunded funds
    function withdraw(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        if (userDeposits[msg.sender] < amount) revert InsufficientBalance();

        userDeposits[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Withdrawal(msg.sender, amount);
    }

    /// @notice View deposit balance
    function getDepositBalance(address user) external view returns (uint256) {
        return userDeposits[user];
    }

    receive() external payable {}
}
