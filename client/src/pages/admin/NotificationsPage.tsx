import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useAdminFetch } from "./lib/useAdminFetch";
import { adminFetch, formatDateTime } from "./lib/api";
import {
  Bell, Package, ShoppingBag, AlertTriangle, Users,
  CheckCheck, Trash2, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NOTIF_ICONS: Record<string, any> = {
  order: ShoppingBag,
  inventory: Package,
  customer: Users,
  alert: AlertTriangle,
  default: Bell,
};

const NOTIF_COLORS: Record<string, string> = {
  order: "bg-blue-50 text-blue-600",
  inventory: "bg-orange-50 text-orange-600",
  customer: "bg-green-50 text-green-600",
  alert: "bg-red-50 text-red-600",
  default: "bg-gray-100 text-gray-600",
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [clearing, setClearing] = useState(false);

  const { data: notifications, loading, refetch } = useAdminFetch<any[]>(
    `/api/admin/notifications?filter=${filter}`
  );

  const allNotifications = notifications || [];
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await adminFetch("/api/admin/notifications/mark-all-read", { method: "POST" });
      toast.success("All notifications marked as read");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await adminFetch(`/api/admin/notifications/${id}/read`, { method: "POST" });
      refetch();
    } catch {}
  };

  const handleClearAll = async () => {
    if (!confirm("Clear all notifications?")) return;
    setClearing(true);
    try {
      await adminFetch("/api/admin/notifications/clear-all", { method: "DELETE" });
      toast.success("Notifications cleared");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <AdminLayout
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      actions={
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
            >
              <CheckCheck size={13} /> Mark All Read
            </button>
          )}
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-wide"
          >
            <Trash2 size={13} /> Clear All
          </button>
        </div>
      }
    >
      {/* Filter */}
      <div className="flex gap-1 mb-4">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg transition-colors",
              filter === f.id
                ? "bg-[#E42933] text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {f.label}
          </button>
        ))}
        <button onClick={refetch} className="ml-auto p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-4 animate-pulse flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : allNotifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {allNotifications.map((notif) => {
              const Icon = NOTIF_ICONS[notif.type] || NOTIF_ICONS.default;
              const colorClass = NOTIF_COLORS[notif.type] || NOTIF_COLORS.default;
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && handleMarkRead(notif.id)}
                  className={cn(
                    "px-5 py-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer",
                    !notif.read && "bg-blue-50/30"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "text-sm leading-snug",
                        !notif.read ? "font-semibold text-gray-900" : "text-gray-600"
                      )}>
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-[#E42933] rounded-full shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(notif.createdAt)}</p>
                    {notif.link && (
                      <a
                        href={notif.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#E42933] font-semibold hover:underline mt-0.5 inline-block"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
