import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import AdminLayout from "../AdminLayout";
import { adminFetch, adminUpload, formatCurrency } from "../lib/api";
import {
  Save, ArrowLeft, Upload, X, Plus, Trash2, Image, Package,
  DollarSign, Layers, Tag, Info, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Braking Systems", "Engine Components", "Transmission & Gear",
  "Steering Systems", "Suspension & Chassis", "Electrical & Sensors",
  "Alloys & Rims", "Lubricants & Fluids", "Body Kits & Styling",
  "Glass & Windscreens", "Tyres",
];

const BRANDS = [
  "Toyota", "BMW", "Mercedes-Benz", "Honda", "Nissan", "Hyundai",
  "Subaru", "Volkswagen", "Ford", "Mitsubishi", "Suzuki", "Mazda",
  "Isuzu", "Land Rover", "Brembo", "Bosch", "Denso", "NGK",
  "Bridgestone", "Michelin", "Continental", "Pirelli", "Goodyear", "Dunlop",
  "Other",
];

interface ProductFormProps {
  productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const [, setLocation] = useLocation();
  const isEditing = !!productId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    price: "",
    comparePrice: "",
    cost: "",
    stock: "0",
    lowStockThreshold: "5",
    description: "",
    condition: "New",
    status: "active",
    tags: [] as string[],
    images: [] as string[],
    weight: "",
    partNumber: "",
    compatibility: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [compatInput, setCompatInput] = useState("");
  const [activeSection, setActiveSection] = useState<string[]>(["basic", "pricing", "inventory", "images"]);

  const toggleSection = (s: string) => {
    setActiveSection((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  // Load product for editing
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    adminFetch(`/api/admin/products/${productId}`)
      .then((p) => {
        setForm({
          name: p.name || "",
          sku: p.sku || "",
          category: p.category || "",
          subcategory: p.subcategory || "",
          brand: p.brand || "",
          model: p.model || "",
          price: String(p.price || ""),
          comparePrice: String(p.comparePrice || ""),
          cost: String(p.cost || ""),
          stock: String(p.stock || 0),
          lowStockThreshold: String(p.lowStockThreshold || 5),
          description: p.description || "",
          condition: p.condition || "New",
          status: p.status || "active",
          tags: p.tags || [],
          images: p.images || [],
          weight: String(p.weight || ""),
          partNumber: p.partNumber || "",
          compatibility: p.compatibility || [],
        });
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("images", f));
      const result = await adminUpload("/api/admin/upload", formData);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...result.urls] }));
      toast.success(`${result.urls.length} image(s) uploaded`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput("");
  };

  const addCompat = () => {
    const c = compatInput.trim();
    if (c && !form.compatibility.includes(c)) {
      setForm((prev) => ({ ...prev, compatibility: [...prev.compatibility, c] }));
    }
    setCompatInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price, and category are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        cost: form.cost ? parseFloat(form.cost) : undefined,
        stock: parseInt(form.stock),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        weight: form.weight ? parseFloat(form.weight) : undefined,
      };

