import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import {
  Search, X, ChevronRight, ChevronDown, Star, ShoppingCart, Heart,
  Filter, Grid, List, SlidersHorizontal, Check, Package, Zap
} from "lucide-react";

const CATEGORIES_WITH_SUBCATEGORIES: Record<string, { subcategories: string[]; icon: string; image: string }> = {
  "Braking Systems": { subcategories: ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"], icon: "🛑", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&h=600&fit=crop" },
  "Engine Components": { subcategories: ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"], icon: "⚙️", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&h=600&fit=crop" },
  "Transmission & Gear": { subcategories: ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Gearbox"], icon: "🔧", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&h=600&fit=crop" },
  "Steering Systems": { subcategories: ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"], icon: "🎯", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&h=600&fit=crop" },
  "Suspension & Chassis": { subcategories: ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"], icon: "🚗", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&h=600&fit=crop" },
  "Electrical & Sensors": { subcategories: ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"], icon: "⚡", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&h=600&fit=crop" },
  "Alloys & Rims": { subcategories: ["Alloy Wheels", "Tire Sets", "Wheel Caps", "Lug Nuts", "Wheel Spacers"], icon: "🔵", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&h=600&fit=crop" },
  "Lubricants & Fluids": { subcategories: ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"], icon: "🛢️", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&h=600&fit=crop" },
  "Body Kits & Styling": { subcategories: ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Headlights"], icon: "🎨", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&h=600&fit=crop" },
  "Glass & Windscreens": { subcategories: ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"], icon: "🪟", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&h=600&fit=crop" },
};

const VEHICLE_MODELS: Record<string, { name: string; img: string }[]> = {
  "Toyota": [
    { name: "Hilux (Vigo/Revo)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Fielder", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "Vitz", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
    { name: "Corolla", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
    { name: "Prado (J120/J150)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Land Cruiser (V8/300)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Harrier", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Hiace", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "5 Series (F10/G30)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "7 Series (F01/G11)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "X3 (F25/G01)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "X5 (E70/F15/G05)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
  ],
  "Mercedes-Benz": [
    { name: "C-Class (W204/W205/W206)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "S550 (W221/W222)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "E-Class (W212/W213)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800&h=600&fit=crop" },
    { name: "GLC-Class", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
    { name: "CR-V", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Accord", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Everest", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Focus", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
  ],
  "Hyundai": [
    { name: "Tucson", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Santa Fe", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Elantra", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
    { name: "i10", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
  ],
  "Suzuki": [
    { name: "Swift", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
    { name: "Vitara", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Jimny", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "Alto", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
  ],
  "Lexus": [
    { name: "RX350", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "LX570", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
    { name: "IS250", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800&h=600&fit=crop" },
    { name: "GX460", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&h=600&fit=crop" },
  ],
};

const BRANDS = Object.keys(VEHICLE_MODELS);

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [backendProducts, setBackendProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { addItem } = useCart();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const subcategory = params.get("subcategory");
    const brand = params.get("brand");
    const model = params.get("model");
    const search = params.get("search");

    if (category) setActiveCategory(decodeURIComponent(category));
    if (subcategory) setActiveSubcategory(decodeURIComponent(subcategory));
    if (brand) setActiveBrand(decodeURIComponent(brand));
    if (model) setActiveModel(decodeURIComponent(model));
    if (search) setSearchTerm(decodeURIComponent(search));
    setPage(1);
  }, [location]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (activeSubcategory) params.set("subcategory", activeSubcategory);
        if (activeBrand) params.set("brand", activeBrand);
        if (activeModel) params.set("model", activeModel);
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        if (Array.isArray(data)) setBackendProducts(data);
      } catch {}
      setLoadingProducts(false);
    };
    fetchProducts();
  }, [activeCategory, activeSubcategory, activeBrand, activeModel, searchTerm]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      brand: product.brand || activeBrand || "",
      model: product.model || activeModel || "",
      category: product.category || activeCategory || "",
      sku: product.sku,
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const sortedProducts = [...backendProducts]
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const pageItems = sortedProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const showCategoryStep = !activeCategory && !searchTerm;
  const showSubcategoryStep = activeCategory && !activeSubcategory && !searchTerm && backendProducts.length === 0;
  const showBrandStep = activeCategory && activeSubcategory && !activeBrand && !searchTerm && backendProducts.length === 0;
  const showModelStep = activeCategory && activeSubcategory && activeBrand && !activeModel && !searchTerm && backendProducts.length === 0;

  const clearFilters = () => {
    setActiveCategory(null); setActiveSubcategory(null); setActiveBrand(null); setActiveModel(null);
    setSearchTerm(""); setLocation("/products");
  };

  const hasActiveFilters = activeCategory || activeSubcategory || activeBrand || activeModel || searchTerm;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <button onClick={() => setLocation("/")} className="hover:text-[#E42933] transition-colors">Home</button>
              <ChevronRight size={14} />
              <button onClick={clearFilters} className="hover:text-[#E42933] transition-colors">Products</button>
              {activeCategory && <><ChevronRight size={14} /><span className="text-gray-900 font-medium">{activeCategory}</span></>}
              {activeSubcategory && <><ChevronRight size={14} /><span className="text-gray-900 font-medium">{activeSubcategory}</span></>}
              {activeBrand && <><ChevronRight size={14} /><span className="text-gray-900 font-medium">{activeBrand}</span></>}
              {activeModel && <><ChevronRight size={14} /><span className="text-gray-900 font-medium">{activeModel}</span></>}
              {searchTerm && <><ChevronRight size={14} /><span className="text-gray-900 font-medium">"{searchTerm}"</span></>}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* STEP: Category Selection */}
          {showCategoryStep && (
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Shop Auto Parts</h1>
              <p className="text-gray-500 mb-8">Select a category to browse parts</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.entries(CATEGORIES_WITH_SUBCATEGORIES).map(([cat, data]) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setLocation(`/products?category=${encodeURIComponent(cat)}`); }}
                    className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 hover:shadow-lg transition-all"
                  >
                    <img src={data.image} alt={cat} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-2xl mb-2 block">{data.icon}</span>
                      <p className="text-white font-bold text-sm leading-tight">{cat}</p>
                      <p className="text-[#E42933] text-xs font-semibold mt-1">{data.subcategories.length} types</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Also show brands */}
              <div className="mt-12">
                <h2 className="text-xl font-black text-gray-900 mb-6">Or Shop by Brand</h2>
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {BRANDS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => { setActiveBrand(brand); setLocation(`/products?brand=${encodeURIComponent(brand)}`); }}
                      className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col items-center gap-2 hover:border-[#E42933] hover:shadow-md transition-all"
                    >
                      <img src={`/assets/images/brands/${brand.toLowerCase().replace(/[^a-z]/g, "")}.png`} alt={brand}
                        className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span className="text-[10px] font-bold text-gray-500 text-center">{brand}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: Subcategory Selection */}
          {showSubcategoryStep && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{activeCategory}</h1>
                  <p className="text-gray-500 text-sm mt-1">Select a subcategory</p>
                </div>
                <button onClick={clearFilters} className="text-sm text-[#E42933] hover:underline flex items-center gap-1">
                  <X size={14} /> Clear
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {(CATEGORIES_WITH_SUBCATEGORIES[activeCategory!]?.subcategories || []).map(sub => (
                  <button
                    key={sub}
                    onClick={() => { setActiveSubcategory(sub); setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(sub)}`); }}
                    className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-[#E42933] hover:shadow-md transition-all group"
                  >
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-[#E42933] transition-colors">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Brand Selection */}
          {showBrandStep && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{activeSubcategory}</h1>
                  <p className="text-gray-500 text-sm mt-1">Select a vehicle brand</p>
                </div>
                <button onClick={clearFilters} className="text-sm text-[#E42933] hover:underline flex items-center gap-1">
                  <X size={14} /> Clear
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {BRANDS.map(brand => (
                  <button
                    key={brand}
                    onClick={() => { setActiveBrand(brand); setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(activeSubcategory!)}&brand=${encodeURIComponent(brand)}`); }}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-3 hover:border-[#E42933] hover:shadow-md transition-all group"
                  >
                    <img src={`/assets/images/brands/${brand.toLowerCase().replace(/[^a-z]/g, "")}.png`} alt={brand}
                      className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-[#E42933] text-center">{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Model Selection */}
          {showModelStep && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{activeBrand} {activeSubcategory}</h1>
                  <p className="text-gray-500 text-sm mt-1">Select your vehicle model</p>
                </div>
                <button onClick={clearFilters} className="text-sm text-[#E42933] hover:underline flex items-center gap-1">
                  <X size={14} /> Clear
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(VEHICLE_MODELS[activeBrand!] || []).map(model => (
                  <button
                    key={model.name}
                    onClick={() => { setActiveModel(model.name); setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(activeSubcategory!)}&brand=${encodeURIComponent(activeBrand!)}&model=${encodeURIComponent(model.name)}`); }}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#E42933] hover:shadow-md transition-all"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img src={model.img} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=400"; }} />
                    </div>
                    <div className="p-3 text-center">
                      <span className="text-sm font-bold text-gray-800 group-hover:text-[#E42933] transition-colors">{model.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS LISTING */}
          {!showCategoryStep && !showSubcategoryStep && !showBrandStep && !showModelStep && (
            <div className="flex gap-6">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#E42933]" /> Filters
                  </h3>

                  {/* Price Range */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <input type="range" min="0" max="200000" step="1000" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-full" />
                      <input type="range" min="0" max="200000" step="1000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full" />
                      <div className="text-xs text-gray-600 mt-2">KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">
                      {searchTerm ? `Search: "${searchTerm}"` : `${activeModel || activeBrand || activeSubcategory || activeCategory || "All Products"}`}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{sortedProducts.length} products found</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="default">Sort by</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Name</option>
                      <option value="newest">Newest</option>
                    </select>
                    <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
                      <button onClick={() => setViewMode("grid")} className={`p-2 rounded ${viewMode === "grid" ? "bg-[#E42933] text-white" : "text-gray-600"}`}>
                        <Grid size={16} />
                      </button>
                      <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-[#E42933] text-white" : "text-gray-600"}`}>
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {loadingProducts ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin">
                      <Zap className="text-[#E42933]" size={32} />
                    </div>
                    <p className="text-gray-500 mt-2">Loading products...</p>
                  </div>
                ) : pageItems.length > 0 ? (
                  <>
                    <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" : "space-y-3"}>
                      {pageItems.map((product) => (
                        <div key={product.id} className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E42933]/30 transition-all group ${viewMode === "list" ? "flex" : ""}`}>
                          <div className={`relative bg-gray-50 overflow-hidden ${viewMode === "list" ? "w-32 h-32" : "aspect-square"}`}>
                            <img src={product.images?.[0] || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400"; }} />
                            {product.comparePrice && product.price < product.comparePrice && (
                              <span className="absolute top-2 left-2 bg-[#E42933] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                              </span>
                            )}
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                              </div>
                            )}
                          </div>
                          <div className={`p-3 flex-1 flex flex-col ${viewMode === "list" ? "" : ""}`}>
                            <p className="text-xs text-gray-500 mb-1">{product.brand} • {product.model}</p>
                            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                            <div className="flex items-center justify-between mt-auto">
                              <div>
                                <p className="text-lg font-black text-[#E42933]">KES {product.price.toLocaleString()}</p>
                                {product.comparePrice && <p className="text-xs text-gray-400 line-through">KES {product.comparePrice.toLocaleString()}</p>}
                              </div>
                              <button onClick={() => handleAddToCart(product)} disabled={product.stock === 0} className={`p-2 rounded-lg transition-all ${addedToCart === product.id ? "bg-green-500 text-white" : product.stock === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#E42933]/10 text-[#E42933] hover:bg-[#E42933] hover:text-white"}`}>
                                {addedToCart === product.id ? <Check size={16} /> : <ShoppingCart size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <button key={p} onClick={() => setPage(p)} className={`px-3 py-2 rounded-lg font-semibold transition-all ${page === p ? "bg-[#E42933] text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-[#E42933]"}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Package size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products found</p>
                    <button onClick={clearFilters} className="text-[#E42933] hover:underline text-sm mt-2">Clear filters</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
