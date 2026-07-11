import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AdminRole = "superadmin" | "admin" | "manager" | "staff";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions?: string[];
  avatar?: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  getToken: () => string | null;
  hasPermission: (permission: string) => boolean;
  canAccess: (section: string) => boolean;
}

// Role-based section access map
const ROLE_ACCESS: Record<AdminRole, string[]> = {
  superadmin: ["*"], // all sections
  admin: [
    "dashboard", "products", "orders", "customers", "inventory",
    "payments", "analytics", "discounts", "refunds", "settings",
    "cms", "media", "marketing", "shipping", "security",
  ],
  manager: [
    "dashboard", "products", "orders", "customers", "inventory",
    "analytics", "discounts", "refunds", "media",
  ],
  staff: ["dashboard", "products", "orders", "inventory"],
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch("/api/admin/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (r.ok) return r.json();
          localStorage.removeItem("admin_token");
          return null;
        })
        .then((data) => {
          if (data) setAdmin(data);
        })
        .catch(() => localStorage.removeItem("admin_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
      throw new Error(data.error || "Login failed");
    }
    localStorage.setItem("admin_token", data.token);
    setAdmin(data.admin);
  };

  const logout = async () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  const clearError = () => setError(null);

  const getToken = () => localStorage.getItem("admin_token");

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.role === "superadmin") return true;
    if (admin.permissions?.includes(permission)) return true;
    return false;
  };

  const canAccess = (section: string): boolean => {
    if (!admin) return false;
    const access = ROLE_ACCESS[admin.role] || [];
    return access.includes("*") || access.includes(section);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        error,
        clearError,
        getToken,
        hasPermission,
        canAccess,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
