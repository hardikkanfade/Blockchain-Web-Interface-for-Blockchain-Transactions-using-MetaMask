import { ethers } from 'ethers';
import { FormErrors, Product } from '../types';

export function validateProduct(product: Partial<Product>): FormErrors {
    const errors: FormErrors = {};

    if (!product.id || product.id.trim() === '') {
        errors.id = 'Product ID is required';
    }

    if (!product.name || product.name.trim() === '') {
        errors.name = 'Product Name is required';
    }

    if (!product.quantity || product.quantity <= 0) {
        errors.quantity = 'Quantity must be a positive number';
    }

    if (!product.price || product.price === '' || parseFloat(product.price) <= 0) {
        errors.price = 'Price must be a positive number';
    }

    if (!product.receiverAddress || product.receiverAddress.trim() === '') {
        errors.receiverAddress = 'Receiver address is required';
    } else if (!ethers.isAddress(product.receiverAddress)) {
        errors.receiverAddress = 'Invalid Ethereum address';
    }

    return errors;
}

export function hasErrors(errors: FormErrors): boolean {
    return Object.values(errors).some(v => v !== undefined && v !== '');
}
