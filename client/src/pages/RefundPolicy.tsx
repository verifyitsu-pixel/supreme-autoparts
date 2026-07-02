import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";

export default function RefundPolicy() {
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
            <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Refund Policy</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>Refund Policy</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-black text-gray-900 mb-4">1. Return Period</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Supreme Autoparts offers a <strong>14-day return period</strong> from the date of purchase for all eligible products. Items must be returned in their original condition, unused, and in their original packaging.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">2. Eligible Returns</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We accept returns for products that are:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Defective or damaged upon delivery</li>
                <li>Incorrect item shipped (wrong part or specification)</li>
                <li>Not compatible with the vehicle as described on our website</li>
                <li>Sealed and unused products returned within 14 days</li>
              </ul>

              <h2 className="text-xl font-black text-gray-900 mb-4">3. Non-Refundable Items</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The following items are <strong>not eligible</strong> for return or refund:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Opened or used products, unless found to be defective</li>
                <li>Custom or special-order items</li>
                <li>Electrical components that have been installed or wired</li>
                <li>Lubricants, fluids, and consumables once the seal is broken</li>
                <li>Items returned after 14 days from the date of purchase</li>
              </ul>

              <h2 className="text-xl font-black text-gray-900 mb-4">4. Return Process</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 text-gray-600 mb-6 space-y-2">
                <li>Contact us within 14 days of purchase via email at <a href="mailto:calvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] underline">calvin@supremeautoparts.co.ke</a> or phone at <a href="tel:+254714498451" className="text-[oklch(0.45_0.22_27)] underline">+254 714 498 451</a></li>
                <li>Provide your order number, proof of purchase, and photos of the item (if applicable)</li>
                <li>Receive a Return Authorization Number (RAN) from our team</li>
                <li>Return the item to our Nairobi CBD location or ship it at your expense</li>
                <li>Once received and inspected, we will process your refund or exchange within 7–14 business days</li>
              </ol>

              <h2 className="text-xl font-black text-gray-900 mb-4">5. Refund Method</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Refunds will be processed using the same payment method used for the original purchase. For cash payments, refunds will be issued in cash or via M-Pesa. For bank transfers and card payments, refunds will be credited back to the original account. Please allow 5–14 business days for the refund to reflect in your account.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">6. Exchanges</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you wish to exchange an item for a different product, the exchange must be for an item of equal or lesser value. If the exchange item is of lesser value, the difference will be refunded. If it is of greater value, you will be required to pay the difference.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">7. Defective Products</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you receive a defective product, contact us immediately. We will arrange a free collection and replacement or full refund. Defective products should not be installed or modified before returning, as this may void your eligibility for a refund.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">8. Warranty Claims</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Products covered under a manufacturer's warranty are subject to the warranty terms of that manufacturer. Supreme Autoparts will facilitate the warranty claim process on behalf of the customer but is not responsible for warranty decisions made by the manufacturer.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                For return or refund inquiries, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm mb-8">
                <p className="text-sm text-gray-700"><strong>Email:</strong> <a href="mailto:calvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] underline">calvin@supremeautoparts.co.ke</a></p>
                <p className="text-sm text-gray-700"><strong>Phone:</strong> <a href="tel:+254714498451" className="text-[oklch(0.45_0.22_27)] underline">+254 714 498 451</a></p>
                <p className="text-sm text-gray-700"><strong>WhatsApp:</strong> <a href="https://wa.me/254714498451" target="_blank" rel="noopener noreferrer" className="text-[oklch(0.45_0.22_27)] underline">+254 714 498 451</a></p>
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
