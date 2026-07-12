import { useState, useCallback } from "react";
import { Link } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatCurrency, formatDate, PRODUCT_STATUS_COLORS } from "../lib/api";
import {
  Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye,
  Package, ChevronLeft, ChevronRight, MoreVertical, Copy, Archive,
  CheckSquare, Square, RefreshCw, AlertTriangle, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "All", "Braking Systems", "Engine Components", "Transmission & Gear",
  "Steering Systems", "Suspension & Chassis", "Electrical & Sensors",
  "Alloys & Rims", "Lubricants & Fluids", "Body Kits & Styling",
  "Glass & Windscreens", "Tyres",
];

const STATUSES = ["All", "active", "draft", "archived"];

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const limit = 20;

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (category !== "All") queryParams.set("category", category);
  if (status !== "All") queryParams.set("status", status);

  const { data: products, loading, refetch } = useAdminFetch<any[]>(
    `/api/admin/products?${queryParams.toString()}`
  );

  const allProducts = products || [];
  const totalPages = Math.ceil(allProducts.length / limit);
  const paginated = allProducts.slice((page - 1) * limit, page * limit);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((p) => p.id)));
    }
  };

  const handleBulkStatus = async (newStatus: string) => {
    if (!selected.size) return;
    try {
      await adminFetch("/api/admin/products/bulk/status", {
        method: "PUT",
        body: JSON.stringify({ ids: Array.from(selected), status: newStatus }),
      });
      toast.success(`${selected.size} products updated to ${newStatus}`);
      setSelected(new Set());
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await adminFetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
      toast.success("Product duplicated");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleExport = () => {
    window.open("/api/admin/products/export/csv", "_blank");
  };

  return (
    <AdminLayout
      title="Products"
      subtitle={`${allProducts.length} products total`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
          >
            <Download size={13} /> Export
          </button>
          <Link href="/admin/products/new">
            <a className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide">
              <Plus size={13} /> Add Product
            </a>
          </Link>
        </div>
      }
    >
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, brand..."
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
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E42933] bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
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

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="bg-[#E42933]/5 border border-[#E42933]/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-[#E42933]">{selected.size} selected</span>
          <button
            onClick={() => handleBulkStatus("active")}
            className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
          >
            Set Active
          </button>
          <button
            onClick={() => handleBulkStatus("draft")}
            className="text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            Set Draft
          </button>
          <button
            onClick={() => handleBulkStatus("archived")}
            className="text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Archive
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-700">
                    {selected.size === paginated.length && paginated.length > 0 ? (
                      <CheckSquare size={16} className="text-[#E42933]" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Stock
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                          <div>
                            <div className="h-3 bg-gray-200 rounded w-32 mb-1" />
                            <div className="h-2 bg-gray-100 rounded w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-16 ml-auto" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 bg-gray-100 rounded w-8 mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-14 mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                : paginated.map((product) => (
                    <tr
                      key={product.id}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        selected.has(product.id) && "bg-[#E42933]/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <button onClick={() => toggleSelect(product.id)} className="text-gray-400 hover:text-gray-700">
                          {selected.has(product.id) ? (
                            <CheckSquare size={16} className="text-[#E42933]" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/assets/images/placeholder.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs font-mono text-gray-500">{product.sku}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">{product.category}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatCurrency(product.comparePrice)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span
                          className={cn(
                            "text-xs font-bold",
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= product.lowStockThreshold
                              ? "text-orange-600"
                              : "text-gray-700"
                          )}
                        >
                          {product.stock}
                          {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                            <AlertTriangle size={11} className="inline ml-1 text-orange-500" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                            PRODUCT_STATUS_COLORS[product.status]
                          )}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <a className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit size={14} />
                            </a>
                          </Link>
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && paginated.length === 0 && (
          <div className="text-center py-16">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No products found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            <Link href="/admin/products/new">
              <a className="inline-flex items-center gap-2 mt-4 bg-[#E42933] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c41f28] transition-colors uppercase">
                <Plus size={13} /> Add First Product
              </a>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, allProducts.length)} of{" "}
              {allProducts.length}
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
                      p === page
                        ? "bg-[#E42933] text-white"
                        : "text-gray-500 hover:bg-gray-100"
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
