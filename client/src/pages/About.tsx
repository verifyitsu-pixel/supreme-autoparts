import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { ShieldCheck, Users, Truck, Award, CheckCircle2, Settings, History, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-900 py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[oklch(0.45_0.22_27)] opacity-10 skew-x-12 translate-x-1/4" />
          <div className="max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-[oklch(0.45_0.22_27)] font-black text-[10px] uppercase tracking-[0.4em] mb-4">Our Legacy & Mission</p>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-8 leading-[0.9]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Defining Automotive Standards Since 1987
              </h1>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                Supreme Autoparts Kenya is more than a supplier; we are a strategic partner to the Kenyan automotive industry, dedicated to the uncompromising supply of genuine and premium OEM components.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-[oklch(0.45_0.22_27)] opacity-20 rounded-sm" />
                <img 
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80" 
                  alt="Supreme Autoparts Operations" 
                  className="relative z-10 w-full rounded-sm shadow-2xl"
                />
              </div>
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    The Supreme Philosophy
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    In an industry often clouded by counterfeit components, Supreme Autoparts was founded on a singular principle: <strong>Trust through Authenticity</strong>. We understand that every part we supply is critical to the safety and performance of your vehicle.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our procurement team works directly with manufacturer-authorized distributors in Europe, Japan, and the UAE to ensure that every SKU in our warehouse meets the exact specifications of the original equipment manufacturer.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 rounded-sm">
                      <ShieldCheck className="text-[oklch(0.45_0.22_27)]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-2">Quality First</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Zero-tolerance policy for counterfeit or substandard components.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 rounded-sm">
                      <Globe className="text-[oklch(0.45_0.22_27)]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-2">Global Network</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Direct supply lines from Germany, Japan, and the United Kingdom.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-5xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>35+</p>
                <p className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-[0.3em]">Years of Excellence</p>
              </div>
              <div>
                <p className="text-5xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>15k+</p>
                <p className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-[0.3em]">Parts in Stock</p>
              </div>
              <div>
                <p className="text-5xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>24hr</p>
                <p className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-[0.3em]">Rapid Dispatch</p>
              </div>
              <div>
                <p className="text-5xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>100%</p>
                <p className="text-[10px] font-black text-[oklch(0.45_0.22_27)] uppercase tracking-[0.3em]">Genuine Guaranteed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Detailed */}
        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="section-label mb-4">The Professional Edge</p>
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Why Leading Garages Choose Supreme
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-6 group">
                <div className="w-16 h-16 bg-white border border-gray-100 flex items-center justify-center rounded-sm shadow-xl group-hover:bg-[oklch(0.45_0.22_27)] group-hover:text-white transition-all duration-500">
                  <Settings size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Advanced VIN Verification</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We eliminate the "trial and error" of part ordering. Our team uses factory-level chassis number matching to ensure 100% fitment accuracy before any part leaves our facility.
                </p>
              </div>
              <div className="space-y-6 group">
                <div className="w-16 h-16 bg-white border border-gray-100 flex items-center justify-center rounded-sm shadow-xl group-hover:bg-[oklch(0.45_0.22_27)] group-hover:text-white transition-all duration-500">
                  <Truck size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Nationwide Logistics</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Whether you are in Nairobi, Mombasa, Kisumu, or Eldoret, our dedicated logistics network ensures your vehicle is back on the road with minimal downtime.
                </p>
              </div>
              <div className="space-y-6 group">
                <div className="w-16 h-16 bg-white border border-gray-100 flex items-center justify-center rounded-sm shadow-xl group-hover:bg-[oklch(0.45_0.22_27)] group-hover:text-white transition-all duration-500">
                  <Award size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Specialist Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our staff consists of automotive technical experts, not just sales clerks. We provide technical insights and advice to ensure you get the right solution for your vehicle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[oklch(0.45_0.22_27)] py-20">
          <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Ready to Experience Supreme Quality?
              </h2>
              <p className="text-white/80 font-bold text-sm uppercase tracking-widest">Connect with our parts specialists today for a professional quote.</p>
            </div>
            <div className="flex gap-4">
              <a href="tel:+254714498451" className="bg-white text-[oklch(0.45_0.22_27)] px-10 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-100 transition-all shadow-xl">
                CALL EXPERTS
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
