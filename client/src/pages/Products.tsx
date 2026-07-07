import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Search, Filter, X, ChevronRight, ShieldCheck, Truck, Clock, Car, Settings2, ArrowRight, LayoutGrid, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { name: "Braking Systems", img: "/assets/images/categories/braking.jpg" },
  { name: "Engine Components", img: "/assets/images/categories/engine.jpg" },
  { name: "Transmission & Gear", img: "/assets/images/categories/transmission.jpg" },
  { name: "Steering Systems", img: "/assets/images/categories/steering.jpg" },
  { name: "Suspension & Chassis", img: "/assets/images/real_parts/mercedes_shock_absorber.jpg" },
  { name: "Electrical & Sensors", img: "/assets/images/products/bmw-sensor.jpg" },
  { name: "Alloys & Rims", img: "/assets/images/products/lexus-alloy-rim.jpg" },
  { name: "Lubricants & Fluids", img: "/assets/images/real_parts/bmw_oil_filter.jpg" },
  { name: "Body Kits & Styling", img: "/assets/images/products/mercedes-bumper.jpg" },
  { name: "Glass & Windscreens", img: "/assets/images/products/toyota-windscreen.webp" },
  { name: "Certified Used Parts", img: "/assets/images/products/bmw-steering-rack.jpg" },
];

