import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { AlertTriangle, CheckCircle, Package, Search, ShoppingCart, Plus, Minus, X, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({}); // Local state for quantity per product (for adding)

    // Cart State
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
                // Initialize quantities to 1
                const initialQuantities = {};
                data.forEach(p => initialQuantities[p.id] = 1);
                setQuantities(initialQuantities);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setError("Could not load products. Please try again later.");
                setLoading(false);
            });
    }, []);

    // Search Logic
    useEffect(() => {
        const results = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);


    const handleQuantityChange = (productId, change) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    };

    // --- CART ACTIONS ---
    const addToCart = (product) => {
        const qty = quantities[product.id] || 1;
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Update quantity if aleady in cart
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, cartQty: item.cartQty + qty }
                        : item
                );
            } else {
                // Add new item
                return [...prevCart, { ...product, cartQty: qty }];
            }
        });
        setIsCartOpen(true); // Open cart to show success
        toast.success(`Added ${product.title} to cart!`);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        toast("Removed from cart", { icon: "🗑️" });
    };

    // Flatten cart count for badge (sum of all item quantities)
    const cartCount = cart.reduce((acc, item) => acc + item.cartQty, 0);
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.cartQty), 0);


    // --- CHECKOUT (Buy Cart Items) ---
    // Note: For simplicity, we'll loop through cart items and buy one by one OR just support single item buy flow.
    // Ideally backend should support bulk order. 
    // For now, let's keep "Buy Now" as single item and Cart Checkout as a "concept" or single bulk payment.
    // Let's implement Bulk Payment if possible or just loop. 
    // Loop is safer without backend changes.
    const handleCheckout = () => {
        toast("Bulk Checkout Feature coming soon! Use 'Buy Now' for instant purchase.", { icon: "🚧" });
        // To implement this properly, we'd need a backend endpoint that accepts a list of items.
    };


    const handleBuyNow = async (product) => {
        const quantity = quantities[product.id] || 1;

        // Check if enough stock
        if (quantity > product.quantity) {
            toast.error(`Only ${product.quantity} items left in stock!`);
            return;
        }

        try {
            // Create Order on Backend (Modified to accept quantity)
            const res = await fetch(`${API_BASE_URL}/payment/create-order/${product.id}?quantity=${quantity}`, {
                method: "POST",
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg);
            }

            const orderData = await res.json();
            const options = {
                key: "rzp_test_Rvq0QBO7CE7YSy", // Ideally from env but okay for public key
                amount: orderData.amount,
                currency: orderData.currency,
                name: "WLeft Store",
                description: `Purchase: ${product.title} (x${quantity})`,
                image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
                order_id: orderData.id,
                handler: function (response) {
                    // Success Handler
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 }
                    });

                    toast.success(`Payment Successful! ID: ${response.razorpay_payment_id}`);

                    // Optimistically update UI
                    setProducts(prev => prev.map(p =>
                        p.id === product.id ? { ...p, quantity: p.quantity - quantity } : p
                    ));
                },
                prefill: {
                    name: "WLeft User",
                    email: "user@wleft.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#2563EB", // Blue-600
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            console.error(err);
            toast.error("Payment initiation failed: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <Navbar role="buyer" cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

            {/* CART SIDEBAR */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-[#1E293B] shadow-2xl transform transition-transform duration-300 z-50 border-l border-gray-800 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-400" /> Your Cart
                        </h2>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-500 mt-20">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Your cart is empty.</p>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex gap-4 p-3 bg-[#0F172A] rounded-xl border border-gray-800">
                                    <div className="w-16 h-16 bg-white rounded-lg p-1 flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm truncate pr-4">{item.title}</h4>
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-blue-400 font-bold">₹{item.price}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 text-xs">Qty: {item.cartQty}</span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-gray-800 pt-6 mt-4">
                        <div className="flex justify-between items-center mb-4 text-lg font-bold">
                            <span>Total</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition-colors"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            </div>

            {/* OVERLAY for Cart */}
            {isCartOpen && <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>}


            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Latest Arrivals</h1>
                        <p className="text-gray-400">Premium tech & lifestyle essentials</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1E293B] border border-gray-700 rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* Loading/Error State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                        const qty = quantities[product.id] || 1;
                        const isOutOfStock = product.quantity === 0;

                        return (
                            <div key={product.id} className="bg-[#1E293B] border border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="h-48 overflow-hidden bg-white p-4 relative">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">SOLD OUT</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold truncate mb-2" title={product.title}>{product.title}</h3>
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-2xl font-bold text-blue-400">₹{product.price}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.quantity < 5 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {product.quantity} in stock
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center justify-between bg-[#0F172A] rounded-lg p-1">
                                            <button
                                                onClick={() => handleQuantityChange(product.id, -1)}
                                                disabled={isOutOfStock || qty <= 1}
                                                className="p-1 hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center">{qty}</span>
                                            <button
                                                onClick={() => handleQuantityChange(product.id, 1)}
                                                disabled={isOutOfStock || qty >= product.quantity}
                                                className="p-1 hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={isOutOfStock}
                                                className="bg-[#0F172A] hover:bg-gray-800 disabled:opacity-50 border border-gray-700 text-blue-400 p-2.5 rounded-xl transition-colors"
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleBuyNow(product)}
                                                disabled={isOutOfStock}
                                                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                {isOutOfStock ? "Out of Stock" : "Buy Now"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredProducts.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No products found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Shop;
