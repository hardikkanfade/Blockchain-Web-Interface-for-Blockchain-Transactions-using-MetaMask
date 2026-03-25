/// <reference types="vite/client" />

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

interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESS: string;
    readonly VITE_CHAIN_ID: string;
    readonly VITE_EXPLORER_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export { };
