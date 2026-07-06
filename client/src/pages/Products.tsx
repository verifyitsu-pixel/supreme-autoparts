import { useState, useEffect } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { Search, Filter, X } from "lucide-react";

const CATEGORIES = [
  "All Parts", "Alloys & Rims", "Brakes", "Electricals", "Engine Parts",
  "Gear Parts", "Lubricants", "Steering", "Suspension Parts", "Body Kits", "Used Parts",
];

const PRODUCTS = [
  // TOYOTA
  { name: "Toyota Genuine Brake Pads", category: "Brakes", brand: "Toyota", price: "KES 5,500", img: "/assets/images/products/toyota-brake-pads.jpg" },
  { name: "Toyota Air Filter", category: "Engine Parts", brand: "Toyota", price: "KES 1,800", img: "/manus-storage/zPFMUNhMi0Ew_b44d9215.jpg" },
  { name: "Toyota Oil Filter", category: "Engine Parts", brand: "Toyota", price: "KES 1,200", img: "/manus-storage/zPFMUNhMi0Ew_b44d9215.jpg" },
  { name: "Toyota Hilux Carburetor", category: "Engine Parts", brand: "Toyota", price: "KES 18,000", img: "/manus-storage/GO7ybAG0jxp4_8f770ca8.webp" },
  { name: "Toyota Fuse Box", category: "Electricals", brand: "Toyota", price: "KES 6,500", img: "/manus-storage/dYYk704pp5FU_59bcbaf8.jpg" },
  { name: "Toyota Starter Motor", category: "Engine Parts", brand: "Toyota", price: "KES 12,500", img: "/manus-storage/H327vhS6DEWU_1cbc3c60.jpg" },

  // BMW
  { name: "BMW Genuine Oil Filter Kit", category: "Engine Parts", brand: "BMW", price: "KES 3,500", img: "/assets/images/products/bmw-oil-filter.jpg" },
  { name: "BMW Railing Carrier Roof Rack", category: "Body Kits", brand: "BMW", price: "KES 45,000", img: "/manus-storage/GXZUdoXVzqPQ_5abad503.jpg" },
  { name: "BMW Camshaft N54", category: "Engine Parts", brand: "BMW", price: "KES 35,000", img: "/manus-storage/Cj14kqW0EFHE_663f6f7b.jpg" },
  { name: "BMW Front Lower Arm", category: "Suspension Parts", brand: "BMW", price: "KES 11,000", img: "/manus-storage/PFo1pre5XNwy_22a198d0.png" },
  { name: "BMW Steering Rack", category: "Steering", brand: "BMW", price: "KES 35,000", img: "/manus-storage/zkPNJza6nOuS_759a5d60.jpg" },
  { name: "BMW Water Pump", category: "Engine Parts", brand: "BMW", price: "KES 7,500", img: "/manus-storage/UsHolq2JTjAa_d9faff3e.jpg" },
  { name: "BMW Alloy Rim 18-inch", category: "Alloys & Rims", brand: "BMW", price: "KES 35,000", img: "/manus-storage/uheUzyXJXuab_451facf8.jpg" },

  // MERCEDES-BENZ
  { name: "Mercedes-Benz Shock Absorber", category: "Suspension Parts", brand: "Mercedes-Benz", price: "KES 14,500", img: "/assets/images/products/mercedes-shock-absorber.jpg" },
  { name: "Mercedes-Benz Brake Pads", category: "Brakes", brand: "Mercedes-Benz", price: "KES 5,500", img: "/manus-storage/TgbmGhpPhcaO_67125cf6.jpg" },
  { name: "Mercedes Fuel Filter", category: "Engine Parts", brand: "Mercedes-Benz", price: "KES 2,000", img: "/manus-storage/qycEYakJQzm7_80a8344c.jpg" },
  { name: "Mercedes Alloy Rim 20-inch", category: "Alloys & Rims", brand: "Mercedes-Benz", price: "KES 48,000", img: "/manus-storage/YkTorajED7yL_485d744f.jpg" },

  // HONDA
  { name: "Honda Headlight Assembly", category: "Electricals", brand: "Honda", price: "KES 12,000", img: "/assets/images/products/honda-headlight.jpg" },
  { name: "Honda Civic Brake Discs", category: "Brakes", brand: "Honda", price: "KES 9,000", img: "/manus-storage/GsXjhKiBYVt2_82d1e305.jpg" },

  // FORD
  { name: "Ford Ranger Radiator", category: "Engine Parts", brand: "Ford", price: "KES 16,000", img: "/assets/images/products/ford-radiator.jpg" },
  { name: "Ford Ranger Clutch Kit", category: "Gear Parts", brand: "Ford", price: "KES 12,000", img: "/manus-storage/RXcTD4AjzfOZ_e4689606.jpg" },

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
  { name: "AC Blower Motor", category: "Electricals", brand: "Universal", price: "KES 8,500", img: "/manus-storage/B64ZG02QbuFg_daace09a.jpg" },
  { name: "Antilock Braking System", category: "Brakes", brand: "Universal", price: "KES 15,000", img: "/manus-storage/qe91vSqdJL9S_1d3c6406.jpg" },
  { name: "Automatic Transmission Fluid", category: "Lubricants", brand: "Universal", price: "KES 2,800", img: "/manus-storage/lICQCnHriqD6_a6ef8f18.jpeg" },
  { name: "Engine Oil 5W-30 Shell", category: "Lubricants", brand: "Universal", price: "KES 3,500", img: "/manus-storage/zx3mpd38mqwh_1dd516ab.jpg" },
  { name: "Engine Oil Castrol 10W-40", category: "Lubricants", brand: "Universal", price: "KES 3,200", img: "/manus-storage/lyq8mGbYVNzx_980b6d3c.jpg" },
  { name: "Power Steering Pump", category: "Steering", brand: "Universal", price: "KES 14,000", img: "/manus-storage/zz0xcWQ26Pwl_81008dae.jpg" },
  { name: "Turbocharger Kit", category: "Engine Parts", brand: "Universal", price: "KES 65,000", img: "/manus-storage/Cj14kqW0EFHE_663f6f7b.jpg" },
];

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All Parts");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");
  const [page, setPage] = useState(1);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
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
                        <Link
                          href={`/order?product=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}`}
                          className="mt-2 text-xs font-bold uppercase tracking-wide text-[oklch(0.45_0.22_27)] hover:underline flex items-center gap-1"
                        >
                          Order Now →
                        </Link>
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

                {/* Contact CTA */}
                <div className="mt-12 bg-gray-900 p-8 text-center rounded-sm">
                  <p className="text-white text-lg font-bold mb-2">Can't find what you're looking for?</p>
                  <p className="text-gray-400 text-sm mb-4">We source all types of auto spare parts. Let us help you find it!</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="tel:+254714498451"
                      className="btn-primary justify-center"
                    >
                      CALL US NOW
                    </a>
                    <Link
                      href="/contact"
                      className="bg-white text-[oklch(0.45_0.22_27)] font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      SEND INQUIRY
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
