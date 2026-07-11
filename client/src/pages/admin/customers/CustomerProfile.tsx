import { Link } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "../lib/api";
import {
  ArrowLeft, Mail, Phone, MapPin, ShoppingBag, DollarSign,
  Calendar, Package, AlertTriangle, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerProfileProps {
  customerId: string;
}

export default function CustomerProfile({ customerId }: CustomerProfileProps) {
  const { data: customer, loading } = useAdminFetch<any>(`/api/admin/customers/${customerId}`);

  if (loading) {
    return (
      <AdminLayout title="Customer Profile">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout title="Customer Not Found">
        <div className="text-center py-16">
          <AlertTriangle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">Customer not found</p>
          <Link href="/admin/customers">
            <a className="text-xs text-[#E42933] font-semibold mt-2 inline-block hover:underline">
              ← Back to Customers
            </a>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const fullName = customer.firstName && customer.lastName
    ? `${customer.firstName} ${customer.lastName}`
    : customer.email;

  return (
    <AdminLayout
      title={fullName}
      subtitle={`Customer since ${formatDate(customer.createdAt)}`}
      actions={
        <Link href="/admin/customers">
          <a className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide">
            <ArrowLeft size={13} /> Back
          </a>
        </Link>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-4">
          {/* Order History */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Order History ({customer.orders?.length || 0})
              </h3>
            </div>
            {customer.orders?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {customer.orders.map((order: any) => (
                  <div key={order.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{order.orderNumber}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                          ORDER_STATUS_COLORS[order.status]
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.date)} · {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        PAYMENT_STATUS_COLORS[order.paymentStatus]
                      )}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <Link href={`/admin/orders/${order.id}`}>
                      <a className="ml-4 text-xs text-[#E42933] font-semibold hover:underline shrink-0">
                        View →
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ShoppingBag size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No orders yet</p>
              </div>
            )}
          </div>

          {/* Addresses */}
          {customer.addresses?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
                Saved Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customer.addresses.map((addr: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">
                        Default
                      </span>
                    )}
                    <p className="text-sm font-semibold text-gray-900">{addr.fullName}</p>
                    <p className="text-xs text-gray-500 mt-1">{addr.address}</p>
                    <p className="text-xs text-gray-500">{addr.county}, {addr.country}</p>
                    {addr.phone && <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#E42933]/10 flex items-center justify-center mb-3">
                <span className="text-2xl font-black text-[#E42933]">
                  {(customer.firstName?.[0] || customer.email?.[0] || "?").toUpperCase()}
                </span>
              </div>
              <h2 className="text-base font-black text-gray-900">{fullName}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Customer ID: {customer.id}</p>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-gray-600">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <a href={`mailto:${customer.email}`} className="hover:text-[#E42933] truncate">
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <Phone size={13} className="text-gray-400 shrink-0" />
                  {customer.phone}
                </div>
              )}
              <div className="flex items-center gap-2.5 text-xs text-gray-600">
                <Calendar size={13} className="text-gray-400 shrink-0" />
                Joined {formatDate(customer.createdAt)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">
              Customer Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShoppingBag size={13} className="text-gray-400" />
                  Total Orders
                </div>
                <span className="text-sm font-black text-gray-900">
                  {customer.orderCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign size={13} className="text-gray-400" />
                  Total Spent
                </div>
                <span className="text-sm font-black text-gray-900">
                  {formatCurrency(customer.totalSpent || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Package size={13} className="text-gray-400" />
                  Avg. Order Value
                </div>
                <span className="text-sm font-black text-gray-900">
                  {customer.orderCount
                    ? formatCurrency((customer.totalSpent || 0) / customer.orderCount)
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
