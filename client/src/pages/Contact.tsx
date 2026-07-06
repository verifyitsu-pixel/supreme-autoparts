import { useState } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, MessageCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const message = `*NEW WEBSITE INQUIRY*%0A%0A` +
      `*Name:* ${form.name}%0A` +
      `*Contact:* ${form.contact}%0A` +
      `*Subject:* ${form.subject}%0A` +
      `*Message:* ${form.message}`;

    const whatsappUrl = `https://wa.me/254714498451?text=${message}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gray-900 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[oklch(0.45_0.22_27)] opacity-10 skew-x-12 translate-x-1/4" />
          <div className="max-w-[1280px] mx-auto px-6 relative z-10">
            <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-4">Connect With Specialists</p>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-8 leading-[0.9]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Technical Support & Inquiries
            </h1>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              {/* Info Side */}
              <div className="lg:col-span-5 space-y-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Expert Assistance
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Our technical desk is staffed by veteran parts specialists who can help you identify the exact component for your vehicle. For the most accurate assistance, please have your <strong>Chassis Number (VIN)</strong> ready.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-gray-50 flex items-center justify-center shrink-0 rounded-sm border border-gray-100">
                      <Phone className="text-[oklch(0.45_0.22_27)]" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Line</p>
                      <p className="text-xl font-black text-gray-900">+254 714 498 451</p>
                      <p className="text-xs text-gray-500">Available Mon-Sat, 8am-6pm</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-gray-50 flex items-center justify-center shrink-0 rounded-sm border border-gray-100">
                      <Mail className="text-[oklch(0.45_0.22_27)]" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Support</p>
                      <p className="text-lg font-black text-gray-900">supremeautopartskenya@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-gray-50 flex items-center justify-center shrink-0 rounded-sm border border-gray-100">
                      <MapPin className="text-[oklch(0.45_0.22_27)]" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Head Office</p>
                      <p className="text-lg font-black text-gray-900">Nairobi, Kenya</p>
                      <p className="text-xs text-gray-500">Nationwide Shipping Center</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-sm text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[oklch(0.45_0.22_27)] opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center gap-4 mb-4">
                    <ShieldCheck className="text-[oklch(0.45_0.22_27)]" size={24} />
                    <h4 className="font-black uppercase tracking-widest text-xs">Genuine Guarantee</h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Every part supplied by Supreme Autoparts undergoes a rigorous quality check to ensure it meets our strict authenticity standards.
                  </p>
                </div>
              </div>

              {/* Form Side */}
              <div className="lg:col-span-7">
                <div className="bg-white p-10 md:p-16 rounded-sm shadow-2xl shadow-gray-200/50 border border-gray-100 relative">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[oklch(0.45_0.22_27)]" />
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Send An Inquiry
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Your Name</label>
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
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contact Number</label>
                        <input
                          type="text"
                          required
                          value={form.contact}
                          onChange={(e) => setForm({ ...form, contact: e.target.value })}
                          className="w-full border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                          placeholder="WhatsApp or Mobile"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subject / Part Name</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                        placeholder="e.g. Toyota Prado Steering Rack Inquiry"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Detailed Message (Include VIN if possible)</label>
                      <textarea
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-100 bg-gray-50 p-4 text-sm font-medium focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors resize-none rounded-sm"
                        placeholder="Describe the parts you need or your technical question..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary justify-center py-5 tracking-[0.4em] text-xs shadow-xl shadow-red-900/20 disabled:opacity-50"
                    >
                      {isSubmitting ? "SENDING..." : "SEND VIA WHATSAPP"} <MessageCircle size={18} />
                    </button>
                  </form>
                </div>
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
