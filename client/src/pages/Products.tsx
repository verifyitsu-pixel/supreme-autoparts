import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Search, Filter, X, ChevronRight, ShieldCheck, Truck, Clock, Car, Settings2, ArrowRight, LayoutGrid, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  "Alloys & Rims", "Braking Systems", "Electrical & Sensors", "Engine Components",
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
    { name: "S550 (W221/W222)", img: "/assets/images/models/mercedesc.png" }, // Using existing C-class img for placeholder or find S550
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
  // MERCEDES S550
  { name: "Mercedes S550 Front Air Suspension Strut (Genuine)", category: "Suspension & Chassis", brand: "Mercedes-Benz", price: "KES 85,000", img: "/assets/images/products/mercedes-s550-strut.jpg", condition: "New", models: ["S550 (W221/W222)", "S-Class (W221/W222)"] },
  { name: "Mercedes S550 Rear Brake Disc Rotor (OEM)", category: "Braking Systems", brand: "Mercedes-Benz", price: "KES 18,500", img: "/assets/images/products/mercedes-s550-brake-disc.webp", condition: "New", models: ["S550 (W221/W222)", "S-Class (W221/W222)"] },
  { name: "Mercedes S550 Hydraulic Engine Mount Set", category: "Engine Components", brand: "Mercedes-Benz", price: "KES 24,000", img: "/assets/images/products/mercedes-s550-mount.jpg", condition: "New", models: ["S550 (W221/W222)", "S-Class (W221/W222)"] },
  
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
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const model = params.get("model");
    const category = params.get("category");
    
    if (brand) setActiveBrand(brand);
    if (model) setActiveModel(model);
    if (category) setActiveCategory(category);
    
    setPage(1);
  }, [location]);

  const filtered = PRODUCTS
    .filter((p) => !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase())
    .filter((p) => !activeModel || p.models.includes(activeModel) || p.models.includes("All Models"))
    .filter((p) => !activeCategory || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetAll = () => {
    setActiveBrand(null);
    setActiveModel(null);
    setActiveCategory(null);
    setLocation("/products");
  };

  const handleBrandSelect = (brand: string) => {
    setActiveBrand(brand);
    setActiveModel(null);
    setActiveCategory(null);
    setLocation(`/products?brand=${encodeURIComponent(brand)}`);
  };

  const handleModelSelect = (model: string) => {
    setActiveModel(model);
    setActiveCategory(null);
    setLocation(`/products?brand=${encodeURIComponent(activeBrand!)}&model=${encodeURIComponent(model)}`);
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setLocation(`/products?brand=${encodeURIComponent(activeBrand!)}&model=${encodeURIComponent(activeModel!)}&category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Progress Header */}
        <div className="bg-gray-900 py-12 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${!activeBrand ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                  <span className="text-[10px] font-black">01</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Select Brand</span>
                </div>
                <ChevronRight className="text-white/20" size={16} />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeBrand && !activeModel ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                  <span className="text-[10px] font-black">02</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Select Model</span>
                </div>
                <ChevronRight className="text-white/20" size={16} />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeModel && !activeCategory ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                  <span className="text-[10px] font-black">03</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
                </div>
              </div>
              
              {(activeBrand || activeModel || activeCategory) && (
                <button onClick={resetAll} className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-widest hover:underline">
                  Reset Selection
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="py-16 min-h-[60vh]">
          <div className="max-w-[1280px] mx-auto px-6">
            
            {/* STEP 1: SELECT BRAND */}
            {!activeBrand && (
              <div className="animate-fadeIn">
                <div className="mb-12">
                  <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step One</p>
                  <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Choose Manufacturer</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Object.keys(VEHICLE_MODELS).map(brand => (
                    <button 
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className="group bg-white border border-gray-100 p-10 flex flex-col items-center justify-center gap-6 hover:border-[oklch(0.45_0.22_27)] hover:shadow-2xl transition-all duration-500"
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

            {/* STEP 2: SELECT MODEL */}
            {activeBrand && !activeModel && (
              <div className="animate-fadeIn">
                <div className="mb-12 flex items-center justify-between">
                  <div>
                    <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step Two</p>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeBrand} Models</h2>
                  </div>
                  <button onClick={() => setActiveBrand(null)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back to Brands
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {VEHICLE_MODELS[activeBrand].map(model => (
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

            {/* STEP 3: SELECT CATEGORY */}
            {activeBrand && activeModel && !activeCategory && (
              <div className="animate-fadeIn">
                <div className="mb-12 flex items-center justify-between">
                  <div>
                    <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Step Three</p>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeModel} Parts</h2>
                  </div>
                  <button onClick={() => setActiveModel(null)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back to Models
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="group bg-white border border-gray-100 p-8 text-left hover:border-[oklch(0.45_0.22_27)] hover:shadow-xl transition-all"
                    >
                      <LayoutGrid className="text-gray-200 group-hover:text-[oklch(0.45_0.22_27)] mb-4 transition-colors" size={24} />
                      <span className="block text-[10px] font-black uppercase tracking-widest text-gray-900">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: VIEW PARTS */}
            {activeBrand && activeModel && activeCategory && (
              <div className="animate-fadeIn">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Selection Summary Sidebar */}
                  <aside className="w-full lg:w-72 shrink-0">
                    <div className="sticky top-28 bg-gray-900 p-8 rounded-sm text-white shadow-2xl">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[oklch(0.45_0.22_27)] mb-8">Selection Summary</h3>
                      <div className="space-y-8">
                        <div>
                          <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Manufacturer</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-widest">{activeBrand}</p>
                            <button onClick={() => setActiveBrand(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Vehicle Model</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-widest">{activeModel}</p>
                            <button onClick={() => setActiveModel(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Part Category</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-widest">{activeCategory}</p>
                            <button onClick={() => setActiveCategory(null)} className="text-white/20 hover:text-white"><X size={12} /></button>
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
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Available Components
                      </h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {filtered.length} Parts Found
                      </p>
                    </div>

                    {filtered.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {pageItems.map((product, idx) => (
                          <div key={idx} className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-56 overflow-hidden bg-gray-50">
                              <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-[8px] font-black px-2 py-1 rounded-sm text-gray-900 uppercase tracking-widest shadow-sm">
                                  {product.condition}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="text-sm font-bold text-gray-900 leading-tight mb-4 h-10 overflow-hidden group-hover:text-[oklch(0.45_0.22_27)] transition-colors">
                                {product.name}
                              </h3>
                              <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                                <div>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price Guide</p>
                                  <p className="text-base font-black text-gray-900">{product.price}</p>
                                </div>
                                <Link
                                  href={`/order?product=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&model=${encodeURIComponent(activeModel)}&brand=${encodeURIComponent(activeBrand)}`}
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
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No Parts Listed Yet</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                          We are currently updating the inventory for this specific model and category. Please contact us directly for a quote.
                        </p>
                        <Link href="/contact" className="btn-primary py-3 px-8 text-xs">REQUEST MANUAL QUOTE</Link>
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
