import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  Search, 
  Car, 
  Wrench, 
  Zap, 
  Shield, 
  ArrowLeft, 
  SlidersHorizontal, 
  LayoutGrid, 
  List as ListIcon,
  ShoppingCart,
  Filter
} from "lucide-react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// ─── BRAND DATA ───────────────────────────────────────────────────────────────
const BRAND_DATA: Record<string, { logo: string; country: string }> = {
  "Toyota": { logo: "/assets/images/brands/toyota.png", 
    country: "Japan" 
  },
  "BMW": { logo: "/assets/images/brands/bmw.png", 
    country: "Germany" 
  },
  "Mercedes-Benz": { logo: "/assets/images/brands/mercedesbenz.png", 
    country: "Germany" 
  },
  "Honda": { logo: "/assets/images/brands/honda.png", 
    country: "Japan" 
  },
  "Ford": { logo: "/assets/images/brands/ford.png", 
    country: "USA" 
  },
  "Hyundai": { logo: "/assets/images/brands/hyundai.png", 
    country: "South Korea" 
  },
  "Suzuki": { logo: "/assets/images/brands/suzuki.png", 
    country: "Japan" 
  },
  "Lexus": { logo: "/assets/images/brands/lexus.png", 
    country: "Japan" 
  },
  "Nissan": { logo: "/assets/images/brands/nissan.png", 
    country: "Japan" 
  },
  "Mitsubishi": { logo: "/assets/images/brands/mitsubishi.png", 
    country: "Japan" 
  },
};

