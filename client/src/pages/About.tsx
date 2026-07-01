import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

// Parts supplier brand logos for the about page
const PART_BRANDS = [
  { name: "ZF", src: "/manus-storage/brand-zf_f563f099.png" },
  { name: "Wahler", src: "/manus-storage/brand-wahler_5cba2942.jpg" },
  { name: "Valeo", src: "/manus-storage/brand-valeo_e32920c8.png" },
  { name: "Vaico", src: "/manus-storage/brand-vaico_9d715da1.jpg" },
  { name: "TRW", src: "/manus-storage/brand-trw_1532b379.jpg" },
  { name: "Trucktec", src: "/manus-storage/brand-trucktec_93b6c5ec.jpg" },
  { name: "Shell", src: "/manus-storage/brand-shell_3f58e290.png" },
  { name: "Remsa", src: "/manus-storage/brand-remsa_e88ecde0.png" },
  { name: "Osram", src: "/manus-storage/brand-osram_51e5f6a5.jpg" },
  { name: "Nissens", src: "/manus-storage/brand-nissens_32bf6f2d.jpg" },
  { name: "Mobil 1", src: "/manus-storage/brand-mobil1_82c40baa.jpg" },
  { name: "Meyle", src: "/manus-storage/brand-meyle_96ec8d61.png" },
  { name: "Magneti Marelli", src: "/manus-storage/brand-magneti_2eb1f068.png" },
  { name: "Lemforder", src: "/manus-storage/brand-lemforder_31697e15.jpg" },
  { name: "Hella", src: "/manus-storage/brand-hella_bb2643e2.jpg" },
  { name: "Castrol", src: "/manus-storage/brand-castrol_bc5092ce.jpg" },
  { name: "Bosch", src: "/manus-storage/brand-bosch_27d7b8b6.png" },
  { name: "Behr", src: "/manus-storage/brand-behr_118e71a7.jpg" },
];

const TESTIMONIALS = [
  {
    name: "James Mwangi",
    text: "I needed spare parts for my Range Rover and found exactly what I was looking for at Supreme Autoparts. The staff were incredibly knowledgeable and helpful. Highly recommend!",
    rating: 5,
  },
  {
    name: "Sarah Njoroge",
    text: "Best auto parts supplier in Nairobi! They had the exact BMW parts I needed and delivered quickly. Prices are very competitive.",
    rating: 5,
  },
  {
    name: "Peter Ochieng",
    text: "Supreme Autoparts has been my go-to for all my Toyota parts. Quality is always top-notch and the team is very professional.",
    rating: 5,
  },
  {
    name: "Grace Wanjiku",
    text: "Excellent service and genuine parts. I've been a customer for 3 years and they never disappoint. Highly recommended for Mercedes parts.",
    rating: 5,
  },
];

export default function About() {
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
            <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>About</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>About Us</span>
            </p>
          </div>
        </div>

        {/* About Content */}
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
            <p className="section-label mb-2">ABOUT US</p>
            <h2 className="text-3xl md:text-4xl font-black mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Know about the Home of Genuine Spare Parts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-xl font-bold mb-4">Trusted Legacy. Proven Performance.</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Founded in <strong>1996</strong>, <strong>Supreme Autoparts Kenya</strong> has grown into one of the <strong>leading suppliers and traders</strong> of automotive spare parts in Kenya and beyond. Our company is officially registered and operates as a trusted business entity serving the Kenyan automotive market.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  With a wide-ranging portfolio that includes <strong>auto spare parts, dry batteries, engine oil</strong>, and various automotive components, we serve customers through <strong>retail, wholesale</strong>, and <strong>re-export</strong> channels.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We are part of the <strong>Supreme Group</strong>, a respected business conglomerate established in <strong>1987</strong> by <strong>Mr. KC Usman</strong>, whose deep understanding of the automotive market and entrepreneurial drive laid the foundation for what would become one of the most trusted names in the industry.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    "Genuine OEM Parts",
                    "Aftermarket Components",
                    "Dry Batteries",
                    "Engine Oils & Lubricants",
                    "Retail & Wholesale",
                    "Re-export Services",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-[oklch(0.45_0.22_27)] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="btn-primary inline-flex">
                  CONTACT US <span className="ml-1">+</span>
                </Link>
              </div>

              {/* Stats */}
              <div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { value: "1987", label: "Founded (Supreme Group)" },
                    { value: "30+", label: "Years of Experience" },
                    { value: "10,000+", label: "Parts in Stock" },
                    { value: "50+", label: "Car Brands Covered" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 border border-gray-100 p-6 text-center rounded-sm">
                      <p className="text-3xl font-black text-[oklch(0.45_0.22_27)]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.value}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 font-semibold">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[oklch(0.45_0.22_27)] p-6 text-white rounded-sm">
                  <h4 className="font-bold text-lg mb-2">Our Mission</h4>
                  <p className="text-red-100 text-sm leading-relaxed">
                    To be Kenya's most trusted automotive spare parts supplier by providing genuine, high-quality components at competitive prices — keeping every Kenyan vehicle on the road with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parts Brands Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-4">
            <p className="section-label text-center mb-2">OUR SUPPLIERS</p>
            <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Trusted Parts Brands We Stock
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {PART_BRANDS.map((brand) => (
                <div key={brand.name} className="bg-white border border-gray-100 p-4 flex items-center justify-center hover:shadow-md transition-shadow rounded-sm" style={{ height: 90 }}>
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
            <p className="section-label text-center mb-2">TESTIMONIALS</p>
            <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-gray-50 border border-gray-100 p-6 rounded-sm">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <p className="font-bold text-gray-900 text-sm">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
