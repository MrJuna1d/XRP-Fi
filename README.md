# 🪙 XRP-Fi: Cross-Chain Yield Aggregator

## 📦 Code Base

GitHub Repository: [MrJuna1d/XRP-Fi](https://github.com/MrJuna1d/XRP-Fi)

---

## 📝 Short Summary of Project

**XRP-Fi** is a cross-chain DeFi yield aggregator that addresses the lack of yield-generating protocols on the XRP EVM Sidechain network. The project displays multiple yield potential protocols to users and users can bridge funds from the XRP EVM sidechain to any chain that the protocol is on and automatically supply those to earn passive yield. Users can later withdraw and return funds back to the XRP chain. The system includes a backend relayer, smart contracts for both chains, and a frontend that provides seamless interaction and transparency throughout the process.

---

## 📖 Full Description of the Project

While XRP is a well-established blockchain with fast and cheap transactions, it lacks a robust ecosystem of DeFi protocols compared to the likes of Ethereum. This project aims to bridge that gap by allowing XRP holders to tap into DeFi opportunities — specifically yield generation — through a simulated cross-chain bridge.

The system works in four phases:

1. **Deposit on XRP side (XRP EVM Sidechain)** – User deposits testnet XRP into XRP.Fi.
2. **Bridge Funds to Ethereum (Sepolia)** – The backend relayer listens to events and sends ETH to the Ethereum smart contract.
3. **Auto-Supply to Start Earning Yield** – The Ethereum contract deposits the ETH directly into DeFi protocol.
4. **Withdraw and Return** – ETH is withdrawn from DeFi protocol and bridged back to XRP, where the user gets credited.

---

## 🛠️ Technical Description

**Frontend:**

- Built with **[Vite](https://vitejs.dev/)** + **[React](https://reactjs.org/)**
- User-friendly interface to bridge, supply, and track yield positions

**Backend / Smart Contracts:**

- Written in **Solidity**
- XRP-side contract (`XrpFiBridge`) handles deposits, bridge tracking, and withdrawals
- Ethereum-side contract (`EthereumBridgeReceiver`) tracks positions, supplies to Aave, and allows for withdrawal

**Integration Layer:**

- Powered by **[ethers.js](https://docs.ethers.org/)** for interacting with contracts
- A **relayer** is used to simulate cross-chain fund movement by monitoring events and triggering corresponding actions

**XRP EVM Sidechain Leverage:**

- Deployed the XRP-side smart contract on **XRP EVM Sidechain** to simulate transactions
- Interacts with a dedicated `CROSSCHAIN_WALLET` address to simulate value bridging
- Ensures compatibility with EVM standards for future migration to XRPL EVM mainnet

---

## 🎤 Presentation Link

👉 [View the Presentation](https://www.canva.com/design/DAGpUganP7c/IzLyz5cRkh2cOt_b0y6NZw/edit?utm_content=DAGpUganP7c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

## 🔗 Transaction Hashes and Contract Addresses

- **Bridge Funds to Ethereum (XRP side)**  
  [View on XRPL EVM Explorer](https://explorer.testnet.xrplevm.org/tx/0x0d89c843ddfe4f4c66b14645f3e41807595853f53d8e3cabee9d8f1bde61988d)

- **ETH Supplied to Aave (Ethereum side)**  
  [View on Sepolia Etherscan](https://sepolia.etherscan.io/tx/0xe912184d6693b873914e5a16a64daa65f0296fdd1fb84ac7540dad745e914b78)

- **XRP Smart Contract Deployments**  
  [View on XRPL EVM Explorer](https://explorer.testnet.xrplevm.org/address/0x61389b858618dc82e961Eadfd5B33C83B9669E04)

- **ETH Smart Contract Deployments**  
  [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xb0c09e33f395122b7788be5c132d5cfdbf7a3e8f)

---

## 📹 Video Demo

📺 _[YouTube Demo Link Here]_

---

## 🖼 Screenshot of UI

![UI Screenshot](./screenshot.png)  
_Example: bridging from XRP to Ethereum and supplying ETH to Aave._

---

## 🚀 Future Roadmap

- Support for multiple DeFi protocols (Compound, Lido, Morpho)
- Add reward tracking and APY comparison
- Support for real XRP EVM sidechain deployments
- Add stablecoin and NFT bridging simulation
