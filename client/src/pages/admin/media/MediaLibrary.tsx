import { useState, useRef } from "react";
import AdminLayout from "../AdminLayout";
import { adminUpload, adminFetch } from "../lib/api";
import { useAdminFetch } from "../lib/useAdminFetch";
import {
  Upload, Image, Trash2, Copy, Search, Grid, List,
  X, Download, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MediaLibrary() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: media, loading, refetch } = useAdminFetch<any[]>("/api/admin/media");
  const allMedia = (media || []).filter(
    (m) => !search || m.filename?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const result = await adminUpload("/api/admin/media/upload", formData);
      toast.success(`${result.files?.length || files.length} file(s) uploaded`);
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await adminFetch(`/api/admin/media/${id}`, { method: "DELETE" });
      toast.success("File deleted");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} files?`)) return;
    try {
      await adminFetch("/api/admin/media/bulk-delete", {
        method: "DELETE",
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      toast.success(`${selected.size} files deleted`);
      setSelected(new Set());
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <AdminLayout
      title="Media Library"
      subtitle={`${allMedia.length} files`}
      actions={
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-wide"
            >
              <Trash2 size={13} /> Delete ({selected.size})
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
          >
            <Upload size={13} /> Upload Files
          </button>
        </div>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-6",
          dragOver ? "border-[#E42933] bg-[#E42933]/5" : "border-gray-200 hover:border-[#E42933]/50 hover:bg-gray-50"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Uploading files...</p>
          </div>
        ) : (
          <>
            <Upload size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF up to 10MB each</p>
          </>
        )}
      </div>

      {/* Search & View Toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E42933]"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("grid")}
            className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            <List size={15} />
          </button>
        </div>
        <button onClick={refetch} className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
              ))
            : allMedia.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer",
                    selected.has(file.id) && "ring-2 ring-[#E42933]"
                  )}
                  onClick={() => toggleSelect(file.id)}
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/placeholder.jpg"; }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}
                      className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      title="Copy URL"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                      className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {selected.has(file.id) && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#E42933] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                  )}
                </div>
              ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Size</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Uploaded</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                          <div className="h-3 bg-gray-200 rounded w-32" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                : allMedia.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img
                              src={file.url}
                              alt={file.filename}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/placeholder.jpg"; }}
                            />
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.filename}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">
                          {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyUrl(file.url)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Copy URL"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
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
          {!loading && allMedia.length === 0 && (
            <div className="text-center py-12">
              <Image size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No media files yet</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
