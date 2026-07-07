import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  Search, Menu, X, User, ShoppingCart, ChevronDown, LogOut,
  Settings, Heart, Package, Phone, Mail, MapPin, Bell, ChevronRight,
  Truck, Shield, Clock, Award, Tag, Zap
} from "lucide-react";

const CATEGORIES = [
  { name: "Braking Systems", icon: "🛑", subcategories: ["Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Brake Hoses"] },
  { name: "Engine Components", icon: "⚙️", subcategories: ["Air Filters", "Oil Filters", "Spark Plugs", "Engine Belts", "Fuel Injectors"] },
  { name: "Transmission & Gear", icon: "🔧", subcategories: ["Transmission Fluid", "Clutch Kits", "Gaskets", "Seals", "Flywheel"] },
  { name: "Steering Systems", icon: "🎯", subcategories: ["Steering Racks", "Tie Rod Ends", "Power Steering Pumps", "Steering Sensors", "Steering Linkage"] },
  { name: "Suspension & Chassis", icon: "🚗", subcategories: ["Shock Absorbers", "Springs", "Struts", "Control Arms", "Suspension Bushings"] },
  { name: "Electrical & Sensors", icon: "⚡", subcategories: ["Alternators", "Batteries", "Starters", "Oxygen Sensors", "ECU Modules"] },
  { name: "Alloys & Rims", icon: "🔵", subcategories: ["Alloy Wheels", "Tire Sets", "Wheel Caps", "Lug Nuts", "Wheel Spacers"] },
  { name: "Lubricants & Fluids", icon: "🛢️", subcategories: ["Engine Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Power Steering Fluid"] },
  { name: "Body Kits & Styling", icon: "🎨", subcategories: ["Front Bumpers", "Rear Bumpers", "Side Skirts", "Spoilers", "Body Panels"] },
  { name: "Glass & Windscreens", icon: "🪟", subcategories: ["Windscreens", "Door Glass", "Rear Glass", "Glass Seals", "Wipers"] },
  { name: "Certified Used Parts", icon: "✅", subcategories: ["Used Engines", "Used Transmissions", "Used Alternators", "Used Starters", "Used Gearboxes"] },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/settings/public").then(r => r.json()).then(setStoreSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setLocation("/");
  };

  const announcement = storeSettings?.announcementBar || "🚚 Free shipping on orders over KES 10,000 | Call us: +254 714 498 451";
  const showAnnouncement = storeSettings?.announcementBarEnabled !== false && announcementVisible;

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#E42933] text-white text-xs py-2 px-4 text-center relative z-50">
          <span className="font-medium">{announcement}</span>
          <button onClick={() => setAnnouncementVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? "shadow-lg" : ""}`}>
        {/* Top Bar - Contact Info */}
        <div className="hidden lg:block bg-[#1a1a1a] text-gray-300 text-xs">
          <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="tel:+254714498451" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={11} /> <span>{storeSettings?.storePhone || "+254 714 498 451"}</span>
              </a>
              <a href="mailto:valvin@supremeautoparts.co.ke" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail size={11} /> <span>valvin@supremeautoparts.co.ke</span>
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin size={11} /> <span>Nairobi, Kenya</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Truck size={11} /> Nationwide Delivery</span>
              <span className="flex items-center gap-1.5"><Shield size={11} /> Genuine Parts Guarantee</span>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center gap-3 h-16 md:h-[70px]">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 mr-2">
                <img src="/assets/images/logo-horizontal.png" alt="Supreme Autoparts" className="h-9 md:h-11 w-auto object-contain" />
              </Link>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
                <div className="flex w-full rounded-lg border-2 border-[#E42933] overflow-hidden">
                  <select className="bg-gray-50 border-r border-gray-200 text-gray-700 text-xs px-3 py-2 focus:outline-none cursor-pointer min-w-[120px]">
                    <option>All Categories</option>
                    {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Search parts, brands, models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <button type="submit" className="bg-[#E42933] hover:bg-[#c41f28] text-white px-5 py-2.5 transition-colors flex items-center gap-2">
                    <Search size={18} />
                    <span className="hidden lg:inline text-sm font-semibold">Search</span>
                  </button>
                </div>
              </form>

              {/* Right Actions */}
              <div className="flex items-center gap-1 ml-auto md:ml-0">
                {/* Wishlist */}
                <button className="hidden md:flex flex-col items-center p-2 text-gray-600 hover:text-[#E42933] transition-colors">
                  <Heart size={20} />
                  <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
                </button>

                {/* Cart */}
                <Link href="/cart" className="flex flex-col items-center p-2 text-gray-600 hover:text-[#E42933] transition-colors relative">
                  <div className="relative">
                    <ShoppingCart size={22} />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#E42933] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-[10px] mt-0.5 font-medium">Cart</span>
                </Link>

                {/* User Account */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex flex-col items-center p-2 text-gray-600 hover:text-[#E42933] transition-colors"
                  >
                    <User size={22} />
                    <span className="hidden md:block text-[10px] mt-0.5 font-medium truncate max-w-[60px]">
                      {user ? user.name.split(" ")[0] : "Account"}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-[200] overflow-hidden">
                      {user ? (
                        <>
                          <div className="px-4 py-3 bg-gradient-to-r from-[#E42933]/10 to-transparent border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#E42933] flex items-center justify-center text-white font-bold text-sm">
                                {user.name[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </div>
                          {[
                            { href: "/dashboard", icon: Package, label: "My Orders" },
                            { href: "/dashboard?tab=invoices", icon: Tag, label: "Invoices" },
                            { href: "/dashboard?tab=addresses", icon: MapPin, label: "My Addresses" },
                            { href: "/dashboard?tab=profile", icon: Settings, label: "Account Settings" },
                          ].map(item => (
                            <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                              <item.icon size={15} className="text-gray-400" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 text-sm">
                            <LogOut size={15} />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="p-4 border-b border-gray-100">
                            <Link href="/login" onClick={() => setUserMenuOpen(false)}
                              className="block w-full bg-[#E42933] text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-[#c41f28] transition-colors mb-2">
                              Sign In
                            </Link>
                            <Link href="/register" onClick={() => setUserMenuOpen(false)}
                              className="block w-full border border-gray-300 text-gray-700 text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                              Create Account
                            </Link>
                          </div>
                          <div className="px-4 py-3 text-xs text-gray-500">
                            <p className="font-medium text-gray-700 mb-1">New to Supreme Autoparts?</p>
                            <p>Sign up for exclusive deals and order tracking.</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-[#E42933] transition-colors"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch} className="flex rounded-lg border-2 border-[#E42933] overflow-hidden">
                <input
                  type="text"
                  placeholder="Search parts, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button type="submit" className="bg-[#E42933] text-white px-4 py-2.5">
                  <Search size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="hidden md:block bg-[#222222] text-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center gap-1 h-11">
              {/* All Categories Dropdown */}
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] px-4 h-11 text-sm font-semibold transition-colors"
                >
                  <Menu size={16} />
                  <span>All Categories</span>
                  <ChevronDown size={14} className={`transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {categoryMenuOpen && (
                  <div className="absolute left-0 top-full w-64 bg-white shadow-2xl z-[200] border border-gray-100 rounded-b-xl overflow-hidden">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.name} className="group relative">
                        <button
                          onClick={() => { setLocation(`/shop/brands?category=${encodeURIComponent(cat.name)}`); setCategoryMenuOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-[#E42933] hover:text-white transition-colors text-sm"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-base">{cat.icon}</span>
                            <span className="font-medium">{cat.name}</span>
                          </span>
                          <ChevronRight size={14} />
                        </button>
                        {/* Submenu */}
                        <div className="absolute left-full top-0 w-56 bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[300]">
                          <div className="px-4 py-2 bg-[#E42933] text-white text-xs font-bold uppercase tracking-wider">{cat.name}</div>
                          {cat.subcategories.map(sub => (
                            <button key={sub} onClick={() => { setLocation(`/shop/brands?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`); setCategoryMenuOpen(false); }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-[#E42933] hover:bg-gray-50 transition-colors">
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Nav Links */}
              {[
                { label: "🔥 Hot Deals", path: "/products?sort=deals" },
                { label: "Toyota Parts", path: "/products?brand=Toyota" },
                { label: "BMW Parts", path: "/products?brand=BMW" },
                { label: "Mercedes Parts", path: "/products?brand=Mercedes-Benz" },
                { label: "Brands", path: "/brands" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map(item => (
                <Link key={item.path} href={item.path}
                  className={`px-3 h-11 flex items-center text-sm font-medium transition-colors hover:bg-white/10 whitespace-nowrap ${location === item.path ? "text-[#E42933]" : "text-gray-200"}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[85vw] max-w-sm bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#E42933] text-white">
              <img src="/assets/images/logo-horizontal.png" alt="Supreme Autoparts" className="h-8 w-auto brightness-0 invert" />
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>

            {/* User Section */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E42933] flex items-center justify-center text-white font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 bg-[#E42933] text-white text-center py-2.5 rounded-lg font-semibold text-sm">Sign In</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 border border-gray-300 text-gray-700 text-center py-2.5 rounded-lg font-semibold text-sm">Register</Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            {user && (
              <div className="border-b border-gray-100">
                {[
                  { href: "/dashboard", icon: Package, label: "My Orders" },
                  { href: "/cart", icon: ShoppingCart, label: `Cart (${itemCount})` },
                  { href: "/dashboard?tab=profile", icon: Settings, label: "Account Settings" },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50 text-sm">
                    <item.icon size={18} className="text-[#E42933]" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Categories */}
            <div className="flex-1">
              <div className="px-4 py-2 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">Categories</div>
              {CATEGORIES.map(cat => (
                <div key={cat.name} className="border-b border-gray-50">
                  <button
                    onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.name ? null : cat.name)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-50 text-sm font-medium"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedMobileCategory === cat.name ? "rotate-180" : ""}`} />
                  </button>
                  {expandedMobileCategory === cat.name && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {cat.subcategories.map(sub => (
                        <button key={sub} onClick={() => { setLocation(`/shop/brands?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`); setMobileMenuOpen(false); }}
                          className="block w-full text-left px-8 py-2.5 text-sm text-gray-600 hover:text-[#E42933] hover:bg-white transition-colors">
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Links */}
            <div className="border-t border-gray-200 p-4 space-y-2">
              {[
                { href: "/shop/brands", label: "Shop by Brand" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-gray-600 hover:text-[#E42933] transition-colors">
                  {item.label}
                </Link>
              ))}
              {user && (
                <button onClick={handleLogout} className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 transition-colors">
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      {/* Trust Badges */}
      <div className="border-b border-white/10 py-8">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Nationwide Delivery", desc: "Fast shipping across Kenya" },
              { icon: Shield, title: "Genuine Parts", desc: "100% authentic OEM parts" },
              { icon: Clock, title: "24hr Dispatch", desc: "Orders dispatched quickly" },
              { icon: Award, title: "Certified Dealer", desc: "Authorized parts dealer" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E42933]/20 flex items-center justify-center flex-shrink-0">
                  <item.icon size={22} className="text-[#E42933]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <img src="/assets/images/logo-horizontal.png" alt="Supreme Autoparts" className="h-10 w-auto mb-4 brightness-0 invert opacity-90" />
              <p className="text-sm text-gray-400 leading-relaxed mb-4">Kenya's premier destination for genuine OEM auto parts. Serving customers since 1987.</p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", href: "#" },
                  { label: "Instagram", href: "#" },
                  { label: "WhatsApp", href: "https://wa.me/254714498451" },
                ].map(s => (
                  <a key={s.label} href={s.href} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E42933] flex items-center justify-center text-xs font-bold transition-colors">
                    {s.label[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Shop All Parts", href: "/products" },
                  { label: "Shop by Brand", href: "/shop/brands" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Track Order", href: "/dashboard" },
                ].map(l => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "My Account", href: "/dashboard" },
                  { label: "Returns & Refunds", href: "/refund-policy" },
                  { label: "Shipping Policy", href: "/returns" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms-and-conditions" },
                ].map(l => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-3">
                <a href="tel:+254714498451" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Phone size={15} className="text-[#E42933] flex-shrink-0" />
                  <span>+254 714 498 451</span>
                </a>
                <a href="mailto:valvin@supremeautoparts.co.ke" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Mail size={15} className="text-[#E42933] flex-shrink-0" />
                  <span>valvin@supremeautoparts.co.ke</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin size={15} className="text-[#E42933] flex-shrink-0 mt-0.5" />
                  <span>Nairobi, Kenya</span>
                </div>
                <a href="https://wa.me/254714498451" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2">
                  <span>💬</span> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Supreme Autoparts. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">We accept:</span>
            {["M-Pesa", "Visa", "Mastercard", "PayPal"].map(p => (
              <span key={p} className="bg-white/10 text-xs text-gray-300 px-2 py-1 rounded font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
