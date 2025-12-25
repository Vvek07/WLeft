import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function Shop() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Use environment variable for API URL in production
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleBuy = async (product) => {
        if (product.quantity <= 0) return;

        try {
            // 1. Create Order on Backend
            const res = await fetch(`${API_BASE}/payment/create-order/${product.id}`, {
                method: "POST",
            });

            if (!res.ok) {
                alert("Failed to create order");
                return;
            }

            // The backend returns the raw JSON string of the Razorpay order
            const orderData = await res.json();
            console.log("Order Created:", orderData);

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_test_Rvq0QBO7CE7YSy", // Ideally fetch this from backend config too
                amount: orderData.amount,
                currency: orderData.currency,
                name: "WLeft Store",
                description: `Purchase ${product.title}`,
                image: product.image,
                order_id: orderData.id,
                handler: function (response) {
                    alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                    // In a real app, verify signature on backend here.
                    // Our backend webhook will handle the inventory deduction automatically.
                    // We should refresh the list to show new quantity.
                    setTimeout(fetchProducts, 2000); // Small delay for webhook to process
                },
                prefill: {
                    name: "Vivek User",
                    email: "vivek@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();

        } catch (err) {
            console.error("Purchase error", err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col"
                >
                    <div className="h-48 overflow-hidden p-4 flex items-center justify-center bg-gray-50">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2" title={product.title}>
                            {product.title}
                        </h3>

                        <div className="mt-auto flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900">
                                ₹{product.price}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${product.quantity > 5
                                ? "bg-green-100 text-green-700"
                                : product.quantity > 0
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                {product.quantity} left
                            </span>
                        </div>

                        <button
                            onClick={() => handleBuy(product)}
                            disabled={product.quantity <= 0}
                            className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${product.quantity > 0
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            {product.quantity > 0 ? "Buy Now" : "Out of Stock"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
