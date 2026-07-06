import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Send, CheckCircle2, Phone, Mail } from "lucide-react";

export default function Order() {
  const [location] = useLocation();
  const [productInfo, setProductInfo] = useState({ name: "", price: "", model: "", brand: "" });
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", year: "", details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProductInfo({
      name: params.get("product") || "Unknown Product",
      price: params.get("price") || "Contact for Price",
      model: params.get("model") || "",
      brand: params.get("brand") || "",
    });
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare WhatsApp message
    const message = `*NEW ORDER INQUIRY - SUPREME AUTOPARTS*%0A%0A` +
      `*Product:* ${productInfo.name}%0A` +
      `*Brand:* ${productInfo.brand}%0A` +
      `*Vehicle Model:* ${productInfo.model}%0A` +
      `*Year:* ${form.year}%0A` +
      `*Price:* ${productInfo.price}%0A%0A` +
      `*Customer Details:*%0A` +
      `- Name: ${form.name}%0A` +
      `- WhatsApp: ${form.whatsapp}%0A` +
      `- Email: ${form.email || "N/A"}%0A%0A` +
      `*Additional Details:*%0A${form.details || "No additional details provided."}`;

    const whatsappUrl = `https://wa.me/254714498451?text=${message}`;
    
    // Redirect to WhatsApp after a small delay
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Complete Your Order
            </h1>
            <p className="text-gray-500 mt-2">Fill in your details and we'll reach out via WhatsApp immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm sticky top-24">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">Order Summary</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-[oklch(0.45_0.22_27)] uppercase">Selected Product</p>
                    <p className="font-bold text-gray-900 leading-tight">{productInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[oklch(0.45_0.22_27)] uppercase">Brand & Model</p>
                    <p className="font-bold text-gray-900">{productInfo.brand} {productInfo.model}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Estimated Price</p>
                    <p className="text-lg font-black text-[oklch(0.45_0.22_27)]">{productInfo.price}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase">
                    <CheckCircle2 size={14} /> Genuine Quality Guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase">
                    <CheckCircle2 size={14} /> Fast Nationwide Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="e.g. 0714498451"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">Vehicle Year *</label>
                    <input
                      type="text"
                      required
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                      placeholder="e.g. 2015"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">Additional Details (Size, VIN, or specific requirements)</label>
                  <textarea
                    rows={4}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm resize-none"
                    placeholder="Provide more info to help us find the exact part..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary justify-center py-4 text-sm tracking-[0.2em]"
                >
                  <Send size={18} />
                  {isSubmitting ? "PREPARING WHATSAPP..." : "SEND ORDER VIA WHATSAPP"}
                </button>

                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                  Secure inquiry - No payment required at this stage
                </p>
              </form>

              {/* Contact Info Footer */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-gray-200 rounded-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full shrink-0">
                    <Phone className="text-[oklch(0.45_0.22_27)]" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Call for Help</p>
                    <p className="text-sm font-bold">+254 714 498 451</p>
                  </div>
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full shrink-0">
                    <Mail className="text-[oklch(0.45_0.22_27)]" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email Us</p>
                    <p className="text-sm font-bold">supremeautopartskenya@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
