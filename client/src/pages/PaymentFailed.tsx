import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { XCircle, ArrowRight, RefreshCw, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const WHATSAPP_NUMBER = "+254714498451";

export default function PaymentFailed() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderNumber(params.get("order") || "");
    setReason(params.get("reason") || "");
  }, []);

  const reasonMessages: Record<string, string> = {
    missing_tracking_id: "Payment tracking information was missing.",
    missing_token: "Payment token was not received.",
    capture_failed: "Payment capture failed.",
    capture_error: "An error occurred while capturing payment.",
    session_error: "Payment session could not be verified.",
    verification_error: "Payment verification failed.",
    missing_session: "Payment session information was missing.",
  };

  const displayReason = reason ? (reasonMessages[reason] || "An unexpected error occurred.") : "The payment could not be completed.";

  const handleWhatsApp = () => {
    const msg = orderNumber
      ? `Hi, I had a payment issue with Order ${orderNumber}. Can you help me complete the payment?`
      : "Hi, I had a payment issue during checkout. Can you help me?";
    window.open(`https://wa.me/254714498451?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center">
        <div className="text-center py-16 max-w-lg px-6 w-full">
          {/* Failed Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-600" size={48} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-4">We were unable to process your payment</p>

          {orderNumber && (
            <div className="my-4">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="text-xl font-black text-gray-700">{orderNumber}</p>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Reason:</span> {displayReason}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-black text-gray-900 mb-3">What you can do</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">• Try again with a different payment method</p>
              <p className="text-sm text-gray-700">• Check your card details and available balance</p>
              <p className="text-sm text-gray-700">• Contact your bank if the issue persists</p>
              <p className="text-sm text-gray-700">• Use WhatsApp to complete your order manually</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLocation("/checkout")}
              className="w-full px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={16} /> Get Help via WhatsApp
            </button>
            {user && (
              <button
                onClick={() => setLocation("/dashboard")}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm transition-colors"
              >
                View My Orders
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
