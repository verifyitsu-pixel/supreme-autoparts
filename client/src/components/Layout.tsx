import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, Clock, MapPin, ChevronDown, MessageCircle, Send, Instagram, ShieldCheck, CheckCircle2 } from "lucide-react";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "PRODUCTS", href: "/products" },
  { label: "BRANDS", href: "/brands" },
  { label: "CONTACT US", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#1a1a1a] text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between py-2.5">
          <div className="flex items-center gap-8">
            <a href="mailto:supremeautopartskenya@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={12} className="text-[oklch(0.45_0.22_27)]" />
              <span>supremeautopartskenya@gmail.com</span>
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={12} className="text-[oklch(0.45_0.22_27)]" />
              <span>Nairobi, Kenya</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock size={12} className="text-[oklch(0.45_0.22_27)]" />
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </span>
            <div className="flex items-center gap-3 border-l border-gray-700 pl-6">
              <a href="https://www.instagram.com/supremeautoke" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`bg-white border-b border-gray-100 transition-all duration-300 ${scrolled ? "py-3 shadow-xl" : "py-5"}`}>
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="bg-[oklch(0.45_0.22_27)] text-white p-1.5 rounded-sm group-hover:rotate-12 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter text-gray-900" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>SUPREME</span>
              <span className="text-[10px] font-black tracking-[0.4em] text-[oklch(0.45_0.22_27)] -mt-0.5">AUTOPARTS</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-[oklch(0.45_0.22_27)] ${
                  location === link.href ? "text-[oklch(0.45_0.22_27)]" : "text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA phone */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Expert Support</span>
              <a href="tel:+254714498451" className="text-sm font-black text-gray-900 hover:text-[oklch(0.45_0.22_27)] transition-colors">+254 714 498 451</a>
            </div>
            <Link href="/products" className="bg-gray-900 text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-black/10">
              Request Part
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-8 flex flex-col gap-6 animate-fadeIn">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-black uppercase tracking-[0.2em] py-2 border-b border-gray-50 ${
                  location === link.href ? "text-[oklch(0.45_0.22_27)]" : "text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-4">
              <a href="tel:+254714498451" className="flex items-center justify-center gap-3 bg-gray-50 py-4 rounded-sm font-black text-sm">
                <Phone size={18} className="text-[oklch(0.45_0.22_27)]" />
                +254 714 498 451
              </a>
              <Link href="/products" className="btn-primary justify-center py-4">
                BROWSE PRODUCTS
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const togglePolicy = (policy: string) => {
    if (activePolicy === policy) {
      setActivePolicy(null);
    } else {
      setActivePolicy(policy);
      setTimeout(() => {
        document.getElementById("policy-content")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

  const policies = {
    refund: {
      title: "Refund & Return Policy",
      content: (
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
          <p>At <strong>Supreme Autoparts Kenya</strong>, we stand behind the quality of our components. We offer a <strong>7-day return window</strong> for parts that are found to be defective or incorrectly supplied, provided they remain in their original packaging and have not been installed.</p>
          <h5 className="font-bold text-white uppercase tracking-wider text-xs">Electrical Components</h5>
          <p>Please note that electrical components (sensors, ECUs, wiring harnesses) are non-returnable once the protective seal is broken, unless verified defective by an authorized technician.</p>
        </div>
      )
    },
    privacy: {
      title: "Data Privacy Policy",
      content: (
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
          <p>We respect your professional privacy. Any data shared during the inquiry process (VIN numbers, contact details, vehicle information) is used strictly for part identification and order fulfillment.</p>
          <p>We do not share your information with third-party marketing entities. Your chassis numbers are only shared with authorized manufacturer databases for precision part matching.</p>
        </div>
      )
    },
    terms: {
      title: "Professional Terms of Service",
      content: (
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
          <p>All quotes provided by Supreme Autoparts are valid for <strong>48 hours</strong> due to fluctuating international shipping and exchange rates. Parts are supplied based on the VIN/Chassis number provided by the customer.</p>
          <p>While we provide expert guidance, final fitment verification is the responsibility of the installing technician. Supreme Autoparts is not liable for labor costs associated with part replacement.</p>
        </div>
      )
    }
  };

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-8 group">
              <div className="bg-[oklch(0.45_0.22_27)] text-white p-1 rounded-sm">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>SUPREME</span>
            </div>
            <p className="text-sm leading-relaxed mb-8">
              Kenya's trusted specialized supplier of genuine and premium OEM automotive components. Serving professional garages and vehicle owners since 1987 with uncompromising quality standards.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/supremeautoke" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-sm hover:bg-[oklch(0.45_0.22_27)] hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/254714498451" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-sm hover:bg-[#25D366] hover:text-white transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 border-l-2 border-[oklch(0.45_0.22_27)] pl-4">Useful Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center gap-2">About Our Company</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors flex items-center gap-2">Browse Parts Catalog</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors flex items-center gap-2">Supported Car Brands</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2">Contact Specialists</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 border-l-2 border-[oklch(0.45_0.22_27)] pl-4">Store Policies</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => togglePolicy('refund')} className="hover:text-white transition-colors">Refund & Returns</button></li>
              <li><button onClick={() => togglePolicy('privacy')} className="hover:text-white transition-colors">Data Privacy</button></li>
              <li><button onClick={() => togglePolicy('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-[oklch(0.45_0.22_27)] font-bold text-[10px] uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Genuine Parts Only
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 border-l-2 border-[oklch(0.45_0.22_27)] pl-4">Head Office</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-4">
                <MapPin size={18} className="text-[oklch(0.45_0.22_27)] shrink-0" />
                <span>Nairobi, Kenya<br /><span className="text-xs text-gray-500 uppercase tracking-widest">Nationwide Shipping Available</span></span>
              </li>
              <li className="flex gap-4">
                <Phone size={18} className="text-[oklch(0.45_0.22_27)] shrink-0" />
                <a href="tel:+254714498451" className="hover:text-white transition-colors font-bold">+254 714 498 451</a>
              </li>
              <li className="flex gap-4">
                <Mail size={18} className="text-[oklch(0.45_0.22_27)] shrink-0" />
                <a href="mailto:supremeautopartskenya@gmail.com" className="hover:text-white transition-colors">supremeautopartskenya@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Expandable Policy */}
        {activePolicy && (
          <div id="policy-content" className="bg-white/5 rounded-sm p-10 mb-20 border border-white/10 animate-fadeIn relative">
            <button onClick={() => setActivePolicy(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20} /></button>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {policies[activePolicy as keyof typeof policies].title}
            </h3>
            {policies[activePolicy as keyof typeof policies].content}
          </div>
        )}

        <div className="border-t border-white/5 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
          <p>© {new Date().getFullYear()} Supreme Autoparts Kenya. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><ShieldCheck size={12} /> Secured by SSL</span>
            <span>Verified Dealer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-4">
      <a 
        href="tel:+254714498451" 
        className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black hover:scale-110 transition-all group relative"
        aria-label="Call Us"
      >
        <Phone size={24} />
        <span className="absolute left-16 bg-gray-900 text-white text-[10px] font-bold py-2 px-4 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">CALL EXPERT</span>
      </a>
      <a 
        href="https://wa.me/254714498451?text=Hello,%20I%20am%20looking%20for%20a%20part%20for%20my%20vehicle." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#1DA851] hover:scale-110 transition-all group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="absolute left-16 bg-[#25D366] text-white text-[10px] font-bold py-2 px-4 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">WHATSAPP US</span>
      </a>
    </div>
  );
}
