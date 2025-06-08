// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Ethereum-side bridge for receiving funds from XRP network and supplying to Aave
/// @author
/// @notice Accepts bridged ETH from off-chain/XRP bridge and supplies it into Aave via WETHGateway

interface IWETHGateway {
    function depositETH(
        address pool,
        address onBehalfOf,
        uint16 referralCode
    ) external payable;
}

contract EthereumBridgeReceiver {
    struct UserPosition {
        uint256 totalBridged;  // Total ETH bridged from XRP
        uint256 totalSupplied; // Total ETH supplied to Aave
        uint256 lastSuppliedAt; // Timestamp of last supply
    }


    address public immutable AAVE_POOL;
    address public immutable WETH_GATEWAY;
    address public immutable RELAYER;

    uint256 public totalBridgedFromXrp;

    /// @notice Optional: per-user bridge tracking
    mapping(address => uint256) public userBridgedAmount;

    mapping(address => UserPosition) public userPositions;


    /// @notice Events
    event BridgedFromXrp(address indexed user, uint256 amount);
    event SuppliedToAave(address indexed user, uint256 amount);

    modifier onlyRelayer() {
        require(msg.sender == RELAYER, "Not authorized");
        _;
    }

    constructor(address _aavePool, address _wethGateway, address _relayer) {
        AAVE_POOL = _aavePool;
        WETH_GATEWAY = _wethGateway;
        RELAYER = _relayer;
    }

    /// @notice Called by XRP bridge relayer to record ETH receipt and forward to Aave
    /// @dev ETH must be sent along with this call
    /// @param user The original XRP user on whose behalf the ETH is bridged
    function bridgeFromXrp(address user) external payable onlyRelayer {
        require(msg.value > 0, "Must send ETH");

        // Track total bridge
        totalBridgedFromXrp += msg.value;

        // Update user position
        UserPosition storage position = userPositions[user];
        position.totalBridged += msg.value;
        position.totalSupplied += msg.value;
        position.lastSuppliedAt = block.timestamp;

        emit BridgedFromXrp(user, msg.value);

        // Supply to Aave on behalf of user
        IWETHGateway(WETH_GATEWAY).depositETH{value: msg.value}(
            AAVE_POOL,
            user,
            0
        );

        emit SuppliedToAave(user, msg.value);
    }


    /// @notice Fallback to reject direct ETH transfers
    receive() external payable {
        revert("Direct ETH not allowed");
    }
}