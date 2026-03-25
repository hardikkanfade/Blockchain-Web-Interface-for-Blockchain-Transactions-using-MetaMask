/// <reference types="vite/client" />

// Extend the Window interface to include ethereum (MetaMask)
interface EthereumProvider {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, listener: (...args: unknown[]) => void) => void;
    removeListener: (event: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}
