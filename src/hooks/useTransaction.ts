import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import type { Transaction, Product } from '../types';
import { getExplorerUrl } from '../utils/ethereum';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ProductRegistry';

const LS_KEY = 'blockchain_dapp_transactions';

function loadFromStorage(): Transaction[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? (JSON.parse(raw) as Transaction[]) : [];
    } catch {
        return [];
    }
}

function saveToStorage(txs: Transaction[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(txs));
}

export function useTransaction(chainId: string | null) {
    const [transactions, setTransactions] = useState<Transaction[]>(loadFromStorage);
    const [signature, setSignature] = useState<string | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [gasEstimate, setGasEstimate] = useState<string | null>(null);
    const [txError, setTxError] = useState<string | null>(null);
    const [pendingHash, setPendingHash] = useState<string | null>(null);

    const buildMessage = (product: Product): string =>
        `Product: ${product.name} | ID: ${product.id} | Qty: ${product.quantity} | Price: ${product.price} ETH | Total: ${product.total} ETH | To: ${product.receiverAddress}`;

    const getProvider = () => new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);

    const getContract = async (withSigner = false) => {
        const provider = getProvider();
        if (withSigner) {
            const signer = await provider.getSigner();
            return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        }
        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    };

    // ─── SIGN ───────────────────────────────────────────────────────────────
    const signTransaction = useCallback(async (product: Product): Promise<string | null> => {
        setIsSigning(true);
        setTxError(null);
        setSignature(null);
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const message = buildMessage(product);
            const sig = await signer.signMessage(message);
            setSignature(sig);
            setIsSigning(false);
            return sig;
        } catch (err: unknown) {
            const error = err as { code?: number; message?: string };
            const msg = error.code === 4001
                ? 'Signature rejected by user.'
                : (error.message || 'Failed to sign message');
            setTxError(msg);
            setIsSigning(false);
            return null;
        }
    }, []);

    // ─── ESTIMATE GAS ───────────────────────────────────────────────────────
    const estimateGas = useCallback(async (product: Product): Promise<string | null> => {
        try {
            const contract = await getContract(true);
            const sigStr = signature || '';
            // Estimate gas for the contract call
            const estimate = await contract.addProduct.estimateGas(
                product.name,
                BigInt(product.quantity),
                product.receiverAddress,
                sigStr,
                { value: ethers.parseEther(product.total) }
            );
            const formatted = estimate.toString();
            setGasEstimate(formatted);
            return formatted;
        } catch {
            // Fallback: estimate a plain ETH transfer gas
            setGasEstimate('100000');
            return '100000';
        }
    }, [signature]);

    // ─── SEND (calls smart contract addProduct) ─────────────────────────────
    const sendTransaction = useCallback(async (product: Product): Promise<Transaction | null> => {
        setIsSending(true);
        setTxError(null);
        setPendingHash(null);
        try {
            const contract = await getContract(true);
            const sigStr = signature || '';

            // Call addProduct on the deployed ProductRegistry contract
            // The contract forwards ETH to the receiver and stores product on-chain
            const txResponse = await contract.addProduct(
                product.name,
                BigInt(product.quantity),
                product.receiverAddress,
                sigStr,
                { value: ethers.parseEther(product.total) }
            );

            setPendingHash(txResponse.hash);

            const newTx: Transaction = {
                hash: txResponse.hash,
                product: {
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                    total: product.total,
                },
                status: 'pending',
                timestamp: Date.now(),
                signature: sigStr || undefined,
                network: chainId || undefined,
            };

            setTransactions(prev => {
                const updated = [newTx, ...prev];
                saveToStorage(updated);
                return updated;
            });

            // Wait for confirmation and update status
            txResponse.wait().then(() => {
                setTransactions(prev => {
                    const updated = prev.map(t =>
                        t.hash === txResponse.hash ? { ...t, status: 'success' as const } : t
                    );
                    saveToStorage(updated);
                    return updated;
                });
                setPendingHash(null);
            }).catch(() => {
                setTransactions(prev => {
                    const updated = prev.map(t =>
                        t.hash === txResponse.hash ? { ...t, status: 'failed' as const } : t
                    );
                    saveToStorage(updated);
                    return updated;
                });
                setPendingHash(null);
            });

            setIsSending(false);
            return newTx;
        } catch (err: unknown) {
            const error = err as { code?: number; message?: string };
            const msg = error.code === 4001
                ? 'Transaction rejected by user.'
                : (error.message || 'Transaction failed');
            setTxError(msg);
            setIsSending(false);
            return null;
        }
    }, [chainId, signature]);

    const clearTransactions = useCallback(() => {
        setTransactions([]);
        localStorage.removeItem(LS_KEY);
    }, []);

    const getExplorer = useCallback((hash: string) => getExplorerUrl(chainId, hash), [chainId]);

    return {
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
    };
}