      if (isEditing) {
        await adminFetch(`/api/admin/products/${productId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Product updated successfully");
      } else {
        await adminFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Product created successfully");
      }
      setLocation("/admin/products");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const profit = form.price && form.cost
    ? parseFloat(form.price) - parseFloat(form.cost)
    : null;
  const margin = profit && form.price
    ? ((profit / parseFloat(form.price)) * 100).toFixed(1)
    : null;

  const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: React.ElementType }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-gray-500" />
        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{title}</span>
      </div>
      {activeSection.includes(id) ? (
        <ChevronUp size={16} className="text-gray-400" />
      ) : (
        <ChevronDown size={16} className="text-gray-400" />
      )}
    </button>
  );

  if (loading) {
    return (
      <AdminLayout title={isEditing ? "Edit Product" : "New Product"}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditing ? "Edit Product" : "New Product"}
      subtitle={isEditing ? `Editing: ${form.name}` : "Add a new product to your catalog"}
      actions={
        <button
          onClick={() => setLocation("/admin/products")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-4">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <SectionHeader id="basic" title="Basic Information" icon={Info} />
              {activeSection.includes("basic") && (
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="e.g. Toyota Hilux Brake Pads - Premium OEM"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={form.sku}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        placeholder="Auto-generated if empty"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Part Number
                      </label>
                      <input
                        type="text"
                        value={form.partNumber}
                        onChange={(e) => setForm({ ...form, partNumber: e.target.value })}
                        placeholder="OEM part number"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                      >
                        <option value="">Select category...</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={form.subcategory}
                        onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                        placeholder="e.g. Brake Pads"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Brand
                      </label>
                      <select
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                      >
                        <option value="">Select brand...</option>
                        {BRANDS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Model
                      </label>
                      <input
                        type="text"
                        value={form.model}
                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                        placeholder="e.g. Hilux Vigo/Revo"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      placeholder="Detailed product description..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Condition
                    </label>
                    <div className="flex gap-2">
                      {["New", "Used", "Refurbished"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setForm({ ...form, condition: c })}
                          className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg border transition-colors",
                            form.condition === c
                              ? "bg-[#E42933] text-white border-[#E42933]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <SectionHeader id="pricing" title="Pricing" icon={DollarSign} />
              {activeSection.includes("pricing") && (
                <div className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Selling Price (KES) *
                      </label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Compare Price (KES)
                      </label>
                      <input
                        type="number"
                        value={form.comparePrice}
                        onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Cost Price (KES)
                      </label>
                      <input
                        type="number"
                        value={form.cost}
                        onChange={(e) => setForm({ ...form, cost: e.target.value })}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                  </div>
                  {profit !== null && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 font-semibold">Profit Margin</span>
                        <span className="font-black text-green-800">
                          {formatCurrency(profit)} ({margin}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <SectionHeader id="inventory" title="Inventory" icon={Layers} />
              {activeSection.includes("inventory") && (
                <div className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        min="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Low Stock Alert
                      </label>
                      <input
                        type="number"
                        value={form.lowStockThreshold}
                        onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                        min="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tags & Compatibility */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <SectionHeader id="tags" title="Tags & Compatibility" icon={Tag} />
              {activeSection.includes("tags") && (
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Compatible Vehicles
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={compatInput}
                        onChange={(e) => setCompatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCompat())}
                        placeholder="e.g. Toyota Hilux Vigo"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                      />
                      <button
                        type="button"
                        onClick={addCompat}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.compatibility.map((c) => (
                        <span
                          key={c}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {c}
                          <button
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, compatibility: p.compatibility.filter((x) => x !== c) }))}
                            className="text-blue-400 hover:text-red-500"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4">
            {/* Status & Save */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">
                Product Status
              </h3>
              <div className="space-y-2 mb-4">
                {[
                  { value: "active", label: "Active", desc: "Visible on store" },
                  { value: "draft", label: "Draft", desc: "Hidden from store" },
                  { value: "archived", label: "Archived", desc: "Removed from catalog" },
                ].map((s) => (
                  <label
                    key={s.value}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      form.status === s.value
                        ? "border-[#E42933] bg-[#E42933]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s.value}
                      checked={form.status === s.value}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="mt-0.5 accent-[#E42933]"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{s.label}</p>
                      <p className="text-[11px] text-gray-400">{s.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#E42933] hover:bg-[#c41f28] text-white font-black py-3 rounded-xl transition-colors disabled:opacity-70 text-sm uppercase tracking-wide flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    {isEditing ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Image size={14} /> Product Images
              </h3>

              {/* Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleImageUpload(e.dataTransfer.files);
                }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                  dragOver
                    ? "border-[#E42933] bg-[#E42933]/5"
                    : "border-gray-200 hover:border-[#E42933]/50 hover:bg-gray-50"
                )}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
                    <p className="text-xs text-gray-500">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-600">
                      Drop images here or click to upload
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />

              {/* Image Grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/images/placeholder.jpg";
                        }}
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* URL Input */}
              <div className="mt-3">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Or add image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    id="imageUrlInput"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E42933]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("imageUrlInput") as HTMLInputElement;
                      if (input.value) {
                        setForm((p) => ({ ...p, images: [...p.images, input.value] }));
                        input.value = "";
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
