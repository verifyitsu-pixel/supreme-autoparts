import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { formatDateTime } from "../lib/api";
import {
  Activity, Search, RefreshCw, ChevronLeft, ChevronRight,
  Shield, User, Package, ShoppingBag, Settings, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_ICONS: Record<string, any> = {
  product: Package,
  order: ShoppingBag,
  customer: User,
  settings: Settings,
  discount: Tag,
  admin: Shield,
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-50 text-green-700",
  update: "bg-blue-50 text-blue-700",
  delete: "bg-red-50 text-red-700",
  login: "bg-purple-50 text-purple-700",
  logout: "bg-gray-100 text-gray-600",
  view: "bg-gray-50 text-gray-500",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 25;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (actionType !== "All") queryParams.set("action", actionType);

  const { data, loading, refetch } = useAdminFetch<any>(
    `/api/admin/audit-logs?${queryParams.toString()}`
  );

  const logs = data?.logs || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout
      title="Audit Logs"
      subtitle={`${total} recorded actions`}
      actions={
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      }
    >
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by admin, action, or resource..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
            />
          </div>
          <div className="flex gap-1">
            {["All", "create", "update", "delete", "login"].map((a) => (
              <button
                key={a}
                onClick={() => { setActionType(a); setPage(1); }}
                className={cn(
                  "px-3 py-2 text-xs font-bold rounded-lg transition-colors capitalize",
                  actionType === a
                    ? "bg-[#E42933] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Details</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-200 rounded" /><div className="h-3 bg-gray-200 rounded w-16" /></div></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-28" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                    </tr>
                  ))
                : logs.map((log: any) => {
                    const Icon = ACTION_ICONS[log.resourceType] || Activity;
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                              ACTION_COLORS[log.action] || "bg-gray-100 text-gray-600"
                            )}>
                              {log.action}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Icon size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-600 capitalize">{log.resourceType}</span>
                            {log.resourceId && (
                              <span className="text-xs font-mono text-gray-400">#{log.resourceId?.slice(0, 8)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-gray-600">{log.adminName || log.adminEmail || "System"}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{log.details || "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-500 whitespace-nowrap">{formatDateTime(log.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!loading && logs.length === 0 && (
          <div className="text-center py-16">
            <Activity size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No audit logs found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
