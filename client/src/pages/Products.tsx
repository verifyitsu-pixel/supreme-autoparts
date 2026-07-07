import { useState, useEffect, useCallback } from "react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import {
  Search, X, ChevronRight, ChevronDown, Star, ShoppingCart, Heart,
  Filter, Grid, List, SlidersHorizontal, Check, Package, Zap
} from "lucide-react";

const CATEGORIES_WITH_SUBCATEGORIES: Record<string, string[]> = {
  "Braking Systems": ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"],
  "Engine Components": ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"],
  "Transmission & Gear": ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Flywheel"],
  "Steering Systems": ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"],
  "Suspension & Chassis": ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"],
  "Electrical & Sensors": ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"],
  "Alloys & Rims": ["Alloy Wheels", "Tire Sets", "Wheel Caps", "Lug Nuts", "Wheel Spacers"],
  "Lubricants & Fluids": ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"],
  "Body Kits & Styling": ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Body Panels"],
  "Glass & Windscreens": ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"],
  "Certified Used Parts": ["Used Engines", "Used Transmissions", "Used Alternators", "Used Starters", "Used Gearboxes"],
};

const VEHICLE_MODELS: Record<string, { name: string; img?: string }[]> = {
  "Toyota": [
    { name: "Fielder", img: "/assets/images/real_models/toyota_fielder.jpg" },
    { name: "Harrier", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Vitz", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Prado (J120/J150)", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Hilux (Vigo/Revo)", img: "/assets/images/real_models/toyota_hilux.jpg" },
    { name: "Land Cruiser (V8/300)", img: "/assets/images/real_models/toyota_landcruiser.jpg" },
    { name: "Corolla", img: "/assets/images/real_models/toyota_fielder.jpg" },
    { name: "Hiace", img: "/assets/images/real_models/toyota_hilux.jpg" },
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "/assets/images/real_models/bmw_3series.jpg" },
    { name: "5 Series (F10/G30)", img: "/assets/images/real_models/bmw_5series.jpg" },
    { name: "7 Series (F01/G11)", img: "/assets/images/real_models/bmw_5series.jpg" },
    { name: "X3 (F25/G01)", img: "/assets/images/real_models/bmw_3series.jpg" },
    { name: "X5 (E70/F15/G05)", img: "/assets/images/real_models/bmw_5series.jpg" },
  ],
  "Mercedes-Benz": [
    { name: "S550 (W221/W222)", img: "/assets/images/real_models/mercedes_sclass.jpg" },
    { name: "C-Class (W204/W205/W206)", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "E-Class (W212/W213)", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "GLC-Class", img: "/assets/images/real_models/mercedes_cclass.jpg" },
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "CR-V", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Accord", img: "/assets/images/real_models/toyota_vitz.jpg" },
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Everest", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Focus", img: "/assets/images/real_models/toyota_vitz.jpg" },
  ],
  "Hyundai": [
    { name: "Tucson", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Santa Fe", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Elantra", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "i10", img: "/assets/images/real_models/toyota_vitz.jpg" },
  ],
  "Suzuki": [
    { name: "Swift", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Vitara", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Jimny", img: "/assets/images/real_models/toyota_hilux.jpg" },
    { name: "Alto", img: "/assets/images/real_models/toyota_vitz.jpg" },
  ],
  "Lexus": [
    { name: "RX350", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "LX570", img: "/assets/images/real_models/toyota_landcruiser.jpg" },
    { name: "IS250", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "GX460", img: "/assets/images/real_models/toyota_prado.jpg" },
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setLocation(`/products?category=${encodeURIComponent(cat)}`); }}
                    className="group bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-3 hover:border-[#E42933] hover:shadow-md transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#E42933]/10 flex items-center justify-center group-hover:bg-[#E42933] transition-colors">
                      <Package size={22} className="text-[#E42933] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-[#E42933] transition-colors leading-tight">{cat}</span>
                    <span className="text-[10px] text-gray-400">{CATEGORIES_WITH_SUBCATEGORIES[cat].length} types</span>
                  </button>
                ))}
              </div>

              {/* Also show brands */}
              <div className="mt-10">
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
                {(CATEGORIES_WITH_SUBCATEGORIES[activeCategory!] || []).map(sub => (
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
                    {model.img && (
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img src={model.img} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
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

                  {/* Categories */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
                    <div className="space-y-1">
                      {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map(cat => (
                        <div key={cat}>
                          <button
                            onClick={() => { setExpandedCategory(expandedCategory === cat ? null : cat); setActiveCategory(cat); setActiveSubcategory(null); setLocation(`/products?category=${encodeURIComponent(cat)}`); }}
                            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${activeCategory === cat ? "bg-[#E42933]/10 text-[#E42933] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                          >
                            <span>{cat}</span>
                            {CATEGORIES_WITH_SUBCATEGORIES[cat] && <ChevronDown size={12} className={`transition-transform ${expandedCategory === cat ? "rotate-180" : ""}`} />}
                          </button>
                          {expandedCategory === cat && activeCategory === cat && (
                            <div className="ml-3 mt-1 space-y-0.5">
                              {CATEGORIES_WITH_SUBCATEGORIES[cat].map(sub => (
                                <button key={sub}
                                  onClick={() => { setActiveSubcategory(sub); setLocation(`/products?category=${encodeURIComponent(cat)}&subcategory=${encodeURIComponent(sub)}`); }}
                                  className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${activeSubcategory === sub ? "text-[#E42933] font-semibold" : "text-gray-500 hover:text-gray-800"}`}>
                                  {sub}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Brand</h4>
                    <div className="space-y-1">
                      {BRANDS.map(brand => (
                        <button key={brand}
                          onClick={() => { setActiveBrand(activeBrand === brand ? null : brand); }}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${activeBrand === brand ? "bg-[#E42933]/10 text-[#E42933] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                          {activeBrand === brand && <Check size={12} />}
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Condition</h4>
                    <div className="space-y-1">
                      {["New", "Refurbished", "Used"].map(cond => (
                        <label key={cond} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 px-2 py-1">
                          <input type="checkbox" className="rounded border-gray-300 text-[#E42933] focus:ring-[#E42933]" />
                          {cond}
                        </label>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="w-full text-sm text-[#E42933] border border-[#E42933] py-2 rounded-lg hover:bg-[#E42933] hover:text-white transition-colors font-medium">
                      Clear All Filters
                    </button>
                  )}
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFilterOpen(!filterOpen)} className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                      <Filter size={15} /> Filters
                    </button>
                    <p className="text-sm text-gray-500">
                      {loadingProducts ? "Loading..." : <><span className="font-bold text-gray-900">{sortedProducts.length}</span> products found</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E42933] bg-white"
                    >
                      <option value="default">Sort: Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Name: A-Z</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                      <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#E42933] text-white" : "text-gray-400 hover:text-gray-700"}`}>
                        <Grid size={15} />
                      </button>
                      <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-[#E42933] text-white" : "text-gray-400 hover:text-gray-700"}`}>
                        <List size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Drawer */}
                {filterOpen && (
                  <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Filters</h3>
                      <button onClick={() => setFilterOpen(false)}><X size={18} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</h4>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map(cat => (
                            <button key={cat}
                              onClick={() => { setActiveCategory(cat); setLocation(`/products?category=${encodeURIComponent(cat)}`); setFilterOpen(false); }}
                              className={`block w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${activeCategory === cat ? "text-[#E42933] font-semibold" : "text-gray-600"}`}>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Brand</h4>
                        <div className="space-y-1">
                          {BRANDS.map(brand => (
                            <button key={brand}
                              onClick={() => { setActiveBrand(activeBrand === brand ? null : brand); setFilterOpen(false); }}
                              className={`block w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${activeBrand === brand ? "text-[#E42933] font-semibold" : "text-gray-600"}`}>
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="mt-4 w-full text-sm text-[#E42933] border border-[#E42933] py-2 rounded-lg">
                        Clear All Filters
                      </button>
                    )}
                  </div>
                )}

                {/* Loading */}
                {loadingProducts && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200"></div>
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loadingProducts && pageItems.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      {searchTerm ? `No results for "${searchTerm}"` : "No products match your current filters."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={clearFilters} className="bg-[#E42933] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#c41f28] transition-colors">
                        Browse All Parts
                      </button>
                      <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
                        className="border border-green-500 text-green-600 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                        💬 Request Part via WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                {!loadingProducts && pageItems.length > 0 && (
                  <>
                    <div className={viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                      : "space-y-3"}>
                      {pageItems.map((product) => (
                        viewMode === "grid"
                          ? <ProductGridCard key={product.id} product={product} onAddToCart={handleAddToCart} addedToCart={addedToCart} />
                          : <ProductListCard key={product.id} product={product} onAddToCart={handleAddToCart} addedToCart={addedToCart} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const p = page <= 3 ? i + 1 : page - 2 + i;
                          if (p < 1 || p > totalPages) return null;
                          return (
                            <button key={p} onClick={() => setPage(p)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-[#E42933] text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                              {p}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
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

function ProductGridCard({ product, onAddToCart, addedToCart }: { product: any; onAddToCart: (p: any) => void; addedToCart: string | null }) {
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const isAdded = addedToCart === product.id;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E42933]/30 transition-all flex flex-col">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.images?.[0] || "/assets/images/products/toyota-brake-pads.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/products/toyota-brake-pads.jpg"; }}
        />
        {discount > 0 && <span className="absolute top-2 left-2 bg-[#E42933] text-white text-[10px] font-bold px-2 py-0.5 rounded">-{discount}%</span>}
        {isOutOfStock && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span></div>}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E42933] hover:text-white">
          <Heart size={14} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-[#E42933] transition-colors flex-1">
          {product.name}
        </p>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
          <span className="text-[10px] text-gray-400 ml-1">(24)</span>
        </div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-base font-black text-[#E42933]">KES {product.price.toLocaleString()}</p>
            {product.comparePrice && <p className="text-xs text-gray-400 line-through">KES {product.comparePrice.toLocaleString()}</p>}
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.condition === "New" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {product.condition}
          </span>
        </div>
        <button
          onClick={() => !isOutOfStock && onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            isAdded ? "bg-green-500 text-white" :
            isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
            "bg-[#E42933] hover:bg-[#c41f28] text-white"
          }`}
        >
          {isAdded ? <><Check size={14} /> Added!</> : isOutOfStock ? "Out of Stock" : <><ShoppingCart size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}

function ProductListCard({ product, onAddToCart, addedToCart }: { product: any; onAddToCart: (p: any) => void; addedToCart: string | null }) {
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const isAdded = addedToCart === product.id;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#E42933]/30 transition-all flex">
      <div className="relative w-32 sm:w-48 flex-shrink-0 bg-gray-50 overflow-hidden">
        <img
          src={product.images?.[0] || "/assets/images/products/toyota-brake-pads.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/products/toyota-brake-pads.jpg"; }}
        />
        {discount > 0 && <span className="absolute top-2 left-2 bg-[#E42933] text-white text-[10px] font-bold px-2 py-0.5 rounded">-{discount}%</span>}
      </div>
      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{product.brand} • {product.category}</p>
          <p className="text-sm md:text-base font-bold text-gray-900 mb-2 group-hover:text-[#E42933] transition-colors">{product.name}</p>
          {product.partNumber && <p className="text-xs text-gray-400 mb-2">Part #: {product.partNumber}</p>}
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
            <span className="text-[10px] text-gray-400 ml-1">(24)</span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3">
          <div>
            <p className="text-xl font-black text-[#E42933]">KES {product.price.toLocaleString()}</p>
            {product.comparePrice && <p className="text-xs text-gray-400 line-through">KES {product.comparePrice.toLocaleString()}</p>}
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.condition === "New" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {product.condition}
          </span>
          <button
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              isAdded ? "bg-green-500 text-white" :
              isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
              "bg-[#E42933] hover:bg-[#c41f28] text-white"
            }`}
          >
            {isAdded ? <><Check size={14} /> Added!</> : isOutOfStock ? "Out of Stock" : <><ShoppingCart size={14} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}
