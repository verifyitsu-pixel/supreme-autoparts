import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { adminFetch } from "../lib/api";
import { useAdminFetch } from "../lib/useAdminFetch";
import {
  Store, Bell, CreditCard, Globe, Palette, Save, X,
  Phone, Mail, MapPin, Clock, Shield, Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TABS = [
  { id: "store", label: "Store", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "seo", label: "SEO", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("store");
  const [saving, setSaving] = useState(false);

  const { data: settings, loading, refetch } = useAdminFetch<any>("/api/admin/settings");

  const [storeForm, setStoreForm] = useState({
    name: settings?.storeName || "Supreme Auto Parts",
    email: settings?.storeEmail || "",
    phone: settings?.storePhone || "",
    address: settings?.storeAddress || "",
    city: settings?.storeCity || "Nairobi",
    country: settings?.storeCountry || "Kenya",
    currency: settings?.currency || "KES",
    timezone: settings?.timezone || "Africa/Nairobi",
    orderPrefix: settings?.orderPrefix || "SAP",
    lowStockThreshold: settings?.lowStockThreshold || 5,
  });

  const [notifForm, setNotifForm] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newCustomer: false,
    dailyReport: false,
    adminEmail: settings?.adminEmail || "",
    smsEnabled: false,
    adminPhone: settings?.adminPhone || "",
  });

  const [seoForm, setSeoForm] = useState({
    metaTitle: settings?.metaTitle || "Supreme Auto Parts Kenya",
    metaDescription: settings?.metaDescription || "",
    metaKeywords: settings?.metaKeywords || "",
    googleAnalyticsId: settings?.googleAnalyticsId || "",
    facebookPixelId: settings?.facebookPixelId || "",
  });

  const handleSaveStore = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ ...storeForm }),
      });
      toast.success("Store settings saved");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings/notifications", {
        method: "PUT",
        body: JSON.stringify(notifForm),
      });
      toast.success("Notification settings saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings/seo", {
        method: "PUT",
        body: JSON.stringify(seoForm),
      });
      toast.success("SEO settings saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure your store">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Store Settings */}
      {activeTab === "store" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-5">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Store Name</label>
              <input
                type="text"
                value={storeForm.name}
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                <Mail size={11} className="inline mr-1" /> Contact Email
              </label>
              <input
                type="email"
                value={storeForm.email}
                onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                placeholder="info@supremeautoparts.co.ke"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                <Phone size={11} className="inline mr-1" /> Phone Number
              </label>
              <input
                type="tel"
                value={storeForm.phone}
                onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                placeholder="+254 700 000 000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                <MapPin size={11} className="inline mr-1" /> Physical Address
              </label>
              <input
                type="text"
                value={storeForm.address}
                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                placeholder="e.g. Kirinyaga Road, Industrial Area"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">City</label>
              <input
                type="text"
                value={storeForm.city}
                onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Currency</label>
              <select
                value={storeForm.currency}
                onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
              >
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Order Number Prefix</label>
              <input
                type="text"
                value={storeForm.orderPrefix}
                onChange={(e) => setStoreForm({ ...storeForm, orderPrefix: e.target.value.toUpperCase() })}
                placeholder="SAP"
                maxLength={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Low Stock Alert Threshold</label>
              <input
                type="number"
                value={storeForm.lowStockThreshold}
                onChange={(e) => setStoreForm({ ...storeForm, lowStockThreshold: parseInt(e.target.value) || 5 })}
                min="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
          </div>
          <button
            onClick={handleSaveStore}
            disabled={saving}
            className="mt-5 bg-[#E42933] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Save Store Settings
          </button>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-5">Notification Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Admin Email for Alerts</label>
              <input
                type="email"
                value={notifForm.adminEmail}
                onChange={(e) => setNotifForm({ ...notifForm, adminEmail: e.target.value })}
                placeholder="admin@supremeautoparts.co.ke"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Notifications</p>
              {[
                { key: "orderConfirmation", label: "Order Confirmation", desc: "Notify when a new order is placed" },
                { key: "orderShipped", label: "Order Shipped", desc: "Notify when an order is dispatched" },
                { key: "orderDelivered", label: "Order Delivered", desc: "Notify when an order is delivered" },
                { key: "lowStockAlert", label: "Low Stock Alert", desc: "Notify when product stock is low" },
                { key: "newCustomer", label: "New Customer", desc: "Notify when a new customer registers" },
                { key: "dailyReport", label: "Daily Sales Report", desc: "Receive a daily summary email" },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <div
                    onClick={() => setNotifForm({ ...notifForm, [item.key]: !(notifForm as any)[item.key] })}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                      (notifForm as any)[item.key] ? "bg-[#E42933]" : "bg-gray-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      (notifForm as any)[item.key] ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleSaveNotifications}
            disabled={saving}
            className="mt-5 bg-[#E42933] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Save Notification Settings
          </button>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">M-Pesa (Daraja API)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Consumer Key</label>
                <input type="password" placeholder="••••••••••••••••" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Consumer Secret</label>
                <input type="password" placeholder="••••••••••••••••" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Business Short Code</label>
                <input type="text" placeholder="174379" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Passkey</label>
                <input type="password" placeholder="••••••••••••••••" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] font-mono" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              These credentials are stored as environment variables. Update them in your Railway dashboard for production.
            </p>
          </div>
        </div>
      )}

      {/* SEO Settings */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-5">SEO & Analytics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Meta Title</label>
              <input
                type="text"
                value={seoForm.metaTitle}
                onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
              <p className="text-xs text-gray-400 mt-1">{seoForm.metaTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Meta Description</label>
              <textarea
                value={seoForm.metaDescription}
                onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                rows={3}
                placeholder="Kenya's #1 online auto parts store..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{seoForm.metaDescription.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Meta Keywords</label>
              <input
                type="text"
                value={seoForm.metaKeywords}
                onChange={(e) => setSeoForm({ ...seoForm, metaKeywords: e.target.value })}
                placeholder="auto parts, car parts, Kenya, Nairobi"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Google Analytics ID</label>
                <input
                  type="text"
                  value={seoForm.googleAnalyticsId}
                  onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={seoForm.facebookPixelId}
                  onChange={(e) => setSeoForm({ ...seoForm, facebookPixelId: e.target.value })}
                  placeholder="1234567890"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933]"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveSeo}
            disabled={saving}
            className="mt-5 bg-[#E42933] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Save SEO Settings
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
