import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/NavbarNew";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import {
  Search, X, ChevronRight, Star, ShoppingCart, Heart,
  Grid, List, SlidersHorizontal, Check, Package, ArrowLeft,
  Car, Wrench, Zap, Shield
} from "lucide-react";

// ─── REAL BRAND LOGOS ─────────────────────────────────────────────────────────
const BRAND_DATA: Record<string, { logo: string; color: string; country: string }> = {
  "Toyota": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/200px-Toyota_carlogo.svg.png",
    color: "#EB0A1E",
    country: "Japan"
  },
  "BMW": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png",
    color: "#0066B1",
    country: "Germany"
  },
  "Mercedes-Benz": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/200px-Mercedes-Logo.svg.png",
    color: "#333333",
    country: "Germany"
  },
  "Honda": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/200px-Honda_Logo.svg.png",
    color: "#CC0000",
    country: "Japan"
  },
  "Ford": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/200px-Ford_logo_flat.svg.png",
    color: "#003478",
    country: "USA"
  },
  "Hyundai": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png",
    color: "#002C5F",
    country: "South Korea"
  },
  "Suzuki": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/200px-Suzuki_logo_2.svg.png",
    color: "#1A4C8B",
    country: "Japan"
  },
  "Lexus": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Lexus_division_emblem.svg/200px-Lexus_division_emblem.svg.png",
    color: "#1A1A1A",
    country: "Japan"
  },
  "Nissan": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_2020_logo.svg/200px-Nissan_2020_logo.svg.png",
    color: "#C3002F",
    country: "Japan"
  },
  "Mitsubishi": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Mitsubishi_logo.svg/200px-Mitsubishi_logo.svg.png",
    color: "#CC0000",
    country: "Japan"
  },
};

