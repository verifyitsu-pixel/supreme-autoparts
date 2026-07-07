import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import {
  RotateCcw,
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface ReturnFormData {
  orderId: string;
  reason: string;
  description: string;
  itemsAffected: string[];
  attachments: File[];
}

export default function Returns() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<ReturnFormData>({
    orderId: "",
    reason: "",
    description: "",
    itemsAffected: [],
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  // Mock orders - replace with API call
  const mockOrders = [
    { id: "ORD-001", date: "2024-07-01", total: 45000 },
    { id: "ORD-002", date: "2024-06-28", total: 28500 },
  ];

  const returnReasons = [
    "Part doesn't fit",
    "Damaged in transit",
    "Wrong part received",
    "Changed mind",
    "Quality issues",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit return request
      console.log("Return request:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit return:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center py-20">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Return Request Submitted
            </h1>
            <p className="text-gray-600 mb-8">
              We've received your return request. You'll receive a confirmation email shortly.
            </p>
            <button
              onClick={() => setLocation("/dashboard")}
              className="px-8 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors inline-flex items-center gap-2"
            >
              Back to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Request a Return</h1>
            <p className="text-gray-600">
              Submit a return request for an order. Our team will review it within 24 hours.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Return Policy</h3>
              <p className="text-sm text-blue-800">
                Items must be returned within 30 days of delivery in original condition. Some
                items may have restocking fees.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            {/* Order Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Order *
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] focus:border-transparent"
                required
              >
                <option value="">Choose an order...</option>
                {mockOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} - {order.date} - KES {order.total.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Return Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason for Return *
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] focus:border-transparent"
                required
              >
                <option value="">Select a reason...</option>
                {returnReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please provide details about the issue..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] focus:border-transparent resize-none"
                rows={5}
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#E42933] transition-colors cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop images here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, WebP (Max 5MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({
                        ...formData,
                        attachments: Array.from(e.target.files),
                      });
                    }
                  }}
                />
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file) => (
                    <div key={file.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="text-green-600" size={18} />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkbox for Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#E42933] focus:ring-[#E42933]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I understand that I'm responsible for return shipping costs unless the item
                arrived damaged
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setLocation("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    Submit Return Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
