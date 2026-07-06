import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Search, Filter, X, ChevronRight, ShieldCheck, Truck, Clock, Car, Settings2, ArrowRight } from "lucide-react";

const CATEGORIES = [
  "All Components", "Alloys & Rims", "Braking Systems", "Electrical & Sensors", "Engine Components",
  "Transmission & Gear", "Lubricants & Fluids", "Steering Systems", "Suspension & Chassis", "Body Kits & Styling", "Glass & Windscreens", "Certified Used Parts",
];

const VEHICLE_MODELS: Record<string, { name: string; img?: string }[]> = {
  "Toyota": [
    { name: "Fielder", img: "/assets/images/models/fielder.jpg" },
    { name: "Harrier", img: "/assets/images/models/harrier.png" },
    { name: "Vitz", img: "/assets/images/models/vitz.jpg" },
    { name: "Prado (J120/J150)", img: "/assets/images/models/prado.jpg" },
    { name: "Premio" },
    { name: "Hilux (Vigo/Revo)" },
    { name: "Land Cruiser (V8/300)" },
    { name: "Corolla" },
    { name: "Axio" },
    { name: "Probox" },
    { name: "Noah/Voxy" },
    { name: "Rav4" },
    { name: "Hiace" },
    { name: "Wish" }
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "/assets/images/models/bmw3.jpg" },
    { name: "5 Series (F10/G30)" },
    { name: "7 Series (F01/G11)" },
    { name: "X1 (E84/F48)" },
    { name: "X3 (F25/G01)" },
    { name: "X5 (E70/F15/G05)" },
    { name: "X6" },
    { name: "1 Series" },
    { name: "M3/M4/M5 Performance" }
  ],
  "Mercedes-Benz": [
    { name: "C-Class (W204/W205/W206)", img: "/assets/images/models/mercedesc.png" },
    { name: "E-Class (W212/W213)" },
    { name: "S-Class (W221/W222)" },
    { name: "GLC-Class" },
    { name: "GLE-Class" },
    { name: "GLA-Class" },
    { name: "G-Wagon" },
    { name: "CLA-Class" },
    { name: "Vito/V-Class" },
    { name: "Sprinter" }
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)" },
    { name: "CR-V" },
    { name: "Fit/Jazz" },
    { name: "Accord" },
    { name: "Insight" },
    { name: "Vezel/HR-V" },
    { name: "Stream" }
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)" },
    { name: "Everest" },
    { name: "F-150 Raptor" },
    { name: "Focus" },
    { name: "Fiesta" },
    { name: "Explorer" }
  ],
  "Hyundai": [
    { name: "Tucson" },
    { name: "Santa Fe" },
    { name: "Elantra" },
    { name: "Accent" },
    { name: "Kona" },
    { name: "Sonata" }
  ],
  "Suzuki": [
    { name: "Swift" },
    { name: "Vitara" },
    { name: "Jimny" },
    { name: "Alto" },
    { name: "Ertiga" }
  ],
  "Lexus": [
    { name: "RX350/RX450h" },
    { name: "NX200t/NX300" },
    { name: "LX570/LX600" },
    { name: "IS250/IS300" },
    { name: "ES300h" },
    { name: "GX460" }
  ],
  "Infiniti": [
    { name: "Q50" },
    { name: "QX70" },
    { name: "QX80" },
    { name: "G37" }
  ],
  "Chevrolet": [
    { name: "Cruze" },
    { name: "Captiva" },
    { name: "Trailblazer" }
  ],
  "Mopar": [
    { name: "Jeep Grand Cherokee" },
    { name: "Jeep Wrangler (JK/JL)" },
    { name: "Dodge Ram 1500" },
    { name: "Chrysler 300C" }
  ],
};