const VEHICLE_MODELS: Record<string, { name: string; img?: string }[]> = {
  "Toyota": [
    { name: "Fielder", img: "/assets/images/real_models/toyota_fielder.jpg" },
    { name: "Harrier", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Vitz", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Prado (J120/J150)", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Premio", img: "/assets/images/models/premio.jpg" },
    { name: "Hilux (Vigo/Revo)", img: "/assets/images/real_models/toyota_hilux.jpg" },
    { name: "Land Cruiser (V8/300)", img: "/assets/images/real_models/toyota_landcruiser.jpg" },
    { name: "Corolla", img: "/assets/images/real_models/toyota_fielder.jpg" },
    { name: "Axio", img: "/assets/images/real_models/toyota_fielder.jpg" },
    { name: "Probox", img: "/assets/images/models/probox.jpg" },
    { name: "Noah/Voxy", img: "/assets/images/models/noah.webp" },
    { name: "Rav4", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Hiace", img: "/assets/images/real_models/toyota_hilux.jpg" },
    { name: "Wish", img: "/assets/images/real_models/toyota_vitz.jpg" }
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "/assets/images/real_models/bmw_3series.jpg" },
    { name: "5 Series (F10/G30)", img: "/assets/images/real_models/bmw_5series.jpg" },
    { name: "7 Series (F01/G11)", img: "/assets/images/real_models/bmw_5series.jpg" },
    { name: "X1 (E84/F48)", img: "/assets/images/real_models/bmw_3series.jpg" },
    { name: "X3 (F25/G01)", img: "/assets/images/real_models/bmw_3series.jpg" },
    { name: "X5 (E70/F15/G05)", img: "/assets/images/real_models/bmw_5series.jpg" },
    { name: "X6", img: "/assets/images/real_models/bmw_5series.jpg" },
    { name: "1 Series", img: "/assets/images/real_models/bmw_3series.jpg" },
    { name: "M3/M4/M5 Performance", img: "/assets/images/real_models/bmw_3series.jpg" }
  ],
  "Mercedes-Benz": [
    { name: "S550 (W221/W222)", img: "/assets/images/real_models/mercedes_sclass.jpg" },
    { name: "C-Class (W204/W205/W206)", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "E-Class (W212/W213)", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "S-Class (W221/W222)", img: "/assets/images/real_models/mercedes_sclass.jpg" },
    { name: "GLC-Class", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "GLE-Class", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "GLA-Class", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "G-Wagon", img: "/assets/images/real_models/mercedes_sclass.jpg" },
    { name: "CLA-Class", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "Vito/V-Class", img: "/assets/images/real_models/mercedes_cclass.jpg" },
    { name: "Sprinter", img: "/assets/images/real_models/mercedes_cclass.jpg" }
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "CR-V", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Fit/Jazz", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Accord", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Insight", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Vezel/HR-V", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Stream", img: "/assets/images/real_models/toyota_harrier.jpg" }
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Everest", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "F-150 Raptor", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Focus", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Fiesta", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Explorer", img: "/assets/images/real_models/toyota_prado.jpg" }
  ],
  "Hyundai": [
    { name: "Tucson", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Santa Fe", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Elantra", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Accent", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Kona", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Sonata", img: "/assets/images/real_models/toyota_vitz.jpg" }
  ],
  "Suzuki": [
    { name: "Swift", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Vitara", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Jimny", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Alto", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Ertiga", img: "/assets/images/real_models/toyota_vitz.jpg" }
  ],
  "Lexus": [
    { name: "RX350/RX450h", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "NX200t/NX300", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "LX570/LX600", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "IS250/IS300", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "ES300h", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "GX460", img: "/assets/images/real_models/toyota_prado.jpg" }
  ],
  "Infiniti": [
    { name: "Q50", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "QX70", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "QX80", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "G37", img: "/assets/images/real_models/toyota_vitz.jpg" }
  ],
  "Chevrolet": [
    { name: "Cruze", img: "/assets/images/real_models/toyota_vitz.jpg" },
    { name: "Captiva", img: "/assets/images/real_models/toyota_harrier.jpg" },
    { name: "Trailblazer", img: "/assets/images/real_models/toyota_prado.jpg" }
  ],
  "Mopar": [
    { name: "Jeep Grand Cherokee", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Jeep Wrangler (JK/JL)", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Dodge Ram 1500", img: "/assets/images/real_models/toyota_prado.jpg" },
    { name: "Chrysler 300C", img: "/assets/images/real_models/toyota_vitz.jpg" }
  ],
};

const CATEGORY_PRODUCTS_MAP: Record<string, (brand: string, model: string) => any[]> = {
  "Braking Systems": (brand, model) => [
    { name: `${brand} ${model} Brembo Performance Brake Disc`, price: "KES 28,500", img: "/assets/images/parts/braking/bmw_brembo_disc.jpg", condition: "New" },
    { name: `${brand} ${model} Bosch Blue Brake Pad Set`, price: "KES 8,500", img: "/assets/images/parts/braking/toyota_fielder_pads.webp", condition: "New" },
    { name: `${brand} ${model} Brembo Big Brake Kit (Front)`, price: "KES 145,000", img: "/assets/images/parts/braking/bmw_brembo_big_brake_kit.jpg", condition: "New" },
    { name: `${brand} ${model} Akebono Ceramic Brake Pads`, price: "KES 12,000", img: "/assets/images/real_parts/toyota_brake_pads.jpg", condition: "New" },
    { name: `${brand} ${model} Brembo Carbon Ceramic Kit`, price: "KES 850,000", img: "/assets/images/parts/braking/bmw_carbon_ceramic_kit.png", condition: "New" },
  ],
  "Engine Components": (brand, model) => [
    { name: `${brand} ${model} Bosch High-Performance Oil Filter`, price: "KES 2,200", img: "/assets/images/parts/engine/bmw_3series_oil_filter.jpg", condition: "New" },
    { name: `${brand} ${model} NGK Laser Iridium Spark Plug Set`, price: "KES 14,500", img: "/assets/images/products/chevrolet-ignition-coil.jpg", condition: "New" },
    { name: `${brand} ${model} Gates Racing Timing Belt Kit`, price: "KES 28,000", img: "/assets/images/products/toyota-air-filter.jpg", condition: "New" },
    { name: `${brand} ${model} Mahle Original Air Filter`, price: "KES 3,500", img: "/assets/images/products/toyota-air-filter.jpg", condition: "New" },
    { name: `${brand} ${model} Bosch Fuel Injector Set`, price: "KES 45,000", img: "/assets/images/parts/engine/bmw_5series_oil_filter.jpg", condition: "New" },
  ],
  "Transmission & Gear": (brand, model) => [
    { name: `${brand} ${model} ZF 8HP Transmission Service Kit`, price: "KES 24,000", img: "/assets/images/products/bmw-gear-service-kit.jpg", condition: "New" },
    { name: `${brand} ${model} Exedy Stage 1 Clutch Kit`, price: "KES 48,000", img: "/assets/images/products/suzuki-clutch-kit.jpg", condition: "New" },
    { name: `${brand} ${model} AISIN Automatic Transmission Fluid`, price: "KES 15,000", img: "/assets/images/products/toyota-vitz-gearbox.png", condition: "New" },
    { name: `${brand} ${model} Luk Dual Mass Flywheel`, price: "KES 65,000", img: "/assets/images/products/mercedes-gearbox.jpg", condition: "New" },
    { name: `${brand} ${model} ZF Rebuilt Automatic Transmission`, price: "KES 185,000", img: "/assets/images/products/bmw-gearbox.jpg", condition: "Certified Used" },
  ],
  "Steering Systems": (brand, model) => [
    { name: `${brand} ${model} Bosch Power Steering Pump`, price: "KES 32,000", img: "/assets/images/products/bmw-steering-rack.jpg", condition: "New" },
    { name: `${brand} ${model} Moog Tie Rod End Assembly`, price: "KES 9,500", img: "/assets/images/products/bmw-sensor-2.jpg", condition: "New" },
    { name: `${brand} ${model} TRW Steering Rack & Pinion`, price: "KES 55,000", img: "/assets/images/products/bmw-steering-rack.jpg", condition: "Certified Used" },
    { name: `${brand} ${model} Lemforder Steering Linkage Kit`, price: "KES 18,000", img: "/assets/images/products/bmw-steering-rack.jpg", condition: "New" },
    { name: `${brand} ${model} Bosch Steering Angle Sensor`, price: "KES 12,500", img: "/assets/images/products/bmw-sensor.jpg", condition: "New" },
  ],
  "Suspension & Chassis": (brand, model) => [
    { name: `${brand} ${model} Bilstein B4 Gas Pressure Shock`, price: "KES 18,500", img: "/assets/images/parts/suspension/mercedes_cclass_shock.jpg", condition: "New" },
    { name: `${brand} ${model} KYB Excel-G Shock Absorber Set`, price: "KES 35,000", img: "/assets/images/real_parts/mercedes_shock_absorber.jpg", condition: "New" },
    { name: `${brand} ${model} Lemforder Control Arm Assembly`, price: "KES 28,000", img: "/assets/images/products/mercedes-s550-strut.jpg", condition: "New" },
    { name: `${brand} ${model} Eibach Pro-Kit Lowering Springs`, price: "KES 42,000", img: "/assets/images/real_parts/mercedes_springs.webp", condition: "New" },
    { name: `${brand} ${model} Sachs Suspension Strut Mount`, price: "KES 8,500", img: "/assets/images/parts/suspension/mercedes_sclass_shock.jpg", condition: "New" },
  ],
  "Electrical & Sensors": (brand, model) => [
    { name: `${brand} ${model} Denso Alternator (Original)`, price: "KES 45,000", img: "/assets/images/parts/electrical/toyota_denso_alternator.webp", condition: "New" },
    { name: `${brand} ${model} Bosch S5 Premium Battery`, price: "KES 18,500", img: "/assets/images/products/hyundai-alternator.jpg", condition: "New" },
    { name: `${brand} ${model} Denso High Output Alternator`, price: "KES 65,000", img: "/assets/images/parts/electrical/toyota_high_output_alternator.jpg", condition: "New" },
    { name: `${brand} ${model} Bosch Oxygen Sensor`, price: "KES 14,000", img: "/assets/images/products/bmw-sensor.jpg", condition: "New" },
    { name: `${brand} ${model} Valeo Starter Motor`, price: "KES 22,000", img: "/assets/images/products/hyundai-alternator-2.jpg", condition: "New" },
  ],
  "Alloys & Rims": (brand, model) => [
    { name: `${brand} ${model} BBS Forged Alloy Wheel (18\")`, price: "KES 125,000", img: "/assets/images/products/lexus-alloy-rim.jpg", condition: "New" },
    { name: `${brand} ${model} Enkei Performance Rim Set (17\")`, price: "KES 85,000", img: "/assets/images/products/mercedes-alloy-rim.jpg", condition: "New" },
    { name: `${brand} ${model} Vossen Custom Alloy Wheel (20\")`, price: "KES 245,000", img: "/assets/images/products/lexus-alloy-rim-2.jpg", condition: "New" },
    { name: `${brand} ${model} BBS Center Cap Set`, price: "KES 6,500", img: "/assets/images/products/lexus-alloy-rim.jpg", condition: "New" },
    { name: `${brand} ${model} Michelin Pilot Sport 4S Tire`, price: "KES 32,000", img: "/assets/images/products/lexus-alloy-rim-2.jpg", condition: "New" },
  ],
  "Lubricants & Fluids": (brand, model) => [
    { name: `${brand} ${model} Castrol EDGE 5W-30 Full Synthetic`, price: "KES 9,500", img: "/assets/images/real_parts/bmw_oil_filter.jpg", condition: "New" },
    { name: `${brand} ${model} Mobil 1 Advanced Full Synthetic`, price: "KES 10,500", img: "/assets/images/products/toyota-oil-filter.jpg", condition: "New" },
    { name: `${brand} ${model} Motul 8100 X-cess Engine Oil`, price: "KES 11,000", img: "/assets/images/products/toyota-oil-filter-2.png", condition: "New" },
    { name: `${brand} ${model} Liqui Moly Top Tec 4200 Oil`, price: "KES 12,500", img: "/assets/images/products/toyota-oil-filter.jpg", condition: "New" },
    { name: `${brand} ${model} Shell Helix Ultra Engine Oil`, price: "KES 8,800", img: "/assets/images/products/toyota-oil-filter-2.png", condition: "New" },
  ],
  "Body Kits & Styling": (brand, model) => [
    { name: `${brand} ${model} M-Performance Style Body Kit`, price: "KES 145,000", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New" },
    { name: `${brand} ${model} AMG Style Front Bumper`, price: "KES 65,000", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New" },
    { name: `${brand} ${model} Wald International Body Styling`, price: "KES 285,000", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New" },
    { name: `${brand} ${model} Carbon Fiber Mirror Caps`, price: "KES 18,500", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New" },
    { name: `${brand} ${model} Rear Diffuser with Quad Tips`, price: "KES 32,000", img: "/assets/images/products/mercedes-bumper.jpg", condition: "New" },
  ],
  "Glass & Windscreens": (brand, model) => [
    { name: `${brand} ${model} Pilkington Front Windscreen`, price: "KES 24,000", img: "/assets/images/products/toyota-windscreen.webp", condition: "New" },
    { name: `${brand} ${model} Saint-Gobain Sekurit Side Glass`, price: "KES 12,500", img: "/assets/images/products/toyota-windscreen-2.jpg", condition: "New" },
    { name: `${brand} ${model} AGC Automotive Rear Glass`, price: "KES 18,500", img: "/assets/images/products/toyota-windscreen.webp", condition: "New" },
    { name: `${brand} ${model} Fuyao Laminated Front Glass`, price: "KES 15,000", img: "/assets/images/products/toyota-windscreen-2.jpg", condition: "New" },
    { name: `${brand} ${model} Guardian Glass Door Assembly`, price: "KES 9,500", img: "/assets/images/products/toyota-windscreen.webp", condition: "New" },
  ],
  "Certified Used Parts": (brand, model) => [
    { name: `${brand} ${model} Used Engine (Japan Import)`, price: "KES 350,000", img: "/assets/images/products/bmw-steering-rack.jpg", condition: "Certified Used" },
    { name: `${brand} ${model} Used Automatic Transmission`, price: "KES 145,000", img: "/assets/images/products/bmw-gearbox.jpg", condition: "Certified Used" },
    { name: `${brand} ${model} Used Xenon Headlight Pair`, price: "KES 85,000", img: "/assets/images/products/honda-headlight.jpg", condition: "Certified Used" },
    { name: `${brand} ${model} Used Instrument Cluster`, price: "KES 24,000", img: "/assets/images/products/bmw-sensor.jpg", condition: "Certified Used" },
    { name: `${brand} ${model} Used Infotainment Screen`, price: "KES 45,000", img: "/assets/images/products/bmw-sensor-2.jpg", condition: "Certified Used" },
  ],
};

const PRODUCTS = Object.entries(VEHICLE_MODELS).flatMap(([brand, models]) => 
  models.flatMap(model => 
    Object.entries(CATEGORY_PRODUCTS_MAP).flatMap(([category, getProducts]) => 
      getProducts(brand, model.name).map(p => ({
        ...p,
        category,
        brand,
        models: [model.name]
      }))
    )
  )
);

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
                  <span className="text-[10px] font-black uppercase tracking-widest">Brand</span>
                </div>
                <div className="w-8 h-px bg-white/10" />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeBrand && !activeModel ? "bg-[oklch(0.45_0.22_27)] border-[oklch(0.45_0.22_27)] text-white" : "border-white/20 text-white/50"}`}>
                  <span className="text-[10px] font-black">02</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Model</span>
                </div>
                <div className="w-8 h-px bg-white/10" />
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
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeModel} Categories</h2>
                  </div>
                  <button onClick={() => setActiveModel(null)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Back to Models
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className="group bg-white border border-gray-100 p-8 flex flex-col items-center justify-center gap-4 hover:border-[oklch(0.45_0.22_27)] hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-900 text-center leading-tight">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: RESULTS GRID */}
            {activeBrand && activeModel && activeCategory && (
              <div className="animate-fadeIn">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Sidebar Info */}
                  <aside className="lg:w-80 shrink-0">
                    <div className="bg-gray-900 p-10 rounded-sm sticky top-32">
                      <div className="mb-10">
                        <h4 className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-[0.3em] mb-8">Current Selection</h4>
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
