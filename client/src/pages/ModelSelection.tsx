import { useState } from "react";
import { Link, useParams, useSearch } from "wouter";
import { Search, ChevronRight, ArrowRight, Car, Tag } from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { CAR_BRANDS, CAR_MODELS } from "@/data/carData";

export default function ModelSelection() {
  const params = useParams<{ brandId: string }>();
  const search_ = useSearch();
  const brandId = params.brandId || "";
  const [search, setSearch] = useState("");

  // Parse optional category/sub context
  const urlParams = new URLSearchParams(search_);
  const categoryCtx = urlParams.get("category") || "";
  const subCtx = urlParams.get("sub") || "";

  const brand = CAR_BRANDS.find((b) => b.id === brandId);
  const models = CAR_MODELS[brandId] || [];
  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Build model link — if category context exists, pass it to the next step
  const buildModelLink = (modelId: string) => {
    const base = `/shop/brand/${brandId}/model/${modelId}`;
    if (categoryCtx) {
      return `${base}?category=${encodeURIComponent(categoryCtx)}${subCtx ? `&sub=${encodeURIComponent(subCtx)}` : ""}`;
    }
    return base;
  };

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">Brand Not Found</h2>
            <Link href="/shop/brands" className="text-[#E42933] font-bold hover:underline">
              ← Back to All Brands
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div
          className="relative flex items-center justify-center py-16 md:py-20 overflow-hidden"
          style={{ minHeight: 280 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${brand.heroImage}')` }}
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/shop/brands" className="hover:text-white transition-colors">Brands</Link>
              <ChevronRight size={12} />
              <span className="text-[#E42933]">{brand.name}</span>
            </nav>
            {/* Category context banner */}
            {categoryCtx && (
              <div className="inline-flex items-center gap-2 bg-[#E42933]/20 border border-[#E42933]/40 text-[#E42933] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                <Tag size={12} />
                {subCtx ? `${categoryCtx} › ${subCtx}` : categoryCtx}
              </div>
            )}
            {/* Brand Logo */}
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <h1
              className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {brand.name} Models
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
              {brand.description}
            </p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${brand.name} models...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#E42933] transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-12">
          {/* Back link */}
          <Link
            href="/shop/brands"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#E42933] transition-colors mb-8"
          >
            ← Back to All Brands
          </Link>

          {/* Models Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((model) => (
                <Link
                  key={model.id}
                  href={buildModelLink(model.id)}
                  className="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E42933] hover:shadow-xl transition-all duration-300"
                >
                  {/* Model Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400&auto=format";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#E42933] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                        {model.type}
                      </span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3
                      className="font-black text-gray-900 text-base uppercase tracking-tight mb-1 group-hover:text-[#E42933] transition-colors"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {model.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{model.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {model.years}
                      </span>
                      <span className="flex items-center gap-1 text-[#E42933] text-xs font-bold group-hover:gap-2 transition-all">
                        View Parts <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Car size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 uppercase mb-2">No Models Found</h3>
              <p className="text-gray-500 mb-6">Try a different search term.</p>
              <button
                onClick={() => setSearch("")}
                className="px-6 py-2.5 bg-[#E42933] text-white rounded-lg font-bold text-sm hover:bg-[#c41f28] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-black text-white uppercase tracking-tight mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Don't See Your {brand.name} Model?
              </h3>
              <p className="text-gray-400 text-sm">
                WhatsApp us with your model year and we'll find the right parts for you.
              </p>
            </div>
            <a
              href={`https://wa.me/254714498451?text=Hello%20Supreme%20Autoparts%2C%20I%20need%20parts%20for%20my%20${encodeURIComponent(brand.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1da851] transition-colors whitespace-nowrap"
            >
              WhatsApp Us <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
