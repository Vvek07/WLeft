import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, Package } from 'lucide-react';

const Navbar = ({ role, cartCount = 0, onCartClick }) => {
    return (
        <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            WLeft
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {role === 'buyer' && (
                            <div className="flex items-center gap-4">
                                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Shop</Link>
                                <button onClick={onCartClick} className="relative p-1">
                                    <ShoppingCart className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white animate-bounce-short">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {role === 'admin' && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400 bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                                    Admin Mode
                                </span>
                            </div>
                        )}

                        {/* Exit/Change Role */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border-l border-white/10 pl-6"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Exit</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
