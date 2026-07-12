import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatCurrency, formatDate } from "../lib/api";
import {
  Plus, Tag, Trash2, Edit, X, Save, Copy, RefreshCw, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount (KES)" },
  { value: "free_shipping", label: "Free Shipping" },
];

export default function DiscountsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
    active: true,
    description: "",
  });

  const { data: discounts, loading, refetch } = useAdminFetch<any[]>("/api/admin/discounts");

  const filtered = (discounts || []).filter(
    (d) => !search || d.code.toLowerCase().includes(search.toLowerCase())
  );

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = "SUPREME" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setForm({ ...form, code });
  };

  const handleCreate = async () => {
    if (!form.code || !form.value) {
      toast.error("Code and discount value are required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/discounts", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value),
          minOrder: form.minOrder ? parseFloat(form.minOrderAmount) : undefined,
          maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        }),
      });
      toast.success("Discount code created");
      setShowCreate(false);
      setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "", active: true, description: "" });
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    try {
      await adminFetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
      toast.success("Discount deleted");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await adminFetch(`/api/admin/discounts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active: !active }),
      });
      toast.success(isActive ? "Discount deactivated" : "Discount activated");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminLayout
      title="Discounts"
      subtitle={`${filtered.length} discount codes`}
      actions={
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
        >
          <Plus size={13} /> Create Discount
        </button>
      }
    >
      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">Create Discount Code</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Discount Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUPREME20"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933]"
                  />
                  <button
                    onClick={generateCode}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. 20% off for new customers"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                  >
                    {DISCOUNT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Value *
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === "percentage" ? "20" : "500"}
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Min Order (KES)
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="Unlimited"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search discount codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
          />
        </div>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))
          : filtered.map((discount) => {
              const isExpired = discount.expiresAt && new Date(discount.expiresAt) < new Date();
              return (
                <div
                  key={discount.id}
                  className={cn(
                    "bg-white rounded-xl border p-5",
                    isExpired ? "border-gray-200 opacity-60" : discount.active ? "border-green-100" : "border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-gray-900 font-mono">{discount.code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(discount.code);
                            toast.success("Copied!");
                          }}
                          className="text-gray-400 hover:text-gray-700"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                      {discount.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{discount.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(discount.id, discount.active)}
                        className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full uppercase transition-colors",
                          discount.active && !isExpired
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {isExpired ? "Expired" : discount.active ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-lg font-black text-[#E42933]">
                      {discount.type === "percentage"
                        ? `${discount.value}% OFF`
                        : discount.type === "free_shipping"
                        ? "FREE SHIPPING"
                        : `KES ${discount.value?.toLocaleString()} OFF`}
                    </p>
                    {discount.minOrder && discount.minOrder > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Min order: {formatCurrency(discount.minOrder)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      Used: {discount.usedCount || 0}
                      {discount.maxUses ? ` / ${discount.maxUses}` : ""}
                    </span>
                    {discount.expiresAt && (
                      <span>Expires: {formatDate(discount.expiresAt)}</span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Tag size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No discount codes found</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 inline-flex items-center gap-2 bg-[#E42933] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c41f28] transition-colors uppercase"
          >
            <Plus size={13} /> Create First Discount
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
