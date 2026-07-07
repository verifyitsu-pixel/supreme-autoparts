import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Send, CheckCircle2, ShieldCheck, Truck, Clock, ChevronLeft } from "lucide-react";

export default function Order() {
  const [location] = useLocation();
  const [productInfo, setProductInfo] = useState({ name: "", price: "", model: "", brand: "" });
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", year: "", details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productName = params.get("product") || "Special Part Inquiry";
    const brand = params.get("brand") || "General";
    const model = params.get("model") || "Universal";
    const price = params.get("price") || "Market Rate";

    setProductInfo({
      name: productName,
      price: price,
      model: model,
      brand: brand,
    });

    // Auto-prefill the details field with the selected part info
    setForm(prev => ({
      ...prev,
      details: `Inquiry for: ${productName}\nVehicle: ${brand} ${model}\nEstimated Price: ${price}\n\n(Please add your Chassis/VIN number here for verification)`
    }));
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `*OFFICIAL PARTS INQUIRY - SUPREME AUTOPARTS*%0A%0A` +
      `*Component:* ${productInfo.name}%0A` +
      `*Brand:* ${productInfo.brand}%0A` +
      `*Vehicle Model:* ${productInfo.model}%0A` +
      `*Year:* ${form.year}%0A` +
      `*Price Guide:* ${productInfo.price}%0A%0A` +
      `*Customer Information:*%0A` +
      `- Name: ${form.name}%0A` +
      `- Contact: ${form.whatsapp}%0A%0A` +
      `*Technical Notes:*%0A${form.details || "None provided."}`;

    const whatsappUrl = `https://wa.me/254714498451?text=${message}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[oklch(0.45_0.22_27)] transition-colors mb-10">
            <ChevronLeft size={14} /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form Side */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 md:p-16 rounded-sm shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[oklch(0.45_0.22_27)]" />
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Order Specification
                </h1>
                <p className="text-gray-500 text-sm mb-12 leading-relaxed">
                  Please provide your vehicle details. Our technical team will verify the part compatibility before finalizing your order.
                </p>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                        placeholder="e.g. Samuel Okoth"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">WhatsApp Number</label>
                      <input
                        type="tel"
                        required
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                        placeholder="e.g. 0714 498 451"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Vehicle Year</label>
                      <input
                        type="text"
                        required
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                        placeholder="e.g. 2018"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email (Optional)</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Details & Specifications</label>
                    <textarea
                      rows={6}
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                      className="w-full border border-gray-100 bg-gray-50 p-4 text-sm font-medium focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors resize-none rounded-sm"
                      placeholder="Providing your Chassis Number (VIN) ensures 100% fitment accuracy..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary justify-center py-5 tracking-[0.4em] text-xs shadow-xl shadow-red-900/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "PROCESSING..." : "SECURE ORDER VIA WHATSAPP"} <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Summary Side */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-8">
                {/* Product Card */}
                <div className="bg-gray-900 rounded-sm p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-6">Order Summary</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-8 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {productInfo.name}
                  </h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Brand / Model</span>
                      <span className="font-bold text-sm">{productInfo.brand} {productInfo.model}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Est. Price</span>
                      <span className="text-2xl font-black text-[oklch(0.45_0.22_27)]">{productInfo.price}</span>
                    </div>
                  </div>
                  <div className="mt-12 flex items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/5">
                    <ShieldCheck className="text-[oklch(0.45_0.22_27)]" size={24} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Genuine Guarantee</p>
                      <p className="text-[9px] text-gray-500">Verified Professional Component</p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 border border-gray-100 rounded-sm flex flex-col items-center text-center">
                    <Truck className="text-[oklch(0.45_0.22_27)] mb-3" size={24} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-900">Nationwide Delivery</p>
                  </div>
                  <div className="bg-white p-6 border border-gray-100 rounded-sm flex flex-col items-center text-center">
                    <Clock className="text-[oklch(0.45_0.22_27)] mb-3" size={24} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-900">Expert Support</p>
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
