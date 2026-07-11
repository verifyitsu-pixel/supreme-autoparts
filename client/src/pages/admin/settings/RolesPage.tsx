import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch } from "../lib/api";
import {
  Shield, Plus, Edit, Trash2, User, X, Save, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ALL_PERMISSIONS = [
  { key: "view_dashboard", label: "View Dashboard", group: "Dashboard" },
  { key: "view_analytics", label: "View Analytics", group: "Dashboard" },
  { key: "manage_products", label: "Manage Products", group: "Products" },
  { key: "delete_products", label: "Delete Products", group: "Products" },
  { key: "manage_categories", label: "Manage Categories", group: "Products" },
  { key: "manage_orders", label: "Manage Orders", group: "Orders" },
  { key: "process_refunds", label: "Process Refunds", group: "Orders" },
  { key: "manage_customers", label: "Manage Customers", group: "Customers" },
  { key: "manage_inventory", label: "Manage Inventory", group: "Inventory" },
  { key: "view_payments", label: "View Payments", group: "Payments" },
  { key: "manage_discounts", label: "Manage Discounts", group: "Marketing" },
  { key: "manage_marketing", label: "Manage Marketing", group: "Marketing" },
  { key: "manage_cms", label: "Manage CMS", group: "Website" },
  { key: "manage_media", label: "Manage Media", group: "Website" },
  { key: "manage_settings", label: "Manage Settings", group: "Settings" },
  { key: "manage_roles", label: "Manage Roles", group: "Settings" },
  { key: "view_audit_logs", label: "View Audit Logs", group: "Security" },
  { key: "manage_admins", label: "Manage Admin Users", group: "Security" },
];

const PERMISSION_GROUPS = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.group)));

export default function RolesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: "", description: "", permissions: [] as string[] });
  const [adminForm, setAdminForm] = useState({ email: "", name: "", role: "staff", password: "" });

  const { data: roles, loading: rolesLoading, refetch: refetchRoles } = useAdminFetch<any[]>("/api/admin/roles");
  const { data: admins, loading: adminsLoading, refetch: refetchAdmins } = useAdminFetch<any[]>("/api/admin/users");

  const allRoles = roles || [];
  const allAdmins = admins || [];

  const togglePermission = (perm: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleCreateRole = async () => {
    if (!roleForm.name) {
      toast.error("Role name is required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/roles", {
        method: "POST",
        body: JSON.stringify(roleForm),
      });
      toast.success("Role created");
      setShowCreate(false);
      setRoleForm({ name: "", description: "", permissions: [] });
      refetchRoles();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminForm.email || !adminForm.password) {
      toast.error("Email and password are required");
      return;
    }
    setSaving(true);
    try {
      await adminFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(adminForm),
      });
      toast.success("Admin user created");
      setShowAddAdmin(false);
      setAdminForm({ email: "", name: "", role: "staff", password: "" });
      refetchAdmins();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Remove this admin user?")) return;
    try {
      await adminFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      toast.success("Admin removed");
      refetchAdmins();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminLayout
      title="Roles & Permissions"
      subtitle="Manage admin access levels"
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddAdmin(true)}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
          >
            <User size={13} /> Add Admin
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
          >
            <Plus size={13} /> New Role
          </button>
        </div>
      }
    >
      {/* Create Role Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">Create New Role</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Role Name *</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    placeholder="e.g. Store Manager"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                  <input
                    type="text"
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Brief description"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Permissions</label>
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group} className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{group}</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_PERMISSIONS.filter((p) => p.group === group).map((perm) => (
                        <button
                          key={perm.key}
                          type="button"
                          onClick={() => togglePermission(perm.key)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                            roleForm.permissions.includes(perm.key)
                              ? "bg-[#E42933] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {roleForm.permissions.includes(perm.key) && <Check size={11} />}
                          {perm.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateRole} disabled={saving} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] disabled:opacity-70">
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-gray-900 uppercase">Add Admin User</h3>
              <button onClick={() => setShowAddAdmin(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} placeholder="John Doe" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email *</label>
                <input type="email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} placeholder="admin@example.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Password *</label>
                <input type="password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} placeholder="••••••••" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Role</label>
                <select value={adminForm.role} onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  {allRoles.map((r: any) => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddAdmin(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateAdmin} disabled={saving} className="flex-1 bg-[#E42933] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#c41f28] disabled:opacity-70">
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Users */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Admin Users</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {adminsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-32 mb-1" />
                    <div className="h-2 bg-gray-100 rounded w-48" />
                  </div>
                </div>
              ))
            : allAdmins.map((admin) => (
                <div key={admin.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#E42933]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-[#E42933]">
                      {(admin.name || admin.email)?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{admin.name || "—"}</p>
                    <p className="text-xs text-gray-400">{admin.email}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                    admin.role === "superadmin" ? "bg-purple-50 text-purple-700" :
                    admin.role === "admin" ? "bg-blue-50 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    {admin.role}
                  </span>
                  {admin.role !== "superadmin" && (
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
        </div>
      </div>

      {/* Roles */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Custom Roles</h3>
        </div>
        {rolesLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : allRoles.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {allRoles.map((role) => (
              <div key={role.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{role.name}</p>
                  <p className="text-xs text-gray-400">{role.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(role.permissions || []).slice(0, 4).map((p: string) => (
                      <span key={p} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{p}</span>
                    ))}
                    {(role.permissions || []).length > 4 && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">+{role.permissions.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No custom roles yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
