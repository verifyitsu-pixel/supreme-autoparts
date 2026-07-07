import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Clock, Award, ChevronRight, Star, Zap, Tag, TrendingUp, Package } from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";

const FEATURED_CATEGORIES = [
  { name: "Braking Systems", img: "/assets/images/categories/braking.jpg", count: "240+ Parts", icon: "🛑" },
  { name: "Engine Components", img: "/assets/images/categories/engine.jpg", count: "580+ Parts", icon: "⚙️" },
  { name: "Suspension & Chassis", img: "/assets/images/products/mercedes-shock-absorber.jpg", count: "310+ Parts", icon: "🚗" },
  { name: "Electrical & Sensors", img: "/assets/images/products/hyundai-alternator.jpg", count: "190+ Parts", icon: "⚡" },
  { name: "Transmission & Gear", img: "/assets/images/categories/transmission.jpg", count: "120+ Parts", icon: "🔧" },
  { name: "Alloys & Rims", img: "/assets/images/products/lexus-alloy-rim.jpg", count: "80+ Parts", icon: "🔵" },
];

const CAR_BRANDS = [
  { name: "Toyota", logo: "/assets/images/brands/toyota.png" },
  { name: "BMW", logo: "/assets/images/brands/bmw.png" },
  { name: "Mercedes-Benz", logo: "/assets/images/brands/mercedesbenz.png" },
  { name: "Honda", logo: "/assets/images/brands/honda.png" },
  { name: "Ford", logo: "/assets/images/brands/ford.png" },
  { name: "Hyundai", logo: "/assets/images/brands/hyundai.png" },
  { name: "Suzuki", logo: "/assets/images/brands/suzuki.png" },
  { name: "Lexus", logo: "/assets/images/brands/lexus.png" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "Genuine Guarantee", desc: "100% authentic OEM parts" },
  { icon: Truck, title: "Nationwide Shipping", desc: "Delivery across Kenya" },
  { icon: Clock, title: "24hr Dispatch", desc: "Fast order processing" },
  { icon: Award, title: "Certified Dealer", desc: "Authorized parts dealer" },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/products?status=active").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        // Get unique products from different categories (max 8)
        const categoryMap = new Map<string, any>();
        const featured: any[] = [];
        
        // Shuffle and prioritize products from different categories
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
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000"
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
              <Link href="/brands" className="text-sm text-[#E42933] hover:underline flex items-center gap-1 font-medium">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
              {CAR_BRANDS.map(brand => (
                <Link
                  key={brand.name}
                  href={`/products?brand=${encodeURIComponent(brand.name)}`}
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
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.5"; }} />
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
                    src="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=1000"
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const isLowStock = product.stock <= product.lowStockThreshold && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/products?search=${encodeURIComponent(product.name)}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E42933]/30 transition-all">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.images?.[0] || "https://m.media-amazon.com/images/I/71jZ3oBSqNL._AC_SL1500_.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://m.media-amazon.com/images/I/71jZ3oBSqNL._AC_SL1500_.jpg"; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#E42933] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Low Stock
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-[#E42933] transition-colors">
          {product.name}
        </p>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
          <span className="text-[10px] text-gray-400 ml-1">(24)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-black text-[#E42933]">KES {product.price.toLocaleString()}</p>
            {product.comparePrice && (
              <p className="text-xs text-gray-400 line-through">KES {product.comparePrice.toLocaleString()}</p>
            )}
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.condition === "New" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {product.condition}
          </span>
        </div>
      </div>
    </Link>
  );
}
