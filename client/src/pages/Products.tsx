import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Search, Filter, X, ChevronRight } from "lucide-react";

const CATEGORIES = [
  "All Parts", "Alloys & Rims", "Brakes", "Electricals", "Engine Parts",
  "Gear Parts", "Lubricants", "Steering", "Suspension Parts", "Body Kits", "Windscreens", "Used Parts",
];

const VEHICLE_MODELS: Record<string, string[]> = {
  "Toyota": ["Fielder", "Premio", "Prado", "Hilux", "Vitz", "Land Cruiser", "Corolla", "Axio", "Probox", "Noah", "Voxy", "Harrier", "Rav4", "Hiace", "Wish"],
  "BMW": ["3 Series (E90/F30/G20)", "5 Series (F10/G30)", "7 Series", "X1", "X3", "X5", "X6", "1 Series", "2 Series", "M3", "M5"],
  "Mercedes-Benz": ["C-Class (W204/W205)", "E-Class (W212/W213)", "S-Class", "GLC", "GLE", "GLA", "G-Wagon", "CLA", "Vito", "Sprinter"],
  "Honda": ["Civic", "CR-V", "Fit", "Accord", "Insight", "Vezel", "Stream"],
  "Ford": ["Ranger", "Everest", "F-150", "Focus", "Fiesta", "Explorer"],
  "Hyundai": ["Tucson", "Santa Fe", "Elantra", "Accent", "Kona", "Sonata"],
  "Suzuki": ["Swift", "Vitara", "Jimny", "Alto", "Ertiga"],
  "Lexus": ["RX350", "NX200", "LX570", "IS250", "ES300", "GX460"],
  "Infiniti": ["Q50", "QX70", "QX80", "G37"],
  "Chevrolet": ["Cruze", "Captiva", "Trailblazer"],
  "Mopar": ["Jeep Grand Cherokee", "Jeep Wrangler", "Dodge Ram", "Chrysler 300C"],
};

