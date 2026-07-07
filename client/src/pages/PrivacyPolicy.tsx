import { Navbar, Footer } from "@/components/NavbarNew";
import { FloatingButtons } from "@/components/Layout";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gray-900 py-20 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">Last updated: July 07, 2026</p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Supreme Autoparts collects information to provide better services to our customers. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                <li><strong>Contact Information:</strong> Name, email address, WhatsApp number, and delivery address.</li>
                <li><strong>Vehicle Information:</strong> Make, model, year, and Chassis/VIN number to ensure part compatibility.</li>
                <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased from us.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and usage data when you visit our website.</li>
              </ul>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We use your data to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                <li>Process and deliver your orders efficiently.</li>
                <li>Verify part compatibility with your specific vehicle.</li>
                <li>Communicate with you via WhatsApp or Email regarding your inquiries.</li>
                <li>Improve our website and product offerings based on customer preferences.</li>
                <li>Comply with legal and regulatory requirements in Kenya.</li>
              </ul>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">3. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We implement industry-standard security measures to protect your personal information. All transaction data is handled through secure channels, and we do not store sensitive payment details on our servers. Access to your personal data is restricted to employees and contractors who need it to fulfill your orders.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">4. Third-Party Sharing</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We do not sell or rent your personal information to third parties. We may share your data with trusted service providers (such as courier companies and payment processors) solely for the purpose of fulfilling your orders.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">5. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Under the Data Protection Act of Kenya, you have the right to access, correct, or request the deletion of your personal data. If you wish to exercise any of these rights, please contact us at the details provided below.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">6. Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our website uses cookies to enhance your browsing experience and remember your vehicle selections. You can choose to disable cookies through your browser settings, though some features of the site may not function correctly.
              </p>

              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">7. Contact Us</h2>
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm mb-12">
                <p className="text-gray-700 mb-4 font-bold">For any privacy-related inquiries, please contact:</p>
                <p className="text-sm text-gray-700"><strong>Email:</strong> <a href="mailto:valvin@supremeautoparts.co.ke" className="text-[oklch(0.45_0.22_27)] underline">valvin@supremeautoparts.co.ke</a></p>
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
