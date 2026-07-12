import { useState } from "react";
import Helmet from "@/components/Helmet";
import { Link, useSearch } from "wouter";
import { Search, ChevronRight, ArrowRight, Star, Tag } from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { CAR_BRANDS } from "@/data/carData";

export default function BrandSelection() {
  const search_ = useSearch();
  const [search, setSearch] = useState("");

  // Parse optional category/sub context from sidebar navigation
  const urlParams = new URLSearchParams(search_);
  const categoryCtx = urlParams.get("category") || "";
  const subCtx = urlParams.get("sub") || "";

  const filtered = CAR_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  const popular = filtered.filter((b) => b.popular);
  const others = filtered.filter((b) => !b.popular);

  // Build the link for each brand card — if we have a category context, pass it along
  const buildBrandLink = (brandId: string) => {
    if (categoryCtx) {
      return `/shop/brand/${brandId}?category=${encodeURIComponent(categoryCtx)}${subCtx ? `&sub=${encodeURIComponent(subCtx)}` : ""}`;
    }
    return `/shop/brand/${brandId}`;
  };

  const pageTitle = categoryCtx ? `Find ${categoryCtx} Parts by Brand | Supreme Autoparts` : "Select Your Car Brand | Supreme Autoparts";
  const pageDescription = categoryCtx ? `Choose your vehicle make to find the right ${categoryCtx.toLowerCase()} parts that fit your car perfectly.` : "Browse genuine OEM car parts by brand for Toyota, BMW, Mercedes-Benz, and more. Supreme Autoparts Kenya offers quality parts with nationwide delivery.";
  const pageCanonicalUrl = "https://supremeautoparts.co.ke/shop/brands";

  return (
    <>
      <Helmet
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={pageCanonicalUrl}
      />
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div
          className="relative flex items-center justify-center py-16 md:py-24"
          style={{
            background:
              "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d0a0d 100%)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/images/models/honda-civic.jpg')] bg-cover bg-center opacity-10" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-[#E42933]">Select Brand</span>
            </nav>

            {/* Category context banner */}
            {categoryCtx && (
              <div className="inline-flex items-center gap-2 bg-[#E42933]/20 border border-[#E42933]/40 text-[#E42933] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                <Tag size={12} />
                {subCtx ? `${categoryCtx} › ${subCtx}` : categoryCtx}
              </div>
            )}

            <h1
              className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {categoryCtx ? `Find ${categoryCtx} Parts` : "Select Your Car Brand"}
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
              {categoryCtx
                ? `Choose your vehicle make to find the right ${categoryCtx.toLowerCase()} parts that fit your car perfectly.`
                : "Choose your vehicle make to find the exact parts that fit your car perfectly."}
            </p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search brand (e.g. Toyota, Mazda...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#E42933] transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-12">
          {/* Popular Brands */}
          {popular.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-8">
                <Star size={18} className="text-[#E42933] fill-[#E42933]" />
                <h2
                  className="text-2xl font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Most Popular in Kenya
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {popular.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} href={buildBrandLink(brand.id)} />
                ))}
              </div>
            </section>
          )}

          {/* Other Brands */}
          {others.length > 0 && (
            <section>
              <h2
                className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                All Brands
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {others.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} href={buildBrandLink(brand.id)} />
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase mb-2">No Brands Found</h3>
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
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Can't Find Your Brand?
              </h3>
              <p className="text-gray-400 text-sm">Contact us via WhatsApp and we'll source the parts you need.</p>
            </div>
            <a
              href="https://wa.me/254714498451?text=Hello%20Supreme%20Autoparts%2C%20I%20need%20parts%20for%20my%20car"
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
    </>
  );
}

function BrandCard({ brand, href }: { brand: (typeof CAR_BRANDS)[0]; href: string }) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E42933] hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Hero Image */}
      <div className="relative h-32 overflow-hidden bg-gray-100">
        <img
          src={brand.heroImage}
          alt={brand.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/models/honda-civic.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Logo overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <span className="text-white text-xs font-black uppercase tracking-wide drop-shadow">
            {brand.name}
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="p-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {brand.country}
        </span>
        <ChevronRight
          size={14}
          className="text-gray-300 group-hover:text-[#E42933] group-hover:translate-x-1 transition-all"
        />
      </div>
    </Link>
  );
}
