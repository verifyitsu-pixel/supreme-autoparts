import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { formatCurrency } from "../lib/api";
import {
  TrendingUp, DollarSign, ShoppingBag, Users, Package,
  Download, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const PERIODS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
];

const CHART_COLORS = ["#E42933", "#1a1a1a", "#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  const { data: analytics, loading, refetch } = useAdminFetch<any>(
    `/api/admin/analytics?period=${period}`
  );

  const revenueData = analytics?.revenueOverTime || [];
  const topProducts = analytics?.topProducts || [];
  const categoryRevenue = analytics?.categoryRevenue || [];
  const ordersByDay = analytics?.ordersByDay || [];
  const customerGrowth = analytics?.customerGrowth || [];

  return (
    <AdminLayout
      title="Analytics"
      subtitle="Sales performance and business insights"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/api/admin/analytics/export?period=${period}`, "_blank")}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      }
    >
      {/* Period Selector */}
      <div className="flex gap-1 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg transition-colors",
              period === p.value
                ? "bg-[#E42933] text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Revenue", value: formatCurrency(analytics?.totalRevenue || 0), icon: DollarSign, color: "green", change: analytics?.revenueChange },
          { title: "Orders", value: analytics?.totalOrders || 0, icon: ShoppingBag, color: "blue", change: analytics?.ordersChange },
          { title: "New Customers", value: analytics?.newCustomers || 0, icon: Users, color: "purple", change: analytics?.customersChange },
          { title: "Avg Order Value", value: formatCurrency(analytics?.avgOrderValue || 0), icon: TrendingUp, color: "orange", change: analytics?.aovChange },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                kpi.color === "green" ? "bg-green-50 text-green-600" :
                kpi.color === "blue" ? "bg-blue-50 text-blue-600" :
                kpi.color === "purple" ? "bg-purple-50 text-purple-600" :
                "bg-orange-50 text-orange-600"
              )}>
                <kpi.icon size={16} />
              </div>
            </div>
            {loading ? (
              <div className="h-7 bg-gray-200 rounded w-3/4 animate-pulse" />
            ) : (
              <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
            )}
            {kpi.change !== undefined && (
              <p className={cn(
                "text-xs font-semibold mt-1",
                kpi.change >= 0 ? "text-green-600" : "text-red-500"
              )}>
                {kpi.change >= 0 ? "+" : ""}{kpi.change}% vs prev period
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
          Revenue Over Time
        </h3>
        {loading ? (
          <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E42933" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E42933" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
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
              <Area type="monotone" dataKey="revenue" stroke="#E42933" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Orders by Day */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
            Orders by Day
          </h3>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Bar dataKey="orders" fill="#E42933" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Revenue */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
            Revenue by Category
          </h3>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="revenue"
                  nameKey="category"
                >
                  {categoryRevenue.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
            Top Selling Products
          </h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {topProducts.map((p: any, i: number) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(p.revenue)}</p>
                  <p className="text-xs text-gray-400">{p.unitsSold} sold</p>
                </div>
                {/* Progress bar */}
                <div className="w-24 hidden lg:block">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E42933] rounded-full"
                      style={{ width: `${Math.min(100, (p.revenue / (topProducts[0]?.revenue || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Growth */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
          Customer Growth
        </h3>
        {loading ? (
          <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Line type="monotone" dataKey="customers" stroke="#1a1a1a" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </AdminLayout>
  );
}
