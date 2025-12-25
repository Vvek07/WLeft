import { Link } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-500/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm text-gray-300 font-medium">System Operational</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        <span className="block mb-2">Commerce Reimagined</span>
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-white bg-clip-text text-transparent">
                            For Everyone.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        WLeft connects premium inventory with discerning buyers.
                        Experience a seamless ecosystem designed for modern commerce.
                    </p>

                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Buyer Card */}
                        <Link to="/products" className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/[0.07] text-left">
                            <div className="absolute top-8 right-8 bg-blue-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">I am a Buyer</h3>
                            <p className="text-gray-400 mb-6">Browse exclusive collection, manage cart, and experience fast checkout.</p>
                            <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-4 transition-all">
                                Enter Shop <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Admin Card */}
                        <Link to="/admin" className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07] text-left">
                            <div className="absolute top-8 right-8 bg-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">Inventory Boss</h3>
                            <p className="text-gray-400 mb-6">Manage stock, track sales, and analyze performance metrics.</p>
                            <div className="flex items-center gap-2 text-purple-400 font-medium group-hover:gap-4 transition-all">
                                Access Dashboard <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="border-t border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Star className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Premium Quality</h4>
                            <p className="text-gray-400 text-sm">Curated items ensuring the highest standard.</p>
                        </div>

                        <div className="p-6">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-6 h-6 text-green-400" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Secure Payments</h4>
                            <p className="text-gray-400 text-sm">Bank-grade protection for every transaction.</p>
                        </div>

                        <div className="p-6">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Lightning Fast</h4>
                            <p className="text-gray-400 text-sm">Instant digital delivery and tracking.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-6">WLeft</h2>
                    <p className="text-gray-500 text-sm mb-4">
                        Designed & Developed by <span className="text-white font-medium">Vivek Patil</span>
                    </p>
                    <p className="text-gray-600 text-xs">
                        © 2024 WLeft Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
