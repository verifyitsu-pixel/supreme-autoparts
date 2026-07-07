import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  Menu,
  X,
  User,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  LogOut,
  Settings,
  Heart,
  Package,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Braking Systems",
    subcategories: ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"],
  },
  {
    name: "Engine Components",
    subcategories: ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"],
  },
  {
    name: "Transmission & Gear",
    subcategories: ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Flywheel"],
  },
  {
    name: "Steering Systems",
    subcategories: ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"],
  },
  {
    name: "Suspension & Chassis",
    subcategories: ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"],
  },
  {
    name: "Electrical & Sensors",
    subcategories: ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"],
  },
  {
    name: "Alloys & Rims",
    subcategories: ["Alloy Wheels", "Tire Sets", "Wheel Caps", "Lug Nuts", "Wheel Spacers"],
  },
  {
    name: "Lubricants & Fluids",
    subcategories: ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"],
  },
  {
    name: "Body Kits & Styling",
    subcategories: ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Body Panels"],
  },
  {
    name: "Glass & Windscreens",
    subcategories: ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"],
  },
  {
    name: "Certified Used Parts",
    subcategories: ["Used Engines", "Used Transmissions", "Used Alternators", "Used Starters", "Used Gearboxes"],
  },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [, setLocationPath] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white shadow-2xl py-3"
            : "bg-gradient-to-b from-black/95 to-black/60 backdrop-blur-md py-4"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Top Row: Logo + Search + User Menu */}
          <div className="flex items-center justify-between gap-6 mb-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group hover:opacity-90 transition-opacity">
              <img
                src="/assets/images/logo-horizontal.png"
                alt="Supreme Autoparts"
                className={`transition-all duration-500 ${isScrolled ? "h-10" : "h-12"}`}
              />
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search parts, brands, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E42933] transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right Side: Cart + User */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                href="/cart"
                className={`relative transition-colors duration-300 hover:text-[#E42933] ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                <ShoppingBag size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E42933] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <User size={20} />
                  {user && <span className="text-xs font-semibold hidden sm:inline">{user.name.split(" ")[0]}</span>}
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-[100] overflow-hidden">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package size={16} />
                          <span className="text-sm">My Dashboard</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart size={16} />
                          <span className="text-sm">Saved Items</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings size={16} />
                          <span className="text-sm">Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                        >
                          <LogOut size={16} />
                          <span className="text-sm">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-[#E42933] hover:bg-red-50 transition-colors font-semibold border-t border-gray-200"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Categories Menu */}
          <div className="hidden lg:flex items-center gap-8 border-t border-white/10 pt-3">
            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#E42933] ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Categories
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-64 bg-white rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] py-4">
                {CATEGORIES.map((category) => (
                  <div key={category.name} className="group/sub">
                    <button 
                      onClick={() => setLocationPath(`/products?category=${encodeURIComponent(category.name)}`)}
                      className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-sm font-semibold">{category.name}</span>
                      <ChevronDown size={14} className="group-hover/sub:rotate-180 transition-transform" />
                    </button>
                    {/* Sub-categories */}
                    <div className="hidden group-hover/sub:block bg-gray-50 border-l-2 border-[#E42933]">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setLocationPath(`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`)}
                          className="block w-full text-left px-6 py-2 text-xs text-gray-600 hover:text-[#E42933] hover:bg-white transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Navigation Links */}
            {[
              { name: "Brands", path: "/brands" },
              { name: "Inventory", path: "/products" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#E42933] relative group ${
                  location === item.path
                    ? "text-[#E42933]"
                    : isScrolled
                    ? "text-gray-700"
                    : "text-white"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-[#E42933] transition-all duration-300 group-hover:w-full ${
                    location === item.path ? "w-full" : ""
                  }`}
                ></span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {!isScrolled && (
        <div className="fixed top-20 left-0 right-0 z-40 md:hidden bg-black/90 backdrop-blur-md p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E42933] transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-[90] pt-24 pb-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white text-lg font-black">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-[#E42933] transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E42933] transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-4 mb-8">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Categories</h4>
              {CATEGORIES.map((category) => (
                <div key={category.name}>
                  <button className="w-full text-left text-white font-semibold py-2 hover:text-[#E42933] transition-colors">
                    {category.name}
                  </button>
                  <div className="pl-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setLocationPath(`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`);
                          setMobileMenuOpen(false);
                        }}
                        className="block text-gray-400 text-sm hover:text-[#E42933] transition-colors text-left w-full"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Contact Info */}
            <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Quick Support</h4>
              <div className="space-y-3">
                <a href="tel:+254714498451" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={16} className="text-[#E42933]" />
                  <span className="text-sm font-medium">+254 714 498 451</span>
                </a>
                <a href="mailto:calvin@supremeautoparts.co.ke" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={16} className="text-[#E42933]" />
                  <span className="text-sm font-medium">calvin@supremeautoparts.co.ke</span>
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={16} className="text-[#E42933] mt-1 shrink-0" />
                  <div>
                    <span className="text-sm font-medium block">MIDAX Plaza, Kangundo Rd</span>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=MIDAX+Plaza+Kangundo+Rd+Nairobi" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#E42933] uppercase tracking-widest hover:underline mt-1 block"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-4 border-t border-gray-700 pt-8">
              {[
                { name: "Brands", path: "/brands" },
                { name: "Inventory", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-lg font-black uppercase tracking-widest hover:text-[#E42933] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className={`${isScrolled ? "h-16" : "h-24"} md:${isScrolled ? "h-16" : "h-32"}`} />
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="text-white font-black mb-4">About Supreme</h4>
            <p className="text-sm leading-relaxed">
              Kenya's leading automotive parts supplier with genuine OEM components for all major brands.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#E42933] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E42933] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#E42933] transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#E42933] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#E42933] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#E42933] transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:calvin@supremeautoparts.co.ke" className="hover:text-[#E42933] transition-colors">calvin@supremeautoparts.co.ke</a></li>
              <li>Phone: <a href="tel:+254714498451" className="hover:text-[#E42933] transition-colors">+254 714 498 451</a></li>
              <li>MIDAX Plaza, Kangundo Rd, Nairobi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2024 Supreme Autoparts. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#E42933] transition-colors">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E42933] transition-colors">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E42933] transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