// ─── REAL CAR MODEL IMAGES (HUMAN-TAKEN PHOTOGRAPHS) ──────────────────────────
const VEHICLE_MODELS: Record<string, { name: string; img: string; year: string; type: string }[]> = {
  "Toyota": [
    { name: "Hilux (Vigo/Revo)", img: "None", year: "2005–2024", type: "Pickup Truck" },
    { name: "Fielder", img: "None", year: "2006–2021", type: "Station Wagon" },
    { name: "Corolla", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8_Front.jpg/1200px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8_Front.jpg", year: "2000–2024", type: "Sedan" },
    { name: "Prado (J120/J150)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/2018_Toyota_Land_Cruiser_Prado_VXL_Front.jpg/1200px-2018_Toyota_Land_Cruiser_Prado_VXL_Front.jpg", year: "2002–2024", type: "SUV" },
    { name: "Vitz", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/2017_Toyota_Yaris_Icon_Tech_VVT-i_Hybrid_1.5_Front.jpg/1200px-2017_Toyota_Yaris_Icon_Tech_VVT-i_Hybrid_1.5_Front.jpg", year: "2005–2020", type: "Hatchback" },
    { name: "Land Cruiser (V8/300)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Toyota_Land_Cruiser_V8_2012.jpg/1200px-Toyota_Land_Cruiser_V8_2012.jpg", year: "2007–2024", type: "Full-Size SUV" },
    { name: "Harrier", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Toyota_Harrier_Hybrid_Z_2020_Front.jpg/1200px-Toyota_Harrier_Hybrid_Z_2020_Front.jpg", year: "2013–2024", type: "Crossover SUV" },
    { name: "Hiace", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Toyota_Hiace_V_LWB_Front.jpg/1200px-Toyota_Hiace_V_LWB_Front.jpg", year: "2005–2024", type: "Van" },
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "None", year: "2005–2024", type: "Sedan" },
    { name: "5 Series (F10/G30)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/2017_BMW_520d_M_Sport_Automatic_2.0_Front.jpg/1200px-2017_BMW_520d_M_Sport_Automatic_2.0_Front.jpg", year: "2010–2024", type: "Sedan" },
    { name: "7 Series (F01/G11)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/2019_BMW_745Le_xDrive_M_Sport_Automatic_3.0_Front.jpg/1200px-2019_BMW_745Le_xDrive_M_Sport_Automatic_3.0_Front.jpg", year: "2008–2024", type: "Luxury Sedan" },
    { name: "X3 (F25/G01)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2018_BMW_X3_xDrive20d_M_Sport_2.0_Front.jpg/1200px-2018_BMW_X3_xDrive20d_M_Sport_2.0_Front.jpg", year: "2010–2024", type: "Compact SUV" },
    { name: "X5 (E70/F15/G05)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/2019_BMW_X5_xDrive30d_M_Sport_Automatic_3.0_Front.jpg/1200px-2019_BMW_X5_xDrive30d_M_Sport_Automatic_3.0_Front.jpg", year: "2006–2024", type: "Mid-Size SUV" },
    { name: "X6 (F16/G06)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/2020_BMW_X6_xDrive30d_M_Sport_Automatic_3.0_Front.jpg/1200px-2020_BMW_X6_xDrive30d_M_Sport_Automatic_3.0_Front.jpg", year: "2014–2024", type: "Sports SAV" },
  ],
  "Mercedes-Benz": [
    { name: "C-Class (W204/W205/W206)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2019_Mercedes-Benz_C200_AMG_Line_Premium_Automatic_1.5_Front.jpg/1200px-2019_Mercedes-Benz_C200_AMG_Line_Premium_Automatic_1.5_Front.jpg", year: "2007–2024", type: "Sedan" },
    { name: "S550 (W221/W222)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/2018_Mercedes-Benz_S350d_L_AMG_Line_Premium_3.0_Front.jpg/1200px-2018_Mercedes-Benz_S350d_L_AMG_Line_Premium_3.0_Front.jpg", year: "2005–2024", type: "Luxury Sedan" },
    { name: "E-Class (W212/W213)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/2017_Mercedes-Benz_E220d_AMG_Line_Premium_Automatic_2.0_Front.jpg/1200px-2017_Mercedes-Benz_E220d_AMG_Line_Premium_Automatic_2.0_Front.jpg", year: "2009–2024", type: "Sedan" },
    { name: "GLC-Class", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2019_Mercedes-Benz_GLC_220d_4MATIC_AMG_Line_Premium_2.0_Front.jpg/1200px-2019_Mercedes-Benz_GLC_220d_4MATIC_AMG_Line_Premium_2.0_Front.jpg", year: "2015–2024", type: "Compact SUV" },
    { name: "GLE-Class", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/2020_Mercedes-Benz_GLE_350d_4MATIC_AMG_Line_Premium_3.0_Front.jpg/1200px-2020_Mercedes-Benz_GLE_350d_4MATIC_AMG_Line_Premium_3.0_Front.jpg", year: "2015–2024", type: "Mid-Size SUV" },
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/2017_Honda_Civic_VTEC_Turbo_SR_1.0_Front.jpg/1200px-2017_Honda_Civic_VTEC_Turbo_SR_1.0_Front.jpg", year: "2006–2024", type: "Sedan/Hatchback" },
    { name: "CR-V", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/2018_Honda_CR-V_EX_i-VTEC_1.5_Front.jpg/1200px-2018_Honda_CR-V_EX_i-VTEC_1.5_Front.jpg", year: "2007–2024", type: "Compact SUV" },
    { name: "Accord", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Honda_Accord_Sedan_L_2018.jpg/1200px-Honda_Accord_Sedan_L_2018.jpg", year: "2008–2024", type: "Sedan" },
    { name: "HR-V", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/2019_Honda_HR-V_EX_i-VTEC_1.5_Front.jpg/1200px-2019_Honda_HR-V_EX_i-VTEC_1.5_Front.jpg", year: "2014–2024", type: "Subcompact SUV" },
    { name: "Fit/Jazz", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2018_Honda_Jazz_SE_i-VTEC_1.3_Front.jpg/1200px-2018_Honda_Jazz_SE_i-VTEC_1.3_Front.jpg", year: "2008–2020", type: "Hatchback" },
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2019_Ford_Ranger_Wildtrak_4WD_2.0_Front.jpg/1200px-2019_Ford_Ranger_Wildtrak_4WD_2.0_Front.jpg", year: "2011–2024", type: "Pickup Truck" },
    { name: "Everest", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2019_Ford_Everest_Titanium_Front.jpg/1200px-2019_Ford_Everest_Titanium_Front.jpg", year: "2015–2024", type: "SUV" },
    { name: "Focus", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2019_Ford_Focus_ST-Line_X_1.0_Front.jpg/1200px-2019_Ford_Focus_ST-Line_X_1.0_Front.jpg", year: "2011–2022", type: "Hatchback/Sedan" },
    { name: "Explorer", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/2020_Ford_Explorer_Limited_Front.jpg/1200px-2020_Ford_Explorer_Limited_Front.jpg", year: "2011–2024", type: "Full-Size SUV" },
  ],
  "Hyundai": [
    { name: "Tucson", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/2019_Hyundai_Tucson_N-Line_1.6_Front.jpg/1200px-2019_Hyundai_Tucson_N-Line_1.6_Front.jpg", year: "2009–2024", type: "Compact SUV" },
    { name: "Santa Fe", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2019_Hyundai_Santa_Fe_Premium_SE_CRDi_2.2_Front.jpg/1200px-2019_Hyundai_Santa_Fe_Premium_SE_CRDi_2.2_Front.jpg", year: "2006–2024", type: "Mid-Size SUV" },
    { name: "Elantra", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/2019_Hyundai_Elantra_Luxury_Front.jpg/1200px-2019_Hyundai_Elantra_Luxury_Front.jpg", year: "2010–2024", type: "Sedan" },
    { name: "i10", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/2020_Hyundai_i10_Premium_1.0_Front.jpg/1200px-2020_Hyundai_i10_Premium_1.0_Front.jpg", year: "2013–2024", type: "City Car" },
    { name: "i20", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2019_Hyundai_i20_Premium_Nav_MPI_1.2_Front.jpg/1200px-2019_Hyundai_i20_Premium_Nav_MPI_1.2_Front.jpg", year: "2014–2024", type: "Supermini" },
  ],
  "Suzuki": [
    { name: "Swift", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/2018_Suzuki_Swift_SZ5_Boosterjet_1.0_Front.jpg/1200px-2018_Suzuki_Swift_SZ5_Boosterjet_1.0_Front.jpg", year: "2010–2024", type: "Supermini" },
    { name: "Vitara", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2019_Suzuki_Vitara_SZ-T_Boosterjet_1.0_Front.jpg/1200px-2019_Suzuki_Vitara_SZ-T_Boosterjet_1.0_Front.jpg", year: "2015–2024", type: "Compact SUV" },
    { name: "Jimny", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/2019_Suzuki_Jimny_SZ5_Allgrip_1.5_Front.jpg/1200px-2019_Suzuki_Jimny_SZ5_Allgrip_1.5_Front.jpg", year: "1998–2024", type: "Mini SUV" },
    { name: "Alto", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2019_Suzuki_Alto_SZ3_1.0_Front.jpg/1200px-2019_Suzuki_Alto_SZ3_1.0_Front.jpg", year: "2009–2024", type: "City Car" },
    { name: "Ertiga", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/2019_Suzuki_Ertiga_GL_1.5_Front.jpg/1200px-2019_Suzuki_Ertiga_GL_1.5_Front.jpg", year: "2012–2024", type: "MPV" },
  ],
  "Lexus": [
    { name: "RX350", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/2019_Lexus_RX_450h_Luxury_Automatic_3.5_Front.jpg/1200px-2019_Lexus_RX_450h_Luxury_Automatic_3.5_Front.jpg", year: "2009–2024", type: "Luxury SUV" },
    { name: "LX570", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2016_Lexus_LX570_Front.jpg/1200px-2016_Lexus_LX570_Front.jpg", year: "2007–2021", type: "Full-Size Luxury SUV" },
    { name: "IS250", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2017_Lexus_IS300h_Luxury_Automatic_2.5_Front.jpg/1200px-2017_Lexus_IS300h_Luxury_Automatic_2.5_Front.jpg", year: "2005–2015", type: "Luxury Sedan" },
    { name: "GX460", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2020_Lexus_GX460_Front.jpg/1200px-2020_Lexus_GX460_Front.jpg", year: "2009–2024", type: "Luxury SUV" },
    { name: "ES300h", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2019_Lexus_ES300h_Luxury_Automatic_2.5_Front.jpg/1200px-2019_Lexus_ES300h_Luxury_Automatic_2.5_Front.jpg", year: "2012–2024", type: "Hybrid Luxury Sedan" },
  ],
  "Nissan": [
    { name: "Navara (D40/D23)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/2019_Nissan_Navara_Tekna_4WD_DCi_2.3_Front.jpg/1200px-2019_Nissan_Navara_Tekna_4WD_DCi_2.3_Front.jpg", year: "2005–2024", type: "Pickup Truck" },
    { name: "X-Trail", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/2018_Nissan_X-Trail_Tekna_DCi_1.6_Front.jpg/1200px-2018_Nissan_X-Trail_Tekna_DCi_1.6_Front.jpg", year: "2007–2024", type: "Compact SUV" },
    { name: "Patrol", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2019_Nissan_Patrol_Ti_Front.jpg/1200px-2019_Nissan_Patrol_Ti_Front.jpg", year: "2010–2024", type: "Full-Size SUV" },
    { name: "Note", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/2017_Nissan_Note_Acenta_Premium_1.2_Front.jpg/1200px-2017_Nissan_Note_Acenta_Premium_1.2_Front.jpg", year: "2012–2024", type: "Hatchback" },
    { name: "Tiida", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/2018_Nissan_Tiida_Front.jpg/1200px-2018_Nissan_Tiida_Front.jpg", year: "2004–2018", type: "Compact" },
  ],
  "Mitsubishi": [
    { name: "Pajero (V6/V8)", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/2019_Mitsubishi_Pajero_Sport_Exceed_Front.jpg/1200px-2019_Mitsubishi_Pajero_Sport_Exceed_Front.jpg", year: "2000–2021", type: "Full-Size SUV" },
    { name: "L200 Triton", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2019_Mitsubishi_L200_Barbarian_4WD_2.4_Front.jpg/1200px-2019_Mitsubishi_L200_Barbarian_4WD_2.4_Front.jpg", year: "2006–2024", type: "Pickup Truck" },
    { name: "Outlander", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/2019_Mitsubishi_Outlander_PHEV_Juro_2.4_Front.jpg/1200px-2019_Mitsubishi_Outlander_PHEV_Juro_2.4_Front.jpg", year: "2012–2024", type: "Compact SUV" },
    { name: "Eclipse Cross", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/2018_Mitsubishi_Eclipse_Cross_4WD_1.5_Front.jpg/1200px-2018_Mitsubishi_Eclipse_Cross_4WD_1.5_Front.jpg", year: "2017–2024", type: "Compact SUV" },
  ],
};

// ─── CATEGORIES WITH REAL PART IMAGES ─────────────────────────────────────────
const CATEGORIES_WITH_SUBCATEGORIES: Record<string, { subcategories: string[]; icon: string; image: string; description: string }> = {
  "Braking Systems": {
    subcategories: ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"],
    icon: "🛑",
    image: "/assets/images/categories/braking.jpg",
    description: "Pads, discs, calipers & more"
  },
  "Engine Components": {
    subcategories: ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"],
    icon: "⚙️",
    image: "/assets/images/categories/engine.jpg",
    description: "Filters, plugs, belts & injectors"
  },
  "Transmission & Gear": {
    subcategories: ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Gearbox"],
    icon: "🔧",
    image: "/assets/images/categories/transmission.jpg",
    description: "Clutch kits, gearbox & fluids"
  },
  "Steering Systems": {
    subcategories: ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"],
    icon: "🎯",
    image: "/assets/images/categories/steering.jpg",
    description: "Racks, pumps & linkage"
  },
  "Suspension & Chassis": {
    subcategories: ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"],
    icon: "🚗",
    image: "/assets/images/categories/suspension.jpg",
    description: "Shocks, springs & control arms"
  },
  "Electrical & Sensors": {
    subcategories: ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"],
    icon: "⚡",
    image: "/assets/images/categories/electrical.jpg",
    description: "Alternators, sensors & ECUs"
  },
  "Alloys & Rims": {
    subcategories: ["Alloy Wheels", "Wheel Caps", "Lug Nuts", "Wheel Spacers"],
    icon: "🔵",
    image: "/assets/images/categories/alloys.jpg",
    description: "Alloys & wheel accessories"
  },
  "Lubricants & Fluids": {
    subcategories: ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"],
    icon: "🛢️",
    image: "/assets/images/categories/lubricants.jpg",
    description: "Oils, coolants & fluids"
  },
  "Body Kits & Styling": {
    subcategories: ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Headlights"],
    icon: "🎨",
    image: "/assets/images/categories/bodykits.jpg",
    description: "Bumpers, headlights & styling"
  },
  "Glass & Windscreens": {
    subcategories: ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"],
    icon: "🪟",
    image: "/assets/images/categories/glass.jpg",
    description: "Windscreens, glass & wipers"
  },
  "Tyres": {
    subcategories: ["Bridgestone", "Michelin", "Continental", "Pirelli", "Goodyear", "Dunlop"],
    icon: "🛞",
    image: "/assets/images/categories/tyres.jpg",
    description: "Premium tyres from top brands"
  },
};

const BRANDS = Object.keys(VEHICLE_MODELS);

// ─── STEP ENUM ────────────────────────────────────────────────────────────────
type Step = "brand" | "model" | "category" | "subcategory" | "products";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [backendProducts, setBackendProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { addItem } = useCart();
  const ITEMS_PER_PAGE = 12;

  // Determine current step
  const getStep = (): Step => {
    if (searchTerm) return "products";
    if (!activeBrand) return "brand";
    if (!activeModel) return "model";
    if (!activeCategory) return "category";
    if (!activeSubcategory) return "subcategory";
    return "products";
  };
  const step = getStep();

  // Parse URL params on mount/navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const model = params.get("model");
    const category = params.get("category");
    const subcategory = params.get("subcategory");
    const search = params.get("search");

    setActiveBrand(brand ? decodeURIComponent(brand) : null);
    setActiveModel(model ? decodeURIComponent(model) : null);
    setActiveCategory(category ? decodeURIComponent(category) : null);
    setActiveSubcategory(subcategory ? decodeURIComponent(subcategory) : null);
    setSearchTerm(search ? decodeURIComponent(search) : "");
    setPage(1);
  }, [location]);

  // Fetch products when on products step
  useEffect(() => {
    if (step !== "products") { setBackendProducts([]); return; }
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
  }, [step, activeCategory, activeSubcategory, activeBrand, activeModel, searchTerm]);

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

  // Navigation helpers
  const goTo = (params: Record<string, string | null>) => {
    const p = new URLSearchParams();
    if (params.brand) p.set("brand", encodeURIComponent(params.brand));
    if (params.model) p.set("model", encodeURIComponent(params.model));
    if (params.category) p.set("category", encodeURIComponent(params.category));
    if (params.subcategory) p.set("subcategory", encodeURIComponent(params.subcategory));
    setLocation(`/products${p.toString() ? "?" + p.toString() : ""}`);
  };

  const goBack = () => {
    if (step === "model") goTo({});
    else if (step === "category") goTo({ brand: activeBrand });
    else if (step === "subcategory") goTo({ brand: activeBrand, model: activeModel });
    else if (step === "products") goTo({ brand: activeBrand, model: activeModel, category: activeCategory });
  };

  const clearAll = () => { setLocation("/products"); };

  // ─── BREADCRUMB ──────────────────────────────────────────────────────────────
  const Breadcrumb = () => (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <button onClick={() => setLocation("/")} className="hover:text-[#E42933] transition-colors font-medium">Home</button>
          <ChevronRight size={14} className="text-gray-300" />
          <button onClick={clearAll} className="hover:text-[#E42933] transition-colors font-medium">Shop Parts</button>
          {activeBrand && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <button onClick={() => goTo({ brand: activeBrand })} className="hover:text-[#E42933] transition-colors font-medium">{activeBrand}</button>
            </>
          )}
          {activeModel && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <button onClick={() => goTo({ brand: activeBrand, model: activeModel })} className="hover:text-[#E42933] transition-colors font-medium">{activeModel}</button>
            </>
          )}
          {activeCategory && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <button onClick={() => goTo({ brand: activeBrand, model: activeModel, category: activeCategory })} className="hover:text-[#E42933] transition-colors font-medium">{activeCategory}</button>
            </>
          )}
          {activeSubcategory && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-900 font-semibold">{activeSubcategory}</span>
            </>
          )}
          {searchTerm && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-900 font-semibold">Search: "{searchTerm}"</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ─── STEP 1: SELECT BRAND ────────────────────────────────────────────────────
  if (step === "brand") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <Breadcrumb />
        <main className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#E42933]/10 text-[#E42933] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                <Car size={14} /> Step 1 of 4
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 uppercase tracking-tighter">Select Your Car Brand</h1>
              <p className="text-gray-500 text-lg">Choose your vehicle manufacturer to find exact-fit parts</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {BRANDS.map(brand => {
                const bd = BRAND_DATA[brand];
                return (
                  <button
                    key={brand}
                    onClick={() => goTo({ brand })}
                    className="group bg-white rounded-2xl border-2 border-gray-100 p-6 flex flex-col items-center gap-4 hover:border-[#E42933] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 flex items-center justify-center">
                      <img
                        src={bd?.logo}
                        alt={brand}
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-900 group-hover:text-[#E42933] transition-colors uppercase tracking-tight">{brand}</p>
                      <p className="text-xs text-gray-400 mt-1">{bd?.country}</p>
                    </div>
                    <div className="w-full bg-gray-50 group-hover:bg-[#E42933]/5 rounded-xl py-2 text-center transition-colors">
                      <span className="text-xs font-bold text-gray-500 group-hover:text-[#E42933] uppercase tracking-wider">
                        {(VEHICLE_MODELS[brand] || []).length} Models
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── STEP 2: SELECT MODEL ────────────────────────────────────────────────────
  if (step === "model") {
    const models = VEHICLE_MODELS[activeBrand!] || [];
    const brandData = BRAND_DATA[activeBrand!];
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <Breadcrumb />
        <main className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center hover:border-[#E42933] hover:text-[#E42933] transition-all">
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-4">
                <img src={brandData?.logo} alt={activeBrand!} className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#E42933]/10 text-[#E42933] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                    <Car size={12} /> Step 2 of 4
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{activeBrand} Models</h1>
                  <p className="text-gray-500 text-sm">Select your exact vehicle model</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {models.map(model => (
                <button
                  key={model.name}
                  onClick={() => goTo({ brand: activeBrand, model: model.name })}
                  className="group bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:border-[#E42933] hover:shadow-2xl transition-all duration-400"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img
                      src={model.img}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{model.type}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-black text-gray-900 group-hover:text-[#E42933] transition-colors uppercase tracking-tight leading-tight">{model.name}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{model.year}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[#E42933] font-bold uppercase">View Parts →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── STEP 3: SELECT CATEGORY ─────────────────────────────────────────────────
  if (step === "category") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <Breadcrumb />
        <main className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center hover:border-[#E42933] hover:text-[#E42933] transition-all">
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="inline-flex items-center gap-2 bg-[#E42933]/10 text-[#E42933] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                  <Wrench size={12} /> Step 3 of 4
                </div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{activeBrand} {activeModel}</h1>
                <p className="text-gray-500 text-sm">Select a part category</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Object.entries(CATEGORIES_WITH_SUBCATEGORIES).map(([cat, data]) => (
                <button
                  key={cat}
                  onClick={() => goTo({ brand: activeBrand, model: activeModel, category: cat })}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <img src={data.image} alt={cat} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 group-hover:bg-[#E42933] transition-colors duration-300">
                      <span className="text-lg">{data.icon}</span>
                    </div>
                    <p className="text-white font-black text-sm leading-tight uppercase tracking-tighter">{cat}</p>
                    <p className="text-gray-300 text-[10px] mt-1">{data.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── STEP 4: SELECT SUBCATEGORY ──────────────────────────────────────────────
  if (step === "subcategory") {
    const subcategories = CATEGORIES_WITH_SUBCATEGORIES[activeCategory!]?.subcategories || [];
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <Breadcrumb />
        <main className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center hover:border-[#E42933] hover:text-[#E42933] transition-all">
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="inline-flex items-center gap-2 bg-[#E42933]/10 text-[#E42933] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                  <Zap size={12} /> Step 4 of 4
                </div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{activeCategory}</h1>
                <p className="text-gray-500 text-sm">{activeBrand} {activeModel} — Select part type</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => goTo({ brand: activeBrand, model: activeModel, category: activeCategory, subcategory: sub })}
                  className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 text-left hover:border-[#E42933] hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E42933] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#E42933]/10 flex items-center justify-center mb-4 transition-colors">
                    <Shield size={22} className="text-gray-400 group-hover:text-[#E42933] transition-colors" />
                  </div>
                  <p className="text-sm font-black text-gray-900 group-hover:text-[#E42933] transition-colors uppercase tracking-tight">{sub}</p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">5+ Parts Available</p>
                  <div className="mt-4 text-xs font-bold text-[#E42933] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                    Browse Parts →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── STEP 5: PRODUCTS LIST ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 sticky top-24 shadow-sm">
                <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                  <SlidersHorizontal size={18} className="text-[#E42933]" /> Filters
                </h3>

                {/* Vehicle info */}
                {activeBrand && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Vehicle</p>
                    <p className="text-sm font-black text-gray-900">{activeBrand}</p>
                    {activeModel && <p className="text-xs text-gray-500 mt-1">{activeModel}</p>}
                    {activeCategory && <p className="text-xs text-[#E42933] mt-1 font-bold">{activeCategory}</p>}
                    {activeSubcategory && <p className="text-xs text-gray-500 mt-1">{activeSubcategory}</p>}
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Price Range (KES)</h4>
                  <div className="space-y-3">
                    <input type="range" min="0" max="300000" step="1000" value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-[#E42933]" />
                    <div className="flex justify-between text-xs font-bold text-gray-900">
                      <span>KES {priceRange[0].toLocaleString()}</span>
                      <span>KES {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button onClick={clearAll} className="w-full py-2.5 border-2 border-gray-100 rounded-xl text-xs font-black text-gray-500 hover:border-[#E42933] hover:text-[#E42933] transition-all uppercase tracking-wider">
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <button onClick={goBack} className="w-9 h-9 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center hover:border-[#E42933] hover:text-[#E42933] transition-all lg:hidden">
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                      {searchTerm ? `"${searchTerm}"` : activeSubcategory || activeCategory || "All Parts"}
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">{sortedProducts.length} Parts Found</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:border-[#E42933] outline-none transition-all">
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name">Name: A–Z</option>
                  </select>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-[#E42933] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#E42933] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}><ListIcon size={18} /></button>
                  </div>
                </div>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border-2 border-gray-100 p-4 animate-pulse">
                      <div className="aspect-square bg-gray-100 rounded-2xl mb-4"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">No Parts Found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any parts matching your current selection or filters. Try adjusting your criteria.</p>
                  <button onClick={clearAll} className="px-8 py-3 bg-[#E42933] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#C21E26] transition-all">Clear All Filters</button>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {pageItems.map(product => (
                    <div key={product.id} className={`group bg-white rounded-3xl border-2 border-gray-100 p-4 hover:border-[#E42933] hover:shadow-2xl transition-all duration-500 ${viewMode === "list" ? "flex gap-6" : ""}`}>
                      <div className={`relative overflow-hidden rounded-2xl bg-gray-50 ${viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square mb-4"}`}>
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        {product.comparePrice && (
                          <div className="absolute top-3 left-3 bg-[#E42933] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Sale</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#E42933] uppercase tracking-widest bg-[#E42933]/5 px-2 py-0.5 rounded-full">{product.brand}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sku}</span>
                        </div>
                        <h3 className="font-black text-gray-900 group-hover:text-[#E42933] transition-colors uppercase tracking-tight leading-tight mb-2 line-clamp-2">{product.name}</h3>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div>
                            <p className="text-lg font-black text-gray-900 tracking-tighter">KES {product.price.toLocaleString()}</p>
                            {product.comparePrice && <p className="text-xs text-gray-400 line-through">KES {product.comparePrice.toLocaleString()}</p>}
                          </div>
                          <button onClick={() => handleAddToCart(product)} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${addedToCart === product.id ? "bg-green-500 text-white" : "bg-gray-900 text-white hover:bg-[#E42933]"}`}>
                            {addedToCart === product.id ? <Shield size={20} /> : <ShoppingCart size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-11 h-11 rounded-xl font-black transition-all ${page === i + 1 ? "bg-[#E42933] text-white" : "bg-white border-2 border-gray-100 text-gray-400 hover:border-[#E42933] hover:text-[#E42933]"}`}>{i + 1}</button>
                  ))}
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
