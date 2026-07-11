import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { adminFetch } from "../lib/api";
import { useAdminFetch } from "../lib/useAdminFetch";
import {
  Store, Bell, CreditCard, Globe, Save,
  Phone, Mail, MapPin, CheckCircle, XCircle,
  RefreshCw, ExternalLink, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Payment Settings Tab ─────────────────────────────────────────────────────
function PaymentSettingsTab() {
  const { data: paymentSettings, loading, refetch } = useAdminFetch<any>("/api/admin/payment-settings");
  const [saving, setSaving] = useState(false);
  const [providers, setProviders] = useState<any>(null);

  const ps = providers || paymentSettings?.providers || {};
  const creds = paymentSettings?.credentials || {};

  const toggleProvider = (name: string, enabled: boolean) => {
    setProviders((prev: any) => ({
      ...(prev || paymentSettings?.providers || {}),
      [name]: { ...(ps[name] || {}), enabled },
    }));
  };

  const setEnv = (name: string, env: string) => {
    setProviders((prev: any) => ({
      ...(prev || paymentSettings?.providers || {}),
      [name]: { ...(ps[name] || {}), env },
    }));
  };

  const handleSave = async () => {
    if (!providers) { toast.info("No changes to save"); return; }
    setSaving(true);
    try {
      await adminFetch("/api/admin/payment-settings", {
        method: "PUT",
        body: JSON.stringify({ providers }),
      });
      toast.success("Payment settings saved");
      setProviders(null);
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRegisterIPN = async () => {
    try {
      const data = await adminFetch("/api/admin/pesapal/register-ipn", { method: "POST" });
      toast.success(`IPN registered! Set PESAPAL_IPN_ID=${data.ipnId} in Railway env vars`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const PROVIDERS = [
    {
      id: "pesapal",
      name: "Pesapal",
      description: "Accept M-Pesa, Visa, Mastercard, and other East African payment methods via Pesapal.",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      docsUrl: "https://developer.pesapal.com/",
      envOptions: ["sandbox", "live"],
      credentialChecks: [
        { label: "Consumer Key", key: "hasKey" },
        { label: "Consumer Secret", key: "hasSecret" },
        { label: "IPN ID", key: "hasIpnId" },
      ],
      extraAction: {
        label: "Register IPN URL",
        onClick: handleRegisterIPN,
        desc: "Auto-register your callback URL with Pesapal",
      },
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Accept PayPal payments and major credit/debit cards worldwide.",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      docsUrl: "https://developer.paypal.com/",
      envOptions: ["sandbox", "live"],
      credentialChecks: [
        { label: "Client ID", key: "hasClientId" },
        { label: "Client Secret", key: "hasSecret" },
        { label: "Webhook ID", key: "hasWebhookId" },
      ],
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept credit cards, Apple Pay, Google Pay, and 135+ currencies via Stripe.",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      docsUrl: "https://stripe.com/docs",
      envOptions: ["test", "live"],
      credentialChecks: [
        { label: "Secret Key", key: "hasSecretKey" },
        { label: "Webhook Secret", key: "hasWebhookSecret" },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-64" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* M-Pesa Direct (Daraja) */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">M-Pesa STK Push (Daraja API)</h3>
            <p className="text-xs text-gray-400 mt-0.5">Direct M-Pesa integration via Safaricom Daraja. Credentials are set as Railway environment variables.</p>
          </div>
          <a href="https://developer.safaricom.co.ke/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
            Docs <ExternalLink size={11} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "MPESA_CONSUMER_KEY", desc: "Daraja consumer key" },
            { label: "MPESA_CONSUMER_SECRET", desc: "Daraja consumer secret" },
            { label: "MPESA_SHORTCODE", desc: "Business short code (e.g. 174379)" },
            { label: "MPESA_PASSKEY", desc: "Lipa na M-Pesa online passkey" },
            { label: "MPESA_CALLBACK_URL", desc: "Your Railway app URL + /api/payments/callback" },
          ].map((env) => (
            <div key={env.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-mono font-bold text-gray-800">{env.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{env.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">Set these as environment variables in your Railway dashboard. They are never stored in the database.</p>
        </div>
      </div>

      {/* Pesapal / PayPal / Stripe */}
      {PROVIDERS.map((provider) => {
        const providerSettings = ps[provider.id] || {};
        const providerCreds = creds[provider.id] || {};
        const isEnabled = providerSettings.enabled || false;
        const currentEnv = providerSettings.env || provider.envOptions[0];
        const hasAllCreds = provider.credentialChecks.every((c) => providerCreds[c.key]);

        return (
          <div key={provider.id} className={cn("rounded-xl border p-6", provider.color)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{provider.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-sm">{provider.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                  Docs <ExternalLink size={11} />
                </a>
                {/* Enable/Disable Toggle */}
                <div
                  onClick={() => toggleProvider(provider.id, !isEnabled)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                    isEnabled ? "bg-[#E42933]" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    isEnabled ? "translate-x-6" : "translate-x-1"
                  )} />
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Environment:</p>
              {provider.envOptions.map((env) => (
                <button
                  key={env}
                  onClick={() => setEnv(provider.id, env)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-full transition-colors capitalize",
                    currentEnv === env
                      ? env === "live" ? "bg-green-600 text-white" : "bg-gray-700 text-white"
                      : "bg-white/70 text-gray-500 hover:bg-white"
                  )}
                >
                  {env}
                </button>
              ))}
            </div>

            {/* Credential Status */}
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Credentials (Railway Env Vars)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {provider.credentialChecks.map((cred) => (
                  <div key={cred.key} className="flex items-center gap-2">
                    {providerCreds[cred.key] ? (
                      <CheckCircle size={13} className="text-green-600 shrink-0" />
                    ) : (
                      <XCircle size={13} className="text-red-400 shrink-0" />
                    )}
                    <span className={cn(
                      "text-xs font-semibold",
                      providerCreds[cred.key] ? "text-green-700" : "text-red-500"
                    )}>
                      {cred.label}
                    </span>
                  </div>
                ))}
              </div>
              {!hasAllCreds && (
                <p className="text-[11px] text-amber-600 mt-2 flex items-center gap-1">
                  <AlertTriangle size={11} /> Set missing credentials in Railway environment variables to enable this provider.
                </p>
              )}
            </div>

            {/* Extra Action (e.g. Register IPN) */}
            {provider.extraAction && (
              <button
                onClick={provider.extraAction.onClick}
                className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-600 bg-white/70 hover:bg-white border border-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={12} /> {provider.extraAction.label}
                <span className="text-gray-400 font-normal">— {provider.extraAction.desc}</span>
              </button>
            )}
          </div>
        );
      })}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !providers}
          className="bg-[#E42933] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
          Save Payment Settings
        </button>
      </div>
    </div>
  );
}

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
        <PaymentSettingsTab />
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
