import { Link } from "wouter";
import AdminLayout from "./AdminLayout";
import { useAdminFetch } from "./lib/useAdminFetch";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "./lib/api";
import {
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Eye, DollarSign,
  CheckCircle, XCircle, Truck,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const CHART_COLORS = ["#E42933", "#1a1a1a", "#4CAF50", "#FF9800", "#2196F3"];

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  pendingRefunds: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  orderStatusBreakdown: Record<string, number>;
  recentOrders: any[];
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = "red",
  loading,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  color?: "red" | "blue" | "green" | "orange" | "purple";
  loading?: boolean;
}) {
  const colorMap = {
    red: "bg-red-50 text-[#E42933]",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              trend >= 0 ? "text-green-600" : "text-red-500"
            )}
          >
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        {trendLabel && <p className="text-xs text-gray-400">{trendLabel}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, loading, refetch } = useAdminFetch<StatsData>("/api/admin/stats");
  const { data: alerts } = useAdminFetch<{ lowStock: any[]; outOfStock: any[] }>(
    "/api/admin/inventory/alerts"
  );

  const orderStatusData = stats
    ? Object.entries(stats.orderStatusBreakdown).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    : [];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with your store."
      actions={
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      }
    >
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/admin/products/new">
          <a className="flex items-center gap-2 bg-[#E42933] hover:bg-[#c41f28] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wide">
            <Plus size={14} /> Add Product
          </a>
        </Link>
        <Link href="/admin/orders">
          <a className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-gray-200 transition-colors uppercase tracking-wide">
            <ShoppingBag size={14} /> View Orders
          </a>
        </Link>
        <Link href="/admin/customers">
          <a className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-gray-200 transition-colors uppercase tracking-wide">
            <Users size={14} /> Customers
          </a>
        </Link>
        <Link href="/admin/analytics">
          <a className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-gray-200 transition-colors uppercase tracking-wide">
            <TrendingUp size={14} /> Analytics
          </a>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : "—"}
          icon={DollarSign}
          color="green"
          subtitle="All time"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? "—"}
          icon={ShoppingBag}
          color="blue"
          subtitle={`${stats?.pendingOrders ?? 0} pending`}
          loading={loading}
        />
        <StatCard
          title="Customers"
          value={stats?.totalCustomers ?? "—"}
          icon={Users}
          color="purple"
          subtitle="Registered accounts"
          loading={loading}
        />
        <StatCard
          title="Products"
          value={stats?.totalProducts ?? "—"}
          icon={Package}
          color="orange"
          subtitle={`${stats?.lowStockProducts ?? 0} low stock`}
          loading={loading}
        />
      </div>

      {/* Alert Cards */}
      {(stats?.pendingOrders || stats?.pendingRefunds || stats?.lowStockProducts) ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders?status=pending">
              <a className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:bg-yellow-100 transition-colors">
                <Clock size={20} className="text-yellow-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-yellow-900">{stats.pendingOrders} Pending Orders</p>
                  <p className="text-xs text-yellow-700">Require attention</p>
                </div>
                <ArrowUpRight size={16} className="text-yellow-600 ml-auto" />
              </a>
            </Link>
          )}
          {stats.pendingRefunds > 0 && (
            <Link href="/admin/refunds?status=pending">
              <a className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 hover:bg-red-100 transition-colors">
                <RefreshCw size={20} className="text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-900">{stats.pendingRefunds} Pending Refunds</p>
                  <p className="text-xs text-red-700">Awaiting review</p>
                </div>
                <ArrowUpRight size={16} className="text-red-600 ml-auto" />
              </a>
            </Link>
          )}
          {stats.lowStockProducts > 0 && (
            <Link href="/admin/inventory">
              <a className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 hover:bg-orange-100 transition-colors">
                <AlertTriangle size={20} className="text-orange-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-orange-900">{stats.lowStockProducts} Low Stock</p>
                  <p className="text-xs text-orange-700">Products need restocking</p>
                </div>
                <ArrowUpRight size={16} className="text-orange-600 ml-auto" />
              </a>
            </Link>
          )}
        </div>
      ) : null}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Revenue Overview
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
          </div>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats?.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E42933" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#E42933" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E42933"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
            Order Status
          </h3>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
              Recent Orders
            </h3>
            <Link href="/admin/orders">
              <a className="text-xs text-[#E42933] font-semibold hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </a>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-3 animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                ))
              : stats?.recentOrders?.slice(0, 8).map((order: any) => (
                  <div key={order.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{order.orderNumber}</span>
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase",
                              ORDER_STATUS_COLORS[order.status]
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {order.customerName || order.customerEmail} · {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase",
                            PAYMENT_STATUS_COLORS[order.paymentStatus]
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Top Products + Low Stock */}
        <div className="space-y-4">
          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Best Sellers
              </h3>
              <Link href="/admin/analytics">
                <a className="text-xs text-[#E42933] font-semibold hover:underline flex items-center gap-1">
                  Analytics <ArrowUpRight size={12} />
                </a>
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : stats?.topProducts?.map((p: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {p.sales} sold · {formatCurrency(p.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          {alerts && (alerts.outOfStock.length > 0 || alerts.lowStock.length > 0) && (
            <div className="bg-white rounded-xl border border-orange-100">
              <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100">
                <h3 className="text-sm font-black text-orange-700 uppercase tracking-tight flex items-center gap-2">
                  <AlertTriangle size={15} /> Stock Alerts
                </h3>
                <Link href="/admin/inventory">
                  <a className="text-xs text-[#E42933] font-semibold hover:underline">
                    Manage →
                  </a>
                </Link>
              </div>
              <div className="divide-y divide-orange-50 max-h-48 overflow-y-auto">
                {alerts.outOfStock.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="px-5 py-2.5 flex items-center justify-between">
                    <p className="text-xs text-gray-700 truncate flex-1">{p.name}</p>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full ml-2 shrink-0">
                      OUT OF STOCK
                    </span>
                  </div>
                ))}
                {alerts.lowStock.slice(0, 4).map((p: any) => (
                  <div key={p.id} className="px-5 py-2.5 flex items-center justify-between">
                    <p className="text-xs text-gray-700 truncate flex-1">{p.name}</p>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full ml-2 shrink-0">
                      {p.stock} LEFT
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
