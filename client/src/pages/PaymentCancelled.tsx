import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { Ban, ArrowRight, ShoppingCart, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentCancelled() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderNumber(params.get("order") || "");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center">
        <div className="text-center py-16 max-w-lg px-6 w-full">
          {/* Cancelled Icon */}
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="text-gray-500" size={48} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 mb-4">You cancelled the payment process</p>

          {orderNumber && (
            <div className="my-4">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="text-xl font-black text-gray-700">{orderNumber}</p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 text-left">
            <p className="text-sm text-gray-700">
              No payment was charged. Your order has been saved and you can complete payment at any time from your dashboard, or start a new checkout.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLocation("/checkout")}
              className="w-full px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={16} /> Return to Checkout
            </button>
            {user && (
              <button
                onClick={() => setLocation("/dashboard")}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm transition-colors"
              >
                View My Orders
              </button>
            )}
            <button
              onClick={() => setLocation("/products")}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              Continue Shopping <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
