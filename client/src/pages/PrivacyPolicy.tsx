import { Navbar, Footer, FloatingButtons } from "@/components/Layout";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
            <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Privacy Policy</h1>
            <p className="mt-2 text-gray-300 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span>Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-black text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Supreme Autoparts ("<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>supremeautoparts.co.ke</strong> or use our services. Please read this policy carefully. If you do not agree with the terms, please do not access our website.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Fill out contact or inquiry forms on our website</li>
                <li>Communicate with us via email, phone, WhatsApp, or social media</li>
                <li>Place an order or make a purchase</li>
                <li>Subscribe to newsletters or promotional communications</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                The types of information we may collect include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, physical address</li>
                <li><strong>Order Information:</strong> Product details, payment information, order history</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information, browsing behavior</li>
                <li><strong>Communication Data:</strong> Content of messages sent to us</li>
              </ul>

              <h2 className="text-xl font-black text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>To process and fulfill your orders and inquiries</li>
                <li>To communicate with you about your orders, deliveries, and customer service</li>
                <li>To send promotional emails, newsletters, and marketing communications (with your consent)</li>
                <li>To improve our website, products, and services</li>
                <li>To comply with legal obligations and protect our rights</li>
                <li>To prevent fraud and ensure the security of our platform</li>
              </ul>

              <h2 className="text-xl font-black text-gray-900 mb-4">4. How We Share Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>Service Providers:</strong> Courier companies, payment processors, and hosting providers who assist us in delivering our services</li>
                <li><strong>Legal Authorities:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction</li>
              </ul>

              <h2 className="text-xl font-black text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze traffic patterns, and understand how users interact with our website. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of certain features on our website.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements. Once the retention period expires, your information will be securely deleted or anonymized.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">8. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Under the <strong>Data Protection Act of Kenya (2019)</strong>, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Request access to the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict the processing of your data</li>
                <li>Withdraw consent for marketing communications at any time</li>
                <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC) in Kenya</li>
              </ul>

              <h2 className="text-xl font-black text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our website may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to review the privacy policies of any third-party site you visit.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>

              <h2 className="text-xl font-black text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
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
