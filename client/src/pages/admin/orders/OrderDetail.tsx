import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "../AdminLayout";
import { useAdminFetch } from "../lib/useAdminFetch";
import { adminFetch, formatCurrency, formatDateTime, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "../lib/api";
import {
  ArrowLeft, Printer, Package, Truck, CheckCircle, Clock,
  XCircle, CreditCard, User, MapPin, Phone, Mail, Edit,
  RefreshCw, Save, X, Download, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OrderDetailProps {
  orderId: string;
}

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

function OrderTimeline({ order }: { order: any }) {
  const events = [
    { label: "Order Placed", time: order.date, icon: Package, done: true },
    { label: "Payment Received", time: order.paidAt, icon: CreditCard, done: !!order.paidAt },
    { label: "Processing", time: order.status !== "pending" ? order.date : null, icon: RefreshCw, done: ["processing", "shipped", "delivered"].includes(order.status) },
    { label: "Shipped", time: order.status === "shipped" || order.status === "delivered" ? order.date : null, icon: Truck, done: ["shipped", "delivered"].includes(order.status) },
    { label: "Delivered", time: order.deliveredAt, icon: CheckCircle, done: order.status === "delivered" },
  ];

  return (
    <div className="space-y-3">
      {events.map((event, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            event.done ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
          )}>
            <event.icon size={14} />
          </div>
          <div className="flex-1 pt-1">
            <p className={cn("text-xs font-bold", event.done ? "text-gray-900" : "text-gray-400")}>
              {event.label}
            </p>
            {event.time && (
              <p className="text-[11px] text-gray-400 mt-0.5">{formatDateTime(event.time)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { data: order, loading, refetch } = useAdminFetch<any>(`/api/admin/orders/${orderId}`);
  const [editStatus, setEditStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateOrder = async () => {
    setSaving(true);
    try {
      const payload: any = {};
      if (newStatus) payload.status = newStatus;
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;
      if (trackingNumber) payload.trackingNumber = trackingNumber;
      if (notes) payload.notes = notes;

      await adminFetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Order updated successfully");
      setEditStatus(false);
      setNewStatus("");
      setNewPaymentStatus("");
      setTrackingNumber("");
      setNotes("");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await adminFetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      toast.success("Order marked as paid");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const data = await adminFetch(`/api/admin/orders/${orderId}/invoice`);
      const content = `
INVOICE
=======
Order: ${data.orderNumber}
Date: ${new Date(data.date).toLocaleDateString()}
Customer: ${data.customerName}
Email: ${data.customerEmail}

ITEMS:
${data.items.map((i: any) => `  ${i.name} x${i.quantity} = KES ${(i.price * i.quantity).toLocaleString()}`).join("\n")}

Subtotal: KES ${data.subtotal?.toLocaleString()}
Tax (16%): KES ${data.tax?.toLocaleString()}
Shipping: KES ${data.shipping?.toLocaleString()}
TOTAL: KES ${data.total?.toLocaleString()}

Shipping Address:
${data.shippingAddress?.fullName}
${data.shippingAddress?.address}
${data.shippingAddress?.county}, ${data.shippingAddress?.country}

Store: ${data.storeInfo?.name}
${data.storeInfo?.email} | ${data.storeInfo?.phone}
      `.trim();

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${data.orderNumber}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Not Found">
        <div className="text-center py-16">
          <AlertTriangle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">Order not found</p>
          <Link href="/admin/orders">
            <a className="text-xs text-[#E42933] font-semibold mt-2 inline-block hover:underline">
              ← Back to Orders
            </a>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Order ${order.orderNumber}`}
      subtitle={`Placed on ${formatDateTime(order.date)}`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
          >
            <Download size={13} /> Invoice
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
          >
            <Printer size={13} /> Print
          </button>
          <Link href="/admin/orders">
            <a className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide">
              <ArrowLeft size={13} /> Back
            </a>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-4">
          {/* Status Banner */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-full uppercase",
                  ORDER_STATUS_COLORS[order.status]
                )}
              >
                {order.status}
              </span>
              <span
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-full uppercase",
                  PAYMENT_STATUS_COLORS[order.paymentStatus]
                )}
              >
                {order.paymentStatus}
              </span>
              {order.trackingNumber && (
                <span className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  Tracking: {order.trackingNumber}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-1">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      STATUS_STEPS.indexOf(order.status) >= i
                        ? "bg-[#E42933]"
                        : "bg-gray-200"
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {STATUS_STEPS.map((s) => (
                <span
                  key={s}
                  className={cn(
                    "text-[10px] font-bold uppercase",
                    order.status === s ? "text-[#E42933]" : "text-gray-400"
                  )}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Order Items ({order.items?.length || 0})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.brand} · {item.category}
                      {item.sku && ` · SKU: ${item.sku}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Tax (16% VAT)</span>
                <span className="font-semibold">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold">
                  {order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update Order */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Update Order
              </h3>
              {order.paymentStatus === "unpaid" && (
                <button
                  onClick={handleMarkPaid}
                  className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Mark as Paid
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Order Status
                </label>
                <select
                  value={newStatus || order.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus || order.paymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] bg-white"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber || order.trackingNumber || ""}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E42933]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this order..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E42933] resize-none"
              />
            </div>
            <button
              onClick={handleUpdateOrder}
              disabled={saving}
              className="w-full bg-[#E42933] hover:bg-[#c41f28] text-white font-black py-3 rounded-xl transition-colors disabled:opacity-70 text-sm uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} /> Update Order
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User size={13} /> Customer
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">{order.customerName || "Guest"}</p>
              {order.customerEmail && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={12} />
                  <a href={`mailto:${order.customerEmail}`} className="hover:text-[#E42933]">
                    {order.customerEmail}
                  </a>
                </div>
              )}
              {order.shippingAddress?.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              )}
              {order.customer && (
                <Link href={`/admin/customers/${order.customer.id}`}>
                  <a className="text-xs text-[#E42933] font-semibold hover:underline mt-2 inline-block">
                    View customer profile →
                  </a>
                </Link>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin size={13} /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-gray-600 space-y-0.5">
                <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.county}</p>
                <p>{order.shippingAddress.country} {order.shippingAddress.postalCode}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No shipping address</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CreditCard size={13} /> Payment
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold text-gray-900 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span
                  className={cn(
                    "font-bold px-2 py-0.5 rounded-full uppercase text-[10px]",
                    PAYMENT_STATUS_COLORS[order.paymentStatus]
                  )}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Paid at</span>
                  <span className="font-semibold text-gray-900">{formatDateTime(order.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={13} /> Timeline
            </h3>
            <OrderTimeline order={order} />
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="text-xs font-black text-yellow-800 uppercase tracking-wider mb-2">
                Notes
              </h3>
              <p className="text-xs text-yellow-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