const PRODUCTS = [
  // TOYOTA
  { name: "Toyota Genuine Brake Pads", category: "Brakes", brand: "Toyota", price: "KES 5,500", img: "/assets/images/products/toyota-brake-pads.jpg" },
  { name: "Toyota Air Filter", category: "Engine Parts", brand: "Toyota", price: "KES 1,800", img: "/assets/images/products/toyota-air-filter.jpg" },
  { name: "Toyota Oil Filter", category: "Engine Parts", brand: "Toyota", price: "KES 1,200", img: "/assets/images/products/toyota-oil-filter.jpg" },
  { name: "Toyota Hilux Carburetor", category: "Engine Parts", brand: "Toyota", price: "KES 18,000", img: "/assets/images/products/toyota-carburetor.jpg" },
  { name: "Toyota Fuse Box", category: "Electricals", brand: "Toyota", price: "KES 6,500", img: "/assets/images/products/toyota-fuse-box.jpg" },
  { name: "Toyota Starter Motor", category: "Engine Parts", brand: "Toyota", price: "KES 12,500", img: "/assets/images/products/toyota-starter-motor.jpg" },
  { name: "Toyota Front Windscreen", category: "Windscreens", brand: "Toyota", price: "KES 15,000", img: "/assets/images/products/toyota-windscreen.webp" },

  // BMW
  { name: "BMW Genuine Oil Filter Kit", category: "Engine Parts", brand: "BMW", price: "KES 3,500", img: "/assets/images/products/bmw-oil-filter.jpg" },
  { name: "BMW Railing Carrier Roof Rack", category: "Body Kits", brand: "BMW", price: "KES 45,000", img: "/assets/images/products/bmw-roof-rack.jpg" },
  { name: "BMW Camshaft N54", category: "Engine Parts", brand: "BMW", price: "KES 35,000", img: "/assets/images/products/bmw-camshaft.jpg" },
  { name: "BMW Front Lower Arm", category: "Suspension Parts", brand: "BMW", price: "KES 11,000", img: "/assets/images/products/bmw-front-lower-arm.jpg" },
  { name: "BMW Steering Rack", category: "Steering", brand: "BMW", price: "KES 35,000", img: "/assets/images/products/bmw-steering-rack.jpg" },
  { name: "BMW Water Pump", category: "Engine Parts", brand: "BMW", price: "KES 7,500", img: "/assets/images/products/bmw-water-pump.jpg" },
  { name: "BMW Headlight Level Sensor", category: "Electricals", brand: "BMW", price: "KES 8,500", img: "/assets/images/products/bmw-sensor.jpg" },

  // MERCEDES-BENZ
  { name: "Mercedes-Benz Shock Absorber", category: "Suspension Parts", brand: "Mercedes-Benz", price: "KES 14,500", img: "/assets/images/products/mercedes-shock-absorber.jpg" },
  { name: "Mercedes-Benz Brake Pads", category: "Brakes", brand: "Mercedes-Benz", price: "KES 5,500", img: "/assets/images/products/mercedes-brake-pads.jpg" },
  { name: "Mercedes Fuel Filter", category: "Engine Parts", brand: "Mercedes-Benz", price: "KES 2,000", img: "/assets/images/products/mercedes-fuel-filter.jpg" },
  { name: "Mercedes Front Bumper", category: "Body Kits", brand: "Mercedes-Benz", price: "KES 25,000", img: "/assets/images/products/mercedes-bumper.jpg" },

  // HONDA
  { name: "Honda Headlight Assembly", category: "Electricals", brand: "Honda", price: "KES 12,000", img: "/assets/images/products/honda-headlight.jpg" },

  // FORD
  { name: "Ford Ranger Radiator", category: "Engine Parts", brand: "Ford", price: "KES 16,000", img: "/assets/images/products/ford-radiator.jpg" },

  // HYUNDAI
  { name: "Hyundai Alternator", category: "Electricals", brand: "Hyundai", price: "KES 18,500", img: "/assets/images/products/hyundai-alternator.jpg" },

  // SUZUKI
  { name: "Suzuki Swift Clutch Kit", category: "Gear Parts", brand: "Suzuki", price: "KES 15,000", img: "/assets/images/products/suzuki-clutch-kit.jpg" },

  // LEXUS
  { name: "Lexus RX Alloy Rim", category: "Alloys & Rims", brand: "Lexus", price: "KES 45,000", img: "/assets/images/products/lexus-alloy-rim.jpg" },

  // INFINITI
  { name: "Infiniti Q50 Brake Pads", category: "Brakes", brand: "Infiniti", price: "KES 6,500", img: "/assets/images/products/infiniti-brake-pads.jpg" },

  // CHEVROLET
  { name: "Chevrolet Ignition Coil", category: "Electricals", brand: "Chevrolet", price: "KES 8,000", img: "/assets/images/products/chevrolet-ignition-coil.jpg" },

  // MOPAR (Jeep, Dodge, Chrysler)
  { name: "Mopar Oil Filter", category: "Engine Parts", brand: "Mopar", price: "KES 1,500", img: "/assets/images/products/mopar-oil-filter.jpg" },

  // UNIVERSAL / OTHER
  { name: "AC Blower Motor", category: "Electricals", brand: "Universal", price: "KES 8,500", img: "/assets/images/products/ac-blower-motor.jpg" },
  { name: "Antilock Braking System", category: "Brakes", brand: "Universal", price: "KES 15,000", img: "/assets/images/products/abs-module.jpg" },
  { name: "Turbocharger Kit", category: "Engine Parts", brand: "Universal", price: "KES 65,000", img: "/assets/images/products/turbocharger-kit.jpg" },
];

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All Parts");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");
  const [page, setPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState("");
  const [showModelPrompt, setShowModelPrompt] = useState<{product: any} | null>(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const category = params.get("category");
    
    if (brand) {
      setActiveBrand(brand);
      setPage(1);
    } else {
      setActiveBrand(null);
    }

    if (category) {
      setActiveCategory(category);
      setPage(1);
    } else {
      setActiveCategory("All Parts");
    }
  }, [location]);

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All Parts" || p.category === activeCategory)
    .filter((p) => !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase() || p.brand === "Universal")
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleOrderClick = (product: any) => {
    setShowModelPrompt({ product });
  };

  const handleModelConfirm = () => {
    if (showModelPrompt && selectedModel) {
      const { product } = showModelPrompt;
      const url = `/order?product=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&model=${encodeURIComponent(selectedModel)}&brand=${encodeURIComponent(product.brand)}`;
      setLocation(url);
    }
  };

  const clearBrandFilter = () => {
    setActiveBrand(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("brand");
    const newPath = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
    setLocation(newPath);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page Hero */}
        <div
          className="relative flex items-center justify-center"
          style={{
            minHeight: 280,
            background: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80') center/cover no-repeat",
          }}
        >
          <div className="text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {activeBrand ? `${activeBrand} Parts` : "Our Products"}
            </h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/products" className="hover:text-white">Products</Link>
              {activeBrand && (
                <>
                  <span className="mx-2">›</span>
                  <span className="text-white font-bold">{activeBrand}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <section className="py-12 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
            {/* Active Filters */}
            {activeBrand && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Filter:</span>
                <div className="bg-[oklch(0.45_0.22_27)] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                  Brand: {activeBrand}
                  <button onClick={clearBrandFilter} className="hover:text-gray-200">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <form className="flex-1 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm"
                />
                <button type="submit" className="btn-primary flex items-center gap-2 px-5">
                  <Search size={16} /> Search
                </button>
              </form>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Categories */}
              <aside className="w-full md:w-56 shrink-0">
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Filter size={14} /> Categories
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {CATEGORIES.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => handleCategoryChange(cat)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors ${
                            activeCategory === cat
                              ? "bg-[oklch(0.45_0.22_27)] text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-4">
                  Showing {pageItems.length} of {filtered.length} products
                  {activeCategory !== "All Parts" && ` in ${activeCategory}`}
                  {activeBrand && ` for ${activeBrand}`}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pageItems.map((product, idx) => (
                    <div
                      key={`${product.name}-${idx}`}
                      className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="overflow-hidden h-40 bg-gray-100">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] text-[oklch(0.45_0.22_27)] font-semibold uppercase tracking-wide">
                            {product.category}
                          </p>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">
                            {product.brand}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 leading-tight mb-2 h-10 overflow-hidden">{product.name}</h3>
                        <p className="text-sm font-bold text-[oklch(0.45_0.22_27)]">{product.price}</p>
                        <button
                          onClick={() => handleOrderClick(product)}
                          className="mt-2 text-xs font-bold uppercase tracking-wide text-[oklch(0.45_0.22_27)] hover:underline flex items-center gap-1"
                        >
                          Order Now →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <p className="text-lg font-semibold">No products found</p>
                    <p className="text-sm mt-1">Try a different search term or category</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 rounded-sm transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 text-sm font-semibold rounded-sm transition-colors ${
                          page === i + 1
                            ? "bg-[oklch(0.45_0.22_27)] text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 rounded-sm transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Model Selection Modal */}
        {showModelPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden">
              <div className="bg-gray-900 p-4 flex justify-between items-center">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">Select Your Vehicle Model</h3>
                <button onClick={() => setShowModelPrompt(null)} className="text-white hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Please select your <strong>{showModelPrompt.product.brand}</strong> model to ensure the <strong>{showModelPrompt.product.name}</strong> fits perfectly.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Vehicle Model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] rounded-sm bg-white"
                    >
                      <option value="">-- Select Model --</option>
                      {(VEHICLE_MODELS[showModelPrompt.product.brand] || []).map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                      <option value="Other">Other (Specify in form)</option>
                    </select>
                  </div>
                  <button
                    disabled={!selectedModel}
                    onClick={handleModelConfirm}
                    className="w-full btn-primary justify-center disabled:opacity-50"
                  >
                    CONTINUE TO ORDER <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
