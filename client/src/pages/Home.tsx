import { useState, useEffect, useRef } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, CheckCircle2, Phone, Mail, MapPin, Send, Instagram } from "lucide-react";

// Hero slider data
const HERO_SLIDES = [
  {
    title: "PREMIUM AUTO SPARE PARTS",
    subtitle: "FOR ALL MAJOR BRANDS",
    description: "Quality parts for Toyota, BMW, Mercedes, and more. Genuine and OEM parts at competitive prices.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80",
    bg: "from-black/80 to-black/40",
  },
  {
    title: "EXPERT PARTS SOURCING",
    subtitle: "WE FIND WHAT YOU NEED",
    description: "Can't find a specific part? Our sourcing experts will track it down for you across our global network.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
    bg: "from-gray-900 to-gray-800",
  },
];

// Product categories
const CATEGORIES = [
  { label: "BRAKES", img: "/assets/images/products/mercedes-brake-pads.jpg" },
  { label: "GEAR PARTS", img: "/assets/images/products/suzuki-clutch-kit.jpg" },
  { label: "STEERING", img: "/assets/images/products/bmw-steering-rack.jpg" },
  { label: "LUBRICANTS", img: "/assets/images/products/shell-oil.jpg" },
  { label: "BODY KITS", img: "/assets/images/products/bmw-roof-rack.jpg" },
  { label: "ENGINE PARTS", img: "/assets/images/products/toyota-carburetor.jpg" },
  { label: "ELECTRICALS", img: "/assets/images/products/hyundai-alternator.jpg" },
  { label: "SUSPENSION PARTS", img: "/assets/images/products/mercedes-shock-absorber.jpg" },
  { label: "ALLOYS & RIMS", img: "/assets/images/products/lexus-alloy-rim.jpg" },
  { label: "WINDSCREENS", img: "/assets/images/products/toyota-windscreen.webp" },
];

// Car brand logos
const CAR_BRANDS = [
  { name: "Chevrolet", src: "/assets/images/brands/chevrolet.png" },
  { name: "BMW", src: "/assets/images/brands/bmw.png" },
  { name: "Ford", src: "/assets/images/brands/ford.png" },
  { name: "Honda", src: "/assets/images/brands/honda.png" },
  { name: "Mercedes-Benz", src: "/assets/images/brands/mercedes.png" },
  { name: "Hyundai", src: "/assets/images/brands/hyundai.png" },
  { name: "Toyota", src: "/assets/images/brands/toyota.png" },
  { name: "Suzuki", src: "/assets/images/brands/suzuki.png" },
  { name: "Infiniti", src: "/assets/images/brands/infiniti.png" },
  { name: "Mopar", src: "/assets/images/brands/mopar.png" },
  { name: "Lexus", src: "/assets/images/brands/lexus.png" },
];

// Recent products
const PRODUCTS = [
  { name: "Toyota Genuine Brake Pads", cat: "Brakes", price: "KES 5,500", img: "/assets/images/products/toyota-brake-pads.jpg" },
  { name: "BMW Genuine Oil Filter Kit", cat: "Engine Parts", price: "KES 3,500", img: "/assets/images/products/bmw-oil-filter.jpg" },
  { name: "Mercedes-Benz Shock Absorber", cat: "Suspension Parts", price: "KES 14,500", img: "/assets/images/products/mercedes-shock-absorber.jpg" },
  { name: "Honda Headlight Assembly", cat: "Electricals", price: "KES 12,000", img: "/assets/images/products/honda-headlight.jpg" },
  { name: "Ford Ranger Radiator", cat: "Engine Parts", price: "KES 16,000", img: "/assets/images/products/ford-radiator.jpg" },
  { name: "Lexus RX Alloy Rim", cat: "Alloys & Rims", price: "KES 45,000", img: "/assets/images/products/lexus-alloy-rim.jpg" },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[450px] md:h-[650px] overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
          <div className="relative z-20 max-w-[1280px] mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <p className="text-white font-bold tracking-[0.3em] mb-2 text-sm md:text-base animate-fadeInUp">
                {slide.subtitle}
              </p>
              <h2
                className="text-4xl md:text-7xl font-black text-white mb-6 leading-none animate-fadeInUp delay-100"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {slide.title}
              </h2>
              <p className="text-gray-300 text-lg mb-8 animate-fadeInUp delay-200">
                {slide.description}
              </p>
              <div className="flex gap-4 animate-fadeInUp delay-300">
                <Link href="/products" className="btn-primary">
                  SHOP NOW <span className="ml-1">+</span>
                </Link>
                <Link href="/contact" className="bg-white text-gray-900 font-bold uppercase tracking-widest text-xs px-8 py-4 hover:bg-gray-100 transition-colors">
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-12 h-1 transition-colors ${i === current ? "bg-[oklch(0.45_0.22_27)]" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturesBar() {
  const features = [
    { label: "QUALITY PARTS", desc: "Genuine & OEM Standards" },
    { label: "EXPERT SUPPORT", desc: "Professional Advice" },
    { label: "QUICK DELIVERY", desc: "Nationwide Shipping" },
    { label: "BEST PRICES", desc: "Competitive Rates" },
  ];

  return (
    <div className="bg-gray-900 py-8">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-4 border-r border-white/10 last:border-0">
              <CheckCircle2 className="text-[oklch(0.45_0.22_27)] shrink-0" size={24} />
              <div>
                <p className="text-white font-bold text-sm tracking-wider uppercase">{f.label}</p>
                <p className="text-gray-400 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
            <Link key={cat.label} href={`/products?category=${encodeURIComponent(cat.label)}`} className="category-card block" style={{ height: 180 }}>
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
            <Link key={i} href={`/products?brand=${encodeURIComponent(brand.name)}`} className="shrink-0 flex items-center justify-center" style={{ width: 140 }}>
              <img
                src={brand.src}
                alt={brand.name}
                className="max-h-12 max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              />
            </Link>
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
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80"
            alt="Auto spare parts store"
            className="relative z-10 w-full h-80 object-cover rounded-sm shadow-lg"
          />
        </div>

        {/* Text side */}
        <div>
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
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="section-label">NEW ARRIVALS</p>
            <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Our Recent Products
            </h2>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-[oklch(0.45_0.22_27)] hover:underline mb-1">
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="bg-white border border-gray-200 rounded-sm overflow-hidden group">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] text-[oklch(0.45_0.22_27)] font-bold uppercase tracking-wider mb-1">{p.cat}</p>
                <h3 className="text-sm font-bold text-gray-800 leading-tight mb-2 h-10 overflow-hidden">{p.name}</h3>
                <Link
                  href={`/order?product=${encodeURIComponent(p.name)}&price=${encodeURIComponent(p.price)}`}
                  className="text-xs font-bold uppercase tracking-wide text-[oklch(0.45_0.22_27)] hover:underline"
                >
                  Order Now →
                </Link>
              </div>
            </div>
          ))}
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
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <p className="section-label">GET IN TOUCH</p>
          <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Ready to order? Or have a question?
          </h2>
          <p className="text-gray-600 mb-10">
            Contact us for any auto spare part inquiry. We respond quickly to all messages and can help you find even the rarest components.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center shrink-0">
                <Phone className="text-white" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                <p className="text-lg font-bold">+254 714 498 451</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center shrink-0">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                <p className="text-lg font-bold">supremeautopartskenya@gmail.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-900 flex items-center justify-center shrink-0">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Location</p>
                <p className="text-lg font-bold">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 border border-gray-100 rounded-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                placeholder="Your Email"
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
