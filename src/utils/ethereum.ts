import { ethers } from 'ethers';

// Network name map from chainId hex
export const NETWORK_NAMES: Record<string, string> = {
    '0x1': 'Ethereum Mainnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x89': 'Polygon',
    '0x13881': 'Mumbai Testnet',
    '0xa': 'Optimism',
    '0xa4b1': 'Arbitrum One',
    '0x38': 'BNB Chain',
    '0x61': 'BNB Testnet',
};

// Map of etherscan-compatible explorers per chainId
export const EXPLORER_URLS: Record<string, string> = {
    '0x1': 'https://etherscan.io/tx',
    '0xaa36a7': 'https://sepolia.etherscan.io/tx',
    '0x89': 'https://polygonscan.com/tx',
    '0xa': 'https://optimistic.etherscan.io/tx',
    '0xa4b1': 'https://arbiscan.io/tx',
};

export function getExplorerUrl(chainId: string | null, hash: string): string {
    if (!chainId) return `https://sepolia.etherscan.io/tx/${hash}`;
    const base = EXPLORER_URLS[chainId] || 'https://sepolia.etherscan.io/tx';
    return `${base}/${hash}`;
}

export function getNetworkName(chainId: string | null): string {
    if (!chainId) return 'Unknown Network';
    return NETWORK_NAMES[chainId] || `Chain ${parseInt(chainId, 16)}`;
}

export function getNetworkBadgeColor(chainId: string | null): string {
    const colors: Record<string, string> = {
        '0x1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        '0xaa36a7': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        '0x89': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
        '0xa': 'bg-red-500/20 text-red-400 border-red-500/30',
        '0xa4b1': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        '0x38': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return chainId ? (colors[chainId] || 'bg-gray-500/20 text-gray-400 border-gray-500/30') : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export async function getProvider(): Promise<ethers.BrowserProvider> {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    return new ethers.BrowserProvider(window.ethereum);
}

export function shortenAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
