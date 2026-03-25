// Shared TypeScript types for the blockchain DApp

export interface Product {
    id: string;
    name: string;
    quantity: number;
    price: string; // in ETH
    receiverAddress: string;
    total: string; // calculated: price * quantity
}

export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
    hash: string;
    product: {
        name: string;
        quantity: number;
        price: string;
        total: string;
    };
    status: TransactionStatus;
    timestamp: number;
    signature?: string;
    network?: string;
}

export interface WalletState {
    account: string | null;
    balance: string;
    isConnected: boolean;
    isLoading: boolean;
    chainId: string | null;
    networkName: string;
    error: string | null;
}

export interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
    id?: number;
}

export interface FormErrors {
    id?: string;
    name?: string;
    quantity?: string;
    price?: string;
    receiverAddress?: string;
}
