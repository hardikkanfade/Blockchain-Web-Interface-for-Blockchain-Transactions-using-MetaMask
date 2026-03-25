import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
    transactions: Transaction[];
    getExplorer: (hash: string) => string;
    onClear: () => void;
}

function formatTime(ts: number): string {
    return new Date(ts).toLocaleString();
}

function statusBadge(status: Transaction['status']) {
    const styles = {
        pending: 'tx-status-pending',
        success: 'tx-status-success',
        failed: 'tx-status-failed',
    };
    const icons = { pending: '⏳', success: '✅', failed: '❌' };
    return (
        <span className={`tx-status-badge ${styles[status]}`}>
            {icons[status]} {status}
        </span>
    );
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
    transactions,
    getExplorer,
    onClear,
}) => {
    if (transactions.length === 0) {
        return (
            <div className="tx-history-empty">
                <span className="text-4xl">📭</span>
                <p className="text-gray-400 mt-2">No transactions yet. Send your first product transaction!</p>
            </div>
        );
    }

    return (
        <div className="tx-history-card">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    📜 Transaction History
                    <span className="tx-count-badge">{transactions.length}</span>
                </h2>
                <button id="clear-history-btn" onClick={onClear} className="danger-btn">Clear All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>Hash</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Explorer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.hash} className="tx-row">
                                <td>
                                    <span className="font-mono text-xs text-gray-300">
                                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-white text-sm">{tx.product.name}</span>
                                </td>
                                <td>
                                    <span className="text-gray-300 text-sm">{tx.product.quantity}</span>
                                </td>
                                <td>
                                    <span className="text-brand-400 font-semibold text-sm">{parseFloat(tx.product.total).toFixed(4)} ETH</span>
                                </td>
                                <td>{statusBadge(tx.status)}</td>
                                <td>
                                    <span className="text-gray-400 text-xs">{formatTime(tx.timestamp)}</span>
                                </td>
                                <td>
                                    <a
                                        href={getExplorer(tx.hash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="explorer-link"
                                        id={`explorer-${tx.hash.slice(2, 8)}`}
                                    >
                                        View ↗
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
