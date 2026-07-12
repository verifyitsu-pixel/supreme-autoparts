import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { Heart, ShoppingCart, Trash2, AlertCircle, Plus, Loader2, Grid3X3, List } from "lucide-react";

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  addedAt: string;
  available: boolean;
}

interface WishlistData {
  id: string;
  items: WishlistItem[];
  totalItems: number;
}

export default function Wishlist() {
  const { getToken, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!isAuthenticated) { setLocation("/login"); return; }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch("/api/wishlist", { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) { if (res.status === 401) { setLocation("/login"); return; } throw new Error("Failed to load wishlist"); }
      setWishlist(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load wishlist"); }
    finally { setIsLoading(false); }
  };

  const removeFromWishlist = async (itemId: string) => {
    setRemovingId(itemId);
    try {
      const res = await fetch(`/api/wishlist/${itemId}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) setWishlist(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== itemId), totalItems: prev.totalItems - 1 } : null);
    } catch {} finally { setRemovingId(null); }
  };

  const addToCart = async (productId: string) => {
    try { await fetch("/api/cart/items", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ productId, quantity: 1 }) }); } catch {}
  };

  const moveAllToCart = async () => {
    if (!wishlist?.items.length) return;
    let added = 0;
    for (const item of wishlist.items) {
      try { const res = await fetch("/api/cart/items", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ productId: item.productId, quantity: 1 }) }); if (res.ok) added++; } catch {}
    }
    if (added > 0) setLocation("/checkout");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E42933]" size={32} /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Heart className="text-[#E42933]" size={32} fill="currentColor" /> My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">{wishlist?.totalItems || 0} items saved</p>
            </div>
            {wishlist && wishlist.items.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-[#E42933] text-white" : "bg-white text-gray-600"}`}><Grid3X3 size={18} /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-[#E42933] text-white" : "bg-white text-gray-600"}`}><List size={18} /></button>
                </div>
                <button onClick={moveAllToCart} className="px-4 py-2 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] flex items-center gap-2 text-sm">
                  <ShoppingCart size={16} /> Move All to Cart
                </button>
              </div>
            )}
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"><AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} /><p className="text-red-700 text-sm font-medium">{error}</p></div>}

          {!wishlist || wishlist.items.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Start saving items you love to your wishlist</p>
              <button onClick={() => setLocation("/products")} className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] inline-flex items-center gap-2">
                <Plus size={18} /> Browse Products
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.items.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Heart className="text-gray-300" size={40} /></div>}
                    {!item.available && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">OUT OF STOCK</span></div>}
                    <button onClick={() => removeFromWishlist(item.id)} disabled={removingId === item.id} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{item.productName}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#E42933]">KSh {item.price.toLocaleString()}</span>
                      {item.available && <button onClick={() => addToCart(item.productId)} className="w-8 h-8 bg-[#E42933] text-white rounded-full flex items-center justify-center hover:bg-[#d41f28]"><ShoppingCart size={14} /></button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.items.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Heart className="text-gray-300" size={24} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Added {new Date(item.addedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-lg font-black ${item.available ? "text-[#E42933]" : "text-gray-400"}`}>KSh {item.price.toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    {item.available && <button onClick={() => addToCart(item.productId)} className="w-8 h-8 bg-[#E42933] text-white rounded-full flex items-center justify-center hover:bg-[#d41f28]"><ShoppingCart size={14} /></button>}
                    <button onClick={() => removeFromWishlist(item.id)} disabled={removingId === item.id} className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
