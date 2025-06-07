// ethBridge.js
import { ethers } from "ethers";
import {
  ETH_CONTRACT_ADDRESS,
  ETH_CONTRACT_ABI,
} from "./src/constants/ETHcontract";

const PRIVATE_KEY =
  "cc82834c349c58d04ae228f109f132852221d652c683f96bc5f383bb99ce1ca3"; // 🔐 keep safe!
const PROVIDER_URL = "https://ethereum-sepolia.publicnode.com"; // or your XRPL EVM RPC
const USER_ADDRESS = "0x9232760bA5385f8c88891A97906b7c8cE4FCafa7"; // get this from frontend or passed in

export async function bridgeXRPToEth(amountInEth) {
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      ETH_CONTRACT_ADDRESS,
      ETH_CONTRACT_ABI,
      wallet
    );

    const tx = await contract.bridgeFromXrp(USER_ADDRESS, {
      value: ethers.parseEther(amountInEth.toString()),
    });

    console.log("Bridge transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ Bridged and staked on ETH side.");
  } catch (error) {
    console.error("❌ Error in ETH bridging:", error);
  }
}
