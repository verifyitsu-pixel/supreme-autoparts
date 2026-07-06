import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Search, Filter, X, ChevronRight, ShieldCheck, Truck, Clock } from "lucide-react";

const CATEGORIES = [
  "All Components", "Alloys & Rims", "Braking Systems", "Electrical & Sensors", "Engine Components",
  "Transmission & Gear", "Lubricants & Fluids", "Steering Systems", "Suspension & Chassis", "Body Kits & Styling", "Glass & Windscreens", "Certified Used Parts",
];

const VEHICLE_MODELS: Record<string, string[]> = {
  "Toyota": ["Fielder", "Premio", "Prado (J120/J150)", "Hilux (Vigo/Revo)", "Vitz", "Land Cruiser (V8/300)", "Corolla", "Axio", "Probox", "Noah/Voxy", "Harrier", "Rav4", "Hiace", "Wish"],
  "BMW": ["3 Series (E90/F30/G20)", "5 Series (F10/G30)", "7 Series (F01/G11)", "X1 (E84/F48)", "X3 (F25/G01)", "X5 (E70/F15/G05)", "X6", "1 Series", "M3/M4/M5 Performance"],
  "Mercedes-Benz": ["C-Class (W204/W205/W206)", "E-Class (W212/W213)", "S-Class (W221/W222)", "GLC-Class", "GLE-Class", "GLA-Class", "G-Wagon", "CLA-Class", "Vito/V-Class", "Sprinter"],
  "Honda": ["Civic (FD/FB/FC)", "CR-V", "Fit/Jazz", "Accord", "Insight", "Vezel/HR-V", "Stream"],
  "Ford": ["Ranger (T6/T7/T8)", "Everest", "F-150 Raptor", "Focus", "Fiesta", "Explorer"],
  "Hyundai": ["Tucson", "Santa Fe", "Elantra", "Accent", "Kona", "Sonata"],
  "Suzuki": ["Swift", "Vitara", "Jimny", "Alto", "Ertiga"],
  "Lexus": ["RX350/RX450h", "NX200t/NX300", "LX570/LX600", "IS250/IS300", "ES300h", "GX460"],
  "Infiniti": ["Q50", "QX70", "QX80", "G37"],
  "Chevrolet": ["Cruze", "Captiva", "Trailblazer"],
  "Mopar": ["Jeep Grand Cherokee", "Jeep Wrangler (JK/JL)", "Dodge Ram 1500", "Chrysler 300C"],
};

