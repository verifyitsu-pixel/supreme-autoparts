import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  loginMethod: "email" | "google" | "apple" | "facebook" | "microsoft";
  createdAt: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  preferences?: {
    darkMode?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  };
  rewardPoints?: number;
  storeCredit?: number;
  twoFactorEnabled?: boolean;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  shippingAddress?: any;
  trackingNumber?: string;
  notes?: string;
  deliveredAt?: string;
  paidAt?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  addedAt: string;
  available: boolean;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "customer" | "admin";
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: "open" | "closed" | "pending_customer";
  priority: "low" | "medium" | "high" | "urgent";
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithApple: () => void;
  loginWithFacebook: () => void;
  loginWithMicrosoft: () => void;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  enableTwoFactor: () => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>;
  verifyTwoFactor: (code: string) => Promise<void>;
  disableTwoFactor: (code: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  error: string | null;
  clearError: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("authToken");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setUser(await res.json());
        } else {
          localStorage.removeItem("authToken");
        }
      } catch {
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("auth_token");
    if (token) {
      localStorage.setItem("authToken", token);
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_token");
      window.history.replaceState({}, "", url.toString());
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(setUser)
        .catch(() => {});
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("authToken", data.token);
      setUser(data.user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg); throw new Error(msg);
    } finally { setIsLoading(false); }
  };

  const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resp = await res.json();
      if (!res.ok) throw new Error(resp.error || "Registration failed");
      localStorage.setItem("authToken", resp.token);
      setUser(resp.user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg); throw new Error(msg);
    } finally { setIsLoading(false); }
  };

  const loginWithGoogle = () => { window.location.href = "/api/auth/google"; };
  const loginWithApple = () => { window.location.href = "/api/auth/apple"; };
  const loginWithFacebook = () => { window.location.href = "/api/auth/facebook"; };
  const loginWithMicrosoft = () => { window.location.href = "/api/auth/microsoft"; };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST", headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch {}
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const res = await fetch("/api/auth/profile", {
      method: "PUT", headers: authHeaders(), body: JSON.stringify(data),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.error || "Update failed");
    setUser(updated);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetch("/api/auth/password", {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Password change failed");
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send reset email");
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Reset failed");
  };

  const verifyEmail = async (token: string) => {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Verification failed");
  };

  const resendVerification = async () => {
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST", headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to resend verification");
  };

  const enableTwoFactor = async () => {
    const res = await fetch("/api/auth/2fa/setup", {
      method: "POST", headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "2FA setup failed");
    return data;
  };

  const verifyTwoFactor = async (code: string) => {
    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "2FA verification failed");
  };

  const disableTwoFactor = async (code: string) => {
    const res = await fetch("/api/auth/2fa/disable", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "2FA disable failed");
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/auth/avatar", {
      method: "POST", headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Avatar upload failed");
    if (user) setUser({ ...user, avatar: data.avatarUrl });
    return data.avatarUrl;
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      login, register, loginWithGoogle, loginWithApple, loginWithFacebook, loginWithMicrosoft, logout,
      updateProfile, changePassword, forgotPassword, resetPassword,
      verifyEmail, resendVerification,
      enableTwoFactor, verifyTwoFactor, disableTwoFactor, uploadAvatar,
      error, clearError: () => setError(null), getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
