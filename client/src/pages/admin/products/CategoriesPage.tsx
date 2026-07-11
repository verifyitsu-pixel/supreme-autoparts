import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { Tag, Package, Edit, Trash2, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Braking Systems", slug: "braking-systems", description: "Brake pads, discs, calipers, and brake fluid", productCount: 0, icon: "🛑" },
  { id: "2", name: "Engine Components", slug: "engine-components", description: "Oil filters, air filters, spark plugs, and engine parts", productCount: 0, icon: "⚙️" },
  { id: "3", name: "Transmission & Gear", slug: "transmission-gear", description: "Gearboxes, clutches, and transmission parts", productCount: 0, icon: "🔧" },
  { id: "4", name: "Steering Systems", slug: "steering-systems", description: "Steering racks, pumps, and tie rods", productCount: 0, icon: "🎯" },
  { id: "5", name: "Suspension & Chassis", slug: "suspension-chassis", description: "Shock absorbers, springs, and chassis parts", productCount: 0, icon: "🚗" },
  { id: "6", name: "Electrical & Sensors", slug: "electrical-sensors", description: "Alternators, starters, sensors, and wiring", productCount: 0, icon: "⚡" },
  { id: "7", name: "Alloys & Rims", slug: "alloys-rims", description: "Alloy wheels and rim accessories", productCount: 0, icon: "💿" },
  { id: "8", name: "Lubricants & Fluids", slug: "lubricants-fluids", description: "Engine oil, coolant, brake fluid, and lubricants", productCount: 0, icon: "🛢️" },
  { id: "9", name: "Body Kits & Styling", slug: "body-kits-styling", description: "Body panels, bumpers, and styling accessories", productCount: 0, icon: "🚘" },
  { id: "10", name: "Glass & Windscreens", slug: "glass-windscreens", description: "Windscreens, side windows, and mirrors", productCount: 0, icon: "🪟" },
  { id: "11", name: "Tyres", slug: "tyres", description: "Premium tyres from all major brands", productCount: 0, icon: "🔵" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", description: "", icon: "📦" });
  const [editForm, setEditForm] = useState({ name: "", description: "", icon: "" });

  const startEdit = (cat: typeof DEFAULT_CATEGORIES[0]) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description, icon: cat.icon });
  };

  const saveEdit = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...editForm } : c))
    );
    setEditingId(null);
    toast.success("Category updated");
  };

  const deleteCategory = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const addCategory = () => {
    if (!newCat.name) {
      toast.error("Category name is required");
      return;
    }
    const id = Date.now().toString();
    const slug = newCat.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setCategories((prev) => [...prev, { ...newCat, id, slug, productCount: 0 }]);
    setNewCat({ name: "", description: "", icon: "📦" });
    setShowAdd(false);
    toast.success("Category added");
  };

  return (
    <AdminLayout
      title="Categories"
      subtitle={`${categories.length} product categories`}
      actions={
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
        >
          <Plus size={13} /> Add Category
        </button>
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
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="e.g. Exhaust Systems"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            {editingId === cat.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#E42933]"
                  placeholder="Icon"
                />
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#E42933]"
                  placeholder="Name"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#E42933] resize-none"
                  placeholder="Description"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="flex-1 bg-[#E42933] text-white text-xs font-bold py-1.5 rounded-lg hover:bg-[#c41f28] transition-colors flex items-center justify-center gap-1"
                  >
                    <Save size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 border border-gray-200 text-gray-600 text-xs font-bold py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
                    {cat.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Package size={12} />
                  <span>{cat.productCount} products</span>
                  <span className="ml-auto font-mono text-gray-300">/{cat.slug}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
