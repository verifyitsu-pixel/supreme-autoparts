import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { adminFetch, formatCurrency } from "../lib/api";
import { useAdminFetch } from "../lib/useAdminFetch";
import { Plus, Truck, Edit, Trash2, Save, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika",
  "Malindi", "Kitale", "Garissa", "Kakamega", "Nyeri", "Meru",
  "Machakos", "Kisii", "Kericho", "Embu", "Migori", "Homabay",
  "Bungoma", "Busia", "All Kenya",
];

export default function ShippingPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    counties: [] as string[],
    rate: "",
    freeShippingThreshold: "",
    estimatedDays: "",
    isActive: true,
  });

  const { data: zones, loading, refetch } = useAdminFetch<any[]>("/api/admin/shipping/zones");
  const allZones = zones || [];

  const handleCreate = async () => {
    if (!form.name || !form.rate) {
      toast.error("Zone name and rate are required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/shipping/zones", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          rate: parseFloat(form.rate),
          freeShippingThreshold: form.freeShippingThreshold ? parseFloat(form.freeShippingThreshold) : undefined,
          estimatedDays: form.estimatedDays || "3-5",
        }),
      });
      toast.success("Shipping zone created");
      setShowAdd(false);
      setForm({ name: "", counties: [], rate: "", freeShippingThreshold: "", estimatedDays: "", isActive: true });
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shipping zone?")) return;
    try {
      await adminFetch(`/api/admin/shipping/zones/${id}`, { method: "DELETE" });
      toast.success("Zone deleted");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleCounty = (county: string) => {
    setForm((prev) => ({
      ...prev,
      counties: prev.counties.includes(county)
        ? prev.counties.filter((c) => c !== county)
        : [...prev.counties, county],
    }));
  };

  return (
    <AdminLayout
      title="Shipping"
      subtitle="Manage shipping zones and rates"
      actions={
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
        >
          <Plus size={13} /> Add Zone
        </button>
      }
    >
      {/* Add Zone Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">New Shipping Zone</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Zone Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Nairobi Metro"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Rate (KES) *</label>
                  <input
                    type="number"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    placeholder="300"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Free Shipping From (KES)</label>
                  <input
                    type="number"
                    value={form.freeShippingThreshold}
                    onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                    placeholder="5000"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Estimated Delivery</label>
                <input
                  type="text"
                  value={form.estimatedDays}
                  onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
                  placeholder="e.g. 1-2 business days"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Counties</label>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {KENYA_COUNTIES.map((county) => (
                    <button
                      key={county}
                      type="button"
                      onClick={() => toggleCounty(county)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors",
                        form.counties.includes(county)
                          ? "bg-[#E42933] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {county}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                Create Zone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
                <div className="h-8 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))
          : allZones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Truck size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900">{zone.name}</h3>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                        zone.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      )}>
                        {zone.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xl font-black text-gray-900">{formatCurrency(zone.rate)}</p>
                  <p className="text-xs text-gray-500">per delivery</p>
                  {zone.freeShippingThreshold && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Free over {formatCurrency(zone.freeShippingThreshold)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                  <Truck size={11} />
                  {zone.estimatedDays || "3-5 business days"}
                </div>

                {zone.counties?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {zone.counties.slice(0, 4).map((c: string) => (
                      <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                        {c}
                      </span>
                    ))}
                    {zone.counties.length > 4 && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                        +{zone.counties.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>

      {!loading && allZones.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Truck size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No shipping zones configured</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 inline-flex items-center gap-2 bg-[#E42933] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c41f28] transition-colors uppercase"
          >
            <Plus size={13} /> Add First Zone
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
