import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Package, ShoppingBag, Users, RefreshCw, Settings,
  LogOut, Bell, Search, ChevronDown, TrendingUp, DollarSign, ShoppingCart,
  AlertTriangle, Plus, Edit, Trash2, Eye, Check, X, Filter, Download,
  Upload, Image, Tag, BarChart3, ArrowUpRight, ArrowDownRight, Menu,
  ChevronRight, Star, Truck, Clock, CheckCircle, XCircle, RotateCcw,
  Save, Camera, Globe, Phone, Mail, MapPin, Zap, Shield, Award,
  Percent, Activity, List, Grid, Layers, Box, Target, Calendar,
  CreditCard, Banknote, Info, Printer, Archive, RefreshCcw, Hash
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

const COLORS = ["#E42933", "#1a1a1a", "#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

function useAdminFetch(url: string, deps: any[] = []) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAdmin();

  const refetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error("Failed to fetch");
      const d = await res.json();
      setData(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, deps);
  return { data, loading, error, refetch };
}

async function adminFetch(url: string, options: RequestInit = {}, getToken: () => string | null) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─── Admin Login Page ─────────────────────────────────────────────────────────
function AdminLogin() {
  const [email, setEmail] = useState("admin@supremeautoparts.co.ke");
  const [password, setPassword] = useState("Admin@2024");
  const [loading, setLoading] = useState(false);
  const { login, error } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#E42933]/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/images/logo-horizontal.png" alt="Supreme Autoparts" className="h-12 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-2xl font-black text-white mb-1">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Sign in to manage your store</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <X size={16} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] focus:ring-2 focus:ring-[#E42933]/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] focus:ring-2 focus:ring-[#E42933]/20 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#E42933] hover:bg-[#c41f28] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 text-sm">
              {loading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-1">Default Credentials:</p>
            <p className="text-xs text-gray-600">Email: admin@supremeautoparts.co.ke</p>
            <p className="text-xs text-gray-600">Password: Admin@2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Dashboard ───────────────────────────────────────────────────────
function OverviewSection() {
  const { data: stats, loading, refetch } = useAdminFetch("/api/admin/stats");

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#E42933] border-t-transparent rounded-full"></div></div>;

  const statCards = [
    { title: "Total Revenue", value: `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "bg-green-500", change: "+12.5%", up: true },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-blue-500", change: "+8.2%", up: true },
    { title: "Customers", value: stats?.totalCustomers || 0, icon: Users, color: "bg-purple-500", change: "+5.1%", up: true },
    { title: "Active Products", value: stats?.totalProducts || 0, icon: Package, color: "bg-orange-500", change: "+3.4%", up: true },
  ];

  const alertCards = [
    { title: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "text-orange-500 bg-orange-50", urgent: stats?.pendingOrders > 0 },
    { title: "Low Stock Items", value: stats?.lowStockProducts || 0, icon: AlertTriangle, color: "text-red-500 bg-red-50", urgent: stats?.lowStockProducts > 0 },
    { title: "Pending Refunds", value: stats?.pendingRefunds || 0, icon: RotateCcw, color: "text-blue-500 bg-blue-50", urgent: stats?.pendingRefunds > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening in your store.</p>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-1 ${card.up ? "text-green-600" : "text-red-500"}`}>
                {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {alertCards.map((card, i) => (
          <div key={i} className={`rounded-xl p-4 border ${card.urgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"} flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-[#E42933]" /> Monthly Revenue (KES)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#E42933" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#E42933]" /> Order Status Breakdown
          </h3>
          {stats?.orderStatusBreakdown && (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={Object.entries(stats.orderStatusBreakdown).map(([k, v]) => ({ name: k, value: v }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {Object.keys(stats.orderStatusBreakdown).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {Object.entries(stats.orderStatusBreakdown).map(([status, count]: any, i) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-xs text-gray-600 capitalize">{status}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#E42933]" /> Top Selling Products
          </h3>
          <div className="space-y-3">
            {(stats?.topProducts || []).map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sales} sold</p>
                </div>
                <p className="text-sm font-bold text-[#E42933]">KES {p.revenue.toLocaleString()}</p>
              </div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#E42933]" /> Recent Orders
          </h3>
          <div className="space-y-3">
            {(stats?.recentOrders || []).slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E42933]/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={14} className="text-[#E42933]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{order.customerName || "Guest"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">KES {order.total.toLocaleString()}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────
function ProductsSection() {
  const { getToken } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await adminFetch(`/api/admin/products?${params}`, {}, getToken);
      setProducts(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search, statusFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" }, getToken);
      showToast("Product deleted");
      fetchProducts();
    } catch (e: any) { showToast(e.message); }
  };

  const handleBulkStatus = async (status: string) => {
    if (!selectedIds.length) return;
    try {
      await adminFetch("/api/admin/products/bulk/status", { method: "PUT", body: JSON.stringify({ ids: selectedIds, status }) }, getToken);
      showToast(`${selectedIds.length} products updated`);
      setSelectedIds([]);
      fetchProducts();
    } catch (e: any) { showToast(e.message); }
  };

  const paged = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-[999] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2">
          <Check size={16} className="text-green-400" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products & Inventory</h1>
          <p className="text-gray-500 text-sm">{products.length} products total</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E42933]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{selectedIds.length} selected</span>
            <button onClick={() => handleBulkStatus("active")} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200">Activate</button>
            <button onClick={() => handleBulkStatus("archived")} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200">Archive</button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? products.map(p => p.id) : [])}
                    checked={selectedIds.length === products.length && products.length > 0}
                    className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-lg"></div><div className="space-y-1"><div className="h-3 bg-gray-200 rounded w-32"></div><div className="h-2 bg-gray-200 rounded w-20"></div></div></div></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-3 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-4 py-4"><div className="h-3 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-3 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No products found</td></tr>
              ) : paged.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(product.id)}
                      onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, product.id] : selectedIds.filter(id => id !== product.id))}
                      className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={product.images?.[0] || "/assets/images/products/toyota-brake-pads.jpg"} alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/products/toyota-brake-pads.jpg"; }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.brand} • {product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">KES {product.price.toLocaleString()}</p>
                      {product.comparePrice && <p className="text-xs text-gray-400 line-through">KES {product.comparePrice.toLocaleString()}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${product.stock === 0 ? "text-red-600" : product.stock <= product.lowStockThreshold ? "text-orange-500" : "text-green-600"}`}>
                      {product.stock}
                    </span>
                    {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                      <span className="ml-1 text-[10px] text-orange-500 font-medium">Low</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditProduct(product); setShowForm(true); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, products.length)} of {products.length}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Prev</button>
              <span className="text-sm text-gray-600">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSave={() => { fetchProducts(); setShowForm(false); setEditProduct(null); showToast(editProduct ? "Product updated!" : "Product created!"); }}
          getToken={getToken}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, onClose, onSave, getToken }: any) {
  const [form, setForm] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    brand: product?.brand || "",
    model: product?.model || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || "",
    cost: product?.cost || "",
    stock: product?.stock || 0,
    lowStockThreshold: product?.lowStockThreshold || 5,
    description: product?.description || "",
    condition: product?.condition || "New",
    status: product?.status || "active",
    partNumber: product?.partNumber || "",
    images: product?.images || [],
    tags: product?.tags?.join(", ") || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const CATEGORIES = ["Braking Systems", "Engine Components", "Transmission & Gear", "Steering Systems", "Suspension & Chassis", "Electrical & Sensors", "Alloys & Rims", "Lubricants & Fluids", "Body Kits & Styling", "Glass & Windscreens", "Certified Used Parts"];
  const BRANDS = ["Toyota", "BMW", "Mercedes-Benz", "Honda", "Ford", "Hyundai", "Suzuki", "Lexus"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined, cost: form.cost ? Number(form.cost) : undefined, stock: Number(form.stock), lowStockThreshold: Number(form.lowStockThreshold), tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) };
      if (product) {
        await adminFetch(`/api/admin/products/${product.id}`, { method: "PUT", body: JSON.stringify(payload) }, getToken);
      } else {
        await adminFetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) }, getToken);
      }
      onSave();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-black text-gray-900">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="e.g. Toyota Hilux Brake Pads - Premium OEM" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="Auto-generated if empty" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Part Number</label>
              <input value={form.partNumber} onChange={(e) => setForm({ ...form, partNumber: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="OEM part number" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand</label>
              <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                <option value="">Select brand</option>
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Model</label>
              <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="e.g. Hilux Vigo/Revo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                <option>New</option><option>Refurbished</option><option>Used</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Tag size={14} /> Pricing</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (KES) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Compare Price</label>
                <input type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cost Price</label>
                <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Package size={14} /> Inventory</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock Quantity</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Low Stock Alert</label>
                <input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none" placeholder="Product description..." />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URLs (one per line)</label>
            <textarea
              value={form.images.join("\n")}
              onChange={(e) => setForm({ ...form, images: e.target.value.split("\n").filter(Boolean) })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none font-mono"
              placeholder="/assets/images/products/product-name.jpg"
            />
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="toyota, brake pads, oem" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#E42933] hover:bg-[#c41f28] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {saving ? "Saving..." : <><Save size={16} /> {product ? "Update Product" : "Create Product"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Orders Section ───────────────────────────────────────────────────────────
function OrdersSection() {
  const { getToken } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await adminFetch(`/api/admin/orders?${params}`, {}, getToken);
      setOrders(data.orders);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [search, statusFilter, page]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const updateOrder = async (id: string, updates: any) => {
    try {
      const updated = await adminFetch(`/api/admin/orders/${id}`, { method: "PUT", body: JSON.stringify(updates) }, getToken);
      showToast("Order updated!");
      fetchOrders();
      if (selectedOrder?.id === id) setSelectedOrder(updated);
    } catch (e: any) { showToast(e.message); }
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 z-[999] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"><Check size={16} className="text-green-400" /> {toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{total} orders total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders, customers..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E42933]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Payment</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.items?.length || 0} items</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-sm font-medium text-gray-900">{order.customerName || "Guest"}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-900">KES {order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><PaymentStatusBadge status={order.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={updateOrder} />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdate }: any) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [notes, setNotes] = useState(order.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(order.id, { status, paymentStatus, trackingNumber, notes });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black text-gray-900">{order.orderNumber}</h2>
            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Customer</h3>
              <p className="font-semibold text-gray-900">{order.customerName || "Guest"}</p>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h3>
              <p className="text-sm text-gray-700">{order.shippingAddress?.fullName}</p>
              <p className="text-sm text-gray-500">{order.shippingAddress?.address}</p>
              <p className="text-sm text-gray-500">{order.shippingAddress?.county}, {order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={item.image || "/assets/images/products/toyota-brake-pads.jpg"} alt={item.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/products/toyota-brake-pads.jpg"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">KES {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-gray-200 pt-3 space-y-1">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>KES {order.subtotal?.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>KES {order.shipping?.toLocaleString() || "0"}</span></div>
              <div className="flex justify-between text-base font-black text-gray-900"><span>Total</span><span>KES {order.total?.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Update Order */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">Update Order</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Order Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Status</label>
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tracking Number</label>
              <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933]" placeholder="Enter tracking number" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Admin Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933] resize-none" placeholder="Internal notes..." />
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full bg-[#E42933] hover:bg-[#c41f28] text-white py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {saving ? "Saving..." : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Customers Section ────────────────────────────────────────────────────────
function CustomersSection() {
  const { getToken } = useAdmin();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const data = await adminFetch(`/api/admin/customers?${params}`, {}, getToken);
      setCustomers(data.customers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, [search, page]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const toggleCustomerStatus = async (customer: any) => {
    const newStatus = customer.status === "active" ? "blocked" : "active";
    try {
      await adminFetch(`/api/admin/customers/${customer.id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) }, getToken);
      showToast(`Customer ${newStatus === "active" ? "activated" : "blocked"}`);
      fetchCustomers();
    } catch (e: any) { showToast(e.message); }
  };

  const viewCustomer = async (id: string) => {
    try {
      const data = await adminFetch(`/api/admin/customers/${id}`, {}, getToken);
      setSelectedCustomer(data);
    } catch {}
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 z-[999] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"><Check size={16} className="text-green-400" /> {toast}</div>}

      <div>
        <h1 className="text-2xl font-black text-gray-900">Customers</h1>
        <p className="text-gray-500 text-sm">{total} registered customers</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E42933]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No customers found</td></tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E42933]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E42933] font-bold text-sm">{customer.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-sm text-gray-600">{customer.phone || "-"}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm font-semibold text-gray-900">{customer.totalOrders}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-sm font-bold text-[#E42933]">KES {(customer.totalSpent || 0).toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${customer.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {customer.status === "active" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => viewCustomer(customer.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => toggleCustomerStatus(customer)}
                        className={`p-1.5 rounded-lg transition-colors ${customer.status === "active" ? "text-gray-400 hover:text-red-600 hover:bg-red-50" : "text-gray-400 hover:text-green-600 hover:bg-green-50"}`}>
                        {customer.status === "active" ? <XCircle size={15} /> : <CheckCircle size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E42933]/10 flex items-center justify-center">
                  <span className="text-[#E42933] font-black text-xl">{selectedCustomer.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-gray-900">{selectedCustomer.totalOrders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-sm font-black text-[#E42933]">KES {(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-sm font-black text-gray-900">{selectedCustomer.addresses?.length || 0}</p>
                  <p className="text-xs text-gray-500">Addresses</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Recent Orders</h3>
                <div className="space-y-2">
                  {(selectedCustomer.orders || []).slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">KES {order.total.toLocaleString()}</p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                  {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Refunds Section ──────────────────────────────────────────────────────────
function RefundsSection() {
  const { getToken } = useAdmin();
  const [statusFilter, setStatusFilter] = useState("");
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const data = await adminFetch(`/api/admin/refunds?${params}`, {}, getToken);
      setRefunds(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchRefunds(); }, [statusFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const updateRefund = async (id: string, updates: any) => {
    try {
      await adminFetch(`/api/admin/refunds/${id}`, { method: "PUT", body: JSON.stringify(updates) }, getToken);
      showToast("Refund updated!");
      fetchRefunds();
      setSelectedRefund(null);
    } catch (e: any) { showToast(e.message); }
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 z-[999] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"><Check size={16} className="text-green-400" /> {toast}</div>}

      <div>
        <h1 className="text-2xl font-black text-gray-900">Refund Requests</h1>
        <p className="text-gray-500 text-sm">{refunds.length} refund requests</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
                    ))}
                  </tr>
                ))
              ) : refunds.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No refund requests</td></tr>
              ) : refunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-900">{refund.orderNumber}</p>
                    <p className="text-xs text-gray-400">{new Date(refund.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-sm text-gray-700">{refund.customerName || "Customer"}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-600 max-w-[150px] truncate">{refund.reason}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-900">KES {refund.refundAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3"><RefundStatusBadge status={refund.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedRefund(refund)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                      <Eye size={13} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Review Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSelectedRefund(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Refund Request</h2>
              <button onClick={() => setSelectedRefund(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Order</p>
                  <p className="font-bold text-gray-900">{selectedRefund.orderNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="font-bold text-[#E42933]">KES {selectedRefund.refundAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-sm font-medium text-gray-900">{selectedRefund.reason}</p>
                {selectedRefund.description && <p className="text-sm text-gray-600 mt-1">{selectedRefund.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Note</label>
                <textarea id="adminNote" defaultValue={selectedRefund.adminNote || ""} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none" placeholder="Add a note to the customer..." />
              </div>
              <div className="flex gap-2">
                {selectedRefund.status === "pending" && (
                  <>
                    <button onClick={() => updateRefund(selectedRefund.id, { status: "approved", adminNote: (document.getElementById("adminNote") as HTMLTextAreaElement)?.value })}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                      <Check size={15} /> Approve
                    </button>
                    <button onClick={() => updateRefund(selectedRefund.id, { status: "rejected", adminNote: (document.getElementById("adminNote") as HTMLTextAreaElement)?.value })}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                      <X size={15} /> Reject
                    </button>
                  </>
                )}
                {selectedRefund.status === "approved" && (
                  <button onClick={() => updateRefund(selectedRefund.id, { status: "completed", adminNote: (document.getElementById("adminNote") as HTMLTextAreaElement)?.value })}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={15} /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Section ─────────────────────────────────────────────────────────
function SettingsSection() {
  const { getToken } = useAdmin();
  const { data: currentSettings, loading } = useAdminFetch("/api/admin/settings");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => { if (currentSettings) setForm(currentSettings); }, [currentSettings]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) }, getToken);
      showToast("Settings saved! Changes will reflect on the website.");
    } catch (e: any) { showToast(e.message); }
    setSaving(false);
  };

  if (loading || !form) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#E42933] border-t-transparent rounded-full"></div></div>;

  const tabs = [
    { id: "general", label: "General" },
    { id: "homepage", label: "Homepage" },
    { id: "shipping", label: "Shipping & Tax" },
    { id: "social", label: "Social & SEO" },
  ];

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 z-[999] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"><Check size={16} className="text-green-400" /> {toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Store Settings</h1>
          <p className="text-gray-500 text-sm">Changes here reflect on the website in real-time</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-70">
          {saving ? "Saving..." : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {activeTab === "general" && (
          <>
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Store Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name</label>
                <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Email</label>
                <input type="email" value={form.storeEmail} onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input value={form.storePhone} onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="+254714498451" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Address</label>
                <input value={form.storeAddress} onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Store Controls</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Show a maintenance page to visitors</p>
                </div>
                <button onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.maintenanceMode ? "bg-[#E42933]" : "bg-gray-300"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.maintenanceMode ? "left-7" : "left-1"}`}></span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "homepage" && (
          <>
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Homepage Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Title</label>
                <input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Subtitle</label>
                <textarea value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Background Image URL</label>
                <input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Announcement Bar Text</label>
                <input value={form.announcementBar} onChange={(e) => setForm({ ...form, announcementBar: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Show Announcement Bar</p>
                  <p className="text-xs text-gray-500">Display the announcement bar at the top of the website</p>
                </div>
                <button onClick={() => setForm({ ...form, announcementBarEnabled: !form.announcementBarEnabled })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.announcementBarEnabled ? "bg-[#E42933]" : "bg-gray-300"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.announcementBarEnabled ? "left-7" : "left-1"}`}></span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "shipping" && (
          <>
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Shipping & Tax</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tax Rate (%)</label>
                <input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Fee (KES)</label>
                <input type="number" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Free Shipping Threshold (KES)</label>
                <input type="number" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
            </div>
          </>
        )}

        {activeTab === "social" && (
          <>
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">SEO & Social Media</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Title</label>
                <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
                <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Facebook URL</label>
                  <input value={form.socialLinks?.facebook || ""} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instagram URL</label>
                  <input value={form.socialLinks?.instagram || ""} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E42933]" placeholder="https://instagram.com/..." />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Analytics Section ──────────────────────────────────────────────────────────
function AnalyticsSection() {
  const { data: stats } = useAdminFetch("/api/admin/stats");
  const [period, setPeriod] = useState("30d");

  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.floor(Math.random() * 120000) + 20000,
    orders: Math.floor(Math.random() * 20) + 3,
  }));

  const brandData = [
    { brand: "Toyota", revenue: 485000, orders: 42 },
    { brand: "BMW", revenue: 320000, orders: 18 },
    { brand: "Mercedes", revenue: 290000, orders: 15 },
    { brand: "Ford", revenue: 210000, orders: 28 },
    { brand: "Honda", revenue: 185000, orders: 31 },
    { brand: "Hyundai", revenue: 145000, orders: 22 },
  ];

  const categoryData = [
    { name: "Braking", value: 32 },
    { name: "Engine", value: 25 },
    { name: "Suspension", value: 18 },
    { name: "Electrical", value: 14 },
    { name: "Transmission", value: 11 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">Store performance insights</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {["7d", "30d", "90d", "1y"].map(r => (
            <button key={r} onClick={() => setPeriod(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue", value: `KES ${((stats?.totalRevenue || 0) / 1000).toFixed(0)}k`, icon: DollarSign, color: "bg-[#E42933]", trend: 12.5 },
          { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-blue-500", trend: 8.2 },
          { title: "Conversion Rate", value: "3.2%", icon: Target, color: "bg-purple-500", trend: -1.5 },
          { title: "Avg Order Value", value: `KES ${(stats?.avgOrderValue || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-green-500", trend: 5.8 },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon size={18} className="text-white" />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${card.trend >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {card.trend >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {Math.abs(card.trend)}%
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-black text-gray-900 mb-5">Revenue Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E42933" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#E42933" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => v.split(" ")[1] || v} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any, name: string) => [name === "revenue" ? `KES ${Number(v).toLocaleString()}` : v, name === "revenue" ? "Revenue" : "Orders"]} />
            <Area type="monotone" dataKey="revenue" stroke="#E42933" strokeWidth={2.5} fill="url(#areaGrad)" name="revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Brand + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-5">Revenue by Brand</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={brandData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="brand" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
              <Tooltip formatter={(v: any) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#E42933" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-5">Sales by Category</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory Section ────────────────────────────────────────────────────────
function InventorySection() {
  const { data: products, loading, refetch } = useAdminFetch("/api/admin/products");
  const { getToken } = useAdmin();
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState("all");

  const allProducts: any[] = products || [];
  const lowStock = allProducts.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStock = allProducts.filter(p => p.stock === 0);

  const filtered = allProducts.filter(p => {
    if (filterStock === "low" && (p.stock === 0 || p.stock > p.lowStockThreshold)) return false;
    if (filterStock === "out" && p.stock > 0) return false;
    if (search) return p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const updateStock = async (id: string, newStock: number) => {
    await adminFetch(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify({ stock: newStock }) }, getToken);
    refetch();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Inventory</h1>
        <p className="text-gray-500 text-sm">Track and manage stock levels across all products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-2xl font-black text-gray-900">{allProducts.length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total SKUs</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-2xl font-black text-green-600">{allProducts.filter(p => p.stock > p.lowStockThreshold).length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">In Stock</p>
        </div>
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <p className="text-2xl font-black text-amber-700">{lowStock.length}</p>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Low Stock</p>
        </div>
        <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
          <p className="text-2xl font-black text-red-700">{outOfStock.length}</p>
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider mt-1">Out of Stock</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, SKU..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E42933] transition-colors" />
        </div>
        <select value={filterStock} onChange={e => setFilterStock(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white">
          <option value="all">All Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">SKU</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Brand</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Stock</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Alert At</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center"><div className="w-8 h-8 border-4 border-gray-100 border-t-[#E42933] rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filtered.slice(0, 60).map((p: any) => (
                <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${p.stock === 0 ? "bg-red-50/30" : p.stock <= p.lowStockThreshold ? "bg-amber-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/models/hyundai-tucson.jpg"; }} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 max-w-48 truncate">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs font-mono text-gray-500">{p.sku}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-700">{p.brand}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-700">{p.category}</span></td>
                  <td className="px-4 py-3"><span className="text-sm font-black text-gray-900">{p.stock}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-500">{p.lowStockThreshold}</span></td>
                  <td className="px-4 py-3">
                    {p.stock === 0 ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Out of Stock</span>
                    ) : p.stock <= p.lowStockThreshold ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Low Stock</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">In Stock</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateStock(p.id, p.stock + 10)}
                        className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors border border-green-200">+10</button>
                      <button onClick={() => updateStock(p.id, p.stock + 50)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">+50</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Discounts Section ────────────────────────────────────────────────────────
function DiscountsSection() {
  const { getToken } = useAdmin();
  const { data: discounts, loading, refetch } = useAdminFetch("/api/admin/discounts");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "", active: true });
  const [saving, setSaving] = useState(false);

  const allDiscounts: any[] = discounts || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await adminFetch("/api/admin/discounts", {
      method: "POST",
      body: JSON.stringify({ ...form, value: Number(form.value), minOrder: form.minOrder ? Number(form.minOrder) : 0, maxUses: form.maxUses ? Number(form.maxUses) : null }),
    }, getToken);
    setSaving(false);
    setShowModal(false);
    setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "", active: true });
    refetch();
  };

  const toggleDiscount = async (id: string, active: boolean) => {
    await adminFetch(`/api/admin/discounts/${id}`, { method: "PUT", body: JSON.stringify({ active: !active }) }, getToken);
    refetch();
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    await adminFetch(`/api/admin/discounts/${id}`, { method: "DELETE" }, getToken);
    refetch();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Discounts</h1>
          <p className="text-gray-500 text-sm">Manage promotional discount codes</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#E42933] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c41f28] transition-colors shadow-sm shadow-[#E42933]/20">
          <Plus size={16} /> Create Discount
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-2xl font-black text-gray-900">{allDiscounts.length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Codes</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-2xl font-black text-green-600">{allDiscounts.filter(d => d.active).length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-2xl font-black text-gray-900">{allDiscounts.reduce((a: number, d: any) => a + (d.usedCount || 0), 0)}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Uses</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-2xl font-black text-[#E42933]">KES {allDiscounts.reduce((a: number, d: any) => a + (d.totalSavings || 0), 0).toLocaleString()}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Savings</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-3">Code</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Value</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Min Order</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Uses</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Expires</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center"><div className="w-8 h-8 border-4 border-gray-100 border-t-[#E42933] rounded-full animate-spin mx-auto"></div></td></tr>
              ) : allDiscounts.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-mono font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-sm">{d.code}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 capitalize">{d.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#E42933]">{d.type === "percentage" ? `${d.value}%` : `KES ${d.value.toLocaleString()}`}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{d.minOrder > 0 ? `KES ${d.minOrder.toLocaleString()}` : "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{d.usedCount || 0}{d.maxUses ? ` / ${d.maxUses}` : ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "Never"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleDiscount(d.id, d.active)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${d.active ? "bg-green-500" : "bg-gray-300"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${d.active ? "left-5" : "left-0.5"}`}></span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteDiscount(d.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!loading && allDiscounts.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">No discount codes yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Create Discount Code</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Discount Code *</label>
                <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#E42933] transition-colors uppercase" placeholder="SAVE20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] bg-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (KES)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Value *</label>
                  <input required type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] transition-colors" placeholder={form.type === "percentage" ? "20" : "500"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Min Order (KES)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] transition-colors" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] transition-colors" placeholder="Unlimited" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Expiry Date</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E42933] transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#E42933] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#c41f28] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {saving ? "Creating..." : <><Plus size={16} /> Create Code</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper Badge Components ──────────────────────────────────────────────────
function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    unpaid: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-blue-100 text-blue-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

function ProductStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

function RefundStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-green-100 text-green-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

// ─── Payments Section ───────────────────────────────────────────────────────
function PaymentsSection() {
  const { getToken } = useAdmin();
  const [activeTab, setActiveTab] = useState<"config" | "transactions" | "logs">("config");
  const [paySettings, setPaySettings] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registeringIPN, setRegisteringIPN] = useState(false);
  const [ipnResult, setIpnResult] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [psRes, txRes, logRes] = await Promise.all([
        fetch("/api/admin/payment-settings", { headers }),
        fetch("/api/admin/transactions", { headers }),
        fetch("/api/admin/payment-logs?limit=200", { headers }),
      ]);
      if (psRes.ok) setPaySettings(await psRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
      if (logRes.ok) setLogs(await logRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggle = async (provider: "pesapal" | "paypal" | "stripe", enabled: boolean) => {
    if (!paySettings) return;
    setSaving(true);
    try {
      const token = getToken();
      const updated = { ...paySettings.providers, [provider]: { ...paySettings.providers[provider], enabled } };
      const res = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ providers: updated }),
      });
      if (res.ok) {
        const data = await res.json();
        setPaySettings((prev: any) => ({ ...prev, providers: data.providers }));
        setSaveMsg(`${provider} ${enabled ? "enabled" : "disabled"} successfully`);
        setTimeout(() => setSaveMsg(null), 3000);
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleRegisterIPN = async () => {
    setRegisteringIPN(true);
    setIpnResult(null);
    try {
      const token = getToken();
      const res = await fetch("/api/admin/pesapal/register-ipn", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setIpnResult(`✅ IPN Registered! ipn_id: ${data.ipnId}\nSet PESAPAL_IPN_ID=${data.ipnId} in Railway environment variables.`);
      else setIpnResult(`❌ Error: ${data.error}`);
    } catch (e: any) { setIpnResult(`❌ Error: ${e.message}`); }
    finally { setRegisteringIPN(false); }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
  };

  const logBadge = (level: string) => {
    const styles: Record<string, string> = {
      info: "bg-blue-100 text-blue-700",
      warn: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[level] || "bg-gray-100 text-gray-700"}`}>{level}</span>;
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E42933] border-t-transparent rounded-full" /></div>;

  const providers = [
    {
      id: "pesapal" as const,
      name: "Pesapal",
      description: "M-Pesa, Airtel Money, Visa, Mastercard — Kenya & East Africa",
      icon: "🇰🇪",
      creds: paySettings?.credentials?.pesapal,
      credFields: [
        { key: "hasKey", label: "Consumer Key" },
        { key: "hasSecret", label: "Consumer Secret" },
        { key: "hasIpnId", label: "IPN ID" },
      ],
    },
    {
      id: "paypal" as const,
      name: "PayPal",
      description: "PayPal balance, credit/debit cards — International",
      icon: "🅿",
      creds: paySettings?.credentials?.paypal,
      credFields: [
        { key: "hasClientId", label: "Client ID" },
        { key: "hasSecret", label: "Client Secret" },
        { key: "hasWebhookId", label: "Webhook ID" },
      ],
    },
    {
      id: "stripe" as const,
      name: "Stripe",
      description: "Visa, Mastercard, Amex — Global card payments",
      icon: "💳",
      creds: paySettings?.credentials?.stripe,
      credFields: [
        { key: "hasSecretKey", label: "Secret Key" },
        { key: "hasWebhookSecret", label: "Webhook Secret" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Payment Management</h2>
          <p className="text-sm text-gray-500 mt-1">Configure payment providers, view transactions and logs</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(["config", "transactions", "logs"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab === "config" ? "Configuration" : tab === "transactions" ? `Transactions (${transactions.length})` : `Logs (${logs.length})`}
          </button>
        ))}
      </div>

      {/* ── Configuration Tab ── */}
      {activeTab === "config" && (
        <div className="space-y-4">
          {saveMsg && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-sm text-green-700 font-medium">{saveMsg}</p>
            </div>
          )}

          {providers.map(provider => (
            <div key={provider.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                    {provider.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    paySettings?.providers?.[provider.id]?.env === "live" || paySettings?.credentials?.[provider.id]?.env === "live"
                      ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {paySettings?.credentials?.[provider.id]?.env === "live" ? "🟢 Live" : "🟡 Sandbox/Test"}
                  </span>
                  <button
                    onClick={() => handleToggle(provider.id, !paySettings?.providers?.[provider.id]?.enabled)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      paySettings?.providers?.[provider.id]?.enabled ? "bg-[#E42933]" : "bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      paySettings?.providers?.[provider.id]?.enabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                  <span className="text-xs font-semibold text-gray-600">
                    {paySettings?.providers?.[provider.id]?.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              {/* Credential Status */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {provider.credFields.map(field => (
                  <div key={field.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                    provider.creds?.[field.key] ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {provider.creds?.[field.key] ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span className="font-medium">{field.label}</span>
                    <span>{provider.creds?.[field.key] ? "Set" : "Missing"}</span>
                  </div>
                ))}
              </div>

              {/* Pesapal IPN Registration */}
              {provider.id === "pesapal" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">IPN Registration</p>
                      <p className="text-xs text-gray-500">Register the IPN URL with Pesapal to receive payment notifications</p>
                    </div>
                    <button
                      onClick={handleRegisterIPN}
                      disabled={registeringIPN || !provider.creds?.hasKey || !provider.creds?.hasSecret}
                      className="flex items-center gap-2 px-4 py-2 bg-[#E42933] text-white rounded-lg text-xs font-semibold hover:bg-[#d41f28] transition-colors disabled:opacity-50"
                    >
                      {registeringIPN ? <><div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Registering...</> : "Register IPN URL"}
                    </button>
                  </div>
                  {ipnResult && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">{ipnResult}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Webhook URLs Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2"><Info size={16} className="text-blue-600" /> Webhook & Callback URLs</h3>
            <p className="text-xs text-gray-600 mb-3">Register these URLs in your payment provider dashboards:</p>
            <div className="space-y-2">
              {[
                { label: "Pesapal IPN (auto-registered)", url: "/api/payments/webhook/pesapal" },
                { label: "Pesapal Callback", url: "/api/payments/callback/pesapal" },
                { label: "PayPal Webhook", url: "/api/payments/webhook/paypal" },
                { label: "PayPal Return URL", url: "/api/payments/callback/paypal" },
                { label: "Stripe Webhook", url: "/api/payments/webhook/stripe" },
                { label: "Stripe Success URL", url: "/api/payments/callback/stripe" },
              ].map(item => (
                <div key={item.url} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                  <code className="text-xs text-[#E42933] font-mono">{window.location.origin}{item.url}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Transactions Tab ── */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900">Transaction History</h3>
            <p className="text-xs text-gray-500 mt-1">{transactions.length} total transactions</p>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-sm text-gray-400">Transactions will appear here once customers complete payments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Order", "Provider", "Amount", "Currency", "Status", "Date", "Customer"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-black text-gray-900">{tx.orderNumber}</p>
                        <p className="text-xs text-gray-400 font-mono">{tx.id.slice(0, 8)}...</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold capitalize text-gray-700">{tx.provider}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-black text-gray-900">{tx.amount?.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-gray-500">{tx.currency}</span>
                      </td>
                      <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        <p className="text-[10px] text-gray-400">{new Date(tx.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{tx.customerEmail || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Logs Tab ── */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900">Payment Event Logs</h3>
              <p className="text-xs text-gray-500 mt-1">Last {logs.length} events (newest first)</p>
            </div>
          </div>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 font-medium">No payment events logged yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Time", "Provider", "Level", "Event", "Message"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map(log => (
                    <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${
                      log.level === "error" ? "bg-red-50/30" : log.level === "warn" ? "bg-amber-50/30" : ""
                    }`}>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold capitalize text-gray-700">{log.provider}</span>
                      </td>
                      <td className="px-4 py-3">{logBadge(log.level)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-600">{log.event}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700 max-w-xs truncate" title={log.message}>{log.message}</p>
                        {log.orderId && <p className="text-[10px] text-gray-400">Order: {log.orderId.slice(0, 8)}...</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin, isAuthenticated, loading, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#E42933] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin />;

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Layers },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "discounts", label: "Discounts", icon: Percent },
    { id: "refunds", label: "Refunds", icon: RotateCcw },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-[#1a1a1a] text-white flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <img src="/assets/images/logo-horizontal.png" alt="Supreme Autoparts" className="h-8 w-auto brightness-0 invert mb-1" />
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Admin Dashboard</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={18} /></button>
          </div>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E42933] flex items-center justify-center font-bold text-sm">
              {admin?.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{admin?.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{admin?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.id ? "bg-[#E42933] text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <Globe size={16} /> View Store
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base font-black text-gray-900 capitalize">{activeSection}</h2>
              <p className="text-xs text-gray-400 hidden sm:block">Supreme Autoparts Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe size={14} /> View Store
            </a>
            <div className="w-9 h-9 rounded-full bg-[#E42933] flex items-center justify-center text-white font-bold text-sm">
              {admin?.name[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "products" && <ProductsSection />}
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "customers" && <CustomersSection />}
          {activeSection === "inventory" && <InventorySection />}
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "discounts" && <DiscountsSection />}
          {activeSection === "refunds" && <RefundsSection />}
          {activeSection === "payments" && <PaymentsSection />}
          {activeSection === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
