import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import { Bell, Trash2, Check, AlertCircle, Loader2, Settings, Eye, EyeOff } from "lucide-react";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  createdAt: string;
}

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  securityAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const priorityColors = { low: "bg-blue-100 text-blue-800", medium: "bg-yellow-100 text-yellow-800", high: "bg-orange-100 text-orange-800", urgent: "bg-red-100 text-red-800" };

export default function Notifications() {
  const { getToken, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "settings">("all");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!isAuthenticated) { setLocation("/login"); return; }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [notifRes, settingsRes] = await Promise.all([
        fetch("/api/notifications", { headers }),
        fetch("/api/notifications/settings", { headers }),
      ]);
      if (!notifRes.ok) { if (notifRes.status === 401) { setLocation("/login"); return; } throw new Error("Failed to load notifications"); }
      setNotifications(await notifRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load data"); }
    finally { setIsLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const updateSettings = async (key: keyof NotificationSettings) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    try {
      const res = await fetch("/api/notifications/settings", {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(updated),
      });
      if (res.ok) setSettings(updated);
    } catch {}
  };

  const displayed = filter === "unread" ? notifications.filter(n => !n.isRead) : notifications;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E42933]" size={32} /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Bell className="text-[#E42933]" size={32} /> Notifications
            </h1>
            <div className="flex items-center gap-2">
              {activeTab === "all" && notifications.some(n => !n.isRead) && (
                <button onClick={markAllAsRead} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 flex items-center gap-1">
                  <Check size={14} /> Mark All Read
                </button>
              )}
              <button onClick={() => setActiveTab(activeTab === "all" ? "settings" : "all")} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {activeTab === "settings" ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><Bell size={20} /> Notification Preferences</h2>
              {settings ? Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <button onClick={() => updateSettings(key as keyof NotificationSettings)} className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-[#E42933]" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              )) : <p className="text-gray-500">No settings available</p>}
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6">
                <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === "all" ? "bg-[#E42933] text-white" : "bg-white border border-gray-300 text-gray-700"}`}>All ({notifications.length})</button>
                <button onClick={() => setFilter("unread")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === "unread" ? "bg-[#E42933] text-white" : "bg-white border border-gray-300 text-gray-700"}`}>Unread ({notifications.filter(n => !n.isRead).length})</button>
              </div>

              {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"><AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} /><p className="text-red-700 text-sm font-medium">{error}</p></div>}

              {displayed.length === 0 ? (
                <div className="text-center py-20">
                  <Bell className="mx-auto text-gray-300 mb-4" size={64} />
                  <h2 className="text-2xl font-black text-gray-900 mb-2">No notifications</h2>
                  <p className="text-gray-600">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayed.map(notif => (
                    <div key={notif.id} className={`bg-white rounded-xl shadow-sm border ${notif.isRead ? "border-gray-200" : "border-[#E42933]/30 bg-red-50/30"} p-4 flex items-start gap-4 transition-all`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.isRead ? "bg-gray-300" : "bg-[#E42933]"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-sm">{notif.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityColors[notif.priority]}`}>{notif.priority}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                          {notif.actionUrl && <a href={notif.actionUrl} className="text-xs text-[#E42933] font-semibold hover:underline">View details</a>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {!notif.isRead && <button onClick={() => markAsRead(notif.id)} className="w-8 h-8 text-green-600 hover:bg-green-50 rounded-full flex items-center justify-center"><Check size={14} /></button>}
                        <button onClick={() => deleteNotification(notif.id)} className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
