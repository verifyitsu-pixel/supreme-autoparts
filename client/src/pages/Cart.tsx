import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/Layout";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Lock,
  Truck,
  Shield,
} from "lucide-react";

export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement checkout process
      console.log("Checkout with items:", items);
      // Simulate checkout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearCart();
      setLocation("/order");
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <h1 className="text-4xl font-black text-gray-900 mb-12">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Browse our inventory and add some parts to get started.
              </p>
              <button
                onClick={() => setLocation("/products")}
                className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors inline-flex items-center gap-2"
              >
                Continue Shopping <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-6 p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.brand} {item.model} • {item.category}
                        </p>
                        <p className="font-black text-[#E42933] text-lg">
                          KES {item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setLocation("/products")}
                  className="mt-6 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowRight size={18} className="rotate-180" />
                  Continue Shopping
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({items.length} items)</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (16%)</span>
                      <span>KES {Math.round(total * 0.16).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="text-2xl font-black text-[#E42933]">
                      KES {Math.round(total * 1.16).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-[#E42933] text-white py-3 rounded-lg font-semibold hover:bg-[#d41f28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Proceed to Checkout
                      </>
                    )}
                  </button>

                  {!user && (
                    <p className="text-xs text-gray-600 text-center mb-6">
                      You'll be prompted to sign in at checkout
                    </p>
                  )}

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="text-green-600" size={18} />
                      <span className="text-gray-600">Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="text-blue-600" size={18} />
                      <span className="text-gray-600">Free nationwide shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
