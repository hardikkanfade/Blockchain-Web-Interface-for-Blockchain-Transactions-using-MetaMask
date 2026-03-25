import React, { useState, useEffect } from 'react';
import { Product, FormErrors } from '../types';
import { validateProduct, hasErrors } from '../utils/validation';

interface ProductFormProps {
    isConnected: boolean;
    onSign: (product: Product) => void;
    onSend: (product: Product) => void;
    onEstimateGas: (product: Product) => void;
    isSigning: boolean;
    isSending: boolean;
    gasEstimate: string | null;
    txError: string | null;
    signature: string | null;
}

const EMPTY_FORM = {
    id: '',
    name: '',
    quantity: '',
    price: '',
    receiverAddress: '',
};

const ProductForm: React.FC<ProductFormProps> = ({
    isConnected,
    onSign,
    onSend,
    onEstimateGas,
    isSigning,
    isSending,
    gasEstimate,
    txError,
    signature,
}) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [total, setTotal] = useState('0');
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const qty = parseFloat(form.quantity) || 0;
        const price = parseFloat(form.price) || 0;
        setTotal((qty * price).toFixed(6));
    }, [form.quantity, form.price]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const getProduct = (): Product => ({
        id: form.id,
        name: form.name,
        quantity: parseFloat(form.quantity) || 0,
        price: form.price,
        receiverAddress: form.receiverAddress,
        total,
    });

    const validate = () => {
        const errs = validateProduct(getProduct());
        setErrors(errs);
        return !hasErrors(errs);
    };

    const handleSign = () => {
        setTouched({ id: true, name: true, quantity: true, price: true, receiverAddress: true });
        if (!validate()) return;
        setShowPreview(true);
    };

    const confirmSign = () => {
        setShowPreview(false);
        onSign(getProduct());
    };

    const handleEstimate = () => {
        if (!validate()) return;
        onEstimateGas(getProduct());
    };

    const handleSend = () => {
        setTouched({ id: true, name: true, quantity: true, price: true, receiverAddress: true });
        if (!validate()) return;
        onSend(getProduct());
    };

    const handleReset = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setTouched({});
        setTotal('0');
    };

    return (
        <div className="product-form-card">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>📦</span> Product Transaction
                </h2>
                <button onClick={handleReset} className="reset-btn">Reset</button>
            </div>

            <div className="form-grid">
                {/* Product ID */}
                <div className="form-group">
                    <label className="form-label">Product ID</label>
                    <input
                        id="product-id"
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        placeholder="e.g. PROD-001"
                        className={`form-input ${touched.id && errors.id ? 'input-error' : ''}`}
                        disabled={!isConnected}
                    />
                    {touched.id && errors.id && <span className="field-error">{errors.id}</span>}
                </div>

                {/* Product Name */}
                <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                        id="product-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Laptop Pro"
                        className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
                        disabled={!isConnected}
                    />
                    {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                {/* Quantity */}
                <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input
                        id="product-quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="e.g. 2"
                        className={`form-input ${touched.quantity && errors.quantity ? 'input-error' : ''}`}
                        disabled={!isConnected}
                    />
                    {touched.quantity && errors.quantity && <span className="field-error">{errors.quantity}</span>}
                </div>

                {/* Price */}
                <div className="form-group">
                    <label className="form-label">Price (ETH)</label>
                    <input
                        id="product-price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.001"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="e.g. 0.05"
                        className={`form-input ${touched.price && errors.price ? 'input-error' : ''}`}
                        disabled={!isConnected}
                    />
                    {touched.price && errors.price && <span className="field-error">{errors.price}</span>}
                </div>
            </div>

            {/* Receiver Address - full width */}
            <div className="form-group mt-3">
                <label className="form-label">Receiver Address</label>
                <input
                    id="receiver-address"
                    name="receiverAddress"
                    value={form.receiverAddress}
                    onChange={handleChange}
                    placeholder="0x..."
                    className={`form-input font-mono ${touched.receiverAddress && errors.receiverAddress ? 'input-error' : ''}`}
                    disabled={!isConnected}
                />
                {touched.receiverAddress && errors.receiverAddress && (
                    <span className="field-error">{errors.receiverAddress}</span>
                )}
            </div>

            {/* Total Display */}
            <div className="total-display mt-4">
                <span className="text-gray-400 text-sm">Total Amount</span>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">{total}</span>
                    <span className="text-brand-400 font-semibold mb-1">ETH</span>
                </div>
                <div className="text-gray-500 text-xs">≈ ${(parseFloat(total) * 3300).toFixed(2)} USD</div>
            </div>

            {/* Gas Estimate */}
            {gasEstimate && (
                <div className="gas-estimate mt-3">
                    <span className="text-yellow-400 text-xs">⛽ Estimated Gas: {parseInt(gasEstimate).toLocaleString()} units</span>
                </div>
            )}

            {/* Transaction Error */}
            {txError && (
                <div className="error-banner mt-3">{txError}</div>
            )}

            {/* Signature */}
            {signature && (
                <div className="sig-box mt-3">
                    <span className="text-green-400 text-xs font-semibold">✅ Signed</span>
                    <div className="text-gray-400 text-xs font-mono break-all mt-1">{signature.slice(0, 42)}...{signature.slice(-10)}</div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons mt-5">
                <button
                    id="estimate-gas-btn"
                    onClick={handleEstimate}
                    disabled={!isConnected}
                    className="secondary-btn"
                >
                    ⛽ Estimate Gas
                </button>
                <button
                    id="sign-transaction-btn"
                    onClick={handleSign}
                    disabled={!isConnected || isSigning}
                    className="primary-btn"
                >
                    {isSigning ? (
                        <span className="flex items-center gap-2 justify-center">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Signing...
                        </span>
                    ) : '✍️ Sign Transaction'}
                </button>
                <button
                    id="send-transaction-btn"
                    onClick={handleSend}
                    disabled={!isConnected || isSending || !signature}
                    className="send-btn"
                >
                    {isSending ? (
                        <span className="flex items-center gap-2 justify-center">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending...
                        </span>
                    ) : '🚀 Send Transaction'}
                </button>
            </div>
            {!signature && isConnected && (
                <p className="text-gray-500 text-xs mt-2 text-center">Sign the transaction first before sending</p>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <h3 className="text-white font-bold text-lg mb-4">📋 Transaction Preview</h3>
                        <div className="preview-grid">
                            <div className="preview-row"><span>Product ID</span><span>{form.id}</span></div>
                            <div className="preview-row"><span>Name</span><span>{form.name}</span></div>
                            <div className="preview-row"><span>Quantity</span><span>{form.quantity}</span></div>
                            <div className="preview-row"><span>Price</span><span>{form.price} ETH</span></div>
                            <div className="preview-row"><span>Total</span><span className="text-brand-400 font-bold">{total} ETH</span></div>
                            <div className="preview-row"><span>To</span><span className="font-mono text-xs break-all">{form.receiverAddress}</span></div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowPreview(false)} className="secondary-btn flex-1">Cancel</button>
                            <button onClick={confirmSign} className="primary-btn flex-1">Confirm & Sign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
