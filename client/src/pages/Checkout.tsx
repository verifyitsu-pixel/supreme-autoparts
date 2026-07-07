import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/Layout";
import {
  Lock,
  Truck,
  Shield,
  ArrowRight,
  Loader2,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  type: "card" | "mpesa" | "bank";
  cardNumber?: string;
  mpesaPhone?: string;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kenya",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "mpesa",
  });

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h1>
            <button
              onClick={() => setLocation("/products")}
              className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors inline-flex items-center gap-2"
            >
              Continue Shopping <ArrowRight size={18} />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // TODO: Implement payment processing
      console.log("Processing payment:", paymentMethod);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep("confirmation");
      clearCart();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center py-20 max-w-md px-6">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. You'll receive an email confirmation shortly with your
              order details and tracking information.
            </p>
            <button
              onClick={() => setLocation("/dashboard")}
              className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors inline-flex items-center gap-2"
            >
              View Order <ArrowRight size={18} />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-black text-gray-900 mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step Indicator */}
              <div className="flex gap-4">
                {["shipping", "payment"].map((s, idx) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                        step === s || (step === "confirmation" && s === "payment")
                          ? "bg-[#E42933] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < 1 && <div className="w-8 h-1 bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>

              {/* Shipping Form */}
              {step === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                  <h2 className="text-2xl font-black text-gray-900">Shipping Address</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Country
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                      >
                        <option>Kenya</option>
                        <option>Uganda</option>
                        <option>Tanzania</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, address: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setLocation("/cart")}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* Payment Form */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                  <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>

                  <div className="space-y-3">
                    {[
                      { id: "mpesa", label: "M-Pesa", icon: "📱" },
                      { id: "card", label: "Credit/Debit Card", icon: "💳" },
                      { id: "bank", label: "Bank Transfer", icon: "🏦" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                        style={{
                          borderColor:
                            paymentMethod.type === method.id ? "#E42933" : "#e5e7eb",
                          backgroundColor:
                            paymentMethod.type === method.id ? "#fef2f2" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod.type === method.id as any}
                          onChange={(e) =>
                            setPaymentMethod({ type: e.target.value as any })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-semibold text-gray-900">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Complete Order
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-6">
                <h3 className="text-xl font-black text-gray-900">Order Summary</h3>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
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

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#E42933]">
                    KES {Math.round(total * 1.16).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} />
                    Secure checkout
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck size={16} />
                    Free nationwide shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
