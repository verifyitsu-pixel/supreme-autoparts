import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { formatCurrency, formatDateTime, PAYMENT_STATUS_COLORS } from "../lib/api";
import {
  Search, Download, RefreshCw, CreditCard, DollarSign,
  TrendingUp, ChevronLeft, ChevronRight, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = ["All", "mpesa", "card", "bank_transfer", "cash"];

interface PaymentsResponse {
  payments: any[];
  total: number;
  totalAmount: number;
  page: number;
  totalPages: number;
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 20;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (method !== "All") queryParams.set("method", method);
  if (status !== "All") queryParams.set("status", status);

  const { data, loading, refetch } = useAdminFetch<PaymentsResponse>(
    `/api/admin/payments?${queryParams.toString()}`
  );

  const payments = data?.payments || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  const totalAmount = data?.totalAmount || 0;

  const handleExport = () => {
    window.open("/api/admin/payments/export/csv", "_blank");
  };

  const methodLabel = (m: string) => {
    const labels: Record<string, string> = {
      mpesa: "M-Pesa",
      card: "Card",
      bank_transfer: "Bank Transfer",
      cash: "Cash",
    };
    return labels[m] || m;
  };

  return (
    <AdminLayout
      title="Payments"
      subtitle={`${total} transactions`}
      actions={
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
        >
          <Download size={13} /> Export CSV
        </button>
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Received</p>
          <p className="text-xl font-black text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Transactions</p>
          <p className="text-xl font-black text-gray-900">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">M-Pesa</p>
          <p className="text-xl font-black text-green-700">
            {payments.filter((p) => p.method === "mpesa").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Card</p>
          <p className="text-xl font-black text-blue-700">
            {payments.filter((p) => p.method === "card").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by reference, order number..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => { setMethod(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E42933] bg-white"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m === "All" ? "All Methods" : methodLabel(m)}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E42933] bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Method
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
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
                      <td className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-28" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-16 ml-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-12 mx-auto" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                : payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-bold text-gray-900">
                          {payment.reference || payment.mpesaCode || payment.id?.slice(0, 12)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {payment.orderId ? (
                          <Link href={`/admin/orders/${payment.orderId}`}>
                            <a className="text-xs text-[#E42933] font-semibold hover:underline">
                              {payment.orderNumber}
                            </a>
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">{payment.customerName || payment.phone || "—"}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={12} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-700">
                            {methodLabel(payment.method)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                          PAYMENT_STATUS_COLORS[payment.status]
                        )}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{formatDateTime(payment.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {payment.orderId && (
                          <Link href={`/admin/orders/${payment.orderId}`}>
                            <a className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                              <Eye size={14} />
                            </a>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && payments.length === 0 && (
          <div className="text-center py-16">
            <CreditCard size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No payments found</p>
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
