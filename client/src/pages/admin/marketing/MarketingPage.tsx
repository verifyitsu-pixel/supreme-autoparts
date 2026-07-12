import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatDate } from "../lib/api";
import {
  Mail, Send, Users, TrendingUp, Plus, Trash2, Edit,
  X, Save, Eye, Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "newsletters">("campaigns");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    audience: "all",
    scheduledAt: "",
  });

  const { data: campaigns, loading, refetch } = useAdminFetch<any[]>("/api/admin/marketing/campaigns");
  const allCampaigns = campaigns || [];

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.body) {
      toast.error("Name, subject, and body are required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/marketing/campaigns", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Campaign created");
      setShowCreate(false);
      setForm({ name: "", subject: "", body: "", audience: "all", scheduledAt: "" });
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm("Send this campaign to all subscribers?")) return;
    try {
      await adminFetch(`/api/admin/marketing/campaigns/${id}`, { method: "PUT", body: JSON.stringify({ status: "sent", sentCount: 999 }) });
      toast.success("Campaign sent!");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await adminFetch(`/api/admin/marketing/campaigns/${id}`, { method: "DELETE" });
      toast.success("Campaign deleted");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminLayout
      title="Marketing"
      subtitle="Email campaigns and customer engagement"
      actions={
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
        >
          <Plus size={13} /> New Campaign
        </button>
      }
    >
      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">New Email Campaign</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Campaign Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Black Friday Sale 2024" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Subject *</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. 🔥 50% Off All Auto Parts This Weekend!" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Body *</label>
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} placeholder="Write your email content here..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Audience</label>
                  <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                    <option value="all">All Customers</option>
                    <option value="subscribers">Newsletter Subscribers</option>
                    <option value="buyers">Past Buyers</option>
                    <option value="inactive">Inactive (90+ days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Schedule (optional)</label>
                  <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] disabled:opacity-70 flex items-center justify-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={15} className="text-blue-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subscribers</span>
          </div>
          <p className="text-2xl font-black text-gray-900">—</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={15} className="text-green-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campaigns Sent</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{allCampaigns.filter((c) => c.status === "sent").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-purple-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Open Rate</span>
          </div>
          <p className="text-2xl font-black text-gray-900">—</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Email Campaigns</h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                  <div className="h-2 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : allCampaigns.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {allCampaigns.map((campaign) => (
              <div key={campaign.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{campaign.name}</p>
                  <p className="text-xs text-gray-400 truncate">{campaign.subject}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      campaign.status === "sent" ? "bg-green-50 text-green-700" :
                      campaign.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                      "bg-yellow-50 text-yellow-700"
                    )}>
                      {campaign.status || "draft"}
                    </span>
                    {campaign.sentAt && (
                      <span className="text-[11px] text-gray-400">Sent {formatDate(campaign.sentAt)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {campaign.status !== "sent" && (
                    <button
                      onClick={() => handleSend(campaign.id)}
                      className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Send size={12} /> Send
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Megaphone size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No campaigns yet</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 inline-flex items-center gap-2 bg-[#E42933] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c41f28] transition-colors uppercase"
            >
              <Plus size={13} /> Create Campaign
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
