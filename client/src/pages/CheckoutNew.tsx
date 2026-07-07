import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { COUNTRIES, getCountryData, COUNTRY_NAMES } from "@/data/countryRegions";
import {
  Lock, Truck, Shield, ArrowRight, Loader2, CheckCircle,
  MapPin, Phone, Mail, MessageCircle, Download, ChevronDown,
  Package, CreditCard, Banknote, Smartphone,
} from "lucide-react";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  county: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  type: "mpesa" | "bank" | "card";
}

interface SavedOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export default function CheckoutNew() {
  const { items, total, clearCart } = useCart();
  const { user, getToken } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "review" | "payment" | "confirmation">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null);
  const orderNumberRef = useRef<string>("");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    county: "",
    postalCode: "",
    country: "Kenya",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ type: "mpesa" });

  // Get county/region options based on selected country
  const countryData = getCountryData(shippingAddress.country);
  const regionLabel = countryData?.regionLabel || "County / Region";
  const regionOptions = countryData?.regions || [];

  // Reset county when country changes
  const handleCountryChange = (country: string) => {
    setShippingAddress(prev => ({ ...prev, country, county: "" }));
  };

  // Subtotals
  const subtotal = total;
  const tax = Math.round(subtotal * 0.16);
  const shipping = 0;
  const orderTotal = subtotal + tax + shipping;

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center py-20">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h1 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-6">Add some parts to your cart before checking out</p>
            <button onClick={() => setLocation("/products")} className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors inline-flex items-center gap-2">
              Browse Parts <ArrowRight size={18} />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.county) { alert(`Please select a ${regionLabel}`); return; }
    setStep("review");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Save order to server
      const orderPayload = {
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal, tax, shipping, total: orderTotal,
        shippingAddress,
        paymentMethod: paymentMethod.type,
      };

      let order: SavedOrder | null = null;
      const token = getToken();
      if (token) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(orderPayload),
        });
        if (res.ok) order = await res.json();
      }

      // Use server order number or generate fallback
      const orderNum = order?.orderNumber || `SA-${Date.now().toString(36).toUpperCase()}`;
      orderNumberRef.current = orderNum;
      setSavedOrder(order);

      // 2. Send WhatsApp message
      const paymentLabel = paymentMethod.type === "mpesa" ? "M-Pesa" : paymentMethod.type === "bank" ? "Bank Transfer" : "Card";
      const orderDetails = `
*Supreme Autoparts Order — ${orderNum}*

*Order Date:* ${new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}

*Items:*
${items.map(i => `• ${i.name} ×${i.quantity} — KES ${(i.price * i.quantity).toLocaleString()}`).join("\n")}

*Order Summary:*
Subtotal: KES ${subtotal.toLocaleString()}
Tax (16% VAT): KES ${tax.toLocaleString()}
Shipping: FREE
*Total: KES ${orderTotal.toLocaleString()}*

*Delivery Address:*
${shippingAddress.fullName}
${shippingAddress.address}
${shippingAddress.county}, ${shippingAddress.country} ${shippingAddress.postalCode}

*Contact:*
Email: ${shippingAddress.email}
Phone: ${shippingAddress.phone}

*Payment Method:* ${paymentLabel}

Please confirm this order and provide payment instructions.
      `.trim();

      window.open(`https://wa.me/254714498451?text=${encodeURIComponent(orderDetails)}`, "_blank");

      await new Promise(r => setTimeout(r, 800));
      setStep("confirmation");
      clearCart();
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Confirmation Screen ────────────────────────────────────────────────────
  if (step === "confirmation") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center py-16 max-w-lg px-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Submitted!</h1>
            <p className="text-gray-500 mb-1">Order Reference</p>
            <p className="text-xl font-black text-[#E42933] mb-6">{orderNumberRef.current}</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-3">
              <h3 className="font-black text-gray-900 mb-3">What happens next?</h3>
              {[
                { step: "1", text: "Our team reviews your order on WhatsApp" },
                { step: "2", text: "We send you payment instructions" },
                { step: "3", text: "Once payment confirmed, we process & ship" },
                { step: "4", text: "Track your order in your dashboard" },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E42933] rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">{s.step}</div>
                  <p className="text-sm text-gray-700">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {user && (
                <button onClick={() => setLocation("/dashboard")} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm">
                  View Dashboard
                </button>
              )}
              <button onClick={() => setLocation("/products")} className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] text-sm inline-flex items-center justify-center gap-2">
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main Checkout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            {[
              { id: "shipping", label: "Shipping" },
              { id: "review", label: "Review" },
              { id: "payment", label: "Payment" },
            ].map((s, idx) => {
              const isActive = step === s.id;
              const isDone = (step === "review" && idx === 0) || (step === "payment" && idx < 2);
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${isDone ? "bg-green-600 text-white" : isActive ? "bg-[#E42933] text-white" : "bg-gray-200 text-gray-500"}`}>
                      {isDone ? <CheckCircle size={16} /> : idx + 1}
                    </div>
                    <span className={`text-sm font-semibold hidden sm:block ${isActive ? "text-gray-900" : "text-gray-500"}`}>{s.label}</span>
                  </div>
                  {idx < 2 && <div className={`w-12 h-1 mx-3 rounded ${isDone ? "bg-green-600" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── SHIPPING FORM ── */}
              {step === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <MapPin className="text-[#E42933]" size={22} /> Shipping Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" value={shippingAddress.fullName}
                        onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm" required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" value={shippingAddress.email}
                        onChange={e => setShippingAddress({...shippingAddress, email: e.target.value})}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm" required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input type="tel" value={shippingAddress.phone}
                        onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm" required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                      <div className="relative">
                        <select value={shippingAddress.country} onChange={e => handleCountryChange(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm appearance-none bg-white pr-10">
                          {COUNTRY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                      <input type="text" value={shippingAddress.address}
                        onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}
                        placeholder="House/Building number, Street name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm" required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{regionLabel} *</label>
                      <div className="relative">
                        <select value={shippingAddress.county} onChange={e => setShippingAddress({...shippingAddress, county: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm appearance-none bg-white pr-10" required>
                          <option value="">Select {regionLabel}...</option>
                          {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Postal / ZIP Code</label>
                      <input type="text" value={shippingAddress.postalCode}
                        onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        placeholder="e.g. 00100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setLocation("/cart")} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm">
                      ← Back to Cart
                    </button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] flex items-center justify-center gap-2 text-sm">
                      Review Order <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ── REVIEW ── */}
              {step === "review" && (
                <div className="space-y-5">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-black text-gray-900 mb-5">Order Review</h2>

                    {/* Items */}
                    <div className="space-y-3 mb-5">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />}
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-black text-gray-900 text-sm">KES {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Tax (16% VAT)</span><span>KES {tax.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-green-600 font-semibold">FREE</span></div>
                      <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span><span>KES {orderTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Summary */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2"><MapPin size={18} className="text-[#E42933]" /> Delivery Address</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-semibold">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.county}, {shippingAddress.country} {shippingAddress.postalCode}</p>
                      <p className="text-gray-500">{shippingAddress.phone} · {shippingAddress.email}</p>
                    </div>
                    <button onClick={() => setStep("shipping")} className="mt-3 text-sm text-[#E42933] font-semibold hover:underline">Edit Address</button>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep("shipping")} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm">← Edit Shipping</button>
                    <button onClick={() => setStep("payment")} className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] flex items-center justify-center gap-2 text-sm">
                      Proceed to Payment <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PAYMENT ── */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                      <CreditCard className="text-[#E42933]" size={22} /> Payment Method
                    </h2>

                    <div className="space-y-3">
                      {[
                        { type: "mpesa", label: "M-Pesa", desc: "Pay via M-Pesa mobile money", icon: Smartphone },
                        { type: "bank", label: "Bank Transfer", desc: "Direct bank transfer", icon: Banknote },
                        { type: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard", icon: CreditCard },
                      ].map(pm => (
                        <label key={pm.type} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod.type === pm.type ? "border-[#E42933] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <input type="radio" name="payment" value={pm.type} checked={paymentMethod.type === pm.type as any}
                            onChange={() => setPaymentMethod({ type: pm.type as any })} className="text-[#E42933]" />
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <pm.icon size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
                            <p className="text-xs text-gray-500">{pm.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">How it works</p>
                          <p>After placing your order, you'll be redirected to WhatsApp where our team will send you exact payment instructions for your chosen method.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep("review")} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm">← Back</button>
                    <button type="submit" disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                      {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : <><Lock size={16} /> Place Order & Pay via WhatsApp</>}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate mr-2">{item.name} ×{item.quantity}</span>
                      <span className="font-semibold text-gray-900 flex-shrink-0">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Tax (16%)</span><span>KES {tax.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-green-600 font-semibold">FREE</span></div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span><span>KES {orderTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={14} className="text-green-600" /> Secure checkout
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck size={14} className="text-blue-600" /> Free delivery in Nairobi
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle size={14} className="text-green-600" /> Genuine OEM parts
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
