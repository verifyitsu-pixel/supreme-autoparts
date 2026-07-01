import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, Clock, MapPin, ChevronDown, MessageCircle, Send, X as XIcon } from "lucide-react";

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
      <div className="topbar hidden md:block">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href="mailto:calvin@supremeautoparts.co.ke" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={12} />
              <span>calvin@supremeautoparts.co.ke</span>
            </a>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>8.00am – 10.00pm</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              <span>Nairobi, Kenya</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/supremeautoke" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://wa.me/254714498451" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`bg-white border-b border-gray-200 transition-shadow ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/manus-storage/logo_cc4bca6e.png" alt="Supreme Autoparts Logo" className="h-12 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm ${location === link.href ? "text-[oklch(0.45_0.22_27)]" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA phone */}
          <a
            href="tel:+254714498451"
            className="hidden md:flex items-center gap-2 bg-[oklch(0.45_0.22_27)] text-white px-4 py-2.5 rounded-sm font-bold text-sm tracking-wide hover:bg-[oklch(0.35_0.20_27)] transition-colors"
          >
            <Phone size={16} />
            <span>+254 714 498 451</span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm py-1 border-b border-gray-100 ${location === link.href ? "text-[oklch(0.45_0.22_27)]" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+254714498451"
              className="btn-primary justify-center mt-2"
            >
              <Phone size={15} />
              +254 714 498 451
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer-dark">
      {/* CTA Strip */}
      <div className="bg-[oklch(0.45_0.22_27)] py-5">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold uppercase tracking-widest text-xs mb-1">IF ANY CAR RELATED ISSUES ARE BOTHERING</p>
            <a href="tel:+254714498451" className="text-white text-2xl font-black tracking-wide hover:underline">+254 714 498 451</a>
          </div>
          <a href="/contact" className="bg-white text-[oklch(0.45_0.22_27)] font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-gray-100 transition-colors">
            CONTACT US
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1280px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & about */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <img src="/manus-storage/logo_cc4bca6e.png" alt="Supreme Autoparts" className="h-14 w-auto object-contain brightness-0 invert" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Based in Kenya, <strong className="text-white">Supreme Autoparts</strong> is a rapidly expanding player in the auto spare parts industry, supplying high-quality components for top-tier brands.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="https://www.instagram.com/supremeautoke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://wa.me/254714498451" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5 border-b border-gray-700 pb-3">USEFUL LINKS</h4>
          <ul className="flex flex-col gap-2.5">
            {[["ABOUT US", "/about"], ["CONTACT US", "/contact"], ["PRODUCTS", "/products"], ["BRANDS", "/brands"], ["PRIVACY POLICY", "/privacy-policy"], ["REFUND POLICY", "/refund-policy"], ["TERMS", "/terms-and-conditions"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <span className="text-[oklch(0.45_0.22_27)]">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Categories */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5 border-b border-gray-700 pb-3">TOP CATEGORIES</h4>
          <ul className="flex flex-col gap-2.5">
            {[["ALLOYS & RIMS", "/products"], ["BRAKES", "/products"], ["ENGINE PARTS", "/products"], ["LUBRICANTS", "/products"]].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <span className="text-[oklch(0.45_0.22_27)]">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5 border-b border-gray-700 pb-3">CONTACT US</h4>
          <ul className="flex flex-col gap-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 text-[oklch(0.45_0.22_27)] shrink-0" />
              <a href="tel:+254714498451" className="hover:text-white transition-colors">+254 714 498 451</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 text-[oklch(0.45_0.22_27)] shrink-0" />
              <a href="mailto:calvin@supremeautoparts.co.ke" className="hover:text-white transition-colors">calvin@supremeautoparts.co.ke</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-[oklch(0.45_0.22_27)] shrink-0" />
              <span>Nairobi, Kenya</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="mt-0.5 text-[oklch(0.45_0.22_27)] shrink-0" />
              <span>8.00am – 10.00pm Daily</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-3">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <Link href="/terms-and-conditions" className="text-gray-500 hover:text-white text-xs transition-colors">Terms & Conditions</Link>
            <Link href="/refund-policy" className="text-gray-500 hover:text-white text-xs transition-colors">Refund Policy</Link>
            <Link href="/privacy-policy" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Supreme Autoparts Kenya. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <>
      <a href="https://wa.me/254714498451?text=Hello,%20I%20need%20auto%20spare%20parts" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a href="tel:+254714498451" className="call-float" aria-label="Call us">
        <Phone size={18} color="white" />
      </a>
      <Chatbot />
    </>
  );
}

/* --- Chatbot --- */
interface ChatMsg {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const CHAT_RESPONSES: { triggers: string[]; reply: string; quickReplies?: string[] }[] = [
  {
    triggers: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    reply: "Hello! Welcome to Supreme Autoparts. How can I help you today?",
    quickReplies: ["Looking for a part", "Car issue help", "Talk to customer care", "Store locations"],
  },
  {
    triggers: ["part", "spare part", "looking for", "need a part", "where can i find"],
    reply: "We stock a wide range of genuine and high-quality aftermarket parts for all major car brands. We have brakes, engine parts, suspension, electricals, lubricants, body kits, steering parts, gear parts, alloys & rims. Which specific part are you looking for?",
    quickReplies: ["Brake pads", "Engine parts", "Suspension parts", "Talk to customer care"],
  },
  {
    triggers: ["brake", "brake pad", "brake disc", "braking", "abs"],
    reply: "We carry a full range of braking components including brake pads, brake discs, ABS sensors, calipers, and brake drums for all major brands. Prices start from KES 1,500 for basic pads. Visit our Products page to browse our catalog, or contact us directly for a specific part.",
    quickReplies: ["View all products", "Call us", "Talk to customer care", "Store locations"],
  },
  {
    triggers: ["engine", "oil change", "transmission", "gearbox", "gear part"],
    reply: "We supply engine components including oil filters, air filters, fuel filters, timing belts, spark plugs, transmission fluids, and gearbox parts. What specific engine part do you need?",
    quickReplies: ["Oil filters", "Timing belts", "View all products", "Talk to customer care"],
  },
  {
    triggers: ["suspension", "shock absorber", "shock", "strut", "ball joint", "lower arm"],
    reply: "We have a comprehensive range of suspension parts including shock absorbers, struts, ball joints, control arms, sway bar links, and tie rod ends. These are available for Toyota, Honda, Mercedes, BMW, Ford, and many more brands.",
    quickReplies: ["View all products", "Call us", "Talk to customer care"],
  },
  {
    triggers: ["price", "cost", "how much", "pricing", "quote"],
    reply: "Our prices vary depending on the part and brand. All prices are displayed in Kenya Shillings (KES). For an accurate quote, please contact us directly with the specific part you need and your vehicle make/model.",
    quickReplies: ["WhatsApp us", "Call us", "Talk to customer care"],
  },
  {
    triggers: ["delivery", "ship", "send", "how long", "when will", "order", "how to buy"],
    reply: "We deliver across Kenya including Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret. Delivery typically takes 1-3 business days within Nairobi and 2-5 days for other regions. You can also pick up in person from any of our branches.",
    quickReplies: ["Store locations", "WhatsApp us", "Call us", "Talk to customer care"],
  },
  {
    triggers: ["return", "refund", "exchange", "wrong part", "defective", "broken", "warranty"],
    reply: "We offer a 14-day return policy for eligible items. If you received a defective or wrong part, contact us immediately and we'll arrange a free replacement. For details, please visit our Refund Policy page.",
    quickReplies: ["View Refund Policy", "WhatsApp us", "Call us", "Talk to customer care"],
  },
  {
    triggers: ["location", "where", "branch", "shop", "store", "address"],
    reply: "We have branches in Nairobi (CBD, Industrial Area, Eastleigh), Mombasa (Nyali, Changamwe), Kisumu, Nakuru, and Eldoret. Visit our Contact page for full addresses and directions.",
    quickReplies: ["View contact page", "WhatsApp us", "Call us", "Talk to customer care"],
  },
  {
    triggers: ["customer care", "human", "agent", "speak to someone", "talk to someone", "complaint"],
    reply: "I'll connect you to our customer care team right away. You can reach us at:\n\nPhone: +254 714 498 451\nEmail: calvin@supremeautoparts.co.ke\nWhatsApp: Click the green WhatsApp button\n\nOur team is available 8:00am - 10:00pm daily.",
    quickReplies: ["WhatsApp us", "Call us", "Email us"],
  },
  {
    triggers: ["thank", "thanks", "appreciate"],
    reply: "You're welcome! Feel free to ask if you need anything else. We're here to help you find the right parts for your vehicle.",
  },
];

const CAR_ISSUE_HELP = [
  {
    triggers: ["car not starting", "won't start", "won't turn over", "engine won't start"],
    reply: "If your car won't start, it could be:\n\n1. Dead battery — Check if headlights turn on\n2. Faulty starter motor — Listen for a clicking sound\n3. Fuel issue — Ensure you have fuel in the tank\n4. Ignition switch failure\n\nWe stock batteries, starter motors, ignition coils, and fuel pumps. Would you like to speak with our technical team for a diagnosis?",
    quickReplies: ["Talk to technical team", "View batteries", "View starter motors", "Talk to customer care"],
  },
  {
    triggers: ["car overheating", "overheat", "temperature gauge", "coolant"],
    reply: "Overheating can be caused by:\n\n1. Low coolant level — Top up coolant immediately\n2. Faulty thermostat — Needs replacement\n3. Leaking radiator or hoses\n4. Water pump failure\n\nWe carry radiators, thermostats, water pumps, and coolant. If the car is overheating, stop driving and let it cool down first. We recommend having it checked by a mechanic.",
    quickReplies: ["Talk to technical team", "View radiators", "Talk to customer care"],
  },
  {
    triggers: ["brake noise", "squeaking brake", "brake warning", "grinding"],
    reply: "Brake noise usually indicates:\n\n1. Worn brake pads — Replace immediately if squeaking\n2. Worn brake discs — Grinding sound means discs need replacement\n3. Brake dust accumulation — Clean and lubricate\n\nDon't delay brake repairs — they're critical for safety. We have brake pads from KES 1,500 and discs from KES 3,500.",
    quickReplies: ["View brake parts", "Talk to customer care", "WhatsApp us"],
  },
  {
    triggers: ["strange noise", "knocking", "clunking", "rattling", "car making noise"],
    reply: "Strange noises from your car can come from various sources:\n\n• Engine knocking — Could be oil issues or worn engine mounts\n• Clunking from suspension — Worn ball joints or control arms\n• Rattling from exhaust — Loose heat shield or broken hanger\n• Squealing from belts — Worn or loose drive belt\n\nI recommend bringing your car in for a diagnostic check. Our team can help identify the issue and provide the right parts.",
    quickReplies: ["Talk to technical team", "Talk to customer care", "Store locations"],
  },
  {
    triggers: ["tire", "tyre", "wheel", "puncture", "flat tire", "alignment"],
    reply: "For tire and wheel issues:\n\n1. Flat tire — We can help you find a replacement tire\n2. Worn tires — If tread depth is below 1.6mm, replace immediately\n3. Wheel alignment — We recommend getting alignment checked every 10,000km\n4. TPMS issues — Sensor replacement available\n\nWe also stock alloy wheels and rims for various vehicle models.",
    quickReplies: ["View alloys & rims", "Talk to customer care", "Store locations"],
  },
  {
    triggers: ["ac", "air conditioning", "not cooling", "ac gas", "ac compressor"],
    reply: "AC issues are common and can be caused by:\n\n1. Low refrigerant gas — Needs recharge\n2. Faulty AC compressor — Replacement needed\n3. Clogged condenser or evaporator\n4. Broken AC blower motor\n\nWe supply AC compressors, condenser units, evaporators, and all AC components. Let our team help you diagnose the exact issue.",
    quickReplies: ["Talk to technical team", "View AC parts", "Talk to customer care"],
  },
  {
    triggers: ["oil", "oil change", "which oil", "oil recommendation"],
    reply: "For oil recommendations:\n\n• Most modern cars use 5W-30 or 5W-40 synthetic oil\n• Older vehicles may use 10W-40 or 15W-40\n• Always check your vehicle's manual for the correct specification\n\nWe stock Shell, Castrol, Mobil 1, and other premium brands. We recommend changing oil every 5,000-10,000km depending on the oil type.",
    quickReplies: ["View lubricants", "Talk to customer care", "WhatsApp us"],
  },
  {
    triggers: ["diesel", "petrol", "fuel", "fuel pump", "injector"],
    reply: "Fuel system issues can include:\n\n1. Fuel pump failure — Signs include difficulty starting and loss of power\n2. Clogged fuel filter — Replace every 20,000-40,000km\n3. Faulty fuel injectors — Can cause rough idling and poor fuel economy\n\nWe carry fuel pumps, injectors, and filters for both diesel and petrol vehicles.",
    quickReplies: ["View fuel parts", "Talk to technical team", "Talk to customer care"],
  },
];

const DEFAULT_REPLY = {
  reply: "I understand you need help. Let me connect you with our customer care team who can assist you better.\n\nYou can reach us at:\n• Phone: +254 714 498 451\n• Email: calvin@supremeautoparts.co.ke\n• WhatsApp: Use the green button below\n\nOur team is available 8:00am - 10:00pm daily.",
  quickReplies: ["WhatsApp us", "Call us", "Email us", "Store locations"],
};

function findBotResponse(message: string): (typeof CHAT_RESPONSES)[0] | null {
  const lower = message.toLowerCase().trim();
  // Check car issue help first (more specific)
  for (const entry of CAR_ISSUE_HELP) {
    if (entry.triggers.some(t => lower.includes(t))) return entry;
  }
  // Check general responses
  for (const entry of CHAT_RESPONSES) {
    if (entry.triggers.some(t => lower.includes(t))) return entry;
  }
  return null;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, text: "Hello! I'm the Supreme Autoparts assistant. I can help you with car issues, parts inquiries, and connecting you to our team. What would you like to know?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: "bot" | "user") => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, "user");
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = findBotResponse(trimmed);
      if (response) {
        addMessage(response.reply, "bot");
        if (response.quickReplies) {
          // Add quick replies as a special message type by appending them
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "QUICK_REPLIES:" + JSON.stringify(response.quickReplies),
            sender: "bot",
          }]);
        }
      } else {
        addMessage(DEFAULT_REPLY.reply, "bot");
        if (DEFAULT_REPLY.quickReplies) {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "QUICK_REPLIES:" + JSON.stringify(DEFAULT_REPLY.quickReplies),
            sender: "bot",
          }]);
        }
      }
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleQuickReply = (text: string) => {
    if (text === "WhatsApp us") {
      window.open("https://wa.me/254714498451?text=Hello,%20I%20need%20help", "_blank");
      return;
    }
    if (text === "Call us") {
      window.location.href = "tel:+254714498451";
      return;
    }
    if (text === "Email us") {
      window.location.href = "mailto:calvin@supremeautoparts.co.ke";
      return;
    }
    if (text === "Talk to customer care" || text === "Talk to technical team") {
      handleSend("I want to talk to customer care");
      return;
    }
    handleSend(text);
  };

  return (
    <>
      {!open && (
        <button
          className="chatbot-btn"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
        >
          <MessageCircle size={22} color="white" />
        </button>
      )}

      {open && (
        <>
          <div className="chatbot-window">
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div>
                <div className="font-bold text-sm">Supreme Autoparts</div>
                <div className="text-xs opacity-80">Online • Reply instantly</div>
              </div>
              <button
                className="ml-auto text-white/80 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-body">
              {messages.map((msg) => {
                if (msg.text.startsWith("QUICK_REPLIES:")) {
                  try {
                    const replies = JSON.parse(msg.text.slice(15)) as string[];
                    return null;
                  } catch {
                    return null;
                  }
                }
                return (
                  <div key={msg.id} className={`chatbot-msg ${msg.sender}`}>
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </div>
                );
              })}
              {typing && (
                <div className="chatbot-msg bot">
                  <div className="chatbot-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="chatbot-quick-replies">
              {(() => {
                const lastMsg = messages.filter(m => m.text.startsWith("QUICK_REPLIES:"));
                if (lastMsg.length === 0) return (
                  <>
                    <button className="chatbot-quick-reply" onClick={() => handleQuickReply("Looking for a part")}>Looking for a part</button>
                    <button className="chatbot-quick-reply" onClick={() => handleQuickReply("Car issue help")}>Car issue help</button>
                    <button className="chatbot-quick-reply" onClick={() => handleQuickReply("Talk to customer care")}>Talk to customer care</button>
                    <button className="chatbot-quick-reply" onClick={() => handleQuickReply("Store locations")}>Store locations</button>
                  </>
                );
                try {
                  const replies = JSON.parse(lastMsg[lastMsg.length - 1].text.slice(15)) as string[];
                  return replies.map((r) => (
                    <button key={r} className="chatbot-quick-reply" onClick={() => handleQuickReply(r)}>{r}</button>
                  ));
                } catch {
                  return null;
                }
              })()}
            </div>

            {/* Input */}
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                className="chatbot-input"
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
              />
              <button
                className="chatbot-send"
                onClick={() => handleSend(input)}
                aria-label="Send message"
              >
                <Send size={14} color="white" />
              </button>
            </div>
          </div>

          {/* Toggle button when open */}
          <button
            className="chatbot-btn"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <XIcon size={20} color="white" />
          </button>
        </>
      )}
    </>
  );
}
