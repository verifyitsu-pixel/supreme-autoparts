import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { CheckCircle, ArrowRight, Package, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [provider, setProvider] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderNumber(params.get("order") || "");
    setProvider(params.get("provider") || "");
  }, []);

  const providerLabel: Record<string, string> = {
    pesapal: "Pesapal",
    paypal: "PayPal",
    stripe: "Credit/Debit Card",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center">
        <div className="text-center py-16 max-w-lg px-6 w-full">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-1">Your payment has been confirmed</p>

          {orderNumber && (
            <div className="my-4">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="text-2xl font-black text-[#E42933]">{orderNumber}</p>
            </div>
          )}

          {provider && (
            <p className="text-sm text-gray-500 mb-6">
              Paid via <span className="font-semibold text-gray-700">{providerLabel[provider] || provider}</span>
            </p>
          )}

          {/* What happens next */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-green-600" /> What Happens Next
            </h3>
            <div className="space-y-3">
              {[
                { icon: "✅", text: "Payment confirmed — your order is now being processed" },
                { icon: "📦", text: "We will prepare and pack your items" },
                { icon: "🚚", text: "Your order will be dispatched with a tracking number" },
                { icon: "📱", text: "You'll receive updates via email and WhatsApp" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">📧 Confirmation Email:</span> A receipt has been recorded for your order. You can view your order history in your dashboard.
            </p>
          </div>

          <div className="flex gap-3">
            {user && (
              <button
                onClick={() => setLocation("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm transition-colors"
              >
                View Orders
              </button>
            )}
            <button
              onClick={() => setLocation("/products")}
              className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] text-sm inline-flex items-center justify-center gap-2 transition-colors"
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
