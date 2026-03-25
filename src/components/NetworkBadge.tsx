import React from 'react';
import { getNetworkBadgeColor } from '../utils/ethereum';

interface NetworkBadgeProps {
    chainId: string | null;
    networkName: string;
    isConnected: boolean;
    onSwitchNetwork: (chainId: string) => void;
}

// Sepolia is the only recommended testnet for this DApp
const SEPOLIA_CHAIN_ID = '0xaa36a7';

const NetworkBadge: React.FC<NetworkBadgeProps> = ({
    chainId,
    networkName,
    isConnected,
    onSwitchNetwork,
}) => {
    if (!isConnected) return null;

    const badgeColor = getNetworkBadgeColor(chainId);
    const isOnSepolia = chainId === SEPOLIA_CHAIN_ID;

    return (
        <div className="flex items-center gap-2">
            {/* Current network badge */}
            <div className={`network-badge ${badgeColor}`}>
                <span className="status-dot-sm" />
                {networkName}
            </div>

            {/* Warn + offer switch if not on Sepolia */}
            {!isOnSepolia && (
                <button
                    id="switch-to-sepolia-btn"
                    onClick={() => onSwitchNetwork(SEPOLIA_CHAIN_ID)}
                    className="switch-network-btn"
                    title="Switch to Sepolia Testnet"
                >
                    ⚠️ Switch to Sepolia
                </button>
            )}
        </div>
    );
};

export default NetworkBadge;
