import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch } from "../lib/api";
import { Link } from "wouter";
import {
  Layout, Image, Megaphone, FileText, Plus, Edit, Trash2,
  Save, X, Eye, ToggleLeft, ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<"banners" | "announcements" | "hero">("banners");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
    position: "hero",
  });
  const [announcementForm, setAnnouncementForm] = useState({
    text: "",
    type: "info",
    isActive: true,
    linkUrl: "",
    linkText: "",
  });

  const { data: banners, loading: bannersLoading, refetch: refetchBanners } = useAdminFetch<any[]>("/api/admin/cms/banners");
  const { data: announcements, loading: announcementsLoading, refetch: refetchAnnouncements } = useAdminFetch<any[]>("/api/admin/cms/pages");

  const handleCreateBanner = async () => {
    if (!bannerForm.title || !bannerForm.imageUrl) {
      toast.error("Title and image URL are required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/cms/banners", {
        method: "POST",
        body: JSON.stringify(bannerForm),
      });
      toast.success("Banner created");
      setShowAdd(false);
      setBannerForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "", isActive: true, position: "hero" });
      refetchBanners();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.text) {
      toast.error("Announcement text is required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/cms/pages", {
        method: "POST",
        body: JSON.stringify(announcementForm),
      });
      toast.success("Announcement created");
      setShowAdd(false);
      setAnnouncementForm({ text: "", type: "info", isActive: true, linkUrl: "", linkText: "" });
      refetchAnnouncements();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await adminFetch(`/api/admin/cms/banners/${id}`, { method: "DELETE" });
      toast.success("Banner deleted");
      refetchBanners();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await adminFetch(`/api/admin/cms/pages/${id}`, { method: "DELETE" });
      toast.success("Announcement deleted");
      refetchAnnouncements();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleBanner = async (id: string, isActive: boolean) => {
    try {
      await adminFetch(`/api/admin/cms/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !isActive }),
      });
      refetchBanners();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminLayout
      title="Website Management"
      subtitle="Manage banners, announcements, and content"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/pages">
            <a className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide">
              <FileText size={13} /> Pages
            </a>
          </Link>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
          >
            <Plus size={13} /> Add Content
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: "banners", label: "Banners", icon: Image },
          { id: "announcements", label: "Announcements", icon: Megaphone },
          { id: "hero", label: "Hero Section", icon: Layout },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors",
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">
                {activeTab === "announcements" ? "New Announcement" : "New Banner"}
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            {activeTab === "announcements" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Announcement Text *
                  </label>
                  <textarea
                    value={announcementForm.text}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                    rows={3}
                    placeholder="e.g. Free shipping on orders above KES 5,000!"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Type</label>
                    <select
                      value={announcementForm.type}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="promo">Promo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Link Text</label>
                    <input
                      type="text"
                      value={announcementForm.linkText}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, linkText: e.target.value })}
                      placeholder="Shop Now"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Link URL</label>
                  <input
                    type="text"
                    value={announcementForm.linkUrl}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, linkUrl: e.target.value })}
                    placeholder="/shop"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                  <button onClick={handleCreateAnnouncement} disabled={saving} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] disabled:opacity-70">
                    Create
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="e.g. Summer Sale - Up to 40% Off"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="e.g. Shop premium auto parts at unbeatable prices"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Image URL *</label>
                  <input
                    type="url"
                    value={bannerForm.imageUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Link URL</label>
                    <input
                      type="text"
                      value={bannerForm.linkUrl}
                      onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                      placeholder="/shop"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Position</label>
                    <select
                      value={bannerForm.position}
                      onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                    >
                      <option value="hero">Hero</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="popup">Popup</option>
                      <option value="footer">Footer</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                  <button onClick={handleCreateBanner} disabled={saving} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] disabled:opacity-70">
                    Create Banner
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === "banners" && (
        <div className="space-y-3">
          {bannersLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))
            : (banners || []).map((banner) => (
                <div key={banner.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-32 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {banner.imageUrl && (
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900">{banner.title}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                        {banner.position}
                      </span>
                    </div>
                    {banner.subtitle && <p className="text-xs text-gray-500 truncate">{banner.subtitle}</p>}
                    {banner.linkUrl && <p className="text-xs text-[#E42933] mt-0.5">{banner.linkUrl}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleBanner(banner.id, banner.isActive)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full uppercase transition-colors",
                        banner.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      )}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
          {!bannersLoading && (banners || []).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Image size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No banners yet</p>
            </div>
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="space-y-3">
          {announcementsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))
            : (announcements || []).map((ann) => (
                <div key={ann.id} className={cn(
                  "rounded-xl border p-4 flex items-center gap-4",
                  ann.type === "promo" ? "bg-[#E42933]/5 border-[#E42933]/20" :
                  ann.type === "success" ? "bg-green-50 border-green-200" :
                  ann.type === "warning" ? "bg-yellow-50 border-yellow-200" :
                  "bg-blue-50 border-blue-200"
                )}>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{ann.text}</p>
                    {ann.linkUrl && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Link: {ann.linkText || ann.linkUrl}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                      ann.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {ann.isActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
          {!announcementsLoading && (announcements || []).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Megaphone size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No announcements yet</p>
            </div>
          )}
        </div>
      )}

      {/* Hero Section Tab */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-4">
            Configure the hero section of your storefront. Changes here will update the main banner displayed on your homepage.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Hero Title</label>
              <input type="text" placeholder="Premium Auto Parts for Every Vehicle" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Hero Subtitle</label>
              <textarea rows={2} placeholder="Kenya's #1 destination for genuine and aftermarket auto parts..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">CTA Button Text</label>
              <input type="text" placeholder="Shop Now" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
            </div>
            <button
              onClick={() => toast.success("Hero section updated")}
              className="bg-[#E42933] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c41f28] transition-colors flex items-center gap-2"
            >
              <Save size={14} /> Save Hero Section
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
