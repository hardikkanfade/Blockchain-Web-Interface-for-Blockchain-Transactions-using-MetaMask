import React from 'react';
import { WalletState } from '../types';
import { shortenAddress } from '../utils/ethereum';

interface WalletConnectProps {
    wallet: WalletState;
    onConnect: () => void;
    onDisconnect: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ wallet, onConnect, onDisconnect }) => {
    return (
        <div className="wallet-connect-card">
            {!wallet.isConnected ? (
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="wallet-icon-ring">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-brand-500">
                            <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12Z" fill="currentColor" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h3 className="text-white font-semibold text-lg mb-1">Connect Your Wallet</h3>
                        <p className="text-gray-400 text-sm">Connect MetaMask to start using the DApp</p>
                    </div>
                    {wallet.error && (
                        <div className="error-banner w-full">{wallet.error}</div>
                    )}
                    <button
                        id="connect-wallet-btn"
                        onClick={onConnect}
                        disabled={wallet.isLoading}
                        className="connect-btn w-full"
                    >
                        {wallet.isLoading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Connecting...
                            </span>
                        ) : (
                            '🦊 Connect MetaMask'
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="status-dot connected" />
                            <span className="text-green-400 text-sm font-medium">Connected</span>
                        </div>
                        <button
                            id="disconnect-wallet-btn"
                            onClick={onDisconnect}
                            className="disconnect-btn"
                        >
                            Disconnect
                        </button>
                    </div>

                    <div className="address-card">
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Wallet Address</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-white font-mono text-sm">{shortenAddress(wallet.account || '')}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(wallet.account || '')}
                                className="copy-btn"
                                title="Copy full address"
                            >
                                📋
                            </button>
                        </div>
                        <div className="text-gray-500 text-xs font-mono mt-1 break-all">{wallet.account}</div>
                    </div>

                    <div className="balance-card">
                        <span className="text-gray-400 text-xs uppercase tracking-wider">ETH Balance</span>
                        <div className="flex items-end gap-1 mt-1">
                            <span className="text-3xl font-bold text-white">
                                {parseFloat(wallet.balance).toFixed(4)}
                            </span>
                            <span className="text-brand-400 font-semibold mb-1">ETH</span>
                        </div>
                        <div className="text-gray-500 text-xs">
                            ≈ ${(parseFloat(wallet.balance) * 3300).toFixed(2)} USD
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletConnect;
