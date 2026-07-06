import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Phone, Globe, CreditCard, Tag, Star, ChevronLeft, ChevronRight, Send } from "lucide-react";

// Hero slides
const SLIDES = [
  {
    tag: "WHERE KENYA GOES FOR THE",
    title: "Your Trusted Source for Auto Spare Parts in Nairobi, Mombasa & Across Kenya",
    bg: "from-gray-900 to-gray-800",
  },
  {
    tag: "LEADING AUTOSPARE PARTS IN KENYA",
    title: "Quality components to keep you moving with confidence",
    bg: "from-gray-900 to-gray-800",
  },
  {
    tag: "COST-EFFECTIVE ALTERNATIVES WITHOUT COMPROMISING ON RELIABILITY",
    title: "Quality Used Auto Parts You Can Trust",
    bg: "from-gray-900 to-gray-800",
  },
];

// Product categories
const CATEGORIES = [
  { label: "BRAKES", img: "/manus-storage/TgbmGhpPhcaO_67125cf6.jpg" },
  { label: "GEAR PARTS", img: "/manus-storage/YMVAngtBcdAv_946f3813.jpg" },
  { label: "STEERING", img: "/manus-storage/zkPNJza6nOuS_759a5d60.jpg" },
  { label: "LUBRICANTS", img: "/manus-storage/zx3mpd38mqwh_1dd516ab.jpg" },
  { label: "BODY KITS", img: "/manus-storage/dk6nReWkXBNM_cceba880.jpg" },
  { label: "ENGINE PARTS", img: "/manus-storage/GO7ybAG0jxp4_8f770ca8.webp" },
  { label: "ELECTRICALS", img: "/manus-storage/dYYk704pp5FU_59bcbaf8.jpg" },
  { label: "SUSPENSION PARTS", img: "/manus-storage/3jMDoiAxEfqq_c26088b5.jpg" },
  { label: "ALLOYS & RIMS", img: "/manus-storage/uheUzyXJXuab_451facf8.jpg" },
];

// Car brand logos
const CAR_BRANDS = [
  { name: "Chevrolet", src: "/manus-storage/logo-chevrolet_81054620.png" },
  { name: "BMW", src: "/manus-storage/logo-bmw_13aff034.png" },
  { name: "Ford", src: "/manus-storage/logo-ford_b4732f80.png" },
  { name: "Honda", src: "/manus-storage/logo-honda_e52f552c.png" },
  { name: "Mercedes-Benz", src: "/manus-storage/logo-mercedes_2feccb84.png" },
  { name: "Hyundai", src: "/manus-storage/logo-hyundai_15b12879.webp" },
  { name: "Toyota", src: "/manus-storage/logo-toyota_1894187f.webp" },
  { name: "Suzuki", src: "/manus-storage/logo-suzuki_b3c0cbaf.webp" },
  { name: "Infiniti", src: "/manus-storage/logo-infiniti_b91aef4e.webp" },
  { name: "Mopar", src: "/manus-storage/logo-mopar_77df2a46.webp" },
  { name: "Lexus", src: "/manus-storage/logo-lexus_5623a401.webp" },
];

