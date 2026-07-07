import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import {
  Search, X, ChevronRight, ChevronDown, Star, ShoppingCart, Heart,
  Filter, Grid, List, SlidersHorizontal, Check, Package, Zap
} from "lucide-react";

const CATEGORIES_WITH_SUBCATEGORIES: Record<string, { subcategories: string[]; icon: string; image: string }> = {
  "Braking Systems": { 
    subcategories: ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"], 
    icon: "🛑", 
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&h=600&fit=crop" 
  },
  "Engine Components": { 
    subcategories: ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"], 
    icon: "⚙️", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&h=600&fit=crop" 
  },
  "Transmission & Gear": { 
    subcategories: ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Gearbox"], 
    icon: "🔧", 
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&h=600&fit=crop" 
  },
  "Steering Systems": { 
    subcategories: ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"], 
    icon: "🎯", 
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&h=600&fit=crop" 
  },
  "Suspension & Chassis": { 
    subcategories: ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"], 
    icon: "🚗", 
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&h=600&fit=crop" 
  },
  "Electrical & Sensors": { 
    subcategories: ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"], 
    icon: "⚡", 
    image: "https://images.unsplash.com/photo-1552338804-c6d7a91ff430?q=80&w=1200&h=600&fit=crop" 
  },
  "Alloys & Rims": { 
    subcategories: ["Alloy Wheels", "Tire Sets", "Wheel Caps", "Lug Nuts", "Wheel Spacers"], 
    icon: "🔵", 
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=1200&h=600&fit=crop" 
  },
  "Lubricants & Fluids": { 
    subcategories: ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"], 
    icon: "🛢️", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&h=600&fit=crop" 
  },
  "Body Kits & Styling": { 
    subcategories: ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Headlights"], 
    icon: "🎨", 
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&h=600&fit=crop" 
  },
  "Glass & Windscreens": { 
    subcategories: ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"], 
    icon: "🪟", 
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&h=600&fit=crop" 
  },
};

