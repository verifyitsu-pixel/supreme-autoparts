import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page Hero */}
        <div
          className="relative flex items-center justify-center"
          style={{
            minHeight: 200,
            background: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80') center/cover no-repeat",
          }}
        >
          <div className="text-center text-white z-10">
            <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Terms & Conditions</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>Terms & Conditions</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-black text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                By accessing and using the Supreme Autoparts website (<strong>supremeautoparts.co.ke</strong>), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">2. Products and Services</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Supreme Autoparts supplies automotive spare parts, accessories, engine oils, lubricants, and related products. All products are described as accurately as possible on our website, but we do not warrant that product descriptions, pricing, or availability information is entirely accurate or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">3. Pricing</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                All prices displayed on our website are in <strong>Kenya Shillings (KES)</strong> and include applicable taxes unless stated otherwise. Prices are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including but not limited to: product or service availability, errors in the description or pricing, or problems identified by our credit and fraud avoidance department.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">4. Orders and Payment</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                When you place an order, you are making an offer to purchase. We reserve the right to accept or decline your order. Payment must be made in full before goods are dispatched unless alternative credit terms have been agreed upon in writing. We accept various payment methods including cash, bank transfer, and mobile money (M-Pesa).
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">5. Delivery</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We strive to process and deliver all orders as quickly as possible. Delivery times are estimates and may vary depending on location, product availability, and courier service. We deliver across <strong>Kenya</strong>, including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and other major towns. Delivery charges may apply depending on the order size and destination.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">6. Warranty and Guarantee</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Products supplied by Supreme Autoparts may carry manufacturer warranties. Warranty terms are governed by the respective manufacturer's policy. We will assist customers in processing warranty claims where applicable. Products sold without a manufacturer warranty are sold as-is.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">7. Returns and Refunds</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Please refer to our separate <Link href="/refund-policy" className="text-[oklch(0.45_0.22_27)] underline hover:no-underline">Refund Policy</Link> for details on returns, exchanges, and refund procedures.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                All content on this website, including text, graphics, logos, images, and software, is the property of Supreme Autoparts or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Supreme Autoparts shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid by the customer for the product or service in question.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the <strong>Republic of Kenya</strong>. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">11. Changes to These Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the website following any changes constitutes acceptance of those changes.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm mb-8">
                <p className="text-sm text-gray-700"><strong>Email:</strong> <a href="mailto:calvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] underline">calvin@supremeautoparts.co.ke</a></p>
                <p className="text-sm text-gray-700"><strong>Phone:</strong> <a href="tel:+254714498451" className="text-[oklch(0.45_0.22_27)] underline">+254 714 498 451</a></p>
                <p className="text-sm text-gray-700"><strong>Address:</strong> Nairobi, Kenya</p>
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