// Recent products
const PRODUCTS = [
  { name: "MOTOR ENGINE OIL", cat: "Lubricants", img: "/manus-storage/AKO7fx0e7EoX_75e2d9bb.png" },
  { name: "AUTOMATIC TRANSMISSION FLUID", cat: "Lubricants", img: "/manus-storage/lICQCnHriqD6_a6ef8f18.jpeg" },
  { name: "BMW Railing Carrier Roof Rack", cat: "Body Kits", img: "/manus-storage/GXZUdoXVzqPQ_5abad503.jpg" },
  { name: "Torque Converter", cat: "Gear Parts", img: "/manus-storage/YMVAngtBcdAv_946f3813.jpg" },
  { name: "Rolls Royce Alloy Rim FD156", cat: "Alloys & Rims", img: "/manus-storage/YkTorajED7yL_485d744f.jpg" },
  { name: "Antilock Braking System", cat: "Brakes", img: "/manus-storage/qe91vSqdJL9S_1d3c6406.jpg" },
  { name: "Audi Lower Arm", cat: "Suspension Parts", img: "/manus-storage/PFo1pre5XNwy_22a198d0.png" },
  { name: "Ball Joint Volkswagen", cat: "Suspension Parts", img: "/manus-storage/BAK11LsdYal3_c70d17ff.jpg" },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const go = (idx: number) => { setCurrent(idx); startTimer(); };

  return (
    <div className="relative overflow-hidden" style={{ minHeight: 520, background: "#111" }}>
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80"
          alt="Auto parts background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      {/* Decorative wheel */}
      <img
        src="/manus-storage/wheel_55c164fa.png"
        alt=""
        className="absolute right-0 top-0 h-full opacity-10 object-contain pointer-events-none"
        style={{ maxWidth: 600 }}
      />
      <img
        src="/manus-storage/dotted-grid_638195c6.png"
        alt=""
        className="absolute right-24 top-12 opacity-20 pointer-events-none"
        style={{ width: 200 }}
      />

      {/* Slides */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 flex flex-col justify-center" style={{ minHeight: 520 }}>
        {/* Large brand title */}
        <p className="text-white/80 font-black text-xl md:text-2xl lg:text-3xl tracking-[0.35em] uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>SUPREME AUTOPARTS</p>

        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ${i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"}`}
            style={i !== current ? { pointerEvents: "none" } : {}}
          >
            <p className="section-label mb-3">{slide.tag}</p>
            <h1 className="text-white font-black text-3xl md:text-5xl leading-tight max-w-2xl mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {slide.title}
            </h1>
            <Link href="/contact" className="btn-primary inline-flex">
              CONTACT US <span className="ml-1">+</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-[oklch(0.45_0.22_27)] scale-110" : "bg-white/40 hover:bg-white/70"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-[oklch(0.45_0.22_27)] text-white p-2 rounded-sm transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-[oklch(0.45_0.22_27)] text-white p-2 rounded-sm transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function FeaturesBar() {
  const features = [
    { icon: <Globe size={28} />, label: "Worldwide Delivery" },
    { icon: <CreditCard size={28} />, label: "Easy Payments" },
    { icon: <Tag size={28} />, label: "Best Prices" },
    { icon: <Star size={28} />, label: "Exclusive Discounts" },
  ];
  return (
    <div className="bg-[oklch(0.45_0.22_27)]">
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className={`flex items-center gap-3 py-5 px-6 text-white ${i < features.length - 1 ? "border-r border-red-700/50" : ""}`}>
            <span className="opacity-80">{f.icon}</span>
            <span className="font-bold uppercase tracking-wide text-sm">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4">
        <p className="section-label text-center mb-2">PRODUCT CATEGORIES</p>
        <h2 className="text-3xl md:text-4xl font-black text-center mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          We have high variety of quality products
        </h2>
        <div className="flex justify-center mb-10">
          <div className="flex gap-1">
            <span className="w-8 h-0.5 bg-[oklch(0.45_0.22_27)]" />
            <span className="w-2 h-0.5 bg-[oklch(0.45_0.22_27)]" />
            <span className="w-2 h-0.5 bg-[oklch(0.45_0.22_27)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} href="/products" className="category-card block" style={{ height: 180 }}>
              <img src={cat.img} alt={cat.label} />
              <span className="label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsCarousel() {
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const next = prev - 1;
        const totalWidth = CAR_BRANDS.length * 160;
        return next <= -totalWidth ? 0 : next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <div className="relative">
        <div
          ref={trackRef}
          className="flex items-center gap-12"
          style={{ transform: `translateX(${offset}px)`, transition: "none", width: "max-content" }}
        >
          {[...CAR_BRANDS, ...CAR_BRANDS, ...CAR_BRANDS].map((brand, i) => (
            <div key={i} className="shrink-0 flex items-center justify-center" style={{ width: 140 }}>
              <img
                src={brand.src}
                alt={brand.name}
                className="max-h-12 max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image side */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full bg-[oklch(0.45_0.22_27)] opacity-10 rounded-sm" />
          <img
            src="/manus-storage/mechanic_f3c33fc9.jpg"
            alt="Auto spare parts store"
            className="relative z-10 w-full h-80 object-cover rounded-sm shadow-lg"
          />
          <img
            src="/manus-storage/ellipse-holder_31878a5d.png"
            alt=""
            className="absolute -bottom-6 -right-6 w-32 opacity-30 pointer-events-none"
          />
        </div>

        {/* Text side */}
        <div>
          <img src="/manus-storage/wrench_bea0eb82.png" alt="" className="w-8 mb-4 opacity-70" />
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Providing All Types of Car Parts & Accessories
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At <strong>Supreme Autoparts</strong>, we stock a complete range of automotive components for every make and model. Whether you're looking for <strong>engine parts</strong>, <strong>brake systems</strong>, <strong>suspension components</strong>, or <strong>body accessories</strong>, we've got you covered.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            From routine maintenance items to specialized performance upgrades, our shelves are packed with <strong>genuine, OEM, and high-quality aftermarket parts</strong> for all major car brands serving the Kenyan market.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            CONTACT US <span className="ml-1">+</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function RecentProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <p className="section-label text-center mb-2">OUR PRODUCTS</p>
        <h2 className="text-3xl md:text-4xl font-black text-center mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Recently Added Parts
        </h2>
        <div className="flex justify-center mb-10">
          <div className="flex gap-1">
            <span className="w-8 h-0.5 bg-[oklch(0.45_0.22_27)]" />
            <span className="w-2 h-0.5 bg-[oklch(0.45_0.22_27)]" />
            <span className="w-2 h-0.5 bg-[oklch(0.45_0.22_27)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="overflow-hidden h-44">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="text-xs text-[oklch(0.45_0.22_27)] font-semibold uppercase tracking-wide mb-1">{p.cat}</p>
                <h3 className="text-sm font-bold text-gray-800 leading-tight">{p.name}</h3>
                <Link href="/contact" className="mt-3 text-xs font-bold uppercase tracking-wide text-[oklch(0.45_0.22_27)] hover:underline flex items-center gap-1">
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/products" className="btn-primary inline-flex">
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <p className="section-label mb-2">GET IN TOUCH</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Feel Free to Ask Us Anything
          </h2>
          <p className="text-gray-600 mb-6">Have a question about a part? Not sure what fits your car? We're just a message away!</p>
          <div className="flex flex-col gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[oklch(0.45_0.22_27)] rounded-full flex items-center justify-center shrink-0">
                <Phone size={16} color="white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Phone</p>
                <a href="tel:+254714498451" className="text-[oklch(0.45_0.22_27)] hover:underline">+254 714 498 451</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[oklch(0.45_0.22_27)] rounded-full flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Email</p>
                <a href="mailto:calvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] hover:underline">calvin@supremeautoparts.co.ke</a>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Your full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
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
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                placeholder="john@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Subject</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
              placeholder="Inquiry about engine parts"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm resize-none"
              placeholder="Tell us what you need..."
            />
          </div>
          <button type="submit" className="btn-primary justify-center">
            <Send size={15} />
            {sent ? "MESSAGE SENT!" : "SEND MAIL"}
          </button>
          {sent && <p className="text-green-600 text-sm font-semibold text-center">Thank you! We'll get back to you shortly.</p>}
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <FeaturesBar />
        <CategoryGrid />
        <BrandsCarousel />
        <AboutSection />
        <RecentProducts />
        <ContactForm />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
