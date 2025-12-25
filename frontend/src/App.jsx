import { useState, useEffect } from "react";
import { Package, ShoppingCart, RefreshCw, AlertTriangle } from "lucide-react";
import Shop from "./Shop";
import Admin from "./Admin";

function App() {
  const [view, setView] = useState("buyer"); // buyer | boss

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                WLeft
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setView("buyer")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === "buyer"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ShoppingCart className="h-5 w-5" />
                Buyer View
              </button>
              <button
                onClick={() => setView("boss")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === "boss"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <AlertTriangle className="h-5 w-5" />
                Inventory Boss
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "buyer" ? <Shop /> : <Admin />}
      </main>
    </div>
  );
}

export default App;
