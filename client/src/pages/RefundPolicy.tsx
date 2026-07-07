import { Navbar, Footer } from "@/components/NavbarNew";
import { FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gray-900 py-20 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Refund & Return Policy
            </h1>
            <p className="text-gray-400 text-lg">Last updated: July 07, 2026</p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">1. Hassle-Free Returns</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Supreme Autoparts, we stand behind the quality of our components. If you are not completely satisfied with your purchase, we offer a <strong>30-day return window</strong> for most parts, provided they are in their original, uninstalled condition and packaging.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">2. Lifetime Replacement Guarantee</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Inspired by industry leaders, we offer a <strong>Lifetime Replacement Guarantee</strong> on select genuine and high-performance parts. If a covered part fails after installation, we will replace it for as long as you own the vehicle. This includes wear-and-tear items like brake pads and filters when replaced with the same brand from our shop.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">3. Core Returns</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                For items like alternators, starters, and steering racks that carry a core charge, the old part must be returned in the original manufacturer's box to receive a full core credit. Cores must be drained of all fluids and show no signs of external damage or tampering.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">4. Non-Returnable Items</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The following items are generally ineligible for return:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                <li>Electrical components that have been plugged in or installed (ECUs, sensors, wiring harnesses).</li>
                <li>Special order items specifically procured for your vehicle.</li>
                <li>Items that show signs of installation, tool marks, or grease.</li>
                <li>Liquids and lubricants where the seal has been broken.</li>
              </ul>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">5. Damaged or Defective Items</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you receive a part that is damaged during transit or has a manufacturing defect, please notify us within <strong>48 hours</strong> of delivery. We will arrange for a replacement or a full refund at no additional cost to you.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">6. Refund Process</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed via your original payment method (M-Pesa, Bank Transfer, or Cash) within <strong>3-5 business days</strong>.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">7. Contact for Returns</h2>
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm mb-12">
                <p className="text-gray-700 mb-4 font-bold">To initiate a return or replacement claim, please contact our support team:</p>
                <p className="text-sm text-gray-700"><strong>WhatsApp:</strong> <a href="https://wa.me/254714498451" className="text-[oklch(0.45_0.22_27)] underline">+254 714 498 451</a></p>
                <p className="text-sm text-gray-700"><strong>Email:</strong> <a href="mailto:valvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] underline">valvin@supremeautoparts.co.ke</a></p>
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
