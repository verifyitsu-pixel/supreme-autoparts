import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatDate } from "../lib/api";
import {
  Search, Package, AlertTriangle, RefreshCw, Edit, Save, X,
  TrendingDown, TrendingUp, Download, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FILTERS = ["All", "In Stock", "Low Stock", "Out of Stock"];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("restock");
  const [adjustNote, setAdjustNote] = useState("");
  const [saving, setSaving] = useState(false);

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (filter !== "All") queryParams.set("filter", filter.toLowerCase().replace(" ", "_"));

  const { data: products, loading, refetch } = useAdminFetch<any[]>(
    `/api/admin/inventory?${queryParams.toString()}`
  );

  const allProducts = products || [];

  const handleAdjust = async (productId: string) => {
    if (!adjustQty) {
      toast.error("Enter a quantity");
      return;
    }
    setSaving(true);
    try {
      await adminFetch(`/api/admin/inventory/${productId}/adjust`, {
        method: "POST",
        body: JSON.stringify({
          quantity: parseInt(adjustQty),
          reason: adjustReason,
          note: adjustNote,
        }),
      });
      toast.success("Inventory updated");
      setEditingId(null);
      setAdjustQty("");
      setAdjustNote("");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;
  const inStockCount = allProducts.filter((p) => p.stock > p.lowStockThreshold).length;

  return (
    <AdminLayout
      title="Inventory"
      subtitle={`${allProducts.length} products tracked`}
      actions={
        <button
          onClick={() => window.open("/api/admin/inventory/export/csv", "_blank")}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
        >
          <Download size={13} /> Export
        </button>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Package size={15} className="text-green-600" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Stock</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{inStockCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={15} className="text-orange-600" />
            </div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Low Stock</span>
          </div>
          <p className="text-2xl font-black text-orange-700">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown size={15} className="text-red-600" />
            </div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Out of Stock</span>
          </div>
          <p className="text-2xl font-black text-red-700">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
            />
          </div>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-2 text-xs font-bold rounded-lg transition-colors",
                  filter === f
                    ? "bg-[#E42933] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={refetch}
            className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  SKU
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Alert At
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Adjust
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                          <div className="h-3 bg-gray-200 rounded w-32" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-8 mx-auto" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 bg-gray-100 rounded w-8 mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-16 mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                : allProducts.map((product) => {
                    const isLow = product.stock > 0 && product.stock <= product.lowStockThreshold;
                    const isOut = product.stock === 0;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/placeholder.jpg"; }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={14} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs font-mono text-gray-500">{product.sku}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "text-sm font-black",
                            isOut ? "text-red-600" : isLow ? "text-orange-600" : "text-gray-900"
                          )}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <span className="text-xs text-gray-500">{product.lowStockThreshold}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isOut ? (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-50 text-red-600 uppercase">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-orange-50 text-orange-600 uppercase">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 uppercase">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingId === product.id ? (
                            <div className="flex items-center gap-1 justify-end">
                              <select
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#E42933] bg-white"
                              >
                                <option value="restock">Restock</option>
                                <option value="sale">Sale</option>
                                <option value="damage">Damage</option>
                                <option value="correction">Correction</option>
                                <option value="return">Return</option>
                              </select>
                              <input
                                type="number"
                                value={adjustQty}
                                onChange={(e) => setAdjustQty(e.target.value)}
                                placeholder="±qty"
                                className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#E42933]"
                              />
                              <button
                                onClick={() => handleAdjust(product.id)}
                                disabled={saving}
                                className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <Save size={12} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingId(product.id); setAdjustQty(""); }}
                              className="flex items-center gap-1 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                            >
                              <Edit size={12} /> Adjust
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!loading && allProducts.length === 0 && (
          <div className="text-center py-16">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
