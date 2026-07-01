import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";

const BRANDS = [
  { name: "ZF", src: "/manus-storage/brand-zf_f563f099.png", description: "Premium driveline and chassis technology" },
  { name: "Wahler", src: "/manus-storage/brand-wahler_5cba2942.jpg", description: "Thermostats and cooling system components" },
  { name: "Valeo", src: "/manus-storage/brand-valeo_e32920c8.png", description: "Automotive technology and smart mobility" },
  { name: "Vaico", src: "/manus-storage/brand-vaico_9d715da1.jpg", description: "Premium replacement parts for European cars" },
  { name: "TRW", src: "/manus-storage/brand-trw_1532b379.jpg", description: "Steering, suspension, braking systems" },
  { name: "Trucktec", src: "/manus-storage/brand-trucktec_93b6c5ec.jpg", description: "Commercial vehicle spare parts" },
  { name: "Textar", src: "/manus-storage/brand-textar.gif", description: "Original equipment brake systems" },
  { name: "Simer", src: "/manus-storage/brand-simer.gif", description: "Quality automotive components" },
  { name: "Shell", src: "/manus-storage/brand-shell_3f58e290.png", description: "Premium engine oils and lubricants" },
  { name: "Remsa", src: "/manus-storage/brand-remsa_e88ecde0.png", description: "High-performance brake components" },
  { name: "Philips", src: "/manus-storage/brand-philips.gif", description: "Automotive lighting solutions" },
  { name: "Pagid", src: "/manus-storage/brand-pagid.gif", description: "Braking systems and components" },
  { name: "Osram", src: "/manus-storage/brand-osram_51e5f6a5.jpg", description: "Automotive lighting and electronics" },
  { name: "Nissens", src: "/manus-storage/brand-nissens_32bf6f2d.jpg", description: "Thermal management solutions" },
  { name: "Mobil 1", src: "/manus-storage/brand-mobil1_82c40baa.jpg", description: "Advanced full synthetic motor oil" },
  { name: "Meyle", src: "/manus-storage/brand-meyle_96ec8d61.png", description: "Enhanced spare parts for cars" },
  { name: "Magneti Marelli", src: "/manus-storage/brand-magneti_2eb1f068.png", description: "Automotive components and systems" },
  { name: "Lemforder", src: "/manus-storage/brand-lemforder_31697e15.jpg", description: "Steering and chassis parts" },
  { name: "Hella", src: "/manus-storage/brand-hella_bb2643e2.jpg", description: "Lighting and electronics" },
  { name: "FEBI", src: "/manus-storage/brand-febi.gif", description: "Bilstein Group – commercial vehicle parts" },
  { name: "Castrol", src: "/manus-storage/brand-castrol_bc5092ce.jpg", description: "Advanced lubricants and oils" },
  { name: "Bosch", src: "/manus-storage/brand-bosch_27d7b8b6.png", description: "Leading global supplier of technology" },
  { name: "Behr", src: "/manus-storage/brand-behr_118e71a7.jpg", description: "Climate control and engine cooling" },
];

// Car brands
const CAR_BRANDS = [
  { name: "BMW", src: "/manus-storage/logo-bmw_13aff034.png" },
  { name: "Chevrolet", src: "/manus-storage/logo-chevrolet_81054620.png" },
  { name: "Mercedes-Benz", src: "/manus-storage/logo-mercedes_2feccb84.png" },
  { name: "Ford", src: "/manus-storage/logo-ford_b4732f80.png" },
  { name: "Honda", src: "/manus-storage/logo-honda_e52f552c.png" },
  { name: "Hyundai", src: "/manus-storage/logo-hyundai_15b12879.webp" },
  { name: "Toyota", src: "/manus-storage/logo-toyota_1894187f.webp" },
  { name: "Suzuki", src: "/manus-storage/logo-suzuki_b3c0cbaf.webp" },
  { name: "Infiniti", src: "/manus-storage/logo-infiniti_b91aef4e.webp" },
  { name: "Mopar", src: "/manus-storage/logo-mopar_77df2a46.webp" },
  { name: "Lexus", src: "/manus-storage/logo-lexus_5623a401.webp" },
];

export default function Brands() {
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
            <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Brands</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>Brands</span>
            </p>
          </div>
        </div>

        {/* Car Brands */}
        <section className="py-12 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
            <p className="section-label text-center mb-2">VEHICLE MAKES</p>
            <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Car Brands We Serve
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {CAR_BRANDS.map((brand) => (
                <div key={brand.name} className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow rounded-sm" style={{ minHeight: 120 }}>
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="max-h-12 max-w-[100px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parts Supplier Brands */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-4">
            <p className="section-label text-center mb-2">PARTS SUPPLIERS</p>
            <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Trusted Parts Brands We Stock
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BRANDS.map((brand) => (
                <div key={brand.name} className="bg-white border border-gray-200 p-5 rounded-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
                  <div className="h-16 flex items-center justify-center w-full">
                    <img
                      src={brand.src}
                      alt={brand.name}
                      className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-700 text-center">{brand.name}</p>
                  <p className="text-[10px] text-gray-400 text-center leading-tight">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="bg-gray-900 p-10 text-center rounded-sm">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Need a specific brand or part?
              </h2>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                We stock thousands of parts from all major brands. If you need something specific, reach out to us!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact" className="btn-primary justify-center">
                  CONTACT US
                </Link>
                <a
                  href="https://wa.me/254714498451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WHATSAPP US
                </a>
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
