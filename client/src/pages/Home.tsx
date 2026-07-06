import { useState, useEffect, useRef } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Instagram, 
  ShieldCheck, 
  Truck, 
  Settings, 
  Award,
  Users
} from "lucide-react";

// Hero slider data
const HERO_SLIDES = [
  {
    title: "KENYA'S PREMIER AUTO PARTS SPECIALISTS",
    subtitle: "GENUINE • OEM • QUALITY AFTERMARKET",
    description: "Uncompromising quality for your vehicle. We stock a comprehensive range of genuine parts for Toyota, BMW, Mercedes-Benz, and all major European and Japanese brands.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80",
    bg: "from-black/85 to-black/50",
  },
  {
    title: "DIRECT SOURCING, UNBEATABLE PRICES",
    subtitle: "EXPERT PARTS IDENTIFICATION",
    description: "Can't find a specific component? Our veteran sourcing team uses advanced VIN-matching technology to track down even the rarest parts from our global supplier network.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
    bg: "from-gray-900/90 to-gray-800/60",
  },
];

// Product categories
const CATEGORIES = [
  { label: "BRAKES", img: "/assets/images/products/mercedes-brake-pads.jpg", count: "120+ Items" },
  { label: "GEAR PARTS", img: "/assets/images/products/suzuki-clutch-kit.jpg", count: "85+ Items" },
  { label: "STEERING", img: "/assets/images/products/bmw-steering-rack.jpg", count: "60+ Items" },
  { label: "LUBRICANTS", img: "/assets/images/products/toyota-oil-filter.jpg", count: "40+ Items" },
  { label: "BODY KITS", img: "/assets/images/products/bmw-roof-rack.jpg", count: "150+ Items" },
  { label: "ENGINE PARTS", img: "/assets/images/products/toyota-carburetor.jpg", count: "300+ Items" },
  { label: "ELECTRICALS", img: "/assets/images/products/hyundai-alternator.jpg", count: "110+ Items" },
  { label: "SUSPENSION", img: "/assets/images/products/mercedes-shock-absorber.jpg", count: "95+ Items" },
  { label: "ALLOYS & RIMS", img: "/assets/images/products/lexus-alloy-rim.jpg", count: "50+ Items" },
];

// Car brand logos
const CAR_BRANDS = [
  { name: "Toyota", src: "/assets/images/brands/toyota.png" },
  { name: "BMW", src: "/assets/images/brands/bmw.png" },
  { name: "Mercedes-Benz", src: "/assets/images/brands/mercedes.png" },
  { name: "Honda", src: "/assets/images/brands/honda.png" },
  { name: "Ford", src: "/assets/images/brands/ford.png" },
  { name: "Hyundai", src: "/assets/images/brands/hyundai.png" },
  { name: "Suzuki", src: "/assets/images/brands/suzuki.png" },
  { name: "Lexus", src: "/assets/images/brands/lexus.png" },
  { name: "Infiniti", src: "/assets/images/brands/infiniti.png" },
  { name: "Chevrolet", src: "/assets/images/brands/chevrolet.png" },
  { name: "Mopar", src: "/assets/images/brands/mopar.png" },
];

