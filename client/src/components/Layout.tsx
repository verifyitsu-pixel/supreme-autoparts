import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Phone, Mail, MapPin, Instagram, Facebook, Twitter, 
  ChevronDown, X, ShieldCheck, Truck, Clock, Award,
  Search, Menu, User, ShoppingBag, ArrowRight, CheckCircle2,
  AlertCircle, HelpCircle, FileText, RefreshCcw, MessageCircle
} from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-2xl py-3" : "bg-transparent py-6"}`}>
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[oklch(0.45_0.22_27)] rounded-sm flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform">S</div>
          <div className="flex flex-col leading-none">
            <span className={`text-2xl font-black tracking-tighter ${isScrolled ? "text-gray-900" : "text-white"}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>SUPREME</span>
            <span className={`text-[10px] font-black tracking-[0.3em] ${isScrolled ? "text-[oklch(0.45_0.22_27)]" : "text-white/60"}`}>AUTOPARTS</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {[
            { name: "Inventory", path: "/products" },
            { name: "About Us", path: "/about" },
            { name: "Support", path: "/contact" }
          ].map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[oklch(0.45_0.22_27)] ${location === item.path ? "text-[oklch(0.45_0.22_27)]" : (isScrolled ? "text-gray-600" : "text-white")}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[oklch(0.45_0.22_27)] transition-colors`}><Search size={20} /></button>
          <Link href="/products" className="hidden md:flex items-center gap-3 bg-[oklch(0.45_0.22_27)] text-white px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl">
            Request Parts <ArrowRight size={14} />
          </Link>
          <button onClick={() => setMobileMenuOpen(true)} className={`lg:hidden ${isScrolled ? "text-gray-900" : "text-white"}`}><Menu size={24} /></button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 z-[60] p-8 flex flex-col animate-fadeIn">
          <div className="flex justify-between items-center mb-16">
            <span className="text-white font-black tracking-tighter text-2xl">SUPREME</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white"><X size={32} /></button>
          </div>
          <div className="flex flex-col gap-8">
            {["Products", "About", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black text-white uppercase tracking-tighter hover:text-[oklch(0.45_0.22_27)]">
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const policies = {
    refund: {
      title: "Return & Refund Policy",
      content: `
        ### Standard Return Policy
        At Supreme Autoparts, we understand that technical fitment can be complex. You may return most new, unopened items within 30 days of delivery for a full refund. 

        ### Core Charges & Returns
        Some automotive parts (like alternators, starters, and steering racks) have a 'core charge'. This is a deposit for the rebuildable old part. To receive a core refund:
        - The old part must be returned in the original manufacturer's box.
        - The core must be in rebuildable condition (no cracked housings or missing components).
        - Cores must be returned within 6 months of the original purchase.

        ### Non-Returnable Items
        - Electrical components (Sensors, ECUs, Wiring Harnesses) if the security seal is broken.
        - Custom-ordered body kits or styling components.
        - Items showing signs of installation or use.

        ### Warranty Claims
        Most parts carry a manufacturer's warranty ranging from 6 to 24 months. Warranty claims cover part replacement only and do not include labor costs or consequential damages.
      `
    },
    privacy: {
      title: "Privacy & Data Protection",
      content: `
        ### Information Collection
        We collect only the information necessary to fulfill your automotive procurement needs: name, vehicle identification (VIN), contact details, and delivery address.

        ### Data Usage
        Your vehicle data is used strictly for part-matching accuracy. We do not sell your personal data to third-party marketing firms. We may share information with our logistics partners (e.g., Sendy, G4S) solely for delivery purposes.

        ### Secure Transactions
        All digital inquiries and WhatsApp communications are encrypted. We do not store credit card information on our servers.
      `
    },
    terms: {
      title: "Terms of Service",
      content: `
        ### Professional Procurement
        By using this site, you acknowledge that automotive repairs should be performed by certified technicians. Supreme Autoparts is a parts supplier and is not liable for damages resulting from improper installation.

        ### VIN Verification
        While we provide a comprehensive vehicle selector, the ultimate responsibility for fitment lies with the customer. We highly recommend providing your VIN (Chassis Number) for every order to ensure 100% accuracy.

        ### Pricing & Availability
        Prices listed are guide prices and may fluctuate based on international exchange rates and logistics costs. We reserve the right to cancel orders due to pricing errors or stock unavailability.
      `
    }
  };

  return (
    <footer className="bg-gray-950 text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[oklch(0.45_0.22_27)] rounded-sm flex items-center justify-center text-white font-black text-lg">S</div>
              <span className="text-xl font-black tracking-tighter">SUPREME</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-8 font-medium">
              Precision-engineered automotive procurement. Since 1987, providing the Kenyan market with genuine OEM components and verified technical support.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[oklch(0.45_0.22_27)] hover:border-[oklch(0.45_0.22_27)] transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-[oklch(0.45_0.22_27)]">Quick Links</h4>
            <ul className="space-y-4">
              {["Inventory", "About Us", "Contact Support", "Request Quote"].map((item) => (
                <li key={item}><Link href={`/${item.toLowerCase().replace(' ', '')}`} className="text-xs text-gray-400 hover:text-white transition-colors font-medium">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-[oklch(0.45_0.22_27)]">HQ Contact</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="text-[oklch(0.45_0.22_27)] shrink-0" size={18} />
                <span className="text-xs text-gray-400 font-medium leading-relaxed">MIDAX PLAZA, Kangundo Rd,<br />Nairobi, Kenya</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-[oklch(0.45_0.22_27)] shrink-0" size={18} />
                <span className="text-xs text-gray-400 font-medium">+254 714 498 451</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-[oklch(0.45_0.22_27)] shrink-0" size={18} />
                <span className="text-xs text-gray-400 font-medium">calvin@supremeautoparts.co.ke</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-[oklch(0.45_0.22_27)]">Trust Badges</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-sm border border-white/5">
                <ShieldCheck className="text-[oklch(0.45_0.22_27)]" size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest">Genuine OEM Guarantee</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-sm border border-white/5">
                <Truck className="text-[oklch(0.45_0.22_27)]" size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest">Nationwide Logistics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Section */}
        {activePolicy && (
          <div className="mb-12 p-10 bg-white text-gray-900 rounded-sm animate-fadeIn relative shadow-2xl">
            <button onClick={() => setActivePolicy(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {policies[activePolicy as keyof typeof policies].title}
            </h3>
            <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed">
              {policies[activePolicy as keyof typeof policies].content.split('\n').map((line, i) => {
                if (line.trim().startsWith('###')) {
                  return <h4 key={i} className="text-sm font-black uppercase tracking-widest text-gray-900 mt-8 mb-4">{line.replace('###', '').trim()}</h4>;
                }
                if (line.trim().startsWith('-')) {
                  return <li key={i} className="ml-4 mb-2">{line.replace('-', '').trim()}</li>;
                }
                return line.trim() ? <p key={i} className="mb-4">{line.trim()}</p> : null;
              })}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100">
              <button onClick={() => { setActivePolicy(null); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="text-[10px] font-black uppercase tracking-widest text-[oklch(0.45_0.22_27)] flex items-center gap-2 hover:underline">
                Close Policy View <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="py-12 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 text-center">We Accept</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <img src="/assets/images/payments/cards.png" alt="Visa, Mastercard, Amex, Discover" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <img src="/assets/images/payments/paypal.png" alt="PayPal" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <img src="/assets/images/payments/mpesa.png" alt="M-Pesa" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <div className="text-white text-xs font-black uppercase tracking-widest px-4 py-2 border border-white/20 rounded-sm hover:border-white transition-colors">PesaLink</div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">© {new Date().getFullYear()} Supreme Autoparts. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <button onClick={() => setActivePolicy('refund')} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Return Policy</button>
            <button onClick={() => setActivePolicy('privacy')} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</button>
            <button onClick={() => setActivePolicy('terms')} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
      <a href="https://wa.me/254714498451" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce">
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
