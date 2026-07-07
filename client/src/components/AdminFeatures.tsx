import React from "react";
import { useState, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import {
  DollarSign, FileText, Plus, Send, TrendingUp, Download, Eye,
  Check, X, Truck, Clock, CheckCircle, AlertCircle, Printer
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function PaymentProcessor({ order, onPaymentProcessed }: any) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [amount, setAmount] = useState(order.total.toString());
  const [method, setMethod] = useState("mpesa");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAdmin();

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/process-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ amount: Number(amount), method, transactionId }),
      });
      const data = await res.json();
      if (res.ok) {
        onPaymentProcessed(data);
        setShowPaymentForm(false);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={18} className="text-[#E42933]" /> Payment
        </h3>
        <span className={`text-xs font-bold px-2 py-1 rounded ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {order.paymentStatus.toUpperCase()}
        </span>
      </div>

      {order.paymentStatus === "paid" ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
          <p className="font-semibold mb-1">✓ Payment Received</p>
          <p className="text-xs">Paid on {new Date(order.paidAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Amount Due</p>
            <p className="text-2xl font-black text-[#E42933]">KES {order.total.toLocaleString()}</p>
          </div>

          {!showPaymentForm ? (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-[#E42933] hover:bg-[#c41f28] text-white font-bold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Check size={16} /> Mark as Paid
            </button>
          ) : (
            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Payment Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm">
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., TXN123456"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="flex-1 bg-[#E42933] hover:bg-[#c41f28] text-white font-bold py-2 rounded-lg transition-colors text-sm disabled:opacity-70">
                  {loading ? "Processing..." : "Confirm Payment"}
                </button>
                <button type="button" onClick={() => setShowPaymentForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export function InvoiceGenerator({ order }: any) {
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAdmin();

  const downloadInvoice = async () => {
    setLoading(true);
    try {
      if (!invoiceRef.current) return;
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <FileText size={18} className="text-[#E42933]" /> Invoice
        </h3>
        <button
          onClick={downloadInvoice}
          disabled={loading}
          className="flex items-center gap-1 bg-[#E42933]/10 hover:bg-[#E42933]/20 text-[#E42933] font-bold py-2 px-3 rounded-lg transition-colors text-sm disabled:opacity-70"
        >
          <Download size={14} /> {loading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      <div ref={invoiceRef} className="bg-white p-6 border border-gray-200 rounded-lg text-sm">
        <div className="flex justify-between mb-6">
          <div>
            <p className="font-black text-lg text-[#E42933]">INVOICE</p>
            <p className="text-xs text-gray-500 mt-1">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">Supreme Autoparts</p>
            <p className="text-xs text-gray-500">Nairobi, Kenya</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Bill To</p>
            <p className="font-bold text-gray-900">{order.customerName}</p>
            <p className="text-xs text-gray-600">{order.customerEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Invoice Details</p>
            <p className="text-xs text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
            <p className="text-xs text-gray-600">Status: {order.paymentStatus.toUpperCase()}</p>
          </div>
        </div>

        <table className="w-full mb-6 text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-bold text-gray-900">Item</th>
              <th className="text-right py-2 font-bold text-gray-900">Qty</th>
              <th className="text-right py-2 font-bold text-gray-900">Price</th>
              <th className="text-right py-2 font-bold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, i: number) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 text-gray-700">{item.name}</td>
                <td className="text-right text-gray-700">{item.quantity}</td>
                <td className="text-right text-gray-700">KES {item.price.toLocaleString()}</td>
                <td className="text-right text-gray-900 font-bold">KES {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-48 space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-bold text-gray-900">KES {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Tax ({((order.tax / order.subtotal) * 100).toFixed(0)}%):</span>
              <span className="font-bold text-gray-900">KES {order.tax.toLocaleString()}</span>
            </div>
            {order.shipping > 0 && (
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-bold text-gray-900">KES {order.shipping.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 bg-[#E42933]/10 px-2 py-2 rounded">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-black text-[#E42933]">KES {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          <p>Thank you for your business!</p>
          <p>For inquiries, contact us at valvin@supremeautoparts.co.ke</p>
        </div>
      </div>
    </div>
  );
}

export function FulfillmentTracker({ order, onFulfillmentUpdated }: any) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [carrier, setCarrier] = useState("DHL");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAdmin();

  const handleUpdateFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/fulfillment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status, trackingNumber, carrier }),
      });
      const data = await res.json();
      if (res.ok) {
        onFulfillmentUpdated(data);
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const statusSteps = ["pending", "processing", "shipped", "delivered"];
  const statusIcons = { pending: Clock, processing: AlertCircle, shipped: Truck, delivered: CheckCircle };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Truck size={18} className="text-[#E42933]" /> Fulfillment
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-[#E42933]/10 hover:bg-[#E42933]/20 text-[#E42933] font-bold py-1 px-2 rounded text-xs transition-colors"
        >
          <Plus size={12} /> Update
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          {statusSteps.map((s, i) => {
            const Icon = statusIcons[s as keyof typeof statusIcons];
            const isActive = statusSteps.indexOf(order.status) >= i;
            return (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${isActive ? "bg-[#E42933] text-white" : "bg-gray-200 text-gray-600"}`}>
                  <Icon size={16} />
                </div>
                <p className={`text-xs font-semibold capitalize ${isActive ? "text-[#E42933]" : "text-gray-500"}`}>{s}</p>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
            <p className="text-blue-700 font-semibold">Tracking: {order.trackingNumber}</p>
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleUpdateFulfillment} className="space-y-3 pt-3 border-t border-gray-200">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm">
              {statusSteps.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Carrier</label>
            <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm">
              <option value="DHL">DHL</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., 1234567890"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-[#E42933] hover:bg-[#c41f28] text-white font-bold py-2 rounded text-sm disabled:opacity-70">
              {loading ? "Updating..." : "Update"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function FinancialReports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAdmin();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/financial", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <div className="text-center py-4 text-gray-500">Loading reports...</div>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#E42933]" /> Financial Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Total Revenue</span>
            <span className="font-black text-[#E42933]">KES {data.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Total Cost</span>
            <span className="font-bold text-gray-900">KES {data.totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Total Profit</span>
            <span className="font-black text-green-600">KES {data.totalProfit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Profit Margin</span>
            <span className="font-black text-green-600">{data.profitMargin}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-[#E42933]" /> Payment Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Paid Orders</span>
            <span className="font-bold text-green-600">{data.paymentStatusBreakdown.paid}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Unpaid Orders</span>
            <span className="font-bold text-yellow-600">{data.paymentStatusBreakdown.unpaid}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Paid Amount</span>
            <span className="font-black text-[#E42933]">KES {data.paymentStatusBreakdown.paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Unpaid Amount</span>
            <span className="font-bold text-yellow-600">KES {data.paymentStatusBreakdown.unpaidAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
