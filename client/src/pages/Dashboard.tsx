import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import {
  User, LogOut, ShoppingBag, RotateCcw, FileText, Receipt,
  MapPin, Settings, ChevronRight, Package, Clock, CheckCircle,
  AlertCircle, XCircle, Truck, Eye, Download, Plus, Edit2,
  Trash2, Star, Phone, Mail, Lock, Home, Save, X, ArrowLeft,
  CreditCard, RefreshCw, Bell,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderItem { name: string; quantity: number; price: number; image?: string; brand?: string; model?: string; category?: string; }
interface Order {
  id: string; orderNumber: string; date: string; items: OrderItem[];
  subtotal: number; tax: number; shipping: number; total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentMethod: string;
  shippingAddress: { fullName: string; email: string; phone: string; address: string; county: string; country: string; postalCode: string; };
  trackingNumber?: string; paidAt?: string; deliveredAt?: string;
}
interface Refund {
  id: string; orderId: string; orderNumber: string; reason: string; reasonDetail: string;
  description: string; status: "pending" | "approved" | "rejected" | "completed";
  refundAmount: number; date: string; resolvedAt?: string; adminNote?: string;
}
interface Address {
  id: string; label: string; fullName: string; phone: string;
  address: string; county: string; country: string; postalCode: string; isDefault: boolean;
}

type Tab = "overview" | "orders" | "invoices" | "receipts" | "refunds" | "addresses" | "profile" | "security";

const REFUND_REASONS = [
  { value: "wrong_part", label: "Wrong part delivered" },
  { value: "damaged", label: "Part arrived damaged" },
  { value: "not_as_described", label: "Not as described" },
  { value: "defective", label: "Defective / not working" },
  { value: "duplicate_order", label: "Duplicate order" },
  { value: "changed_mind", label: "Changed my mind" },
  { value: "fitment_issue", label: "Does not fit my vehicle" },
  { value: "other", label: "Other reason" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    unpaid: "bg-orange-100 text-orange-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-gray-100 text-gray-800"}`;
}

function StatusIcon({ status }: { status: string }) {
  if (["delivered", "paid", "completed", "approved"].includes(status)) return <CheckCircle className="text-green-600" size={18} />;
  if (["shipped", "processing"].includes(status)) return <Truck className="text-blue-600" size={18} />;
  if (["pending"].includes(status)) return <Clock className="text-yellow-600" size={18} />;
  if (["cancelled", "rejected"].includes(status)) return <XCircle className="text-red-600" size={18} />;
  return <Package className="text-gray-600" size={18} />;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
}

// ─── Invoice / Receipt Print ──────────────────────────────────────────────────
function InvoiceModal({ order, type, onClose }: { order: Order; type: "invoice" | "receipt"; onClose: () => void }) {
  const isPaid = type === "receipt";
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-8" id="invoice-print">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
            <div>
              <img src="/assets/images/logo-horizontal.png" alt="Supreme Autoparts" className="h-10 mb-3" />
              <p className="text-sm text-gray-600">MIDAX Plaza, Kangundo Rd, Nairobi</p>
              <p className="text-sm text-gray-600">+254 714 498 451 | valvin@supremeautoparts.co.ke</p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-4 py-2 rounded-lg text-white font-black text-lg mb-2 ${isPaid ? "bg-green-600" : "bg-[#E42933]"}`}>
                {isPaid ? "RECEIPT" : "INVOICE"}
              </div>
              <p className="text-sm font-semibold text-gray-700">#{order.orderNumber}</p>
              <p className="text-xs text-gray-500">Date: {formatDate(order.date)}</p>
              {isPaid && order.paidAt && <p className="text-xs text-green-600 font-semibold">Paid: {formatDate(order.paidAt)}</p>}
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.county}, {order.shippingAddress.country}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
            </div>
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Payment</p>
              <p className="text-sm text-gray-700 capitalize">{order.paymentMethod === "mpesa" ? "M-Pesa" : order.paymentMethod}</p>
              <p className={`text-sm font-semibold ${order.paymentStatus === "paid" ? "text-green-600" : "text-orange-600"}`}>
                Status: {order.paymentStatus.toUpperCase()}
              </p>
              {order.trackingNumber && <p className="text-sm text-gray-600 mt-1">Tracking: {order.trackingNumber}</p>}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-600">Item</th>
                <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-600">Qty</th>
                <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-600">Unit Price</th>
                <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">KES {item.price.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">KES {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>KES {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (16% VAT)</span><span>KES {order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span><span>{order.shipping === 0 ? "FREE" : `KES ${order.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t-2 border-gray-200">
                <span>TOTAL</span><span>KES {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {isPaid && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="mx-auto text-green-600 mb-1" size={24} />
              <p className="text-green-800 font-semibold text-sm">Payment Confirmed — Thank you for your purchase!</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            Supreme Autoparts Kenya | Genuine & OEM Car Spare Parts | supremeautoparts.co.ke
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50">Close</button>
          <button onClick={() => window.print()} className="flex-1 px-4 py-2 bg-[#E42933] text-white rounded-lg text-sm font-semibold hover:bg-[#d41f28] flex items-center justify-center gap-2">
            <Download size={16} /> Download / Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Refund Modal ─────────────────────────────────────────────────────────────
function RefundModal({ order, onClose, onSubmit }: { order: Order; onClose: () => void; onSubmit: (data: any) => void }) {
  const [reason, setReason] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    await onSubmit({ orderId: order.id, reason, reasonDetail, description, refundAmount: order.total });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900">Request Refund / Return</h3>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
            <p className="text-gray-600">{order.items.length} item(s) · KES {order.total.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Reason for Return *</label>
            <div className="space-y-2">
              {REFUND_REASONS.map(r => (
                <label key={r.value} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${reason === r.value ? "border-[#E42933] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="text-[#E42933]" />
                  <span className="text-sm font-medium text-gray-800">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {reason && (
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Additional Details</label>
              <input
                type="text"
                value={reasonDetail}
                onChange={e => setReasonDetail(e.target.value)}
                placeholder="e.g. Part number, specific issue..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933] text-sm resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Refund Policy</p>
            <p>Returns accepted within 7 days of delivery. Refund processed within 3-5 business days after approval.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={!reason || submitting} className="flex-1 px-4 py-3 bg-[#E42933] text-white rounded-lg text-sm font-semibold hover:bg-[#d41f28] disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><RefreshCw size={16} className="animate-spin" /> Submitting...</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout, updateProfile, changePassword, getToken } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceType, setInvoiceType] = useState<"invoice" | "receipt">("invoice");
  const [refundOrder, setRefundOrder] = useState<Order | null>(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

  useEffect(() => {
    if (!user) { setLocation("/login"); return; }
    setProfileForm({ name: user.name, phone: user.phone || "" });
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [oRes, rRes, aRes] = await Promise.all([
          fetch("/api/orders", { headers: authHeaders() }),
          fetch("/api/refunds", { headers: authHeaders() }),
          fetch("/api/addresses", { headers: authHeaders() }),
        ]);
        if (oRes.ok) setOrders(await oRes.json());
        if (rRes.ok) setRefunds(await rRes.json());
        if (aRes.ok) setAddresses(await aRes.json());
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  const handleLogout = async () => { await logout(); setLocation("/"); };

  const openInvoice = (order: Order, type: "invoice" | "receipt") => { setSelectedOrder(order); setInvoiceType(type); };

  const submitRefund = async (data: any) => {
    const res = await fetch("/api/refunds", { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    if (res.ok) { const r = await res.json(); setRefunds(prev => [r, ...prev]); }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingProfile(true); setProfileMsg("");
    try { await updateProfile(profileForm); setProfileMsg("Profile updated successfully!"); }
    catch (err) { setProfileMsg(err instanceof Error ? err.message : "Update failed"); }
    setSavingProfile(false);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPasswordMsg("");
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordMsg("New passwords do not match"); return; }
    if (passwordForm.newPass.length < 6) { setPasswordMsg("Password must be at least 6 characters"); return; }
    setSavingPassword(true);
    try { await changePassword(passwordForm.current, passwordForm.newPass); setPasswordMsg("Password changed successfully!"); setPasswordForm({ current: "", newPass: "", confirm: "" }); }
    catch (err) { setPasswordMsg(err instanceof Error ? err.message : "Failed to change password"); }
    setSavingPassword(false);
  };

  if (!user) return null;

  const paidOrders = orders.filter(o => o.paymentStatus === "paid");
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing");
  const totalSpent = paidOrders.reduce((s, o) => s + o.total, 0);

  const tabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "orders", label: "My Orders", icon: ShoppingBag, badge: orders.length },
    { id: "invoices", label: "Invoices", icon: FileText, badge: orders.length },
    { id: "receipts", label: "Receipts", icon: Receipt, badge: paidOrders.length },
    { id: "refunds", label: "Refunds", icon: RotateCcw, badge: refunds.length },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-[1280px] mx-auto px-4 py-8">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#E42933] rounded-full flex items-center justify-center text-2xl font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black">{user.name}</h1>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  {user.phone && <p className="text-gray-400 text-sm">{user.phone}</p>}
                  <p className="text-gray-500 text-xs mt-1">Member since {formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-xl font-black">{orders.length}</p>
                  <p className="text-xs text-gray-400">Orders</p>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-xl font-black">{paidOrders.length}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-xl font-black">KES {(totalSpent/1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-400">Total Spent</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-56 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors border-l-4 ${activeTab === tab.id ? "border-[#E42933] bg-red-50 text-[#E42933]" : "border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={17} />
                      {tab.label}
                    </div>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="bg-[#E42933] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">{tab.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">

              {/* ── OVERVIEW ── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Pending", value: pendingOrders.length, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
                      { label: "Completed", value: paidOrders.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
                      { label: "Refunds", value: refunds.length, icon: RotateCcw, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5">
                        <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                          <stat.icon className={stat.color} size={20} />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                      <h2 className="font-black text-gray-900">Recent Orders</h2>
                      <button onClick={() => setActiveTab("orders")} className="text-sm text-[#E42933] font-semibold hover:underline">View All</button>
                    </div>
                    {loading ? (
                      <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : orders.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-gray-500 text-sm">No orders yet</p>
                        <button onClick={() => setLocation("/products")} className="mt-3 px-4 py-2 bg-[#E42933] text-white rounded-lg text-sm font-semibold hover:bg-[#d41f28]">Shop Now</button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map(order => (
                          <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <StatusIcon status={order.status} />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                                <p className="text-xs text-gray-500">{formatDate(order.date)} · {order.items.length} item(s)</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="font-black text-gray-900 text-sm">KES {order.total.toLocaleString()}</p>
                                <span className={statusBadge(order.status)}>{order.status}</span>
                              </div>
                              <button onClick={() => { setSelectedOrder(order); setInvoiceType("invoice"); }} className="p-2 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-500" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── ORDERS ── */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-black text-gray-900 text-lg">My Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} order(s) total</p>
                  </div>
                  {loading ? <div className="p-8 text-center text-gray-500">Loading orders...</div> :
                  orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                      <button onClick={() => setLocation("/products")} className="px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28]">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <div key={order.id} className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-black text-gray-900">{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                              <span className={statusBadge(order.status)}>{order.status}</span>
                              <span className={statusBadge(order.paymentStatus)}>{order.paymentStatus}</span>
                            </div>
                          </div>
                          <div className="space-y-1 mb-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                                <span className="text-gray-900 font-semibold">KES {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <p className="font-black text-gray-900">Total: KES {order.total.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <button onClick={() => openInvoice(order, "invoice")} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50">
                                <FileText size={14} /> Invoice
                              </button>
                              {order.paymentStatus === "paid" && (
                                <button onClick={() => openInvoice(order, "receipt")} className="flex items-center gap-1 px-3 py-1.5 border border-green-300 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50">
                                  <Receipt size={14} /> Receipt
                                </button>
                              )}
                              {order.paymentStatus === "paid" && order.status === "delivered" && !refunds.find(r => r.orderId === order.id) && (
                                <button onClick={() => setRefundOrder(order)} className="flex items-center gap-1 px-3 py-1.5 border border-orange-300 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-50">
                                  <RotateCcw size={14} /> Return
                                </button>
                              )}
                            </div>
                          </div>
                          {order.trackingNumber && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                              <Truck size={14} /> Tracking: <span className="font-semibold">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── INVOICES ── */}
              {activeTab === "invoices" && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-black text-gray-900 text-lg">Invoices</h2>
                    <p className="text-sm text-gray-500 mt-1">Download invoices for all your orders</p>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-12 text-center"><FileText className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-500">No invoices yet</p></div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                              <FileText className="text-[#E42933]" size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">Invoice #{order.orderNumber}</p>
                              <p className="text-xs text-gray-500">{formatDate(order.date)} · {order.items.length} item(s)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-black text-gray-900">KES {order.total.toLocaleString()}</p>
                              <span className={statusBadge(order.paymentStatus)}>{order.paymentStatus}</span>
                            </div>
                            <button onClick={() => openInvoice(order, "invoice")} className="flex items-center gap-2 px-4 py-2 bg-[#E42933] text-white rounded-lg text-sm font-semibold hover:bg-[#d41f28]">
                              <Eye size={14} /> View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── RECEIPTS ── */}
              {activeTab === "receipts" && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-black text-gray-900 text-lg">Payment Receipts</h2>
                    <p className="text-sm text-gray-500 mt-1">Receipts are generated once the seller confirms payment</p>
                  </div>
                  {paidOrders.length === 0 ? (
                    <div className="p-12 text-center">
                      <Receipt className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-gray-500 mb-2">No receipts yet</p>
                      <p className="text-xs text-gray-400">Receipts appear here once your payment has been confirmed by our team</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {paidOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                              <Receipt className="text-green-600" size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">Receipt #{order.orderNumber}</p>
                              <p className="text-xs text-gray-500">
                                Paid: {order.paidAt ? formatDate(order.paidAt) : formatDate(order.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-black text-gray-900">KES {order.total.toLocaleString()}</p>
                            <button onClick={() => openInvoice(order, "receipt")} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
                              <Download size={14} /> Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── REFUNDS ── */}
              {activeTab === "refunds" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h2 className="font-black text-gray-900 text-lg">Refunds & Returns</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your return requests</p>
                      </div>
                    </div>
                    {refunds.length === 0 ? (
                      <div className="p-12 text-center">
                        <RotateCcw className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 mb-2">No refund requests</p>
                        <p className="text-xs text-gray-400">To request a refund, go to My Orders and click "Return" on a delivered order</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {refunds.map(refund => (
                          <div key={refund.id} className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-900">Refund #{refund.id.slice(0,8).toUpperCase()}</p>
                                <p className="text-sm text-gray-500">Order: {refund.orderNumber}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Reason: <span className="font-medium">{REFUND_REASONS.find(r => r.value === refund.reason)?.label || refund.reason}</span>
                                </p>
                                {refund.description && <p className="text-sm text-gray-500 mt-1">"{refund.description}"</p>}
                              </div>
                              <div className="text-right">
                                <span className={statusBadge(refund.status)}>{refund.status}</span>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(refund.date)}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <p className="text-sm font-semibold text-gray-700">Refund Amount: <span className="text-gray-900 font-black">KES {refund.refundAmount.toLocaleString()}</span></p>
                              {refund.adminNote && <p className="text-xs text-blue-600 italic">Note: {refund.adminNote}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Eligible orders for refund */}
                  {orders.filter(o => o.paymentStatus === "paid" && o.status === "delivered" && !refunds.find(r => r.orderId === o.id)).length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-black text-gray-900">Eligible for Return</h3>
                        <p className="text-xs text-gray-500 mt-1">Delivered orders you can request a return for</p>
                      </div>
                      {orders.filter(o => o.paymentStatus === "paid" && o.status === "delivered" && !refunds.find(r => r.orderId === o.id)).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.date)} · KES {order.total.toLocaleString()}</p>
                          </div>
                          <button onClick={() => setRefundOrder(order)} className="flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-50">
                            <RotateCcw size={14} /> Request Return
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── ADDRESSES ── */}
              {activeTab === "addresses" && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-black text-gray-900 text-lg">Saved Addresses</h2>
                    <button onClick={() => setLocation("/checkout")} className="flex items-center gap-2 px-4 py-2 bg-[#E42933] text-white rounded-lg text-sm font-semibold hover:bg-[#d41f28]">
                      <Plus size={16} /> Add Address
                    </button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="p-12 text-center">
                      <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-gray-500 mb-2">No saved addresses</p>
                      <p className="text-xs text-gray-400">Addresses are saved when you complete checkout</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {addresses.map(addr => (
                        <div key={addr.id} className="p-5 flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                              <MapPin className="text-gray-600" size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">{addr.label || "Home"}</p>
                                {addr.isDefault && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Default</span>}
                              </div>
                              <p className="text-sm text-gray-700">{addr.fullName}</p>
                              <p className="text-sm text-gray-600">{addr.address}</p>
                              <p className="text-sm text-gray-600">{addr.county}, {addr.country} {addr.postalCode}</p>
                              <p className="text-sm text-gray-600">{addr.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── PROFILE ── */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-black text-gray-900 text-lg">Personal Information</h2>
                  </div>
                  <form onSubmit={saveProfile} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input type="email" value={user.email} disabled className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                          placeholder="+254 7XX XXX XXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Login Method</label>
                        <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 capitalize text-sm">{user.loginMethod}</div>
                      </div>
                    </div>
                    {profileMsg && (
                      <div className={`p-3 rounded-lg text-sm font-medium ${profileMsg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{profileMsg}</div>
                    )}
                    <button type="submit" disabled={savingProfile} className="flex items-center gap-2 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] disabled:opacity-50">
                      {savingProfile ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                    </button>
                  </form>
                </div>
              )}

              {/* ── SECURITY ── */}
              {activeTab === "security" && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-black text-gray-900 text-lg">Security Settings</h2>
                  </div>
                  <form onSubmit={savePassword} className="p-6 space-y-5 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                      <input type="password" value={passwordForm.newPass} onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                      <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]" required />
                    </div>
                    {passwordMsg && (
                      <div className={`p-3 rounded-lg text-sm font-medium ${passwordMsg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{passwordMsg}</div>
                    )}
                    <button type="submit" disabled={savingPassword} className="flex items-center gap-2 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] disabled:opacity-50">
                      {savingPassword ? <><RefreshCw size={16} className="animate-spin" /> Updating...</> : <><Lock size={16} /> Change Password</>}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Invoice / Receipt Modal */}
      {selectedOrder && (
        <InvoiceModal order={selectedOrder} type={invoiceType} onClose={() => setSelectedOrder(null)} />
      )}

      {/* Refund Modal */}
      {refundOrder && (
        <RefundModal order={refundOrder} onClose={() => setRefundOrder(null)} onSubmit={submitRefund} />
      )}
    </div>
  );
}
