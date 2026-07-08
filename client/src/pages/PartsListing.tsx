import { useState, useEffect } from "react";
import { Link, useParams, useSearch } from "wouter";
import {
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Shield,
  Phone,
  MessageCircle,
  Tag,
  Package,
  Star,
} from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { CAR_BRANDS, CAR_MODELS, PART_CATEGORIES } from "@/data/carData";
import { useCart } from "@/contexts/CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  price: number;
  comparePrice?: number;
  images: string[];
  description: string;
  condition: string;
  status: string;
  partNumber?: string;
  compatibility?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return Array.isArray(data) ? data : Object.values(data);
  } catch {
    // Fallback: load from local JSON
    try {
      const res = await fetch("/data/products.json");
      const data = await res.json();
      return Object.values(data) as Product[];
    } catch {
      return [];
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PartsListing() {
  const params = useParams<{ brandId: string; modelId: string; categoryId: string }>();
  const search_ = useSearch();
  const brandId = params.brandId || "";
  const modelId = params.modelId || "";
  const categoryId = params.categoryId || "";

  // Parse subcategory from query string
  const urlParams = new URLSearchParams(search_);
  const subFromUrl = urlParams.get("sub") || "";

  const { addItem } = useCart();

  const brand = CAR_BRANDS.find((b) => b.id === brandId);
  const models = CAR_MODELS[brandId] || [];
  const model = models.find((m) => m.id === modelId);
  const category = PART_CATEGORIES.find((c) => c.id === categoryId);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSub, setActiveSub] = useState(subFromUrl);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts().then((all) => {
      setProducts(all.filter((p) => p.status === "active"));
      setLoading(false);
    });
  }, []);

  // Filter products
  const filtered = products.filter((p) => {
    const matchBrand =
      brand && p.brand.toLowerCase() === brand.name.toLowerCase();
    const matchModel =
      model &&
      p.model.toLowerCase().includes(model.name.split(" ")[0].toLowerCase());
    const matchCat =
      category &&
      p.category.toLowerCase().replace(/[^a-z]/g, "").includes(
        category.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 6)
      );
    const matchSub = !activeSub || p.subcategory === activeSub;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.partNumber || "").toLowerCase().includes(search.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchBrand && matchModel && matchCat && matchSub && matchSearch && matchPrice;
  });

  // Fallback: if no exact match, show all products for brand+category
  const displayProducts =
    filtered.length > 0
      ? filtered
      : products.filter((p) => {
          const matchBrand =
            brand && p.brand.toLowerCase() === brand.name.toLowerCase();
          const matchCat =
            category &&
            p.category.toLowerCase().replace(/[^a-z]/g, "").includes(
              category.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 6)
            );
          return matchBrand && matchCat;
        });

  // Sort
  const sorted = [...displayProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const handleAddToCart = (product: Product) => {
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
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (!brand || !model || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">Page Not Found</h2>
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
          className="relative flex items-center justify-center py-12 md:py-16 overflow-hidden"
          style={{ minHeight: 200 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${category.image}')` }}
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-5 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/shop/brands" className="hover:text-white transition-colors">Brands</Link>
              <ChevronRight size={10} />
              <Link href={`/shop/brand/${brandId}`} className="hover:text-white transition-colors">{brand.name}</Link>
              <ChevronRight size={10} />
              <Link href={`/shop/brand/${brandId}/model/${modelId}`} className="hover:text-white transition-colors">{model.name}</Link>
              <ChevronRight size={10} />
              <span className="text-[#E42933]">{category.name}</span>
            </nav>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl">{category.icon}</span>
              <h1
                className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {brand.name} {model.name}
              </h1>
            </div>
            <p className="text-[#E42933] text-sm font-bold uppercase tracking-widest">
              {category.name}
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="flex gap-8">
            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0`}
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                {/* Back nav */}
                <Link
                  href={`/shop/brand/${brandId}/model/${modelId}`}
                  className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#E42933] transition-colors mb-5"
                >
                  ← Change Category
                </Link>

                {/* Subcategories */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    Filter by Type
                  </h4>
                  <button
                    onClick={() => setActiveSub("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold mb-1 transition-colors ${
                      activeSub === ""
                        ? "bg-[#E42933] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All {category.name}
                  </button>
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSub(sub)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold mb-1 transition-colors ${
                        activeSub === sub
                          ? "bg-[#E42933] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    Price Range (KES)
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>0</span>
                    <span className="flex-1 text-center font-bold text-gray-900">
                      Up to {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full accent-[#E42933]"
                  />
                </div>

                {/* Contact */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    Need Help?
                  </p>
                  <a
                    href="https://wa.me/254714498451"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-[#25D366] hover:underline mb-2"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a
                    href="tel:+254714498451"
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#E42933] transition-colors"
                  >
                    <Phone size={14} /> +254 714 498 451
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold"
                  >
                    <SlidersHorizontal size={14} /> Filters
                  </button>
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-900">{sorted.length}</strong> parts found
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search parts..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E42933] w-44 transition-colors"
                    />
                  </div>
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E42933] transition-colors"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                  {/* View Toggle */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-[#E42933] text-white" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-[#E42933] text-white" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                      : "space-y-4"
                  }
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
                    >
                      <div className="aspect-square bg-gray-100 rounded-xl mb-4" />
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : sorted.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Package size={48} className="text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-gray-900 uppercase mb-2">
                    No Parts Found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    We're stocking up! WhatsApp us and we'll source these parts for your{" "}
                    <strong>
                      {brand.name} {model.name}
                    </strong>
                    .
                  </p>
                  <a
                    href={`https://wa.me/254714498451?text=Hello%20Supreme%20Autoparts%2C%20I%20need%20${encodeURIComponent(category.name)}%20for%20my%20${encodeURIComponent(brand.name + " " + model.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1da851] transition-colors"
                  >
                    <MessageCircle size={16} /> WhatsApp for This Part
                  </a>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                      : "space-y-4"
                  }
                >
                  {sorted.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onAddToCart={handleAddToCart}
                      addedId={addedId}
                      brandId={brandId}
                      modelId={modelId}
                      categoryId={categoryId}
                    />
                  ))}
                </div>
              )}

              {/* WhatsApp Order CTA */}
              {sorted.length > 0 && (
                <div className="mt-10 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
                  <MessageCircle size={32} className="text-[#25D366] flex-shrink-0" />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-black text-gray-900 uppercase text-sm tracking-tight">
                      Prefer to Order via WhatsApp?
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Send us your part number or name and we'll confirm availability and pricing instantly.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/254714498451?text=Hello%20Supreme%20Autoparts%2C%20I%20need%20${encodeURIComponent(category.name)}%20for%20my%20${encodeURIComponent(brand.name + " " + model.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1da851] transition-colors whitespace-nowrap"
                  >
                    Order on WhatsApp <ArrowRight size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  viewMode,
  onAddToCart,
  addedId,
  brandId,
  modelId,
  categoryId,
}: {
  product: Product;
  viewMode: "grid" | "list";
  onAddToCart: (p: Product) => void;
  addedId: string | null;
  brandId: string;
  modelId: string;
  categoryId: string;
}) {
  const isAdded = addedId === product.id;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div
      className={`group bg-white rounded-2xl border-2 border-gray-100 hover:border-[#E42933] hover:shadow-xl transition-all duration-300 overflow-hidden ${
        viewMode === "list" ? "flex gap-0" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-gray-50 ${
          viewMode === "list" ? "w-44 flex-shrink-0" : "aspect-square"
        }`}
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/models/toyota-hilux.jpg";
          }}
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#E42933] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
            -{discount}%
          </div>
        )}
        {product.condition === "New" && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
            New
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`p-4 flex flex-col flex-1 ${viewMode === "list" ? "justify-between" : ""}`}>
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-black text-[#E42933] uppercase tracking-widest bg-[#E42933]/5 px-2 py-0.5 rounded-full">
              {product.subcategory || product.category}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {product.sku}
            </span>
          </div>
          <h3
            className="font-black text-gray-900 text-sm uppercase tracking-tight mb-1 group-hover:text-[#E42933] transition-colors line-clamp-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {product.name}
          </h3>
          {product.partNumber && (
            <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1">
              <Tag size={10} /> OEM: {product.partNumber}
            </p>
          )}
          {viewMode === "list" && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
          )}
        </div>

        <div className={`${viewMode === "list" ? "" : "mt-auto pt-3 border-t border-gray-50"} flex items-center justify-between`}>
          <div>
            <p className="text-lg font-black text-gray-900 tracking-tighter">
              KES {product.price.toLocaleString()}
            </p>
            {product.comparePrice && (
              <p className="text-xs text-gray-400 line-through">
                KES {product.comparePrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/254714498451?text=Hello%20Supreme%20Autoparts%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})%20for%20KES%20${product.price.toLocaleString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1da851] transition-colors"
              title="Order via WhatsApp"
            >
              <MessageCircle size={15} />
            </a>
            <button
              onClick={() => onAddToCart(product)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white hover:bg-[#E42933]"
              }`}
              title="Add to Cart"
            >
              {isAdded ? <Shield size={15} /> : <ShoppingCart size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
