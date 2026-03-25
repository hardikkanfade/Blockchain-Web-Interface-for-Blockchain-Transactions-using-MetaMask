# ⛓️ Blockchain Product Registry DApp

A modern, high-performance Decentralized Application (DApp) for registering products and tracking transactions on the Ethereum blockchain (Sepolia Testnet). Built with React, Vite, Ethers.js, and Solidity.

![DApp Interface](src/assets/preview.png) *(Note: Add a screenshot to src/assets for best results!)*

## 🚀 Features

-   **🌐 MetaMask Integration**: Secure wallet connection and network management.
-   **📜 Smart Contract Logic**: Product data is stored permanently on the Sepolia Testnet.
-   **✍️ Cryptographic Signing**: Off-chain signing before sending transactions for enhanced security.
-   **📊 Transaction History**: Real-time view of all on-chain interactions.
-   **🛡️ Secure Config**: Environment variable support for contract addresses and configurations.
-   **💎 Premium UI**: Built with Tailwind CSS, featuring glassmorphism and smooth micro-animations.

## 🛠️ Technology Stack

-   **Frontend**: React 19, Vite, TypeScript
-   **Blockchain**: Solidity, Ethers.js
-   **Styling**: Vanilla CSS + Tailwind CSS
-   **Development**: MetaMask, Remix IDE

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [MetaMask](https://metamask.io/) browser extension
-   Some Sepolia ETH (Get it from a [faucet](https://sepoliafaucet.com/))

## ⚙️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/blockchain-product-registry.git
    cd blockchain-product-registry/blockchain-dapp
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    -   Create a `.env` file in the `blockchain-dapp` directory.
    -   Copy the contents of `.env.example` and fill in your values:
    ```env
    VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
    VITE_CHAIN_ID=0xaa36a7
    VITE_EXPLORER_URL=https://sepolia.etherscan.io
    ```

4.  **Deploy the Smart Contract**:
    -   Open `ProductRegistry.sol` in [Remix IDE](https://remix.ethereum.org/).
    -   Compile and deploy to the **Sepolia Testnet** using "Injected Provider - MetaMask".
    -   Copy the resulting contract address into your `.env` file.

## 🚀 Usage

Run the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## 📂 Project Structure

-   `ProductRegistry.sol`: Solidity smart contract.
-   `src/contracts`: TypeScript ABI and contract wrapper.
-   `src/hooks`: Custom hooks for wallet and transaction logic.
-   `src/components`: Reusable UI components.
-   `src/utils`: Helper functions for Ethereum interactions.

