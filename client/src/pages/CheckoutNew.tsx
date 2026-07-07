import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
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
  MessageCircle,
  Download,
  Copy,
  Check,
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
  type: "mpesa" | "bank" | "card";
}

interface OrderSummary {
  orderNumber: string;
  date: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
}

export default function CheckoutNew() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "review" | "payment" | "confirmation">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Generate order summary
  const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const orderSummary: OrderSummary = {
    orderNumber: generateOrderNumber(),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: total,
    tax: Math.round(total * 0.16),
    shipping: 0,
    total: Math.round(total * 1.16),
    shippingAddress,
  };

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
    setStep("review");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Generate WhatsApp message with order details
      const orderDetails = `
*Supreme Autoparts Order - ${orderSummary.orderNumber}*

*Order Date:* ${orderSummary.date}

*Items:*
${orderSummary.items.map((item) => `• ${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toLocaleString()}`).join("\n")}

*Order Summary:*
Subtotal: KES ${orderSummary.subtotal.toLocaleString()}
Tax (16%): KES ${orderSummary.tax.toLocaleString()}
Shipping: FREE
*Total: KES ${orderSummary.total.toLocaleString()}*

*Delivery Address:*
${shippingAddress.fullName}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.postalCode}
${shippingAddress.country}

*Contact:*
Email: ${shippingAddress.email}
Phone: ${shippingAddress.phone}

*Payment Method:* ${paymentMethod.type === "mpesa" ? "M-Pesa" : paymentMethod.type === "bank" ? "Bank Transfer" : "Card"}

Please confirm this order and provide payment instructions.
      `.trim();

      const whatsappUrl = `https://wa.me/254714498451?text=${encodeURIComponent(orderDetails)}`;
      window.open(whatsappUrl, "_blank");

      // Wait a moment then show confirmation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("confirmation");
      clearCart();
    } catch (error) {
      console.error("Error:", error);
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
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Submitted!</h1>
            <p className="text-gray-600 mb-4">
              Order #{orderSummary.orderNumber}
            </p>
            <p className="text-gray-600 mb-8">
              You've been redirected to WhatsApp. Our team will contact you shortly with payment instructions and order confirmation.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-900">
                <strong>What's next?</strong><br />
                1. Complete payment via WhatsApp<br />
                2. Receive order confirmation<br />
                3. Track your shipment
              </p>
            </div>
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
                {["shipping", "review", "payment"].map((s, idx) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                        step === s || (["review", "payment", "confirmation"].includes(step) && ["shipping", "review"].includes(s))
                          ? "bg-[#E42933] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < 2 && <div className="w-8 h-1 bg-gray-200 mx-2" />}
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
                      Review Order <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* Review Order with Invoice */}
              {step === "review" && (
                <div className="space-y-6">
                  {/* Invoice */}
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="mb-8">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
                          <p className="text-gray-600 text-sm">Order #{orderSummary.orderNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-semibold text-gray-900">{orderSummary.date}</p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin size={18} />
                          Delivery Address
                        </h3>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-semibold">{shippingAddress.fullName}</p>
                          <p>{shippingAddress.address}</p>
                          <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                          <p>{shippingAddress.country}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Email</p>
                          <p className="text-sm font-semibold text-gray-900">{shippingAddress.email}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Phone</p>
                          <p className="text-sm font-semibold text-gray-900">{shippingAddress.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                      <h3 className="font-black text-gray-900 mb-4">Order Items</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 text-sm font-black text-gray-900">Item</th>
                            <th className="text-center py-3 text-sm font-black text-gray-900">Qty</th>
                            <th className="text-right py-3 text-sm font-black text-gray-900">Price</th>
                            <th className="text-right py-3 text-sm font-black text-gray-900">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderSummary.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-200">
                              <td className="py-4 text-sm text-gray-700">{item.name}</td>
                              <td className="py-4 text-center text-sm text-gray-700">{item.quantity}</td>
                              <td className="py-4 text-right text-sm text-gray-700">KES {item.price.toLocaleString()}</td>
                              <td className="py-4 text-right text-sm font-semibold text-gray-900">
                                KES {(item.price * item.quantity).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 border-t-2 border-gray-200 pt-6">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>KES {orderSummary.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax (16%)</span>
                        <span>KES {orderSummary.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                        <span className="font-black text-gray-900 text-lg">Total</span>
                        <span className="text-3xl font-black text-[#E42933]">KES {orderSummary.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep("shipping")}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Edit Address
                    </button>
                    <button
                      onClick={() => setStep("payment")}
                      className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                  <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>

                  <div className="space-y-3">
                    {[
                      { id: "mpesa", label: "M-Pesa", icon: "📱", description: "Pay via M-Pesa" },
                      { id: "bank", label: "Bank Transfer", icon: "🏦", description: "Direct bank transfer" },
                      { id: "card", label: "Credit/Debit Card", icon: "💳", description: "Visa, Mastercard, etc." },
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
                        <div>
                          <p className="font-semibold text-gray-900">{method.label}</p>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* WhatsApp Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <MessageCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h3 className="font-black text-green-900 mb-2">Payment via WhatsApp</h3>
                        <p className="text-sm text-green-800 mb-3">
                          After selecting your payment method, you'll be redirected to WhatsApp where our team will provide you with:
                        </p>
                        <ul className="text-sm text-green-800 space-y-1 ml-4">
                          <li>✓ Complete order invoice</li>
                          <li>✓ Payment instructions for your chosen method</li>
                          <li>✓ Payment confirmation and receipt</li>
                          <li>✓ Delivery tracking information</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep("review")}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Redirecting to WhatsApp...
                        </>
                      ) : (
                        <>
                          <MessageCircle size={18} />
                          Complete Order via WhatsApp
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
                    <span>Tax (16%)</span>
                    <span>KES {Math.round(total * 0.16).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageCircle size={16} />
                    WhatsApp support
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
