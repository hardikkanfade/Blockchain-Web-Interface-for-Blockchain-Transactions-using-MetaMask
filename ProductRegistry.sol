// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProductRegistry
 * @notice Stores product transactions on-chain on Sepolia testnet
 * @dev Deploy via Remix IDE at remix.ethereum.org
 */
contract ProductRegistry {

    // ─────────────────────────────────────────
    //  STRUCTS & STORAGE
    // ─────────────────────────────────────────

    struct Product {
        uint256 productId;      // auto-incremented on-chain ID
        string  name;           // product name
        uint256 quantity;       // quantity
        uint256 priceWei;       // price in wei (1 ETH = 1e18 wei)
        address sender;         // who sent the transaction
        address receiver;       // who receives the product/payment
        uint256 timestamp;      // block timestamp
        string  signature;      // off-chain MetaMask signature hash
    }

    // Array of all products
    Product[] public products;

    // Counter for product IDs (starts at 1)
    uint256 public productCount;

    // Owner of the contract
    address public owner;

    // ─────────────────────────────────────────
    //  EVENTS
    // ─────────────────────────────────────────

    event ProductAdded(
        uint256 indexed onChainId,
        string  name,
        uint256 quantity,
        uint256 priceWei,
        address indexed sender,
        address indexed receiver,
        uint256 timestamp
    );

    // ─────────────────────────────────────────
    //  MODIFIERS
    // ─────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    modifier validQuantity(uint256 _qty) {
        require(_qty > 0, "Quantity must be greater than zero");
        _;
    }

    modifier validPrice(uint256 _price) {
        require(_price > 0, "Price must be greater than zero");
        _;
    }

    // ─────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        productCount = 0;
    }

    // ─────────────────────────────────────────
    //  WRITE FUNCTIONS
    // ─────────────────────────────────────────

    /**
     * @notice Add a product to the registry
     * @param _name        Product name
     * @param _quantity    Quantity
     * @param _receiver    Receiver wallet address
     * @param _signature   Off-chain MetaMask signature string
     */
    function addProduct(
        string  memory _name,
        uint256        _quantity,
        address        _receiver,
        string  memory _signature
    )
        external
        payable
        validAddress(_receiver)
        validQuantity(_quantity)
        validPrice(msg.value)
    {
        productCount++;

        products.push(Product({
            productId:  productCount,
            name:       _name,
            quantity:   _quantity,
            priceWei:   msg.value,
            sender:     msg.sender,
            receiver:   _receiver,
            timestamp:  block.timestamp,
            signature:  _signature
        }));

        // Forward the ETH to the receiver
        (bool sent, ) = payable(_receiver).call{value: msg.value}("");
        require(sent, "ETH transfer to receiver failed");

        emit ProductAdded(
            productCount,
            _name,
            _quantity,
            msg.value,
            msg.sender,
            _receiver,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────
    //  READ FUNCTIONS
    // ─────────────────────────────────────────

    /**
     * @notice Get a single product by its on-chain index (0-based)
     */
    function getProduct(uint256 _index)
        external
        view
        returns (
            uint256 productId,
            string  memory name,
            uint256 quantity,
            uint256 priceWei,
            address sender,
            address receiver,
            uint256 timestamp,
            string  memory signature
        )
    {
        require(_index < products.length, "Product does not exist");
        Product memory p = products[_index];
        return (
            p.productId,
            p.name,
            p.quantity,
            p.priceWei,
            p.sender,
            p.receiver,
            p.timestamp,
            p.signature
        );
    }

    /**
     * @notice Get all products (returns array)
     */
    function getAllProducts() external view returns (Product[] memory) {
        return products;
    }

    /**
     * @notice Total number of products registered
     */
    function getTotalProducts() external view returns (uint256) {
        return products.length;
    }

    /**
     * @notice Get products submitted by a specific address
     */
    function getProductsBySender(address _sender)
        external
        view
        returns (Product[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < products.length; i++) {
            if (products[i].sender == _sender) count++;
        }

        Product[] memory result = new Product[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < products.length; i++) {
            if (products[i].sender == _sender) {
                result[idx] = products[i];
                idx++;
            }
        }
        return result;
    }
}
