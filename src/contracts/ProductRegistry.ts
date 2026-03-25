// ProductRegistry Contract ABI
// Deployed on Sepolia Testnet: 0xd9145CCE52D386f254917e481eB44e9943F39138

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const CONTRACT_ABI = [
    // addProduct - payable, stores product on-chain and forwards ETH to receiver
    {
        inputs: [
            { internalType: 'string', name: '_name', type: 'string' },
            { internalType: 'uint256', name: '_quantity', type: 'uint256' },
            { internalType: 'address', name: '_receiver', type: 'address' },
            { internalType: 'string', name: '_signature', type: 'string' },
        ],
        name: 'addProduct',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },

    // getAllProducts - returns entire products array
    {
        inputs: [],
        name: 'getAllProducts',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'productId', type: 'uint256' },
                    { internalType: 'string', name: 'name', type: 'string' },
                    { internalType: 'uint256', name: 'quantity', type: 'uint256' },
                    { internalType: 'uint256', name: 'priceWei', type: 'uint256' },
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'receiver', type: 'address' },
                    { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
                    { internalType: 'string', name: 'signature', type: 'string' },
                ],
                internalType: 'struct ProductRegistry.Product[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },

    // getProduct - get single product by index
    {
        inputs: [{ internalType: 'uint256', name: '_index', type: 'uint256' }],
        name: 'getProduct',
        outputs: [
            { internalType: 'uint256', name: 'productId', type: 'uint256' },
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'uint256', name: 'quantity', type: 'uint256' },
            { internalType: 'uint256', name: 'priceWei', type: 'uint256' },
            { internalType: 'address', name: 'sender', type: 'address' },
            { internalType: 'address', name: 'receiver', type: 'address' },
            { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
            { internalType: 'string', name: 'signature', type: 'string' },
        ],
        stateMutability: 'view',
        type: 'function',
    },

    // getTotalProducts
    {
        inputs: [],
        name: 'getTotalProducts',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },

    // productCount
    {
        inputs: [],
        name: 'productCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },

    // owner
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },

    // ProductAdded event
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'onChainId', type: 'uint256' },
            { indexed: false, internalType: 'string', name: 'name', type: 'string' },
            { indexed: false, internalType: 'uint256', name: 'quantity', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'priceWei', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        name: 'ProductAdded',
        type: 'event',
    },
] as const;
