import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Clock, Award, ChevronRight, Star, Zap, Settings2 } from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { FloatingButtons } from "@/components/Layout";

const FEATURED_CATEGORIES = [
  { name: "Braking Systems", img: "/assets/images/categories/braking.jpg", count: "240+ Parts" },
  { name: "Engine Components", img: "/assets/images/categories/engine.jpg", count: "580+ Parts" },
  { name: "Transmission & Gear", img: "/assets/images/categories/transmission.jpg", count: "120+ Parts" },
  { name: "Suspension & Chassis", img: "/assets/images/products/mercedes-shock-absorber.jpg", count: "310+ Parts" },
];

const CAR_BRANDS = [
  "Toyota", "BMW", "Mercedes-Benz", "Honda", "Ford", "Hyundai", "Suzuki", "Lexus"
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION - AutoExpress Style */}
        <section className="relative h-[90vh] flex items-center bg-black overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000" 
              className="w-full h-full object-cover opacity-60 scale-105"
              alt="Luxury Car"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
          </div>
          
          <div className="max-w-[1280px] mx-auto px-6 relative z-10 w-full">
            <div className="max-w-3xl animate-fadeIn">
              <span className="bg-[#E42933] text-white text-[11px] font-black uppercase tracking-[0.3em] px-4 py-2 mb-8 inline-block">
                Kenya's #1 Automotive Specialist
              </span>
              <h1 className="text-7xl md:text-9xl text-white mb-8 leading-[0.85] font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Precision <br /><span className="text-[#E42933]">Engineering.</span> <br />Verified Parts.
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-xl font-medium leading-relaxed">
                Procuring genuine OEM components for luxury and performance vehicles since 1987. Nationwide delivery across Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/products" className="btn-primary text-sm px-10 py-5">
                  BROWSE INVENTORY <ArrowRight size={18} />
                </Link>
                <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-black text-sm px-10 py-5">
                  OUR LEGACY
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="bg-[#F4F4F4] py-8 border-b border-gray-200">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, text: "GENUINE GUARANTEE" },
                { icon: Truck, text: "NATIONWIDE SHIPPING" },
                { icon: Clock, text: "24HR DISPATCH" },
                { icon: Award, text: "CERTIFIED DEALER" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <item.icon className="text-[#E42933] group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BRAND SELECTOR - High Contrast */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="section-title">Shop By Manufacturer</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-gray-200 border border-gray-200">
              {CAR_BRANDS.map(brand => (
                <Link 
                  key={brand} 
                  href={`/products?brand=${brand}`}
                  className="bg-white p-8 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all group"
                >
                  <img 
                    src={`/assets/images/brands/${brand.toLowerCase().replace(' ', '')}.png`} 
                    alt={brand} 
                    className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">{brand}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES - Grid Layout */}
        <section className="py-24 bg-[#121212] text-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-5xl font-black uppercase tracking-tighter border-l-[12px] border-[#E42933] pl-8 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Parts Categories
                </h2>
              </div>
              <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E42933] hover:text-white transition-colors flex items-center gap-2">
                VIEW ALL CATEGORIES <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURED_CATEGORIES.map((cat, i) => (
                <Link 
                  key={i} 
                  href={`/products?category=${cat.name}`}
                  className="group relative h-96 overflow-hidden block"
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <span className="text-[#E42933] text-[10px] font-black uppercase tracking-widest mb-2 block">{cat.count}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - AutoExpress Review Style */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="section-title">The Supreme Standard</h2>
                <div className="space-y-12">
                  {[
                    { title: "Expert Verification", desc: "Every part is verified against manufacturer databases using your vehicle's VIN/Chassis number." },
                    { title: "Global Procurement", desc: "We source directly from OEM manufacturers in Germany, Japan, and the UK to ensure zero compromise." },
                    { title: "Technical Support", desc: "Our team consists of automotive engineers, not just salesmen. We speak your language." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-[#E42933] font-black text-xl">0{i+1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gray-100 overflow-hidden border-[20px] border-[#F4F4F4]">
                  <img 
                    src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000" 
                    alt="Workshop" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-[#E42933] p-12 text-white shadow-2xl">
                  <p className="text-5xl font-black leading-none mb-2">35+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER - High Contrast */}
        <section className="bg-[#E42933] py-20">
          <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-white">
              <h2 className="text-5xl font-black uppercase tracking-tight leading-none mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Join The Network
              </h2>
              <p className="text-white/80 font-medium uppercase tracking-widest text-xs">Get exclusive updates on new inventory and technical bulletins.</p>
            </div>
            <div className="flex w-full lg:w-auto gap-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="bg-white border-none px-8 py-5 w-full lg:w-96 text-xs font-black tracking-widest focus:ring-2 focus:ring-black outline-none"
              />
              <button className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
