import { useState } from "react";
import { Link, useSearch } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatCurrency, formatDateTime } from "../lib/api";
import {
  RefreshCw, Eye, CheckCircle, XCircle, Clock, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  processed: "bg-blue-50 text-blue-700",
};

export default function RefundsPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const [status, setStatus] = useState(params.get("status") || "All");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const queryParams = new URLSearchParams();
  if (status !== "All") queryParams.set("status", status);
  if (search) queryParams.set("search", search);

  const { data: refunds, loading, refetch } = useAdminFetch<any[]>(
    `/api/admin/refunds?${queryParams.toString()}`
  );

  const allRefunds = refunds || [];

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessing(id);
    try {
      await adminFetch(`/api/admin/refunds/${id}/${action}`, { method: "POST" });
      toast.success(`Refund ${action}d`);
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <AdminLayout
      title="Refunds"
      subtitle={`${allRefunds.length} refund requests`}
    >
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
            />
          </div>
          <div className="flex gap-1">
            {["All", "pending", "approved", "rejected", "processed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-3 py-2 text-xs font-bold rounded-lg transition-colors capitalize",
                  status === s
                    ? "bg-[#E42933] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {s === "All" ? "All" : s}
              </button>
            ))}
          </div>
          <button onClick={refetch} className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reason</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-24" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-28" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-16 ml-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-16 mx-auto" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-20 ml-auto" /></td>
                    </tr>
                  ))
                : allRefunds.map((refund) => (
                    <tr key={refund.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${refund.orderId}`}>
                          <a className="text-sm font-bold text-[#E42933] hover:underline">
                            {refund.orderNumber}
                          </a>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-600">{refund.customerName || refund.customerEmail}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500 line-clamp-1">{refund.reason}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(refund.amount)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                          STATUS_COLORS[refund.status] || "bg-gray-100 text-gray-600"
                        )}>
                          {refund.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{formatDateTime(refund.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {refund.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(refund.id, "approve")}
                                disabled={processing === refund.id}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => handleAction(refund.id, "reject")}
                                disabled={processing === refund.id}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <Link href={`/admin/orders/${refund.orderId}`}>
                            <a className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                              <Eye size={14} />
                            </a>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && allRefunds.length === 0 && (
          <div className="text-center py-16">
            <RefreshCw size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No refund requests</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
