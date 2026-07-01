import { useState } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const LOCATIONS = [
  {
    region: "Nairobi",
    name: "Supreme Autoparts Kenya",
    address: "Nairobi CBD, Moi Avenue, Nairobi, Kenya",
  },
  {
    region: "Nairobi",
    name: "Supreme Auto East",
    address: "Enterprise Road, Industrial Area, Nairobi, Kenya",
  },
  {
    region: "Nairobi",
    name: "Supreme Auto West",
    address: "Ngong Road, Near Yaya Centre, Nairobi, Kenya",
  },
  {
    region: "Mombasa",
    name: "Supreme Autoparts Mombasa",
    address: "Nyerere Avenue, Mombasa, Kenya",
  },
  {
    region: "Mombasa",
    name: "Supreme Auto Nyali",
    address: "Mombasa Road, Nyali, Mombasa, Kenya",
  },
  {
    region: "Kisumu",
    name: "Supreme Autoparts Kisumu",
    address: "Odinga Road, Kisumu CBD, Kenya",
  },
  {
    region: "Nakuru",
    name: "Supreme Auto Nakuru",
    address: "Kenyatta Road, Nakuru CBD, Kenya",
  },
  {
    region: "Eldoret",
    name: "Supreme Auto Eldoret",
    address: "Uganda Road, Eldoret CBD, Kenya",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page Hero */}
        <div
          className="relative flex items-center justify-center"
          style={{
            minHeight: 280,
            background: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80') center/cover no-repeat",
          }}
        >
          <div className="text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Us</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>Contact Us</span>
            </p>
          </div>
        </div>

        {/* Locations Grid */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {LOCATIONS.map((loc) => (
                <div key={loc.name} className="bg-white border border-gray-200 p-5 rounded-sm hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.45_0.22_27)] mb-2">{loc.region}</p>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">{loc.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">LOCATION</p>
                  <p className="text-sm text-gray-600">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form + Info */}
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <p className="section-label mb-2">GET IN TOUCH</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Feel Free to Ask Us Anything
              </h2>
              <p className="text-gray-600 mb-8">Have a question about a part? Not sure what fits your car? We're just a message away!</p>

              {/* Quick contact options */}
              <div className="flex flex-col gap-5 mb-8">
                <a
                  href="tel:+254714498451"
                  className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-sm hover:border-[oklch(0.45_0.22_27)] transition-colors"
                >
                  <div className="w-12 h-12 bg-[oklch(0.45_0.22_27)] rounded-full flex items-center justify-center shrink-0">
                    <Phone size={20} color="white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">WhatsApp / Call</p>
                    <p className="text-lg font-bold text-[oklch(0.45_0.22_27)]">+254 714 498 451</p>
                  </div>
                </a>

                <a
                  href="mailto:calvin@supremeautoparts.co.ke"
                  className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-sm hover:border-[oklch(0.45_0.22_27)] transition-colors"
                >
                  <div className="w-12 h-12 bg-[oklch(0.45_0.22_27)] rounded-full flex items-center justify-center shrink-0">
                    <Mail size={20} color="white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email Us</p>
                    <p className="text-lg font-bold text-[oklch(0.45_0.22_27)]">calvin@supremeautoparts.co.ke</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-sm">
                  <div className="w-12 h-12 bg-[oklch(0.45_0.22_27)] rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={20} color="white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Head Office</p>
                    <p className="text-lg font-bold text-gray-900">Nairobi CBD, Moi Avenue, Nairobi</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/254714498451?text=Hello,%20I%20need%20auto%20spare%20parts"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center bg-[#25D366] hover:bg-[#1DA851] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                CHAT ON WHATSAPP
              </a>
            </div>

            {/* Form */}
            <div>
              <h3 className="text-2xl font-black mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Raise an Inquiry
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Your full name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                    placeholder="John Kamau"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">E-mail address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                    placeholder="john@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                    placeholder="Inquiry about engine parts"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm resize-none"
                    placeholder="Tell us what parts you need..."
                  />
                </div>
                <button type="submit" className="btn-primary justify-center">
                  <Send size={15} />
                  {sent ? "MESSAGE SENT!" : "SEND MAIL"}
                </button>
                {sent && <p className="text-green-600 text-sm font-semibold text-center">Thank you! We'll get back to you shortly.</p>}
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
