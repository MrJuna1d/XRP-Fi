import { ethers } from "ethers";
import {
  ETH_CONTRACT_ADDRESS,
  ETH_CONTRACT_ABI,
} from "../constants/ETHcontract";

// Using environment variables for sensitive data
const BRIDGE_WALLET_PRIVATE_KEY = 'cc82834c349c58d04ae228f109f132852221d652c683f96bc5f383bb99ce1ca3';
const BRIDGE_WALLET_ADDRESS = '0x9232760ba5385f8c88891a97906b7c8ce4fcafa7';
const ETH_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/Chp3sLtAWI2CAe3S7ws_uMZLoh1d8DQJ";

if (!BRIDGE_WALLET_PRIVATE_KEY || !BRIDGE_WALLET_ADDRESS || !ETH_RPC_URL) {
  console.error("Missing required environment variables for bridge service");
}

export const bridgeToEthereum = async (amountInEther, userAddress) => {
  try {
    console.log("Starting Ethereum bridge process...");
    console.log("Amount:", amountInEther, "ETH");
    console.log("User address:", userAddress);

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
    const bridgeWallet = new ethers.Wallet(BRIDGE_WALLET_PRIVATE_KEY, provider);

    // Verify bridge wallet address matches expected address
    if (bridgeWallet.address.toLowerCase() !== BRIDGE_WALLET_ADDRESS.toLowerCase()) {
      throw new Error("Bridge wallet address mismatch");
    }

    // Create contract instance
    const contract = new ethers.Contract(
      ETH_CONTRACT_ADDRESS,
      ETH_CONTRACT_ABI,
      bridgeWallet
    );

    // Convert amount to Wei
    const amountInWei = ethers.parseEther(amountInEther.toString());

    console.log("Calling bridgeFromXrp with parameters:");
    console.log("User address:", userAddress);
    console.log("Amount in Wei:", amountInWei.toString());

    // Call bridgeFromXrp function
    const tx = await contract.bridgeFromXrp(userAddress, {
      value: amountInWei
    });

    console.log("Bridge transaction sent:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Bridge transaction confirmed:", receipt.hash);

    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error in Ethereum bridge:", error);
    return {
      success: false,
      error: error.message
    };
  }
}; 