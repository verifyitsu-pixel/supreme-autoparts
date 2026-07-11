import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { formatCurrency, formatDate } from "../lib/api";
import {
  Search, Download, Eye, ChevronLeft, ChevronRight, Users,
  RefreshCw, Mail, Phone, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomersResponse {
  customers: any[];
  total: number;
  page: number;
  totalPages: number;
}

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);

  const { data, loading, refetch } = useAdminFetch<CustomersResponse>(
    `/api/admin/customers?${queryParams.toString()}`
  );

  const customers = data?.customers || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const handleExport = () => {
    window.open("/api/admin/customers/export/csv", "_blank");
  };

  return (
    <AdminLayout
      title="Customers"
      subtitle={`${total} registered customers`}
      actions={
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
        >
          <Download size={13} /> Export CSV
        </button>
      }
    >
      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
            />
          </div>
          <button
            onClick={refetch}
            className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Orders
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Joined
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-200 rounded-full" />
                          <div className="h-3 bg-gray-200 rounded w-28" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-36" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 bg-gray-100 rounded w-8 mx-auto" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-20 ml-auto" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                : customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#E42933]/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-black text-[#E42933]">
                              {(customer.firstName?.[0] || customer.email?.[0] || "?").toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {customer.firstName && customer.lastName
                                ? `${customer.firstName} ${customer.lastName}`
                                : customer.email}
                            </p>
                            <p className="text-xs text-gray-400 md:hidden">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail size={11} className="text-gray-400" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Phone size={11} />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <ShoppingBag size={12} className="text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {customer.orderCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(customer.totalSpent || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{formatDate(customer.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/customers/${customer.id}`}>
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

        {!loading && customers.length === 0 && (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No customers found</p>
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