const VEHICLE_MODELS: Record<string, { name: string; img: string }[]> = {
  "Toyota": [
    { name: "Hilux (Vigo/Revo)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Fielder", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "Vitz", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
    { name: "Corolla", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
    { name: "Prado (J120/J150)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Land Cruiser (V8/300)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Harrier", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Hiace", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "5 Series (F10/G30)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "7 Series (F01/G11)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "X3 (F25/G01)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "X5 (E70/F15/G05)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
  ],
  "Mercedes-Benz": [
    { name: "C-Class (W204/W205/W206)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "S550 (W221/W222)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "E-Class (W212/W213)", img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=800" },
    { name: "GLC-Class", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
    { name: "CR-V", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Accord", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Everest", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Focus", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
  ],
  "Hyundai": [
    { name: "Tucson", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Santa Fe", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Elantra", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
    { name: "i10", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
  ],
  "Suzuki": [
    { name: "Swift", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
    { name: "Vitara", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Jimny", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "Alto", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
  ],
  "Lexus": [
    { name: "RX350", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "LX570", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
    { name: "IS250", img: "https://images.unsplash.com/photo-1552821206-e896f6b9f2e1?q=80&w=800" },
    { name: "GX460", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800" },
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
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
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {showCategoryStep && (
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Shop Auto Parts</h1>
              <p className="text-gray-500 mb-8">Select a category to browse parts</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.entries(CATEGORIES_WITH_SUBCATEGORIES).map(([cat, data]) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setLocation(`/products?category=${encodeURIComponent(cat)}`); }}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 hover:shadow-2xl transition-all duration-500"
                  >
                    <img src={data.image} alt={cat} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-[#E42933] transition-colors duration-300">
                        <span className="text-xl">{data.icon}</span>
                      </div>
                      <p className="text-white font-black text-lg leading-tight uppercase tracking-tighter">{cat}</p>
                      <p className="text-[#E42933] text-xs font-bold mt-1 uppercase">{data.subcategories.length} Types Available</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSubcategoryStep && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{activeCategory}</h1>
                  <p className="text-gray-500 text-sm mt-1">Select a specific part type</p>
                </div>
                <button onClick={clearFilters} className="text-sm font-bold text-[#E42933] hover:underline flex items-center gap-1 uppercase">
                  <X size={14} /> Reset
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {(CATEGORIES_WITH_SUBCATEGORIES[activeCategory!]?.subcategories || []).map(sub => (
                  <button
                    key={sub}
                    onClick={() => { setActiveSubcategory(sub); setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(sub)}`); }}
                    className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center hover:border-[#E42933] hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E42933] transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                    <span className="text-sm font-black text-gray-900 group-hover:text-[#E42933] transition-colors uppercase tracking-tight">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showBrandStep && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{activeSubcategory}</h1>
                  <p className="text-gray-500 text-sm mt-1">Select vehicle manufacturer</p>
                </div>
                <button onClick={clearFilters} className="text-sm font-bold text-[#E42933] hover:underline flex items-center gap-1 uppercase">
                  <X size={14} /> Reset
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {BRANDS.map(brand => (
                  <button
                    key={brand}
                    onClick={() => { setActiveBrand(brand); setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(activeSubcategory!)}&brand=${encodeURIComponent(brand)}`); }}
                    className="bg-white rounded-2xl border-2 border-gray-100 p-5 flex flex-col items-center gap-4 hover:border-[#E42933] hover:shadow-xl transition-all group"
                  >
                    <img src={`/assets/images/brands/${brand.toLowerCase().replace(/[^a-z]/g, "")}.png`} alt={brand}
                      className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span className="text-xs font-black text-gray-900 group-hover:text-[#E42933] text-center uppercase tracking-tighter">{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showModelStep && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{activeBrand} {activeSubcategory}</h1>
                  <p className="text-gray-500 text-sm mt-1">Select your exact vehicle model</p>
                </div>
                <button onClick={clearFilters} className="text-sm font-bold text-[#E42933] hover:underline flex items-center gap-1 uppercase">
                  <X size={14} /> Reset
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {(VEHICLE_MODELS[activeBrand!] || []).map(model => (
                  <button
                    key={model.name}
                    onClick={() => { setActiveModel(model.name); setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(activeSubcategory!)}&brand=${encodeURIComponent(activeBrand!)}&model=${encodeURIComponent(model.name)}`); }}
                    className="group bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:border-[#E42933] hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                      <img src={model.img} alt={model.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-5 text-center bg-white">
                      <span className="text-sm font-black text-gray-900 group-hover:text-[#E42933] transition-colors uppercase tracking-tight">{model.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showCategoryStep && !showSubcategoryStep && !showBrandStep && !showModelStep && (
            <div className="flex gap-8">
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 sticky top-24 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                    <SlidersHorizontal size={18} className="text-[#E42933]" /> Filters
                  </h3>
                  <div className="mb-8">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Price Range</h4>
                    <div className="space-y-4">
                      <input type="range" min="0" max="200000" step="1000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-[#E42933]" />
                      <div className="flex justify-between text-xs font-bold text-gray-900">
                        <span>KES {priceRange[0].toLocaleString()}</span>
                        <span>KES {priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                      {searchTerm ? `Search: "${searchTerm}"` : `${activeModel || activeBrand || activeSubcategory || activeCategory || "All Products"}`}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">{sortedProducts.length} Results Found</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:border-[#E42933] outline-none transition-all">
                      <option value="default">Sort by: Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Name: A-Z</option>
                    </select>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                      <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-[#E42933] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                        <Grid size={18} />
                      </button>
                      <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#E42933] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {loadingProducts ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-[#E42933] rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Inventory...</p>
                  </div>
                ) : pageItems.length > 0 ? (
                  <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                    {pageItems.map((product) => (
                      <div key={product.id} className={`bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#E42933]/20 transition-all duration-500 group ${viewMode === "list" ? "flex h-48" : ""}`}>
                        <div className={`relative bg-gray-50 overflow-hidden ${viewMode === "list" ? "w-48" : "aspect-square"}`}>
                          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          {product.comparePrice && product.price < product.comparePrice && (
                            <span className="absolute top-4 left-4 bg-[#E42933] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">Save {Math.round((1 - product.price / product.comparePrice) * 100)}%</span>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <p className="text-[10px] font-black text-[#E42933] uppercase tracking-widest mb-2">{product.brand} • {product.model}</p>
                          <h3 className="text-sm font-black text-gray-900 mb-3 line-clamp-2 uppercase tracking-tight group-hover:text-[#E42933] transition-colors">{product.name}</h3>
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              <p className="text-lg font-black text-gray-900">KES {product.price.toLocaleString()}</p>
                              {product.comparePrice && <p className="text-xs text-gray-400 line-through font-bold">KES {product.comparePrice.toLocaleString()}</p>}
                            </div>
                            <button onClick={() => handleAddToCart(product)} disabled={product.stock === 0} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${addedToCart === product.id ? "bg-green-500 text-white" : product.stock === 0 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-[#E42933] shadow-lg shadow-gray-200 hover:shadow-[#E42933]/30"}`}>
                              {addedToCart === product.id ? <Check size={18} /> : <ShoppingCart size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <Package size={64} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-900 font-black uppercase tracking-tighter text-xl">No Parts Found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
                    <button onClick={clearFilters} className="mt-6 px-8 py-3 bg-[#E42933] text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors">Clear All Filters</button>
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
