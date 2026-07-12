import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch } from "../lib/api";
import { Tag, Package, Edit, Trash2, Plus, X, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
  const { data: categories, loading, refetch } = useAdminFetch<any[]>("/api/admin/categories");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", description: "", icon: "\uD83D\uDCE6" });
  const [editForm, setEditForm] = useState({ name: "", description: "", icon: "" });

  const allCategories = categories || [];

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || "", icon: cat.icon || "\uD83D\uDCE6" });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      toast.success("Category updated");
      setEditingId(null);
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      toast.success("Category deleted");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addCategory = async () => {
    if (!newCat.name) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(newCat),
      });
      toast.success("Category added");
      setNewCat({ name: "", description: "", icon: "\uD83D\uDCE6" });
      setShowAdd(false);
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Categories"
      subtitle={`${allCategories.length} product categories`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
          >
            <Plus size={13} /> Add Category
          </button>
        </div>
      }
    >
      {/* Add Category Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-900 uppercase">New Category</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Name *</label>
                <input
                  type="text"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="e.g. Braking Systems"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                <input
                  type="text"
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  placeholder="e.g. Brake pads, discs, calipers"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Icon</label>
                <input
                  type="text"
                  value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                  placeholder="\uD83D\uDCE6"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={addCategory} disabled={saving} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-8 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))
          : allCategories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                {editingId === cat.id ? (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Icon</label>
                        <input
                          type="text"
                          value={editForm.icon}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(cat.id)}
                          disabled={saving}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Save size={12} /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{cat.icon || "\uD83D\uDCE6"}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{cat.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{cat.description || "No description"}</p>
                        <p className="text-xs text-gray-500 mt-2">{cat.productCount || 0} products</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => startEdit(cat)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#E42933] px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
      </div>

      {!loading && allCategories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Tag size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No categories yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first category to organize products</p>
        </div>
      )}
    </AdminLayout>
  );
}
