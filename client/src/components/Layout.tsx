import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, Clock, MapPin, ChevronDown } from "lucide-react";

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
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
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
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5 border-b border-gray-700 pb-3">USEFUL LINKS</h4>
          <ul className="flex flex-col gap-2.5">
            {[["ABOUT US", "/about"], ["CONTACT US", "/contact"], ["PRODUCTS", "/products"], ["BRANDS", "/brands"]].map(([label, href]) => (
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
      <div className="border-t border-gray-800 py-4">
        <div className="max-w-[1280px] mx-auto px-4 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Supreme Autoparts Kenya. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <>
      <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a href="tel:+254714498451" className="call-float" aria-label="Call us">
        <Phone size={18} color="white" />
      </a>
    </>
  );
}