const PRODUCTS = [
  // TOYOTA
  { name: "Toyota Genuine Brake Pads (Front Set)", category: "Braking Systems", brand: "Toyota", price: "KES 5,500", img: "/assets/images/products/toyota-brake-pads.jpg", condition: "New" },
  { name: "Toyota OEM Air Filter Element", category: "Engine Components", brand: "Toyota", price: "KES 1,800", img: "/assets/images/products/toyota-air-filter.jpg", condition: "New" },
  { name: "Toyota Genuine Oil Filter (Spin-on)", category: "Engine Components", brand: "Toyota", price: "KES 1,200", img: "/assets/images/products/toyota-oil-filter.jpg", condition: "New" },
  { name: "Toyota Hilux/Land Cruiser Carburetor Assembly", category: "Engine Components", brand: "Toyota", price: "KES 18,000", img: "/assets/images/products/toyota-carburetor.jpg", condition: "New" },
  { name: "Toyota Laminated Front Windscreen (OEM)", category: "Glass & Windscreens", brand: "Toyota", price: "KES 15,000", img: "/assets/images/products/toyota-windscreen.webp", condition: "New" },

  // BMW
  { name: "BMW Genuine Oil Filter Kit (N20/N54/N55)", category: "Engine Components", brand: "BMW", price: "KES 3,500", img: "/assets/images/products/bmw-oil-filter.jpg", condition: "New" },
  { name: "BMW OEM Railing Carrier Roof Rack System", category: "Body Kits & Styling", brand: "BMW", price: "KES 45,000", img: "/assets/images/products/bmw-roof-rack.jpg", condition: "New" },
  { name: "BMW Performance Camshaft (N54 Twin Turbo)", category: "Engine Components", brand: "BMW", price: "KES 35,000", img: "/assets/images/products/bmw-camshaft.jpg", condition: "New" },
  { name: "BMW Electronic Steering Rack Assembly", category: "Steering Systems", brand: "BMW", price: "KES 35,000", img: "/assets/images/products/bmw-steering-rack.jpg", condition: "Certified Used" },
  { name: "BMW Headlight Auto-Leveling Sensor", category: "Electrical & Sensors", brand: "BMW", price: "KES 8,500", img: "/assets/images/products/bmw-sensor.jpg", condition: "New" },

  // MERCEDES-BENZ
  { name: "Mercedes-Benz Bilstein Shock Absorber (Rear)", category: "Suspension & Chassis", brand: "Mercedes-Benz", price: "KES 14,500", img: "/assets/images/products/mercedes-shock-absorber.jpg", condition: "New" },
  { name: "Mercedes-Benz Ceramic Brake Pads (W205/W213)", category: "Braking Systems", brand: "Mercedes-Benz", price: "KES 5,500", img: "/assets/images/products/mercedes-brake-pads.jpg", condition: "New" },
  { name: "Mercedes-Benz High-Pressure Fuel Filter", category: "Engine Components", brand: "Mercedes-Benz", price: "KES 2,000", img: "/assets/images/products/mercedes-fuel-filter.jpg", condition: "New" },
  { name: "Mercedes-Benz AMG Styling Front Bumper", category: "Body Kits & Styling", brand: "Mercedes-Benz", price: "KES 25,000", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New" },

  // OTHERS
  { name: "Honda Civic LED Headlight Assembly", category: "Electrical & Sensors", brand: "Honda", price: "KES 12,000", img: "/assets/images/products/honda-headlight.jpg", condition: "New" },
  { name: "Ford Ranger T6 Heavy Duty Radiator", category: "Engine Components", brand: "Ford", price: "KES 16,000", img: "/assets/images/products/ford-radiator.jpg", condition: "New" },
  { name: "Hyundai Santa Fe High-Output Alternator", category: "Electrical & Sensors", brand: "Hyundai", price: "KES 18,500", img: "/assets/images/products/hyundai-alternator.jpg", condition: "New" },
  { name: "Suzuki Swift Exedy Clutch Kit", category: "Transmission & Gear", brand: "Suzuki", price: "KES 15,000", img: "/assets/images/products/suzuki-clutch-kit.jpg", condition: "New" },
  { name: "Lexus RX Series 18\" Machine-Face Alloy Rim", category: "Alloys & Rims", brand: "Lexus", price: "KES 45,000", img: "/assets/images/products/lexus-alloy-rim.jpg", condition: "New" },
  { name: "Infiniti Q50 Akebono Brake Pads", category: "Braking Systems", brand: "Infiniti", price: "KES 6,500", img: "/assets/images/products/infiniti-brake-pads.jpg", condition: "New" },
  { name: "Chevrolet Cruze Ignition Coil Pack", category: "Electrical & Sensors", brand: "Chevrolet", price: "KES 8,000", img: "/assets/images/products/chevrolet-ignition-coil.jpg", condition: "New" },
  { name: "Mopar Heavy Duty Oil Filter (Jeep/Dodge)", category: "Engine Components", brand: "Mopar", price: "KES 1,500", img: "/assets/images/products/mopar-oil-filter.jpg", condition: "New" },
];

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All Components");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState("");
  const [showModelPrompt, setShowModelPrompt] = useState<{product: any} | null>(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const category = params.get("category");
    
    if (brand) setActiveBrand(brand);
    else setActiveBrand(null);

    if (category) setActiveCategory(category);
    else setActiveCategory("All Components");
    
    setPage(1);
  }, [location]);

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All Components" || p.category === activeCategory)
    .filter((p) => !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase() || p.brand === "Universal")
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gray-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[oklch(0.45_0.22_27)] opacity-10 skew-x-12 translate-x-1/4" />
          <div className="max-w-[1280px] mx-auto px-6 relative z-10">
            <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-4">Professional Parts Catalog</p>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {activeBrand ? `${activeBrand} Specialized Parts` : "Automotive Components"}
            </h1>
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-[oklch(0.45_0.22_27)]" /> Genuine Guaranteed
              </div>
              <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <Truck size={14} className="text-[oklch(0.45_0.22_27)]" /> Nationwide Delivery
              </div>
              <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <Clock size={14} className="text-[oklch(0.45_0.22_27)]" /> Expert Support
              </div>
            </div>
          </div>
        </div>

        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-72 shrink-0">
                <div className="sticky top-28 space-y-10">
                  {/* Search */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-4 border-l-2 border-[oklch(0.45_0.22_27)] pl-4">Search Catalog</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Part name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors"
                      />
                      <Search className="absolute right-0 top-3 text-gray-400" size={18} />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-4 border-l-2 border-[oklch(0.45_0.22_27)] pl-4">System Categories</h3>
                    <ul className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <li key={cat}>
                          <button
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-all ${
                              activeCategory === cat
                                ? "bg-[oklch(0.45_0.22_27)] text-white shadow-lg shadow-red-900/10"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>

              {/* Products List */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Found <span className="text-gray-900">{filtered.length}</span> Components
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
                    >
                      <option value="name">Alphabetical</option>
                      <option value="price">Price Point</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {pageItems.map((product, idx) => (
                    <div
                      key={idx}
                      className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative h-56 overflow-hidden bg-gray-50">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-white/90 backdrop-blur-sm text-[8px] font-black px-2 py-1 rounded-sm text-gray-900 uppercase tracking-widest shadow-sm">
                            {product.brand}
                          </span>
                          <span className={`text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm ${
                            product.condition === "New" ? "bg-green-600 text-white" : "bg-orange-500 text-white"
                          }`}>
                            {product.condition}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-[9px] text-[oklch(0.45_0.22_27)] font-black uppercase tracking-[0.2em] mb-2">{product.category}</p>
                        <h3 className="text-base font-bold text-gray-900 leading-tight mb-4 h-12 overflow-hidden group-hover:text-[oklch(0.45_0.22_27)] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price Guide</p>
                            <p className="text-lg font-black text-gray-900">{product.price}</p>
                          </div>
                          <button
                            onClick={() => handleOrderClick(product)}
                            className="bg-gray-900 text-white p-3 rounded-sm hover:bg-[oklch(0.45_0.22_27)] transition-all shadow-lg"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-20">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-12 h-12 text-xs font-black rounded-sm transition-all ${
                          page === i + 1
                            ? "bg-[oklch(0.45_0.22_27)] text-white shadow-lg shadow-red-900/20"
                            : "border border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900"
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Model Selection Modal */}
        {showModelPrompt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden relative">
              <div className="bg-gray-900 p-8">
                <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Vehicle Verification</p>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Confirm Fitment</h3>
                <button onClick={() => setShowModelPrompt(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10">
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                  To ensure the <strong>{showModelPrompt.product.name}</strong> fits your <strong>{showModelPrompt.product.brand}</strong>, please select your specific vehicle model below.
                </p>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Chassis / Model Series</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full border-b border-gray-200 py-4 text-sm font-bold focus:outline-none focus:border-[oklch(0.45_0.22_27)] transition-colors bg-white cursor-pointer"
                    >
                      <option value="">-- Select Vehicle Model --</option>
                      {(VEHICLE_MODELS[showModelPrompt.product.brand] || []).map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                      <option value="Other">Other (Manual Specification)</option>
                    </select>
                  </div>
                  <button
                    disabled={!selectedModel}
                    onClick={handleModelConfirm}
                    className="w-full btn-primary justify-center py-5 tracking-[0.3em] disabled:opacity-30 disabled:grayscale"
                  >
                    CONTINUE TO ORDER <ChevronRight size={18} />
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