// ─── REAL CAR MODEL IMAGES ────────────────────────────────────────────────────
const VEHICLE_MODELS: Record<string, { name: string; img: string; year: string; type: string }[]> = {
  "Toyota": [
    { name: "Hilux (Vigo/Revo)", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format", year: "2005–2024", type: "Pickup Truck" },
    { name: "Fielder", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format", year: "2006–2021", type: "Station Wagon" },
    { name: "Corolla", img: "https://images.unsplash.com/photo-1623854275502-d113ae198f67?q=80&w=800&auto=format", year: "2000–2024", type: "Sedan" },
    { name: "Prado (J120/J150)", img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format", year: "2002–2024", type: "SUV" },
    { name: "Vitz", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format", year: "2005–2020", type: "Hatchback" },
    { name: "Land Cruiser (V8/300)", img: "https://images.unsplash.com/photo-1542362567-b05503f3af15?q=80&w=800&auto=format", year: "2007–2024", type: "Full-Size SUV" },
    { name: "Harrier", img: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=800&auto=format", year: "2013–2024", type: "Crossover SUV" },
    { name: "Hiace", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format", year: "2005–2024", type: "Van" },
  ],
  "BMW": [
    { name: "3 Series (E90/F30/G20)", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format", year: "2005–2024", type: "Sedan" },
    { name: "5 Series (F10/G30)", img: "https://images.unsplash.com/photo-1617654112329-a0b9e2a2f9f2?q=80&w=800&auto=format", year: "2010–2024", type: "Sedan" },
    { name: "7 Series (F01/G11)", img: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=800&auto=format", year: "2008–2024", type: "Luxury Sedan" },
    { name: "X3 (F25/G01)", img: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=800&auto=format", year: "2010–2024", type: "Compact SUV" },
    { name: "X5 (E70/F15/G05)", img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format", year: "2006–2024", type: "Mid-Size SUV" },
    { name: "X6 (F16/G06)", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format", year: "2014–2024", type: "Sports SAV" },
  ],
  "Mercedes-Benz": [
    { name: "C-Class (W204/W205/W206)", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", year: "2007–2024", type: "Sedan" },
    { name: "S550 (W221/W222)", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", year: "2005–2024", type: "Luxury Sedan" },
    { name: "E-Class (W212/W213)", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", year: "2009–2024", type: "Sedan" },
    { name: "GLC-Class", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", year: "2015–2024", type: "Compact SUV" },
    { name: "GLE-Class", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", year: "2015–2024", type: "Mid-Size SUV" },
  ],
  "Honda": [
    { name: "Civic (FD/FB/FC)", img: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format", year: "2006–2024", type: "Sedan/Hatchback" },
    { name: "CR-V", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2007–2024", type: "Compact SUV" },
    { name: "Accord", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", year: "2008–2024", type: "Sedan" },
    { name: "HR-V", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", year: "2014–2024", type: "Subcompact SUV" },
    { name: "Fit/Jazz", img: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format", year: "2008–2020", type: "Hatchback" },
  ],
  "Ford": [
    { name: "Ranger (T6/T7/T8)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&auto=format", year: "2011–2024", type: "Pickup Truck" },
    { name: "Everest", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2015–2024", type: "SUV" },
    { name: "Focus", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", year: "2011–2022", type: "Hatchback/Sedan" },
    { name: "Explorer", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2011–2024", type: "Full-Size SUV" },
  ],
  "Hyundai": [
    { name: "Tucson", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2009–2024", type: "Compact SUV" },
    { name: "Santa Fe", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2006–2024", type: "Mid-Size SUV" },
    { name: "Elantra", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", year: "2010–2024", type: "Sedan" },
    { name: "i10", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2013–2024", type: "City Car" },
    { name: "i20", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2014–2024", type: "Supermini" },
  ],
  "Suzuki": [
    { name: "Swift", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2010–2024", type: "Supermini" },
    { name: "Vitara", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2015–2024", type: "Compact SUV" },
    { name: "Jimny", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&auto=format", year: "1998–2024", type: "Mini SUV" },
    { name: "Alto", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2009–2024", type: "City Car" },
    { name: "Ertiga", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2012–2024", type: "MPV" },
  ],
  "Lexus": [
    { name: "RX350", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2009–2024", type: "Luxury SUV" },
    { name: "LX570", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2007–2021", type: "Full-Size Luxury SUV" },
    { name: "IS250", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format", year: "2005–2015", type: "Luxury Sedan" },
    { name: "GX460", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2009–2024", type: "Luxury SUV" },
    { name: "ES300h", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format", year: "2012–2024", type: "Hybrid Luxury Sedan" },
  ],
  "Nissan": [
    { name: "Navara (D40/D23)", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&auto=format", year: "2005–2024", type: "Pickup Truck" },
    { name: "X-Trail", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2007–2024", type: "Compact SUV" },
    { name: "Patrol", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2010–2024", type: "Full-Size SUV" },
    { name: "Note", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2012–2024", type: "Hatchback" },
    { name: "Tiida", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2004–2018", type: "Compact" },
  ],
  "Mitsubishi": [
    { name: "Pajero (V6/V8)", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2000–2021", type: "Full-Size SUV" },
    { name: "L200 Triton", img: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&auto=format", year: "2006–2024", type: "Pickup Truck" },
    { name: "Outlander", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", year: "2012–2024", type: "Compact SUV" },
    { name: "Eclipse Cross", img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", year: "2017–2024", type: "Compact SUV" },
  ],
};

// ─── CATEGORIES WITH REAL PART IMAGES ─────────────────────────────────────────
const CATEGORIES_WITH_SUBCATEGORIES: Record<string, { subcategories: string[]; icon: string; image: string; description: string }> = {
  "Braking Systems": {
    subcategories: ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"],
    icon: "🛑",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800",
    description: "Pads, discs, calipers & more"
  },
  "Engine Components": {
    subcategories: ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"],
    icon: "⚙️",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
    description: "Filters, plugs, belts & injectors"
  },
  "Transmission & Gear": {
    subcategories: ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Gearbox"],
    icon: "🔧",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800",
    description: "Clutch kits, gearbox & fluids"
  },
  "Steering Systems": {
    subcategories: ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"],
    icon: "🎯",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800",
    description: "Racks, pumps & linkage"
  },
  "Suspension & Chassis": {
    subcategories: ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"],
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800",
    description: "Shocks, springs & control arms"
  },
  "Electrical & Sensors": {
    subcategories: ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"],
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1552338804-c6d7a91ff430?q=80&w=800",
    description: "Alternators, sensors & ECUs"
  },
  "Alloys & Rims": {
    subcategories: ["Alloy Wheels", "Wheel Caps", "Lug Nuts", "Wheel Spacers"],
    icon: "🔵",
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800",
    description: "Alloys & wheel accessories"
  },
  "Lubricants & Fluids": {
    subcategories: ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"],
    icon: "🛢️",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
    description: "Oils, coolants & fluids"
  },
  "Body Kits & Styling": {
    subcategories: ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Headlights"],
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800",
    description: "Bumpers, headlights & styling"
  },
  "Glass & Windscreens": {
    subcategories: ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"],
    icon: "🪟",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800",
    description: "Windscreens, glass & wipers"
  },
  "Tyres": {
    subcategories: ["Bridgestone", "Michelin", "Continental", "Pirelli", "Goodyear", "Dunlop"],
    icon: "🛞",
    image: "https://m.media-amazon.com/images/I/71Yw5TCcPLL._AC_SL1500_.jpg",
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
                  <img src={data.image} alt={cat} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700" />
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
                    <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-[#E42933] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                      <Grid size={16} />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#E42933] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-12 h-12 border-4 border-gray-100 border-t-[#E42933] rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Parts...</p>
                </div>
              ) : pageItems.length > 0 ? (
                <>
                  <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5" : "space-y-4"}>
                    {pageItems.map((product) => (
                      <div key={product.id}
                        className={`bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#E42933]/20 transition-all duration-500 group ${viewMode === "list" ? "flex h-44" : ""}`}>
                        <div className={`relative bg-gray-50 overflow-hidden ${viewMode === "list" ? "w-44 flex-shrink-0" : "aspect-square"}`}>
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400";
                            }}
                          />
                          {product.comparePrice && product.price < product.comparePrice && (
                            <span className="absolute top-3 left-3 bg-[#E42933] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                              Save {Math.round((1 - product.price / product.comparePrice) * 100)}%
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <p className="text-[10px] font-black text-[#E42933] uppercase tracking-widest mb-1.5">{product.brand} • {product.model}</p>
                          <h3 className="text-sm font-black text-gray-900 mb-2 line-clamp-2 uppercase tracking-tight group-hover:text-[#E42933] transition-colors leading-tight">{product.name}</h3>
                          {product.partNumber && (
                            <p className="text-[10px] text-gray-400 font-mono mb-2">Part #: {product.partNumber}</p>
                          )}
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              <p className="text-lg font-black text-gray-900">KES {product.price.toLocaleString()}</p>
                              {product.comparePrice && <p className="text-xs text-gray-400 line-through font-bold">KES {product.comparePrice.toLocaleString()}</p>}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${addedToCart === product.id ? "bg-green-500 text-white" : product.stock === 0 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-[#E42933] shadow-lg shadow-gray-200 hover:shadow-[#E42933]/30"}`}
                            >
                              {addedToCart === product.id ? <Check size={16} /> : <ShoppingCart size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-900 hover:border-[#E42933] hover:text-[#E42933] disabled:opacity-40 transition-all">
                        Previous
                      </button>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === p ? "bg-[#E42933] text-white" : "bg-white border-2 border-gray-100 text-gray-900 hover:border-[#E42933] hover:text-[#E42933]"}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-900 hover:border-[#E42933] hover:text-[#E42933] disabled:opacity-40 transition-all">
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <Package size={64} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-900 font-black uppercase tracking-tighter text-xl">No Parts Found</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
                  <button onClick={clearAll} className="mt-6 px-8 py-3 bg-[#E42933] text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors">
                    Start Over
                  </button>
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
