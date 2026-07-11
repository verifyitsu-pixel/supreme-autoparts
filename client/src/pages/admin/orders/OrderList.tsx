import { useState } from "react";
import { Link, useSearch } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatCurrency, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "../lib/api";
import {
  Search, Filter, Download, Eye, ChevronLeft, ChevronRight,
  ShoppingBag, RefreshCw, Plus, X, CheckSquare, Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ORDER_STATUSES = ["All", "pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["All", "paid", "unpaid", "refunded"];

interface OrdersResponse {
  orders: any[];
  total: number;
  page: number;
  totalPages: number;
}

export default function OrderList() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialStatus = params.get("status") || "All";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const limit = 20;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (status !== "All") queryParams.set("status", status);
  if (paymentStatus !== "All") queryParams.set("paymentStatus", paymentStatus);

  const { data, loading, refetch } = useAdminFetch<OrdersResponse>(
    `/api/admin/orders?${queryParams.toString()}`
  );

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === orders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(orders.map((o) => o.id)));
    }
  };

  const handleExport = () => {
    window.open("/api/admin/orders/export/csv", "_blank");
  };

  return (
    <AdminLayout
      title="Orders"
      subtitle={`${total} orders total`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
          >
            <Download size={13} /> Export CSV
          </button>
          <Link href="/admin/orders/create">
            <a className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide">
              <Plus size={13} /> New Order
            </a>
          </Link>
        </div>
      }
    >
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E42933] bg-white"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E42933] bg-white"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Payments" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={refetch}
              className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors",
              status === s
                ? "bg-[#E42933] text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {s === "All" ? "All Orders" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-700">
                    {selected.size === orders.length && orders.length > 0 ? (
                      <CheckSquare size={16} className="text-[#E42933]" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Payment
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-28" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-16 ml-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-16 mx-auto" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-5 bg-gray-100 rounded-full w-12 mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                : orders.map((order) => (
                    <tr
                      key={order.id}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        selected.has(order.id) && "bg-[#E42933]/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <button onClick={() => toggleSelect(order.id)} className="text-gray-400 hover:text-gray-700">
                          {selected.has(order.id) ? (
                            <CheckSquare size={16} className="text-[#E42933]" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                          <p className="text-xs text-gray-400">{order.items?.length || 0} items</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div>
                          <p className="text-sm text-gray-900">{order.customerName || "—"}</p>
                          <p className="text-xs text-gray-400">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">{formatDate(order.date)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                            ORDER_STATUS_COLORS[order.status]
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                            PAYMENT_STATUS_COLORS[order.paymentStatus]
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <a className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                            <Eye size={14} />
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && orders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-7 h-7 text-xs font-bold rounded-lg transition-colors",
                      p === page ? "bg-[#E42933] text-white" : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
