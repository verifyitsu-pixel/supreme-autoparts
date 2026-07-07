import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { FloatingButtons } from "@/components/Layout";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Search, X, ArrowRight, Car, CheckCircle2 } from "lucide-react";

const CATEGORIES_WITH_SUBCATEGORIES = {
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
};

// Helper function to generate products for any model
const generateProductsForModel = (brand: string, model: string, category: string, subcategory: string) => {
  const baseProducts = [
    { name: `${brand} ${model} ${subcategory} - Premium OEM`, price: "KES 15,500", img: "/assets/images/parts/braking/bmw_brembo_disc.jpg", condition: "New" },
    { name: `${brand} ${model} ${subcategory} - Standard Grade`, price: "KES 12,000", img: "/assets/images/real_parts/toyota_brake_pads.jpg", condition: "New" },
    { name: `${brand} ${model} ${subcategory} - Performance Edition`, price: "KES 18,500", img: "/assets/images/parts/braking/toyota_fielder_pads.webp", condition: "New" },
    { name: `${brand} ${model} ${subcategory} - Economy Option`, price: "KES 9,500", img: "/assets/images/products/toyota-oil-filter.jpg", condition: "New" },
    { name: `${brand} ${model} ${subcategory} - Heavy Duty`, price: "KES 22,000", img: "/assets/images/products/toyota-oil-filter-2.png", condition: "New" },
    { name: `${brand} ${model} ${subcategory} - Racing Grade`, price: "KES 28,000", img: "/assets/images/parts/braking/bmw_brembo_disc.jpg", condition: "New" },
  ];
  return baseProducts;
};

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addItem } = useCart();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const subcategory = params.get("subcategory");
    const brand = params.get("brand");
    const model = params.get("model");
    
    if (category) setActiveCategory(decodeURIComponent(category));
    if (subcategory) setActiveSubcategory(decodeURIComponent(subcategory));
    if (brand) setActiveBrand(decodeURIComponent(brand));
    if (model) setActiveModel(decodeURIComponent(model));
    
    setPage(1);
  }, [location]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setActiveSubcategory(null);
    setActiveBrand(null);
    setActiveModel(null);
    setLocation(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    setActiveBrand(null);
    setActiveModel(null);
    setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(subcategory)}`);
  };

  const handleBrandSelect = (brand: string) => {
    setActiveBrand(brand);
    setActiveModel(null);
    setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(activeSubcategory!)}&brand=${encodeURIComponent(brand)}`);
  };

  const handleModelSelect = (model: string) => {
    setActiveModel(model);
    setLocation(`/products?category=${encodeURIComponent(activeCategory!)}&subcategory=${encodeURIComponent(activeSubcategory!)}&brand=${encodeURIComponent(activeBrand!)}&model=${encodeURIComponent(model)}`);
  };

  const resetAll = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveBrand(null);
    setActiveModel(null);
    setLocation("/products");
  };

  const getProducts = () => {
    if (activeModel && activeSubcategory && activeCategory && activeBrand) {
      return generateProductsForModel(activeBrand, activeModel, activeCategory, activeSubcategory);
    }
    return [];
  };

  const products = getProducts()
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const pageItems = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddToCart = (product: any) => {
    addItem({
      id: `${activeModel}-${product.name}`,
      name: product.name,
      price: parseInt(product.price.replace(/[^0-9]/g, "")),
      image: product.img,
      quantity: 1,
      brand: activeBrand || "",
      model: activeModel || "",
      category: activeCategory || ""
    });
    setAddedToCart(`${activeModel}-${product.name}`);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Progress Header */}
        <div className="bg-gray-900 py-12 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${!activeCategory ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                  <span className="text-[10px] font-black">01</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
                </div>
                {activeCategory && (
                  <>
                    <div className="w-8 h-px bg-white/10" />
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeCategory && !activeSubcategory ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                      <span className="text-[10px] font-black">02</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Type</span>
                    </div>
                  </>
                )}
                {activeSubcategory && (
                  <>
                    <div className="w-8 h-px bg-white/10" />
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeSubcategory && !activeBrand ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                      <span className="text-[10px] font-black">03</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Brand</span>
                    </div>
                  </>
                )}
                {activeBrand && (
                  <>
                    <div className="w-8 h-px bg-white/10" />
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeBrand && !activeModel ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                      <span className="text-[10px] font-black">04</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Model</span>
                    </div>
                  </>
                )}
              </div>
              {(activeCategory || activeSubcategory || activeBrand || activeModel) && (
                <button onClick={resetAll} className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-widest hover:underline">
                  Reset Selection
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="py-16 min-h-[60vh]">
          <div className="max-w-[1280px] mx-auto px-6">
            {/* STEP 1: SELECT CATEGORY */}
            {!activeCategory && (
              <div className="animate-fadeIn">
                <div className="mb-12">
                  <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step One</p>
                  <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Select Part Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map(category => (
                    <button 
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="group bg-white border border-gray-100 p-8 flex flex-col items-center justify-center gap-4 hover:border-[oklch(0.45_0.22_27)] hover:shadow-2xl transition-all duration-500 rounded-sm"
                    >
                      <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full border border-gray-100 group-hover:bg-[oklch(0.45_0.22_27)] group-hover:text-white transition-all">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-900 text-center leading-tight group-hover:text-[oklch(0.45_0.22_27)]">{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT SUBCATEGORY */}
            {activeCategory && !activeSubcategory && (
              <div className="animate-fadeIn">
                <div className="mb-12 flex items-center justify-between">
                  <div>
                    <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step Two</p>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeCategory} Types</h2>
                  </div>
                  <button onClick={() => setActiveCategory(null)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {(CATEGORIES_WITH_SUBCATEGORIES[activeCategory as keyof typeof CATEGORIES_WITH_SUBCATEGORIES] || []).map((subcategory: string) => (
                    <button 
                      key={subcategory}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className="group bg-white border border-gray-100 p-8 flex flex-col items-center justify-center gap-4 hover:border-[oklch(0.45_0.22_27)] hover:shadow-2xl transition-all duration-500 rounded-sm"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-900 text-center leading-tight group-hover:text-[oklch(0.45_0.22_27)]">{subcategory}</span>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-[oklch(0.45_0.22_27)] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: SELECT BRAND */}
            {activeCategory && activeSubcategory && !activeBrand && (
              <div className="animate-fadeIn">
                <div className="mb-12 flex items-center justify-between">
                  <div>
                    <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step Three</p>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Choose Brand</h2>
                  </div>
                  <button onClick={() => setActiveSubcategory(null)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Object.keys(VEHICLE_MODELS).map(brand => (
                    <button 
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className="group bg-white border border-gray-100 p-10 flex flex-col items-center justify-center gap-6 hover:border-[oklch(0.45_0.22_27)] hover:shadow-2xl transition-all duration-500 rounded-sm"
                    >
                      <img 
                        src={`/assets/images/brands/${brand.toLowerCase().replace(' ', '')}.png`} 
                        alt={brand} 
                        className="h-16 w-auto object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{brand}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: SELECT MODEL */}
            {activeCategory && activeSubcategory && activeBrand && !activeModel && (
              <div className="animate-fadeIn">
                <div className="mb-12 flex items-center justify-between">
                  <div>
                    <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step Four</p>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeBrand} Models</h2>
                  </div>
                  <button onClick={() => setActiveBrand(null)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {(VEHICLE_MODELS[activeBrand] || []).map(model => (
                    <button 
                      key={model.name}
                      onClick={() => handleModelSelect(model.name)}
                      className="group relative flex flex-col bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-[oklch(0.45_0.22_27)] hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="h-48 bg-gray-50 overflow-hidden">
                        {model.img ? (
                          <img src={model.img} alt={model.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Car className="text-gray-200" size={48} /></div>
                        )}
                      </div>
                      <div className="p-6 bg-white flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">{model.name}</span>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[oklch(0.45_0.22_27)] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: PRODUCTS GRID */}
            {activeCategory && activeSubcategory && activeBrand && activeModel && (
              <div className="animate-fadeIn">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Sidebar Info */}
                  <aside className="lg:w-80 shrink-0">
                    <div className="bg-gray-900 p-10 rounded-sm sticky top-32">
                      <div className="mb-10">
                        <h4 className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-[0.3em] mb-8">Current Selection</h4>
                        <div className="space-y-8">
                          <div>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Category</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black uppercase tracking-widest text-white">{activeCategory}</p>
                              <button onClick={() => setActiveCategory(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
                            </div>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Type</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black uppercase tracking-widest text-white">{activeSubcategory}</p>
                              <button onClick={() => setActiveSubcategory(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
                            </div>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Brand</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black uppercase tracking-widest text-white">{activeBrand}</p>
                              <button onClick={() => setActiveBrand(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
                            </div>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Model</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black uppercase tracking-widest text-white">{activeModel}</p>
                              <button onClick={() => setActiveModel(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-3 text-[oklch(0.45_0.22_27)]">
                          <CheckCircle2 size={16} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Verified Fitment</span>
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Results Grid */}
                  <div className="flex-1">
                    <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{pageItems.length} Products Found</h3>
                      <div className="relative w-full md:w-64">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.22_27)]"
                        />
                      </div>
                    </div>

                    {pageItems.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                          {pageItems.map((product, idx) => (
                            <div key={idx} className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500">
                              <div className="h-48 bg-gray-50 overflow-hidden relative">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-[oklch(0.45_0.22_27)] text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">
                                  {product.condition}
                                </div>
                              </div>
                              <div className="p-6">
                                <h4 className="text-sm font-black text-gray-900 mb-4 line-clamp-2">{product.name}</h4>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-2xl font-black text-[oklch(0.45_0.22_27)]">{product.price}</span>
                                </div>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className={`w-full py-3 px-4 rounded-sm text-xs font-black uppercase tracking-widest transition-all ${
                                    addedToCart === `${activeModel}-${product.name}`
                                      ? "bg-green-500 text-white"
                                      : "bg-[oklch(0.45_0.22_27)] text-white hover:scale-105"
                                  }`}
                                >
                                  {addedToCart === `${activeModel}-${product.name}` ? "✓ Added" : "Add to Cart"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center gap-2 mb-12">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                              <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 rounded-sm font-black text-xs uppercase tracking-widest transition-all ${
                                  page === p
                                    ? "bg-[oklch(0.45_0.22_27)] text-white"
                                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found for this selection.</p>
                        <button
                          onClick={() => handleModelSelect(activeModel)}
                          className="mt-6 text-[oklch(0.45_0.22_27)] font-black uppercase tracking-widest hover:underline"
                        >
                          Try another model
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