// Recent products
const PRODUCTS = [
  { name: "Toyota Genuine Brake Pads (Front)", cat: "Brakes", price: "KES 5,500", img: "/assets/images/products/toyota-brake-pads.jpg", brand: "Toyota" },
  { name: "BMW N54/N55 Oil Filter Housing", cat: "Engine Parts", price: "KES 3,500", img: "/assets/images/products/bmw-oil-filter.jpg", brand: "BMW" },
  { name: "Mercedes-Benz W205 Shock Absorber", cat: "Suspension", price: "KES 14,500", img: "/assets/images/products/mercedes-shock-absorber.jpg", brand: "Mercedes" },
  { name: "Honda Civic Headlight Assembly", cat: "Electricals", price: "KES 12,000", img: "/assets/images/products/honda-headlight.jpg", brand: "Honda" },
  { name: "Ford Ranger T6 Radiator", cat: "Engine Parts", price: "KES 16,000", img: "/assets/images/products/ford-radiator.jpg", brand: "Ford" },
  { name: "Lexus RX Series Alloy Rim 18\"", cat: "Alloys & Rims", price: "KES 45,000", img: "/assets/images/products/lexus-alloy-rim.jpg", brand: "Lexus" },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[700px] overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 flex items-center ${
            i === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
          <div className="relative z-20 max-w-[1280px] mx-auto px-6 w-full">
            <div className="max-w-3xl">
              <p className="text-white font-bold tracking-[0.4em] mb-4 text-xs md:text-sm animate-fadeInUp opacity-90 border-l-2 border-[oklch(0.45_0.22_27)] pl-4">
                {slide.subtitle}
              </p>
              <h2
                className="text-4xl md:text-8xl font-black text-white mb-6 leading-[0.9] animate-fadeInUp delay-100"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {slide.title}
              </h2>
              <p className="text-gray-200 text-lg md:text-xl mb-10 leading-relaxed max-w-xl animate-fadeInUp delay-200">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeInUp delay-300">
                <Link href="/products" className="btn-primary py-4 px-10 text-sm">
                  EXPLORE CATALOG <span className="ml-2">→</span>
                </Link>
                <Link href="/contact" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 font-bold uppercase tracking-widest text-xs px-10 py-4 hover:bg-white hover:text-gray-900 transition-all">
                  GET A QUOTE
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-16 h-1 transition-all duration-500 ${i === current ? "bg-[oklch(0.45_0.22_27)]" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

function TrustSignals() {
  const signals = [
    { icon: <ShieldCheck size={32} />, label: "GENUINE GUARANTEE", desc: "100% Authentic Parts" },
    { icon: <Truck size={32} />, label: "NATIONWIDE DELIVERY", desc: "Fast Shipping Across Kenya" },
    { icon: <Settings size={32} />, label: "EXPERT ADVICE", desc: "Qualified Parts Specialists" },
    { icon: <Award size={32} />, label: "BEST VALUE", desc: "Competitive Industry Rates" },
  ];

  return (
    <div className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {signals.map((s, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="text-[oklch(0.45_0.22_27)] group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <div>
                <p className="text-gray-900 font-black text-sm tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.label}</p>
                <p className="text-gray-500 text-xs font-medium">{s.desc}</p>
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
    <section className="py-24 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <p className="section-label mb-3">PARTS BY CATEGORY</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Precision Components for Every Automotive System
            </h2>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-[oklch(0.45_0.22_27)] hover:underline mb-2">
            BROWSE ALL CATEGORIES →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} href={`/products?category=${encodeURIComponent(cat.label)}`} className="group relative overflow-hidden h-64 bg-gray-900 rounded-sm">
              <img 
                src={cat.img} 
                alt={cat.label} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white text-2xl font-black uppercase tracking-tight mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cat.label}</p>
                <p className="text-[oklch(0.45_0.22_27)] text-xs font-bold tracking-widest uppercase">{cat.count}</p>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-[oklch(0.45_0.22_27)] rounded-full flex items-center justify-center text-white">
                  <ChevronRight size={20} />
                </div>
              </div>
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
        const next = prev - 0.5;
        const totalWidth = CAR_BRANDS.length * 200;
        return next <= -totalWidth ? 0 : next;
      });
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-10 text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">OFFICIAL & OEM PARTNERS</p>
        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Specialized Parts for Global Brands</h3>
      </div>
      <div className="relative">
        <div
          ref={trackRef}
          className="flex items-center gap-20"
          style={{ transform: `translateX(${offset}px)`, transition: "none", width: "max-content" }}
        >
          {[...CAR_BRANDS, ...CAR_BRANDS, ...CAR_BRANDS].map((brand, i) => (
            <Link key={i} href={`/products?brand=${encodeURIComponent(brand.name)}`} className="shrink-0 flex items-center justify-center grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500" style={{ width: 140 }}>
              <img
                src={brand.src}
                alt={brand.name}
                className="max-h-12 max-w-[120px] object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const points = [
    { icon: <Settings size={24} />, title: "Precision VIN Matching", desc: "We use factory software to ensure the part fits your specific chassis number." },
    { icon: <Users size={24} />, title: "Trusted by Garages", desc: "Official supplier to leading automotive workshops across Nairobi and Mombasa." },
    { icon: <ShieldCheck size={24} />, title: "Warranty Protection", desc: "All our genuine and premium OEM parts come with a standard manufacturer warranty." },
  ];

  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[oklch(0.45_0.22_27)] opacity-5 skew-x-12 translate-x-1/2" />
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-[oklch(0.45_0.22_27)] font-bold tracking-widest uppercase mb-4">WHY SUPREME AUTOPARTS?</p>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            The Professional Choice for Automotive Excellence
          </h2>
          <div className="space-y-10">
            {points.map((p, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-14 h-14 bg-[oklch(0.45_0.22_27)] rounded-sm flex items-center justify-center shrink-0 shadow-lg">
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 border-2 border-[oklch(0.45_0.22_27)] opacity-30 rounded-sm" />
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80" 
            alt="Expert Mechanic" 
            className="relative z-10 w-full rounded-sm shadow-2xl"
          />
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-sm shadow-xl hidden md:block">
            <p className="text-gray-900 font-black text-5xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>35+</p>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Years of Expertise</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="section-label mb-3">NEW ARRIVALS</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Latest Professional Components
            </h2>
          </div>
          <Link href="/products" className="btn-primary bg-gray-900 hover:bg-black py-3 px-8 text-xs">
            VIEW FULL CATALOG
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 overflow-hidden bg-gray-50 relative">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black px-2 py-1 rounded-sm text-gray-900 uppercase tracking-widest shadow-sm">
                    {p.brand}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] text-[oklch(0.45_0.22_27)] font-bold uppercase tracking-[0.15em] mb-2">{p.cat}</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 h-10 overflow-hidden group-hover:text-[oklch(0.45_0.22_27)] transition-colors">{p.name}</h3>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <p className="text-sm font-black text-gray-900">{p.price}</p>
                  <Link
                    href={`/order?product=${encodeURIComponent(p.name)}&price=${encodeURIComponent(p.price)}&brand=${encodeURIComponent(p.brand)}`}
                    className="text-[10px] font-black uppercase tracking-widest text-[oklch(0.45_0.22_27)] hover:underline"
                  >
                    ORDER →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <p className="section-label mb-3">GET IN TOUCH</p>
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Need Professional Parts Sourcing?
          </h2>
          <p className="text-gray-600 text-lg mb-12 leading-relaxed">
            Our specialists are standing by to help you identify the exact part for your vehicle. Send us your VIN or chassis number for a guaranteed fitment match.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center shrink-0 rounded-sm shadow-sm">
                <Phone className="text-[oklch(0.45_0.22_27)]" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">CALL EXPERTS</p>
                <p className="text-lg font-black text-gray-900">+254 714 498 451</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center shrink-0 rounded-sm shadow-sm">
                <Mail className="text-[oklch(0.45_0.22_27)]" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">EMAIL INQUIRY</p>
                <p className="text-sm font-black text-gray-900 break-all">supremeautopartskenya@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 border border-gray-200 rounded-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[oklch(0.45_0.22_27)]" />
          <h3 className="text-2xl font-black mb-8 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Quick Inquiry Form</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Your Name" className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors" />
              <input type="text" placeholder="WhatsApp Number" className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors" />
            </div>
            <input type="text" placeholder="Vehicle Model & Year" className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors" />
            <textarea rows={3} placeholder="Describe the parts you need..." className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors resize-none" />
            <button className="btn-primary w-full justify-center py-4 tracking-[0.3em]">
              SEND INQUIRY <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[oklch(0.45_0.22_27)] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <TrustSignals />
        <CategoryGrid />
        <BrandsCarousel />
        <WhyChooseUs />
        <RecentProducts />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
