import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
    LayoutDashboard,
    Package,
    RefreshCcw,
    TrendingUp,
    MapPin,
    Mail,
    User,
    AlertOctagon,
    CheckCircle2,
    Plus,
    Edit2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import toast from "react-hot-toast";

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function Admin() {
    const [activeTab, setActiveTab] = useState("inventory"); // inventory | profile
    const [products, setProducts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: "", price: "", description: "", image: "", quantity: 10 });

    // Fetch products on load
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch products");
        }
    };

    const restock = async (id) => {
        const promise = fetch(`${API_BASE_URL}/products/${id}/restock`, { method: "POST" });

        toast.promise(promise, {
            loading: 'Restocking...',
            success: 'Stock updated successfully!',
            error: 'Failed to restock',
        });

        await promise;
        fetchProducts();
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/products/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setNewProduct({ title: "", price: "", description: "", image: "", quantity: 10 });
                fetchProducts(); // Refresh list
                toast.success("Product Added Successfully!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to add product");
        }
    };

    // Stats calculation
    const totalStock = products.reduce((acc, p) => acc + p.quantity, 0);
    const lowStockCount = products.filter(p => p.quantity < 5).length;
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2);

    // Chart Data
    const chartData = [
        { name: 'Healthy Stock', value: products.filter(p => p.quantity >= 5).length },
        { name: 'Low Stock', value: lowStockCount },
    ];
    const COLORS = ['#10B981', '#F97316']; // Emerald, Orange

    return (
        <div className="min-h-screen bg-[#0F172A] text-white flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-[#1E293B] border-r border-gray-800 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-blue-600 p-1.5 rounded-lg"><LayoutDashboard className="w-5 h-5" /></span>
                        Boss Panel
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("inventory")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Package className="w-5 h-5" />
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <User className="w-5 h-5" />
                        My Profile
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        System Online
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Navbar role="admin" />

                <main className="p-6 md:p-8 max-w-7xl mx-auto w-full relative">
                    {/* Add Product Modal */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                            <div className="bg-[#1E293B] rounded-2xl border border-gray-700 p-6 w-full max-w-md">
                                <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <input
                                        type="text" placeholder="Product Title" required
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                        onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                                    />
                                    <input
                                        type="number" placeholder="Price (₹)" required
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                    <input
                                        type="text" placeholder="Image URL" required
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 hover:bg-white/10 rounded-lg">Cancel</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold">Add Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === "inventory" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Stats & Table */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Dashboard Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-gray-400">Total Asset Value</span>
                                            <TrendingUp className="text-emerald-400 w-5 h-5" />
                                        </div>
                                        <div className="text-3xl font-bold">₹{totalValue}</div>
                                    </div>
                                    <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-gray-400">Low Stock Alerts</span>
                                            <AlertOctagon className={`w-5 h-5 ${lowStockCount > 0 ? 'text-orange-500' : 'text-gray-600'}`} />
                                        </div>
                                        <div className="text-3xl font-bold">{lowStockCount}</div>
                                        <div className="text-xs text-gray-500 mt-1">Items below threshold (5)</div>
                                    </div>
                                    <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-gray-400">Total Units</span>
                                            <Package className="text-blue-400 w-5 h-5" />
                                        </div>
                                        <div className="text-3xl font-bold">{totalStock}</div>
                                    </div>
                                </div>

                                {/* Inventory Table */}
                                <div className="bg-[#1E293B] rounded-2xl border border-gray-800 overflow-hidden">
                                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Live Inventory</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                                <Plus className="w-4 h-4" /> Add Product
                                            </button>
                                            <button onClick={fetchProducts} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                                <RefreshCcw className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#0F172A] text-gray-400 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-4">Product</th>
                                                    <th className="px-6 py-4 text-right">Price</th>
                                                    <th className="px-6 py-4 text-center">Status</th>
                                                    <th className="px-6 py-4 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-white/[0.02]">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-white p-1">
                                                                    <img src={product.image} className="w-full h-full object-contain" />
                                                                </div>
                                                                <span className="font-medium">{product.title.substring(0, 40)}...</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono text-gray-300">
                                                            ₹{product.price}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {product.quantity < 5 ? (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                                    <AlertOctagon className="w-3 h-3" />
                                                                    Low Stock ({product.quantity})
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    Healthy ({product.quantity})
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => restock(product.id)}
                                                                className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                                                            >
                                                                Restock (+20)
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Charts */}
                            <div className="bg-[#1E293B] rounded-2xl border border-gray-800 p-6 flex flex-col h-[450px]">
                                <h3 className="text-lg font-bold mb-6">Inventory Health</h3>
                                <div className="flex-1 w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#374151', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 text-center text-sm text-gray-400">
                                    Visual representation of stock status across all {totalStock} units.
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <ProfileSection />
                    )}
                </main>
            </div>
        </div>
    );
}

// Sub-component for Profile Logic to keep code clean
const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Boss User",
        role: "Master Administrator",
        email: "vivek.patil@wleft.com",
        location: "Mumbai, India (HQ)"
    });

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("adminProfile");
        if (saved) setProfile(JSON.parse(saved));
    }, []);

    const handleSave = () => {
        localStorage.setItem("adminProfile", JSON.stringify(profile));
        setIsEditing(false);
        alert("Profile Updated!");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                    {isEditing ? <><CheckCircle2 className="w-4 h-4" /> Save Usage</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                </button>
            </div>

            <div className="bg-[#1E293B] rounded-2xl border border-gray-800 p-8 text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                    {profile.name.charAt(0)}
                </div>
                {isEditing ? (
                    <div className="space-y-3 max-w-xs mx-auto">
                        <input
                            value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-2 text-center font-bold text-xl focus:border-blue-500 outline-none"
                        />
                        <input
                            value={profile.role}
                            onChange={e => setProfile({ ...profile, role: e.target.value })}
                            className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-2 text-center text-gray-400 focus:border-blue-500 outline-none"
                        />
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-gray-400">{profile.role}</p>
                    </>
                )}
            </div>

            <div className="bg-[#1E293B] rounded-2xl border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="font-bold">Contact Information</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-500">Email Address</div>
                            {isEditing ? (
                                <input
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-2 mt-1 focus:border-blue-500 outline-none"
                                />
                            ) : (
                                <div className="font-medium">{profile.email}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-500">Location Report</div>
                            {isEditing ? (
                                <input
                                    value={profile.location}
                                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-lg p-2 mt-1 focus:border-blue-500 outline-none"
                                />
                            ) : (
                                <div className="font-medium">{profile.location}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
