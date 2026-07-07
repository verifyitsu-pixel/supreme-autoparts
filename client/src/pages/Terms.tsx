import { Navbar, Footer } from "@/components/NavbarNew";
import { FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gray-900 py-20 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Terms of Service
            </h1>
            <p className="text-gray-400 text-lg">Last updated: July 07, 2026</p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                By accessing or using the Supreme Autoparts website, you agree to be bound by these Terms of Service and all applicable laws and regulations in the <strong>Republic of Kenya</strong>. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">2. Use License</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Permission is granted to temporarily download one copy of the materials (information or software) on Supreme Autoparts' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">3. Fitment Responsibility</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                While our technical team assists in verifying part compatibility, the ultimate responsibility for ensuring a part fits your specific vehicle rests with the customer. We strongly recommend providing your <strong>Chassis Number (VIN)</strong> with every order to ensure 100% fitment accuracy.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">4. Pricing and Availability</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                All prices are subject to change without notice. While we strive for accuracy, errors in pricing or description may occur. We reserve the right to cancel any orders placed for products listed at an incorrect price. Product availability is not guaranteed until an order is confirmed by our team.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">5. Professional Installation</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Supreme Autoparts highly recommends that all automotive components be installed by a certified professional technician. We are not liable for any damages, injuries, or warranty voids resulting from improper installation or misuse of the parts supplied.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                In no event shall Supreme Autoparts or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website or the products sold.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">7. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Any claim relating to Supreme Autoparts' website or products shall be governed by the laws of the <strong>Republic of Kenya</strong> without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">8. Contact Information</h2>
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm mb-12">
                <p className="text-gray-700 mb-4 font-bold">For any legal or service-related inquiries, please contact:</p>
                <p className="text-sm text-gray-700"><strong>Email:</strong> <a href="mailto:calvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] underline">calvin@supremeautoparts.co.ke</a></p>
                <p className="text-sm text-gray-700"><strong>WhatsApp:</strong> <a href="https://wa.me/254714498451" className="text-[oklch(0.45_0.22_27)] underline">+254 714 498 451</a></p>
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
