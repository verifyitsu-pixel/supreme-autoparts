import { useState } from "react";
import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";
import { Search, Filter } from "lucide-react";

const CATEGORIES = [
  "All Parts", "Alloys & Rims", "Brakes", "Electricals", "Engine Parts",
  "Gear Parts", "Lubricants", "Steering", "Suspension Parts", "Body Kits", "Used Parts",
];

const PRODUCTS = [
  { name: "AC Blower Motor", category: "Electricals", price: "KES 8,500", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "AC Compressor A8", category: "Electricals", price: "KES 25,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Antilock Braking System", category: "Brakes", price: "KES 15,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Automatic Transmission Fluid", category: "Lubricants", price: "KES 2,800", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80" },
  { name: "BMW Railing Carrier Roof Rack", category: "Body Kits", price: "KES 45,000", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80" },
  { name: "Ball Joint Volkswagen", category: "Suspension Parts", price: "KES 3,200", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Battery Charger Cable", category: "Electricals", price: "KES 1,500", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Brake Pads Mercedes-Benz", category: "Brakes", price: "KES 5,500", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Camshaft BMW N54", category: "Engine Parts", price: "KES 35,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Carburetor Toyota Hilux", category: "Engine Parts", price: "KES 18,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Clutch Kit Ford Ranger", category: "Gear Parts", price: "KES 12,000", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
  { name: "Crankshaft Sensor", category: "Engine Parts", price: "KES 4,500", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Differential Gear Set", category: "Gear Parts", price: "KES 22,000", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
  { name: "Disc Brake Rotors Audi", category: "Brakes", price: "KES 7,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Engine Oil 5W-30 Shell", category: "Lubricants", price: "KES 3,500", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80" },
  { name: "Engine Oil Castrol 10W-40", category: "Lubricants", price: "KES 3,200", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80" },
  { name: "Exhaust Manifold VW Golf", category: "Engine Parts", price: "KES 9,500", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Front Lower Arm BMW", category: "Suspension Parts", price: "KES 11,000", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Fuel Filter Mercedes", category: "Engine Parts", price: "KES 2,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Fuse Box Toyota", category: "Electricals", price: "KES 6,500", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Gearbox Mountings", category: "Gear Parts", price: "KES 4,000", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
  { name: "Headlight Assembly Honda", category: "Electricals", price: "KES 8,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Motor Engine Oil", category: "Lubricants", price: "KES 4,000", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80" },
  { name: "Oil Filter Universal", category: "Engine Parts", price: "KES 800", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Power Steering Pump", category: "Steering", price: "KES 14,000", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Radiator Ford Ranger", category: "Engine Parts", price: "KES 16,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Rear Shock Absorbers", category: "Suspension Parts", price: "KES 8,500", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Side Mirror Assembly", category: "Body Kits", price: "KES 5,000", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80" },
  { name: "Starter Motor Toyota", category: "Engine Parts", price: "KES 12,500", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Steering Rack BMW", category: "Steering", price: "KES 35,000", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Strut Assembly Front", category: "Suspension Parts", price: "KES 12,000", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Tie Rod End", category: "Steering", price: "KES 2,500", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Torque Converter", category: "Gear Parts", price: "KES 28,000", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
  { name: "Turbocharger Kit", category: "Engine Parts", price: "KES 65,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Water Pump BMW", category: "Engine Parts", price: "KES 7,500", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Wheel Bearing Kit", category: "Suspension Parts", price: "KES 4,800", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Window Motor Regulator", category: "Electricals", price: "KES 6,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Alloy Rim 18-inch BMW", category: "Alloys & Rims", price: "KES 35,000", img: "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=400&q=80" },
  { name: "Alloy Rim 20-inch Mercedes", category: "Alloys & Rims", price: "KES 48,000", img: "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=400&q=80" },
  { name: "Caliper Assembly", category: "Brakes", price: "KES 9,500", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Control Arm Bushing", category: "Suspension Parts", price: "KES 1,800", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
  { name: "Cylinder Head Gasket", category: "Engine Parts", price: "KES 5,500", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
  { name: "Door Handle Exterior", category: "Body Kits", price: "KES 3,500", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80" },
  { name: "Alternator 12V", category: "Electricals", price: "KES 18,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Drive Shaft CV Joint", category: "Gear Parts", price: "KES 15,000", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
  { name: "Timing Belt Kit", category: "Engine Parts", price: "KES 12,000", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80" },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All Parts");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All Parts" || p.category === activeCategory)
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
            <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Products</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>Products</span>
            </p>
          </div>
        </div>

        <section className="py-12 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
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
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pageItems.map((product) => (
                    <div
                      key={product.name}
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
                        <p className="text-xs text-[oklch(0.45_0.22_27)] font-semibold uppercase tracking-wide mb-1">
                          {product.category}
                        </p>
                        <h3 className="text-sm font-bold text-gray-800 leading-tight mb-2">{product.name}</h3>
                        <p className="text-sm font-bold text-[oklch(0.45_0.22_27)]">{product.price}</p>
                        <Link
                          href="/contact"
                          className="mt-2 text-xs font-bold uppercase tracking-wide text-[oklch(0.45_0.22_27)] hover:underline flex items-center gap-1"
                        >
                          Read more →
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
                      className="bg-white text-[oklch(0.45_0.22_27)] font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-gray-100 transition-colors"
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
