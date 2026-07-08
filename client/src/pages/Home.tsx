import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Clock, Award, ChevronRight, Star, Zap, Tag, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { useCart } from "@/contexts/CartContext";

const FEATURED_CATEGORIES = [
  { name: "Braking Systems", img: "/assets/images/categories/braking.png", count: "240+ Parts", icon: "🛑" },
  { name: "Engine Components", img: "/assets/images/categories/engine.png", count: "580+ Parts", icon: "⚙️" },
  { name: "Suspension & Chassis", img: "/assets/images/categories/suspension.png", count: "310+ Parts", icon: "🚗" },
  { name: "Electrical & Sensors", img: "/assets/images/categories/electrical.png", count: "190+ Parts", icon: "⚡" },
  { name: "Transmission & Gear", img: "/assets/images/categories/transmission.png", count: "120+ Parts", icon: "🔧" },
  { name: "Alloys & Rims", img: "/assets/images/categories/alloys.png", count: "80+ Parts", icon: "🔵" },
];

const CAR_BRANDS = [
  { id: "toyota", name: "Toyota", logo: "/assets/images/brands/toyota.png" },
  { id: "nissan", name: "Nissan", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.svg/200px-Nissan_logo.svg.png" },
  { id: "mazda", name: "Mazda", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mazda_logo.svg/200px-Mazda_logo.svg.png" },
  { id: "honda", name: "Honda", logo: "/assets/images/brands/honda.png" },
  { id: "subaru", name: "Subaru", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subaru_logo.svg/200px-Subaru_logo.svg.png" },
  { id: "mitsubishi", name: "Mitsubishi", logo: "/assets/images/brands/mitsubishi.png" },
  { id: "suzuki", name: "Suzuki", logo: "/assets/images/brands/suzuki.png" },
  { id: "bmw", name: "BMW", logo: "/assets/images/brands/bmw.png" },
  { id: "mercedes-benz", name: "Mercedes-Benz", logo: "/assets/images/brands/mercedesbenz.png" },
  { id: "volkswagen", name: "Volkswagen", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png" },
  { id: "ford", name: "Ford", logo: "/assets/images/brands/ford.png" },
  { id: "hyundai", name: "Hyundai", logo: "/assets/images/brands/hyundai.png" },
  { id: "isuzu", name: "Isuzu", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Isuzu_logo.svg/200px-Isuzu_logo.svg.png" },
  { id: "lexus", name: "Lexus", logo: "/assets/images/brands/lexus.png" },
  { id: "kia", name: "Kia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.svg/200px-Kia-logo.svg.png" },
  { id: "land-rover", name: "Land Rover", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Land_Rover_logo.svg/200px-Land_Rover_logo.svg.png" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "Genuine Guarantee", desc: "100% authentic OEM parts" },
  { icon: Truck, title: "Nationwide Shipping", desc: "Delivery across Kenya" },
  { icon: Clock, title: "24hr Dispatch", desc: "Fast order processing" },
  { icon: Award, title: "Certified Dealer", desc: "Authorized parts dealer" },
];

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      brand: product.brand || "",
      model: product.model || "",
      category: product.category || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-100 p-4 hover:border-[#E42933] hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 mb-4">
        <img 
          src={product.images?.[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          loading="lazy" 
        />
      </div>
      <div className="mb-2">
        <span className="text-[10px] font-black text-[#E42933] uppercase tracking-widest bg-[#E42933]/5 px-2 py-0.5 rounded-full">{product.brand}</span>
      </div>
      <h3 className="font-black text-gray-900 text-sm mb-3 line-clamp-2 uppercase tracking-tight h-10">{product.name}</h3>
      <div className="flex items-center justify-between mt-auto">
        <p className="text-lg font-black text-gray-900 tracking-tighter">KES {product.price.toLocaleString()}</p>
        <button 
          onClick={handleAddToCart}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${added ? "bg-green-500 text-white" : "bg-gray-900 text-white hover:bg-[#E42933]"}`}
        >
          {added ? <ShieldCheck size={18} /> : <ShoppingCart size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/products?status=active").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const categoryMap = new Map<string, any>();
        const featured: any[] = [];
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        
        for (const product of shuffled) {
          const category = product.category || 'Unknown';
          if (!categoryMap.has(category) && featured.length < 8) {
            categoryMap.set(category, true);
            featured.push(product);
          }
        }
        setFeaturedProducts(featured);
      }
    }).catch(() => {});
    fetch("/api/settings/public").then(r => r.json()).then(setStoreSettings).catch(() => {});
  }, []);

  const heroTitle = storeSettings?.heroTitle || "Precision Engineering. Verified Parts.";
  const heroSubtitle = storeSettings?.heroSubtitle || "Procuring genuine OEM components for luxury and performance vehicles since 1987. Nationwide delivery across Kenya.";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[60vh] md:min-h-[75vh] flex items-center bg-black overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.toyota-europe.com/eu/hilux/0/exterior/front-view.jpg"
              className="w-full h-full object-cover opacity-50"
              alt="Luxury Car"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 relative z-10 w-full py-16 md:py-24">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-[#E42933] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 mb-6 rounded-sm">
                <Zap size={12} /> Kenya's #1 Automotive Specialist
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight font-black uppercase">
                {heroTitle.split(".")[0]}.<br />
                <span className="text-[#E42933]">{heroTitle.split(".")[1] || "Verified Parts"}.</span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white font-bold px-8 py-4 transition-colors text-sm uppercase tracking-wider rounded-sm">
                  Browse Inventory <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 transition-colors text-sm uppercase tracking-wider rounded-sm">
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES BAR */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {TRUST_BADGES.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E42933]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-[#E42933]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SHOP BY BRAND */}
        <section className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Shop By Brand</h2>
              <Link href="/shop/brands" className="text-sm text-[#E42933] hover:underline flex items-center gap-1 font-medium">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
              {CAR_BRANDS.map(brand => (
                <Link
                  key={brand.id}
                  href={`/shop/brand/${brand.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 flex flex-col items-center justify-center gap-2 hover:border-[#E42933] hover:shadow-md transition-all group aspect-square"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 md:h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                  />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-[#E42933] text-center leading-tight">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Shop By Category</h2>
              <Link href="/products" className="text-sm text-[#E42933] hover:underline flex items-center gap-1 font-medium">
                All Categories <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {FEATURED_CATEGORIES.map((cat, i) => (
                <Link
                  key={i}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 hover:shadow-lg transition-all"
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-xl mb-1 block">{cat.icon}</span>
                    <p className="text-white font-bold text-xs leading-tight">{cat.name}</p>
                    <p className="text-[#E42933] text-[10px] font-semibold mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        {featuredProducts.length > 0 && (
          <section className="py-10 md:py-14 bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp size={22} className="text-[#E42933]" />
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Featured Products</h2>
                </div>
                <Link href="/products" className="text-sm text-[#E42933] hover:underline flex items-center gap-1 font-medium">
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WHY CHOOSE US */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#E42933] text-xs font-bold uppercase tracking-widest mb-3 block">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-8 leading-tight">
                  The Supreme Standard
                </h2>
                <div className="space-y-6">
                  {[
                    { num: "01", title: "Expert Verification", desc: "Every part is verified against manufacturer databases using your vehicle's VIN/Chassis number." },
                    { num: "02", title: "Global Procurement", desc: "We source directly from OEM manufacturers in Germany, Japan, and the UK to ensure zero compromise." },
                    { num: "03", title: "Technical Support", desc: "Our team consists of automotive engineers, not just salesmen. We speak your language." },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-5">
                      <div className="w-12 h-12 bg-[#E42933]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E42933] font-black text-lg">{item.num}</span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Car_engine_parts.jpg/1200px-Car_engine_parts.jpg"
                    alt="Workshop"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#E42933] p-6 rounded-xl text-white shadow-2xl">
                  <p className="text-4xl font-black leading-none mb-1">35+</p>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-90">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-[#1a1a1a] py-12 md:py-16">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  Join Our Network
                </h2>
                <p className="text-gray-400 text-sm">Get exclusive updates on new inventory, deals and technical bulletins.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex w-full lg:w-auto gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#E42933] focus:bg-white/15 transition-all"
                />
                <button type="submit" className="bg-[#E42933] hover:bg-[#c41f28] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
