import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { COUNTRIES, getCountryData, COUNTRY_NAMES } from "@/data/countryRegions";
import {
  Lock, Truck, Shield, ArrowRight, Loader2, CheckCircle,
  MapPin, Phone, Mail, MessageCircle, Download, ChevronDown,
  Package, CreditCard, Banknote, Smartphone, AlertCircle, ExternalLink, Plus, Home as HomeIcon,
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

interface PaymentProvider {
  id: "pesapal" | "paypal" | "stripe" | "whatsapp";
  name: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
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

interface ProviderStatus {
  pesapal: { enabled: boolean; configured: boolean };
  paypal: { enabled: boolean; configured: boolean };
  stripe: { enabled: boolean; configured: boolean };
}

export default function CheckoutNew() {
  const { items, total, clearCart } = useCart();
  const { user, getToken } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "review" | "payment" | "confirmation">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<"pesapal" | "paypal" | "stripe" | "whatsapp">("whatsapp");
  const [paymentError, setPaymentError] = useState<string | null>(null);
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

  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const WHATSAPP_NUMBER = "+254714498451";
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showNewAddress, setShowNewAddress] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch("/api/addresses", { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json())
        .then(data => {
          if (data?.length) {
            setSavedAddresses(data);
            const def = data.find((a: any) => a.isDefault);
            if (def) {
              setShippingAddress(prev => ({
                ...prev,
                fullName: def.fullName || prev.fullName,
                phone: def.phone || prev.phone,
                address: def.address || prev.address,
                county: def.county || prev.county,
                postalCode: def.postalCode || prev.postalCode,
                country: def.country || prev.country,
              }));
            }
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const countryData = getCountryData(shippingAddress.country);
  const regionLabel = countryData?.regionLabel || "County / Region";
  const regionOptions = countryData?.regions || [];

  const handleCountryChange = (country: string) => {
    setShippingAddress(prev => ({ ...prev, country, county: "" }));
  };

  const subtotal = total;
  const tax = Math.round(subtotal * 0.16);
  const shipping = 0;
  const orderTotal = subtotal + tax + shipping;

  // Fetch enabled payment providers
  useEffect(() => {
    fetch("/api/payments/providers")
      .then(r => r.json())
      .then((data: ProviderStatus) => {
        setProviderStatus(data);
        // Auto-select first enabled provider
        if (data.pesapal?.enabled && data.pesapal?.configured) setSelectedProvider("pesapal");
        else if (data.paypal?.enabled && data.paypal?.configured) setSelectedProvider("paypal");
        else if (data.stripe?.enabled && data.stripe?.configured) setSelectedProvider("stripe");
        else setSelectedProvider("whatsapp");
      })
      .catch(() => setProviderStatus(null));
  }, []);

  const availableProviders: PaymentProvider[] = [
    ...(providerStatus?.pesapal?.enabled && providerStatus?.pesapal?.configured ? [{
      id: "pesapal" as const,
      name: "Pesapal",
      description: "Pay via M-Pesa, Airtel Money, Visa, Mastercard",
      icon: <span className="text-2xl">🇰🇪</span>,
      badge: "Popular in Kenya",
    }] : []),
    ...(providerStatus?.paypal?.enabled && providerStatus?.paypal?.configured ? [{
      id: "paypal" as const,
      name: "PayPal",
      description: "Pay with PayPal balance, card, or bank account",
      icon: <span className="text-2xl font-bold text-[#003087]">P</span>,
      badge: "International",
    }] : []),
    ...(providerStatus?.stripe?.enabled && providerStatus?.stripe?.configured ? [{
      id: "stripe" as const,
      name: "Credit / Debit Card",
      description: "Visa, Mastercard, Amex — powered by Stripe",
      icon: <CreditCard className="text-[#635BFF]" size={24} />,
      badge: "Secure",
    }] : []),
    {
      id: "whatsapp" as const,
      name: "WhatsApp / Manual",
      description: "Send order via WhatsApp — we'll confirm and invoice you",
      icon: <MessageCircle className="text-green-600" size={24} />,
    },
  ];

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
    setPaymentError(null);

    try {
      // 1. Save order to server
      const orderPayload = {
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal, tax, shipping, total: orderTotal,
        shippingAddress,
        paymentMethod: selectedProvider,
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

      // Save this address for future use if logged in and address not already saved
      if (token && shippingAddress.address && !savedAddresses.find(a => a.address === shippingAddress.address && a.county === shippingAddress.county)) {
        await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            label: "Delivery Address",
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            county: shippingAddress.county,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            isDefault: savedAddresses.length === 0,
          }),
        }).catch(() => {});
      }

      const orderNum = order?.orderNumber || `SA-${Date.now().toString(36).toUpperCase()}`;
      orderNumberRef.current = orderNum;
      setSavedOrder(order);

      // 2. Handle WhatsApp fallback
      if (selectedProvider === "whatsapp") {
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

Please confirm this order and provide payment instructions.
        `.trim();

        window.open(`https://wa.me/254714498451?text=${encodeURIComponent(orderDetails)}`, "_blank");
        await new Promise(r => setTimeout(r, 800));
        setStep("confirmation");
        clearCart();
        return;
      }

      // 3. Initiate real payment
      if (!order?.id || !token) {
        setPaymentError("You must be logged in to use online payment. Please log in or use WhatsApp checkout.");
        return;
      }

      const payRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: order.id, provider: selectedProvider }),
      });

      const payData = await payRes.json();

      if (!payRes.ok) {
        setPaymentError(payData.error || "Payment initialization failed. Please try again.");
        return;
      }

      if (payData.checkoutUrl) {
        // Clear cart before redirect (will be restored if payment fails)
        clearCart();
        // Redirect to payment provider
        window.location.href = payData.checkoutUrl;
        return;
      }

      setPaymentError("Payment provider did not return a checkout URL. Please try again.");
    } catch (err) {
      console.error("Checkout error:", err);
      setPaymentError("An unexpected error occurred. Please try again or use WhatsApp checkout.");
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

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left space-y-4">
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2"><MessageCircle size={18} className="text-blue-600" /> Post-Order Process</h3>
              <p className="text-sm text-gray-700 mb-4">Our team will contact you shortly via WhatsApp to confirm your order details and provide an invoice.</p>
              {[
                { step: "1", icon: "📋", text: "Order Received - We review your order details" },
                { step: "2", icon: "💬", text: `WhatsApp Contact - Our team confirms product info via WhatsApp at ${WHATSAPP_NUMBER}` },
                { step: "3", icon: "🧾", text: "Invoice Shared - We send you an official invoice with payment details" },
                { step: "4", icon: "💳", text: "Payment & Shipping - Once payment confirmed, we dispatch your order" },
                { step: "5", icon: "🚚", text: "Track Your Order - Monitor delivery in your dashboard" },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{s.icon}</div>
                  <div>
                    <p className="text-sm text-gray-700"><span className="font-black text-[#E42933]">Step {s.step}:</span> {s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-amber-900"><span className="font-semibold">💡 Tip:</span> Make sure your WhatsApp is active and notifications are enabled. We'll contact you at <span className="font-semibold">{WHATSAPP_NUMBER}</span> to confirm your order and share the invoice.</p>
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

                  {/* Saved Addresses Selector */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">Saved Addresses</h3>
                        <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-xs text-[#E42933] font-semibold hover:underline">
                          {showNewAddress ? "Use New Address" : "Add New Address"}
                        </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {savedAddresses.map(addr => (
                          <button key={addr.id} onClick={() => {
                            setShippingAddress(prev => ({
                              ...prev, fullName: addr.fullName, phone: addr.phone, address: addr.address,
                              county: addr.county, postalCode: addr.postalCode, country: addr.country || "Kenya",
                            }));
                          }}
                            className={`flex-shrink-0 p-3 rounded-lg border-2 text-left min-w-[200px] transition-all ${addr.isDefault ? "border-[#E42933] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <HomeIcon size={14} className="text-gray-500" />
                              <span className="text-xs font-bold text-gray-900">{addr.label || "Home"}</span>
                              {addr.isDefault && <span className="text-[10px] bg-[#E42933] text-white px-1.5 py-0.5 rounded-full">Default</span>}
                            </div>
                            <p className="text-xs text-gray-600">{addr.fullName}</p>
                            <p className="text-xs text-gray-500">{addr.address}</p>
                            <p className="text-xs text-gray-500">{addr.county}, {addr.country}</p>
                            <p className="text-xs text-gray-500">{addr.phone}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(showNewAddress || savedAddresses.length === 0) && (
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm appearance-none bg-white pr-10">
                          <option value="">Select {regionLabel}</option>
                          {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                      <input type="text" value={shippingAddress.postalCode}
                        onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        placeholder="00100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm" />
                    </div>
                  </div>
                  )}

                  <button type="submit" className="w-full py-4 bg-[#E42933] text-white rounded-xl font-black text-base hover:bg-[#d41f28] transition-colors flex items-center justify-center gap-2">
                    Continue to Review <ArrowRight size={18} />
                  </button>
                </form>
              )}

              {/* ── ORDER REVIEW ── */}
              {step === "review" && (
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Package className="text-[#E42933]" size={22} /> Order Review
                  </h2>

                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-black text-gray-900">KES {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h3 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2"><MapPin size={16} className="text-[#E42933]" /> Delivery To</h3>
                    <p className="text-sm text-gray-700">{shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                    <p className="text-sm text-gray-600">{shippingAddress.county}, {shippingAddress.country}</p>
                    <p className="text-sm text-gray-600">{shippingAddress.phone} · {shippingAddress.email}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep("shipping")} className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50">
                      Edit Address
                    </button>
                    <button onClick={() => setStep("payment")} className="flex-1 py-3 bg-[#E42933] text-white rounded-lg font-black text-sm hover:bg-[#d41f28] flex items-center justify-center gap-2">
                      Choose Payment <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PAYMENT SELECTION ── */}
              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Lock className="text-[#E42933]" size={22} /> Payment Method
                  </h2>

                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-red-700">{paymentError}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {availableProviders.map(provider => (
                      <label key={provider.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedProvider === provider.id ? "border-[#E42933] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <input
                          type="radio"
                          name="paymentProvider"
                          value={provider.id}
                          checked={selectedProvider === provider.id}
                          onChange={() => { setSelectedProvider(provider.id); setPaymentError(null); }}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedProvider === provider.id ? "border-[#E42933]" : "border-gray-300"}`}>
                          {selectedProvider === provider.id && <div className="w-2.5 h-2.5 rounded-full bg-[#E42933]" />}
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {provider.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-gray-900">{provider.name}</p>
                            {provider.badge && <span className="text-[10px] font-bold bg-[#E42933] text-white px-2 py-0.5 rounded-full">{provider.badge}</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{provider.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Security badges */}
                  <div className="flex items-center gap-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Lock size={13} className="text-green-600" /> SSL Encrypted
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Shield size={13} className="text-green-600" /> Secure Checkout
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Truck size={13} className="text-green-600" /> Fast Delivery
                    </div>
                  </div>

                  {/* Policies */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={policiesAccepted} onChange={e => setPoliciesAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#E42933] focus:ring-[#E42933]" required />
                    <span className="text-xs text-gray-600">
                      I agree to the <a href="/terms" className="text-[#E42933] hover:underline" target="_blank">Terms of Service</a> and <a href="/privacy" className="text-[#E42933] hover:underline" target="_blank">Privacy Policy</a>. I understand that my order will be processed and I will be contacted for confirmation.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep("review")} className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50">
                      Back
                    </button>
                    <button type="submit" disabled={isProcessing || !policiesAccepted} className="flex-1 py-4 bg-[#E42933] text-white rounded-xl font-black text-base hover:bg-[#d41f28] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {isProcessing ? (
                        <><Loader2 className="animate-spin" size={18} /> Processing...</>
                      ) : selectedProvider === "whatsapp" ? (
                        <><MessageCircle size={18} /> Send via WhatsApp</>
                      ) : (
                        <><ExternalLink size={18} /> Pay Now — KES {orderTotal.toLocaleString()}</>
                      )}
                    </button>
                  </div>

                  {selectedProvider !== "whatsapp" && (
                    <p className="text-xs text-center text-gray-400">
                      You will be redirected to {availableProviders.find(p => p.id === selectedProvider)?.name} to complete your payment securely.
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* ── ORDER SUMMARY SIDEBAR ── */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <h3 className="text-base font-black text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate pr-2">{item.name} ×{item.quantity}</span>
                      <span className="font-semibold text-gray-900 flex-shrink-0">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (16% VAT)</span><span>KES {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>Shipping</span><span>FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span><span>KES {orderTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={13} className="text-green-600 flex-shrink-0" />
                    <span>All transactions are encrypted and secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck size={13} className="text-blue-600 flex-shrink-0" />
                    <span>Nationwide delivery across Kenya</span>
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
