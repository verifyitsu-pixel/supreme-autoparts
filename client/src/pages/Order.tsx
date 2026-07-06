import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Phone, Mail, Send, MessageSquare } from "lucide-react";

export default function Order() {
  const [location] = useLocation();
  const [productInfo, setProductInfo] = useState({ name: "", price: "" });
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("product") || "";
    const price = params.get("price") || "";
    setProductInfo({ name, price });
    if (name) {
      setForm(prev => ({ ...prev, message: `I am interested in purchasing: ${name}${price ? ` (${price})` : ""}. Please provide more details.` }));
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const whatsappMessage = `*New Order Inquiry*\n\n*Product:* ${productInfo.name}\n*Price:* ${productInfo.price}\n\n*Customer Info:*\n*Name:* ${form.name}\n*WhatsApp:* ${form.whatsapp}\n*Email:* ${form.email}\n\n*Message:* ${form.message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/254714498451?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page Hero */}
        <div
          className="relative flex items-center justify-center"
          style={{
            minHeight: 200,
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80') center/cover no-repeat",
          }}
        >
          <div className="text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Place Your Order</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/products" className="hover:text-white">Products</Link>
              <span className="mx-2">›</span>
              <span>Order Inquiry</span>
            </p>
          </div>
        </div>

        <section className="py-16 bg-white">
          <div className="max-w-[900px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Product Summary */}
              <div>
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.45_0.22_27)] mb-2">Selected Item</p>
                  <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {productInfo.name || "Custom Part Inquiry"}
                  </h2>
                  <p className="text-xl font-bold text-[oklch(0.45_0.22_27)] mb-4">{productInfo.price}</p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Please fill in your details and we will get back to you immediately to finalize your order and arrange delivery.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-[oklch(0.45_0.22_27)]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Call Us</p>
                      <p className="font-bold">+254 714 498 451</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-[oklch(0.45_0.22_27)]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Email Us</p>
                      <p className="font-bold">calvin@supremeautoparts.co.ke</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <div>
                <h3 className="text-2xl font-black mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Customer Information
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="e.g. John Kamau"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="e.g. 0712 345 678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Message / Additional Details</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm resize-none"
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary justify-center bg-[#25D366] hover:bg-[#1DA851] border-none py-4">
                    <MessageSquare size={18} />
                    {sent ? "REDIRECTING TO WHATSAPP..." : "SEND ORDER VIA WHATSAPP"}
                  </button>
                  
                  <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-2">
                    Clicking the button will open WhatsApp with your order details pre-filled.
                  </p>
                  
                  {sent && <p className="text-green-600 text-sm font-semibold text-center mt-2">Thank you! Opening WhatsApp...</p>}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
