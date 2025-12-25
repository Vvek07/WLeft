import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, AlertOctagon } from "lucide-react";

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        const interval = setInterval(fetchProducts, 5000); // Auto-refresh every 5s for real-time monitoring
        return () => clearInterval(interval);
    }, []);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/products`);
            const data = await res.json();
            setProducts(data.sort((a, b) => a.id - b.id)); // Keep order stable
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleRestock = async (id) => {
        setLoading(true);
        try {
            await fetch(`${API_BASE}/products/${id}/restock`, { method: "POST" });
            fetchProducts(); // Refresh immediately
        } catch (err) {
            alert("Restock failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Inventory Dashboard</h2>
                    <p className="text-sm text-gray-500">Real-time stock monitoring</p>
                </div>
                <button
                    onClick={fetchProducts}
                    className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 shadow-sm"
                    title="Refresh Data"
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Stock Level</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => {
                            const isLowStock = product.quantity < 5;
                            return (
                                <tr
                                    key={product.id}
                                    className={`transition-colors ${isLowStock ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"}`}
                                >
                                    <td className="p-4 text-gray-500">#{product.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt="" className="h-10 w-10 object-contain bg-white rounded border border-gray-200 p-1" />
                                            <span className={`font-medium ${isLowStock ? "text-red-900" : "text-gray-900"}`}>
                                                {product.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">₹{product.price}</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${isLowStock
                                            ? "bg-red-100 text-red-700 border-red-200 animate-pulse"
                                            : "bg-green-100 text-green-700 border-green-200"
                                            }`}>
                                            {isLowStock && <AlertOctagon className="h-3 w-3" />}
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleRestock(product.id)}
                                            disabled={loading}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm disabled:opacity-50"
                                        >
                                            <TrendingUp className="h-4 w-4" />
                                            Restock (+20)
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