const PRODUCTS = [
  // TOYOTA
  { name: "Toyota Genuine Brake Pads (Front Set)", category: "Braking Systems", brand: "Toyota", price: "KES 5,500", img: "/assets/images/products/toyota-brake-pads.jpg", condition: "New", models: ["Fielder", "Premio", "Corolla", "Axio", "Vitz", "Wish"] },
  { name: "Toyota OEM Air Filter Element", category: "Engine Components", brand: "Toyota", price: "KES 1,800", img: "/assets/images/products/toyota-air-filter.jpg", condition: "New", models: ["Prado (J120/J150)", "Hilux (Vigo/Revo)", "Land Cruiser (V8/300)", "Harrier", "Rav4"] },
  { name: "Toyota Genuine Oil Filter (Spin-on)", category: "Engine Components", brand: "Toyota", price: "KES 1,200", img: "/assets/images/products/toyota-oil-filter.jpg", condition: "New", models: ["All Models"] },
  { name: "Toyota Hilux/Land Cruiser Carburetor Assembly", category: "Engine Components", brand: "Toyota", price: "KES 18,000", img: "/assets/images/products/toyota-carburetor.jpg", condition: "New", models: ["Hilux (Vigo/Revo)", "Land Cruiser (V8/300)"] },
  { name: "Toyota Laminated Front Windscreen (OEM)", category: "Glass & Windscreens", brand: "Toyota", price: "KES 15,000", img: "/assets/images/products/toyota-windscreen.webp", condition: "New", models: ["All Models"] },
  { name: "Toyota Vitz CVT Automatic Gearbox (K410)", category: "Transmission & Gear", brand: "Toyota", price: "KES 45,000", img: "/assets/images/products/toyota-vitz-gearbox.png", condition: "Certified Used", models: ["Vitz"] },
  { name: "Toyota Fielder LED Headlight Assembly", category: "Electrical & Sensors", brand: "Toyota", price: "KES 14,000", img: "/assets/images/products/toyota-fielder-headlight.jpg", condition: "New", models: ["Fielder"] },

  // BMW
  { name: "BMW Genuine Oil Filter Kit (N20/N54/N55)", category: "Engine Components", brand: "BMW", price: "KES 3,500", img: "/assets/images/products/bmw-oil-filter.jpg", condition: "New", models: ["3 Series (E90/F30/G20)", "5 Series (F10/G30)", "X3 (F25/G01)", "X5 (E70/F15/G05)"] },
  { name: "BMW OEM Railing Carrier Roof Rack System", category: "Body Kits & Styling", brand: "BMW", price: "KES 45,000", img: "/assets/images/products/bmw-roof-rack.jpg", condition: "New", models: ["X1 (E84/F48)", "X3 (F25/G01)", "X5 (E70/F15/G05)", "X6"] },
  { name: "BMW Performance Camshaft (N54 Twin Turbo)", category: "Engine Components", brand: "BMW", price: "KES 35,000", img: "/assets/images/products/bmw-camshaft.jpg", condition: "New", models: ["3 Series (E90/F30/G20)", "5 Series (F10/G30)", "M3/M4/M5 Performance"] },
  { name: "BMW Electronic Steering Rack Assembly", category: "Steering Systems", brand: "BMW", price: "KES 35,000", img: "/assets/images/products/bmw-steering-rack.jpg", condition: "Certified Used", models: ["3 Series (E90/F30/G20)", "5 Series (F10/G30)"] },
  { name: "BMW Headlight Auto-Leveling Sensor", category: "Electrical & Sensors", brand: "BMW", price: "KES 8,500", img: "/assets/images/products/bmw-sensor.jpg", condition: "New", models: ["All Models"] },
  { name: "BMW 8-Speed Automatic Transmission (ZF 8HP)", category: "Transmission & Gear", brand: "BMW", price: "KES 120,000", img: "/assets/images/products/bmw-gearbox.jpg", condition: "Certified Used", models: ["3 Series (E90/F30/G20)", "5 Series (F10/G30)", "X5 (E70/F15/G05)"] },
  { name: "BMW ZF 8HP Transmission Service Kit", category: "Transmission & Gear", brand: "BMW", price: "KES 22,000", img: "/assets/images/products/bmw-gear-service-kit.jpg", condition: "New", models: ["All Models"] },

  // MERCEDES-BENZ
  { name: "Mercedes-Benz Bilstein Shock Absorber (Rear)", category: "Suspension & Chassis", brand: "Mercedes-Benz", price: "KES 14,500", img: "/assets/images/products/mercedes-shock-absorber.jpg", condition: "New", models: ["C-Class (W204/W205/W206)", "E-Class (W212/W213)"] },
  { name: "Mercedes-Benz Ceramic Brake Pads (W205/W213)", category: "Braking Systems", brand: "Mercedes-Benz", price: "KES 5,500", img: "/assets/images/products/mercedes-brake-pads.jpg", condition: "New", models: ["C-Class (W204/W205/W206)", "E-Class (W212/W213)", "GLC-Class"] },
  { name: "Mercedes-Benz High-Pressure Fuel Filter", category: "Engine Components", brand: "Mercedes-Benz", price: "KES 2,000", img: "/assets/images/products/mercedes-fuel-filter.jpg", condition: "New", models: ["All Models"] },
  { name: "Mercedes-Benz AMG Styling Front Bumper", category: "Body Kits & Styling", brand: "Mercedes-Benz", price: "KES 25,000", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New", models: ["C-Class (W204/W205/W206)", "E-Class (W212/W213)"] },
  { name: "Mercedes-Benz 7G-Tronic Plus Transmission", category: "Transmission & Gear", brand: "Mercedes-Benz", price: "KES 95,000", img: "/assets/images/products/mercedes-gearbox.jpg", condition: "Certified Used", models: ["C-Class (W204/W205/W206)", "E-Class (W212/W213)"] },

  // OTHERS
  { name: "Honda Civic High-Performance Brake Rotors", category: "Braking Systems", brand: "Honda", price: "KES 15,500", img: "/assets/images/products/honda-civic-brake-disc.jpg", condition: "New", models: ["Civic (FD/FB/FC)"] },
  { name: "Honda Civic Genuine Front Brake Pads", category: "Braking Systems", brand: "Honda", price: "KES 6,500", img: "/assets/images/products/honda-civic-brake-pads.jpg", condition: "New", models: ["Civic (FD/FB/FC)"] },
  { name: "Honda Civic LED Headlight Assembly", category: "Electrical & Sensors", brand: "Honda", price: "KES 12,000", img: "/assets/images/products/honda-headlight.jpg", condition: "New", models: ["Civic (FD/FB/FC)"] },
  { name: "Ford Ranger T6/T7 Heavy Duty Radiator", category: "Engine Components", brand: "Ford", price: "KES 16,000", img: "/assets/images/products/ford-ranger-radiator.jpg", condition: "New", models: ["Ranger (T6/T7/T8)", "Everest"] },
  { name: "Ford Ranger T6 Front Brake Pad Set", category: "Braking Systems", brand: "Ford", price: "KES 5,800", img: "/assets/images/products/honda-civic-brake-pads.jpg", condition: "New", models: ["Ranger (T6/T7/T8)"] },
  { name: "Hyundai Tucson/Elantra High-Output Alternator", category: "Electrical & Sensors", brand: "Hyundai", price: "KES 18,500", img: "/assets/images/products/hyundai-tucson-alternator.jpg", condition: "New", models: ["Tucson", "Elantra", "Santa Fe"] },
  { name: "Suzuki Swift Exedy Clutch Kit", category: "Transmission & Gear", brand: "Suzuki", price: "KES 15,000", img: "/assets/images/products/suzuki-swift-clutch.jpg", condition: "New", models: ["Swift"] },
  { name: "Lexus RX350 KYB Gas-A-Just Shock Absorber", category: "Suspension & Chassis", brand: "Lexus", price: "KES 18,000", img: "/assets/images/products/lexus-rx350-shock.jpg", condition: "New", models: ["RX350/RX450h"] },
  { name: "Lexus RX Series 18\" Machine-Face Alloy Rim", category: "Alloys & Rims", brand: "Lexus", price: "KES 45,000", img: "/assets/images/products/lexus-alloy-rim.jpg", condition: "New", models: ["RX350/RX450h"] },
  { name: "Infiniti Q50 Akebono Brake Pads", category: "Braking Systems", brand: "Infiniti", price: "KES 6,500", img: "/assets/images/products/infiniti-brake-pads.jpg", condition: "New", models: ["Q50"] },
  { name: "Chevrolet Cruze Ignition Coil Pack", category: "Electrical & Sensors", brand: "Chevrolet", price: "KES 8,000", img: "/assets/images/products/chevrolet-ignition-coil.jpg", condition: "New", models: ["Cruze"] },
  { name: "Mopar Heavy Duty Oil Filter (Jeep/Dodge)", category: "Engine Components", brand: "Mopar", price: "KES 1,500", img: "/assets/images/products/mopar-oil-filter.jpg", condition: "New", models: ["Jeep Grand Cherokee", "Jeep Wrangler (JK/JL)", "Dodge Ram 1500"] },
];

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All Components");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);
  const [showSelector, setShowSelector] = useState(false);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const category = params.get("category");
    const model = params.get("model");
    
    if (brand) setActiveBrand(brand);
    else setActiveBrand(null);

    if (category) setActiveCategory(category);
    else setActiveCategory("All Components");

    if (model) setActiveModel(model);
    else setActiveModel(null);
    
    setPage(1);
  }, [location]);

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All Components" || p.category === activeCategory)
    .filter((p) => !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase())
    .filter((p) => !activeModel || p.models.includes(activeModel) || p.models.includes("All Models"))
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setActiveCategory("All Components");
    setActiveBrand(null);
    setActiveModel(null);
    setSearchTerm("");
    setLocation("/products");
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (cat !== "All Components" && !activeBrand) {
      setShowSelector(true);
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
              {activeModel ? `${activeModel} ${activeCategory}` : activeBrand ? `${activeBrand} ${activeCategory}` : activeCategory}
            </h1>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <button 
                onClick={() => setShowSelector(true)}
                className="bg-[oklch(0.45_0.22_27)] text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl hover:bg-[oklch(0.35_0.20_27)] transition-all"
              >
                <Car size={16} /> {activeModel || activeBrand ? "CHANGE VEHICLE" : "SELECT YOUR VEHICLE"}
              </button>
              {(activeBrand || activeModel || activeCategory !== "All Components") && (
                <button 
                  onClick={resetFilters}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all"
                >
                  CLEAR ALL FILTERS
                </button>
              )}
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
                            onClick={() => handleCategorySelect(cat)}
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-6 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      Found <span className="text-gray-900">{filtered.length}</span> Components
                    </p>
                    {(activeBrand || activeModel) && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-sm uppercase tracking-widest">{activeBrand}</span>
                        {activeModel && <span className="text-[10px] font-black bg-[oklch(0.45_0.22_27)] text-white px-2 py-0.5 rounded-sm uppercase tracking-widest">{activeModel}</span>}
                      </div>
                    )}
                  </div>
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

                {filtered.length > 0 ? (
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
                            <Link
                              href={`/order?product=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&model=${encodeURIComponent(activeModel || "Unspecified")}&brand=${encodeURIComponent(product.brand)}`}
                              className="bg-gray-900 text-white p-3 rounded-sm hover:bg-[oklch(0.45_0.22_27)] transition-all shadow-lg"
                            >
                              <ChevronRight size={18} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                    <Settings2 size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No Exact Match Found</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                      We may still have this part in our offline inventory. Contact our specialists with your VIN for a manual search.
                    </p>
                    <Link href="/contact" className="btn-primary py-3 px-8 text-xs">CONTACT SPECIALISTS</Link>
                  </div>
                )}

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

        {/* Multi-Step Vehicle Selector Modal */}
        {showSelector && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
              <div className="bg-gray-900 p-8 flex-shrink-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`h-1 w-12 rounded-full ${activeCategory ? "bg-[oklch(0.45_0.22_27)]" : "bg-white/20"}`} />
                  <div className={`h-1 w-12 rounded-full ${activeBrand ? "bg-[oklch(0.45_0.22_27)]" : "bg-white/20"}`} />
                  <div className={`h-1 w-12 rounded-full ${activeModel ? "bg-[oklch(0.45_0.22_27)]" : "bg-white/20"}`} />
                </div>
                <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-1">Step {activeBrand ? "3: Select Model" : "2: Select Brand"}</p>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {activeBrand ? `Refining for ${activeBrand}` : "Identify Your Vehicle"}
                </h3>
                <button onClick={() => setShowSelector(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 bg-gray-50">
                {!activeBrand ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Object.keys(VEHICLE_MODELS).map(brand => (
                      <button 
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
                        className="group bg-white border border-gray-100 p-8 flex flex-col items-center justify-center gap-4 hover:border-[oklch(0.45_0.22_27)] hover:shadow-xl transition-all"
                      >
                        <img 
                          src={`/assets/images/brands/${brand.toLowerCase().replace(' ', '')}.png`} 
                          alt={brand} 
                          className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{brand}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button 
                      onClick={() => { setActiveBrand(null); setActiveModel(null); }}
                      className="text-[10px] font-black uppercase tracking-widest text-[oklch(0.45_0.22_27)] mb-8 hover:underline flex items-center gap-2"
                    >
                      ← BACK TO BRANDS
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {VEHICLE_MODELS[activeBrand].map(model => (
                        <button 
                          key={model.name}
                          onClick={() => {
                            setActiveModel(model.name);
                            setShowSelector(false);
                            setLocation(`/products?brand=${encodeURIComponent(activeBrand)}&model=${encodeURIComponent(model.name)}&category=${encodeURIComponent(activeCategory)}`);
                          }}
                          className={`group relative flex flex-col bg-white border rounded-sm overflow-hidden transition-all ${
                            activeModel === model.name 
                              ? "border-[oklch(0.45_0.22_27)] shadow-xl" 
                              : "border-gray-100 hover:border-gray-900 hover:shadow-lg"
                          }`}
                        >
                          <div className="h-32 bg-gray-50 overflow-hidden">
                            {model.img ? (
                              <img 
                                src={model.img} 
                                alt={model.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Car className="text-gray-300" size={32} />
                              </div>
                            )}
                          </div>
                          <div className="p-4 bg-white flex justify-between items-center">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              activeModel === model.name ? "text-[oklch(0.45_0.22_27)]" : "text-gray-900"
                            }`}>
                              {model.name}
                            </span>
                            <ArrowRight size={14} className="text-gray-300 group-hover:text-[oklch(0.45_0.22_27)] transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
