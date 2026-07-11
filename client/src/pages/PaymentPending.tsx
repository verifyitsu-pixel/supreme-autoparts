import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { Clock, ArrowRight, RefreshCw, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentPending() {
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
    stripe: "Stripe",
  };

  const handleWhatsApp = () => {
    const msg = orderNumber
      ? `Hi, my payment for Order ${orderNumber} is showing as pending. Can you help confirm the status?`
      : "Hi, my payment is showing as pending. Can you help confirm the status?";
    window.open(`https://wa.me/254714498451?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center">
        <div className="text-center py-16 max-w-lg px-6 w-full">
          {/* Pending Icon */}
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-amber-600" size={48} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Pending</h1>
          <p className="text-gray-500 mb-4">Your payment is being processed</p>

          {orderNumber && (
            <div className="my-4">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="text-2xl font-black text-amber-600">{orderNumber}</p>
            </div>
          )}

          {provider && (
            <p className="text-sm text-gray-500 mb-6">
              Payment via <span className="font-semibold text-gray-700">{providerLabel[provider] || provider}</span>
            </p>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={18} className="text-amber-600" /> Payment Processing
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Your payment is currently being verified. This may take a few minutes.</p>
              <p className="text-sm text-gray-700 mt-2">Once confirmed, your order status will automatically update to "Processing" and you'll receive a notification.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Note:</span> If you completed the payment on the provider's page, please allow up to 10 minutes for confirmation. If the status doesn't update, contact us via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {user && (
              <button
                onClick={() => setLocation("/dashboard")}
                className="w-full px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowRight size={16} /> Check Order Status
              </button>
            )}
            <button
              onClick={handleWhatsApp}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={16} /> Contact Us on WhatsApp
            </button>
            <button
              onClick={() => setLocation("/products")}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
