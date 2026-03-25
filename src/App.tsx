import React, { useState, useCallback } from 'react';
import { useWallet } from './hooks/useWallet';
import { useTransaction } from './hooks/useTransaction';
import type { NotificationState, Product } from './types';
import WalletConnect from './components/WalletConnect';
import NetworkBadge from './components/NetworkBadge';
import ProductForm from './components/ProductForm';
import TransactionHistory from './components/TransactionHistory';
import Notifications from './components/Notifications';

const SEPOLIA_CHAIN_ID = import.meta.env.VITE_CHAIN_ID || '0xaa36a7';

let notifId = 0;

function App() {
    const { wallet, connectWallet, disconnectWallet, switchNetwork } = useWallet();
    const {
        transactions,
        signature,
        isSigning,
        isSending,
        gasEstimate,
        txError,
        pendingHash,
        signTransaction,
        sendTransaction,
        estimateGas,
        clearTransactions,
        getExplorer,
    } = useTransaction(wallet.chainId);

    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        type: 'info',
        visible: false,
        id: 0,
    });

    const showNotification = useCallback((message: string, type: NotificationState['type']) => {
        notifId++;
        setNotification({ message, type, visible: true, id: notifId });
    }, []);

    const dismissNotification = useCallback(() => {
        setNotification(prev => ({ ...prev, visible: false }));
    }, []);

    const handleConnect = async () => {
        await connectWallet();
        // Auto-prompt to switch to Sepolia after connecting
        setTimeout(async () => {
            if (window.ethereum) {
                const currentChain = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
                if (currentChain !== SEPOLIA_CHAIN_ID) {
                    showNotification('⚠️ Please switch to Sepolia Testnet to use this DApp.', 'warning');
                    await switchNetwork(SEPOLIA_CHAIN_ID);
                } else {
                    showNotification('✅ Wallet connected on Sepolia Testnet!', 'success');
                }
            }
        }, 500);
    };

    const handleDisconnect = () => {
        disconnectWallet();
        showNotification('Wallet disconnected.', 'info');
    };

    const handleSign = async (product: Product) => {
        const sig = await signTransaction(product);
        if (sig) {
            showNotification('✅ Transaction signed successfully!', 'success');
        } else {
            showNotification(txError || 'Signing failed.', 'error');
        }
    };

    const handleSend = async (product: Product) => {
        showNotification('⏳ Sending transaction...', 'info');
        const tx = await sendTransaction(product);
        if (tx) {
            showNotification(`🚀 Transaction sent! Hash: ${tx.hash.slice(0, 10)}...`, 'success');
        } else {
            showNotification(txError || 'Transaction failed.', 'error');
        }
    };

    const handleEstimate = async (product: Product) => {
        await estimateGas(product);
        showNotification('⛽ Gas estimated!', 'info');
    };

    return (
        <div className="app-root">
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="flex items-center gap-3">
                        <div className="logo-icon">⛓️</div>
                        <div>
                            <h1 className="app-title">BlockChain DApp</h1>
                            <p className="app-subtitle">Sepolia Testnet · MetaMask Interface</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NetworkBadge
                            chainId={wallet.chainId}
                            networkName={wallet.networkName}
                            isConnected={wallet.isConnected}
                            onSwitchNetwork={switchNetwork}
                        />
                        {wallet.isConnected && (
                            <div className="header-account-badge">
                                🦊 {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Notification Toast */}
            <Notifications notification={notification} onDismiss={dismissNotification} />

            {/* Pending Tx Banner */}
            {pendingHash && (
                <div className="pending-banner">
                    <span className="animate-pulse">⏳</span>
                    <span>Waiting for confirmation...</span>
                    <span className="font-mono text-xs">{pendingHash.slice(0, 16)}...</span>
                </div>
            )}

            {/* Wrong network warning banner */}
            {wallet.isConnected && wallet.chainId !== SEPOLIA_CHAIN_ID && (
                <div className="wrong-network-banner">
                    <span>⚠️ You are on <strong>{wallet.networkName}</strong>. This DApp is configured for <strong>Sepolia Testnet</strong>.</span>
                    <button
                        onClick={() => switchNetwork(SEPOLIA_CHAIN_ID)}
                        className="switch-now-btn"
                    >
                        Switch Now
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="app-main">
                <div className="main-grid">
                    {/* Left Panel */}
                    <div className="left-panel">
                        <WalletConnect
                            wallet={wallet}
                            onConnect={handleConnect}
                            onDisconnect={handleDisconnect}
                        />

                        {wallet.isConnected && (
                            <div className="info-card mt-4">
                                <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Network Info</h3>
                                <div className="info-row">
                                    <span className="text-gray-400 text-sm">Network</span>
                                    <span className="text-white text-sm">{wallet.networkName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="text-gray-400 text-sm">Chain ID</span>
                                    <span className="text-brand-400 text-sm font-mono">{wallet.chainId}</span>
                                </div>
                                <div className="info-row">
                                    <span className="text-gray-400 text-sm">Contract</span>
                                    <a
                                        href={`${import.meta.env.VITE_EXPLORER_URL}/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="explorer-link text-xs"
                                        title={import.meta.env.VITE_CONTRACT_ADDRESS}
                                    >
                                        {import.meta.env.VITE_CONTRACT_ADDRESS.slice(0, 6)}...{import.meta.env.VITE_CONTRACT_ADDRESS.slice(-4)} ↗
                                    </a>
                                </div>
                                <div className="info-row">
                                    <span className="text-gray-400 text-sm">Transactions</span>
                                    <span className="text-white text-sm">{transactions.length}</span>
                                </div>
                                {gasEstimate && (
                                    <div className="info-row">
                                        <span className="text-gray-400 text-sm">Last Gas Est.</span>
                                        <span className="text-yellow-400 text-sm">{parseInt(gasEstimate).toLocaleString()} units</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!wallet.isConnected && (
                            <div className="info-card mt-4">
                                <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3">How it Works</h3>
                                <ol className="how-it-works">
                                    <li>🦊 Connect MetaMask wallet</li>
                                    <li>📦 Fill in product details</li>
                                    <li>✍️ Sign the transaction</li>
                                    <li>🚀 Send on-chain</li>
                                    <li>📜 View in history</li>
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="right-panel">
                        <ProductForm
                            isConnected={wallet.isConnected}
                            onSign={handleSign}
                            onSend={handleSend}
                            onEstimateGas={handleEstimate}
                            isSigning={isSigning}
                            isSending={isSending}
                            gasEstimate={gasEstimate}
                            txError={txError}
                            signature={signature}
                        />
                    </div>
                </div>

                {/* Transaction History */}
                <div className="history-section">
                    <TransactionHistory
                        transactions={transactions}
                        getExplorer={getExplorer}
                        onClear={clearTransactions}
                    />
                </div>
            </main>

            <footer className="app-footer">
                <p>Built with React + ethers.js + MetaMask · Blockchain DApp</p>
            </footer>
        </div>
    );
}

export default App;
