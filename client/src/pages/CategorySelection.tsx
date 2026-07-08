import { useEffect } from "react";
import { Link, useParams, useSearch, useLocation } from "wouter";
import { ChevronRight, ArrowRight, Wrench, Tag } from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { CAR_BRANDS, CAR_MODELS, PART_CATEGORIES } from "@/data/carData";

export default function CategorySelection() {
  const params = useParams<{ brandId: string; modelId: string }>();
  const search_ = useSearch();
  const [, setLocation] = useLocation();
  const brandId = params.brandId || "";
  const modelId = params.modelId || "";

  // Parse optional category/sub context from sidebar navigation
  const urlParams = new URLSearchParams(search_);
  const categoryCtx = urlParams.get("category") || "";
  const subCtx = urlParams.get("sub") || "";

  // If a category context is provided, auto-redirect to that category's parts page
  useEffect(() => {
    if (categoryCtx) {
      // Find the matching category by name
      const matched = PART_CATEGORIES.find(
        (c) => c.name.toLowerCase().includes(categoryCtx.toLowerCase().slice(0, 6))
          || categoryCtx.toLowerCase().includes(c.name.toLowerCase().slice(0, 6))
      );
      if (matched) {
        const sub = subCtx ? `?sub=${encodeURIComponent(subCtx)}` : "";
        setLocation(`/shop/brand/${brandId}/model/${modelId}/category/${matched.id}${sub}`);
      }
    }
  }, [categoryCtx, subCtx, brandId, modelId]);

  const brand = CAR_BRANDS.find((b) => b.id === brandId);
  const models = CAR_MODELS[brandId] || [];
  const model = models.find((m) => m.id === modelId);

  if (!brand || !model) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">Not Found</h2>
            <Link href="/shop/brands" className="text-[#E42933] font-bold hover:underline">
              ← Back to Brands
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
          style={{ minHeight: 260 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${model.image}')` }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/shop/brands" className="hover:text-white transition-colors">Brands</Link>
              <ChevronRight size={12} />
              <Link href={`/shop/brand/${brandId}`} className="hover:text-white transition-colors">{brand.name}</Link>
              <ChevronRight size={12} />
              <span className="text-[#E42933]">{model.name}</span>
            </nav>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="text-[#E42933] text-xs font-black uppercase tracking-widest">{brand.name}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {model.name}
            </h1>
            <p className="text-gray-300 text-sm mb-2">
              {model.years} &nbsp;·&nbsp; {model.type}
            </p>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">{model.description}</p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-12">
          {/* Back link */}
          <Link
            href={`/shop/brand/${brandId}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#E42933] transition-colors mb-8"
          >
            ← Back to {brand.name} Models
          </Link>

          {/* Section Title */}
          <div className="flex items-center gap-3 mb-8">
            <Wrench size={20} className="text-[#E42933]" />
            <h2
              className="text-2xl font-black text-gray-900 uppercase tracking-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {categoryCtx ? `${categoryCtx} Parts` : "Select Part Category"}
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-10 -mt-4">
            Choose a category to browse parts specifically for your <strong>{brand.name} {model.name}</strong>.
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {PART_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/brand/${brandId}/model/${modelId}/category/${cat.id}`}
                className="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E42933] hover:shadow-xl transition-all duration-300"
              >
                {/* Category Image */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/models/toyota-hilux.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-black text-gray-900 text-sm uppercase tracking-tight mb-1 group-hover:text-[#E42933] transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-3 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {cat.subcategories.length} subcategories
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-[#E42933] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Browse by Subcategory */}
          <div className="mt-14">
            <h3
              className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Quick Browse by Part Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {PART_CATEGORIES.flatMap((cat) =>
                cat.subcategories.map((sub) => (
                  <Link
                    key={`${cat.id}-${sub}`}
                    href={`/shop/brand/${brandId}/model/${modelId}/category/${cat.id}?sub=${encodeURIComponent(sub)}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-[#E42933] hover:text-white hover:border-[#E42933] transition-all"
                  >
                    {sub}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-black text-white uppercase tracking-tight mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Need Help Finding Parts?
              </h3>
              <p className="text-gray-400 text-sm">
                Our experts know the {brand.name} {model.name} inside out. WhatsApp us now.
              </p>
            </div>
            <a
              href={`https://wa.me/254714498451?text=Hello%20Supreme%20Autoparts%2C%20I%20need%20parts%20for%20my%20${encodeURIComponent(brand.name + " " + model.name)}`}
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
