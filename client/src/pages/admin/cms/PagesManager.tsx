import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatDate } from "../lib/api";
import { Plus, FileText, Edit, Trash2, Eye, Save, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_PAGES = [
  { id: "1", title: "About Us", slug: "about", status: "published", updatedAt: new Date().toISOString() },
  { id: "2", title: "Contact Us", slug: "contact", status: "published", updatedAt: new Date().toISOString() },
  { id: "3", title: "Privacy Policy", slug: "privacy-policy", status: "published", updatedAt: new Date().toISOString() },
  { id: "4", title: "Terms & Conditions", slug: "terms", status: "published", updatedAt: new Date().toISOString() },
  { id: "5", title: "Shipping Policy", slug: "shipping-policy", status: "published", updatedAt: new Date().toISOString() },
  { id: "6", title: "Return Policy", slug: "return-policy", status: "published", updatedAt: new Date().toISOString() },
];

export default function PagesManager() {
  const [pages, setPages] = useState(DEFAULT_PAGES);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", status: "draft" });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.title) {
      toast.error("Page title is required");
      return;
    }
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setPages((prev) => [...prev, {
      id: Date.now().toString(),
      title: form.title,
      slug,
      status: form.status,
      updatedAt: new Date().toISOString(),
    }]);
    setShowCreate(false);
    setForm({ title: "", slug: "", content: "", status: "draft" });
    toast.success("Page created");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this page?")) return;
    setPages((prev) => prev.filter((p) => p.id !== id));
    toast.success("Page deleted");
  };

  return (
    <AdminLayout
      title="Pages"
      subtitle={`${pages.length} pages`}
      actions={
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
        >
          <Plus size={13} /> New Page
        </button>
      }
    >
      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">New Page</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. About Us"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated from title"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  placeholder="Page content (supports HTML)..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28]">Create Page</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Updated</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-900">{page.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-mono text-gray-500">/{page.slug}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                    page.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  )}>
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-gray-500">{formatDate(page.updatedAt)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View page"
                    >
                      <Globe size={14} />
                    </a>
                    <button
                      onClick={() => toast.info("Page editor coming soon")}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
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
    </AdminLayout>
  );
}
