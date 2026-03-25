import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { WalletState } from '../types';
import { getNetworkName } from '../utils/ethereum';

const DISCONNECTED_KEY = 'wallet_manually_disconnected';

const INITIAL_STATE: WalletState = {
    account: null,
    balance: '0',
    isConnected: false,
    isLoading: false,
    chainId: null,
    networkName: 'Not Connected',
    error: null,
};

export function useWallet() {
    const [wallet, setWallet] = useState<WalletState>(INITIAL_STATE);

    const fetchBalance = useCallback(async (address: string, chainId: string) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
            const balance = await provider.getBalance(address);
            const networkName = getNetworkName(chainId);
            setWallet(prev => ({
                ...prev,
                balance: ethers.formatEther(balance),
                networkName,
                chainId,
                error: null,
            }));
        } catch (err) {
            console.error('Balance fetch error:', err);
        }
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setWallet(prev => ({ ...prev, error: 'MetaMask is not installed. Please install it from metamask.io' }));
            return;
        }

        // Clear the manual disconnect flag — user is explicitly reconnecting
        localStorage.removeItem(DISCONNECTED_KEY);
        setWallet(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
            const chainId = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
            const account = accounts[0];

            const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
            const balance = await provider.getBalance(account);

            setWallet({
                account,
                balance: ethers.formatEther(balance),
                isConnected: true,
                isLoading: false,
                chainId,
                networkName: getNetworkName(chainId),
                error: null,
            });
        } catch (err: unknown) {
            const error = err as { code?: number; message?: string };
            const message = error.code === 4001
                ? 'Connection rejected by user.'
                : (error.message || 'Failed to connect wallet');
            setWallet(prev => ({ ...prev, isLoading: false, error: message }));
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        // Mark as manually disconnected so auto-reconnect on page load is suppressed
        localStorage.setItem(DISCONNECTED_KEY, 'true');
        setWallet(INITIAL_STATE);
    }, []);

    const switchNetwork = useCallback(async (targetChainId: string) => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetChainId }],
            });
        } catch (err: unknown) {
            const error = err as { code?: number; message?: string };
            setWallet(prev => ({
                ...prev,
                error: error.message || 'Failed to switch network',
            }));
        }
    }, []);

    useEffect(() => {
        if (!window.ethereum) return;

        const checkConnection = async () => {
            // Don't auto-reconnect if user explicitly disconnected
            if (localStorage.getItem(DISCONNECTED_KEY) === 'true') return;
            try {
                const accounts = (await window.ethereum!.request({ method: 'eth_accounts' })) as string[];
                if (accounts.length > 0) {
                    const chainId = (await window.ethereum!.request({ method: 'eth_chainId' })) as string;
                    const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
                    const balance = await provider.getBalance(accounts[0]);
                    setWallet({
                        account: accounts[0],
                        balance: ethers.formatEther(balance),
                        isConnected: true,
                        isLoading: false,
                        chainId,
                        networkName: getNetworkName(chainId),
                        error: null,
                    });
                }
            } catch {
                // no auto-connection
            }
        };
        checkConnection();

        const handleAccountsChanged = (...args: unknown[]) => {
            const accounts = args[0] as string[];
            if (accounts.length === 0) {
                setWallet(INITIAL_STATE);
            } else {
                setWallet(prev => ({ ...prev, account: accounts[0] }));
                setWallet(prev => {
                    if (prev.chainId) fetchBalance(accounts[0], prev.chainId);
                    return prev;
                });
            }
        };

        const handleChainChanged = (...args: unknown[]) => {
            const chainId = args[0] as string;
            setWallet(prev => {
                if (prev.account) fetchBalance(prev.account, chainId);
                return { ...prev, chainId, networkName: getNetworkName(chainId) };
            });
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [fetchBalance]);

    return { wallet, connectWallet, disconnectWallet, switchNetwork };
}
