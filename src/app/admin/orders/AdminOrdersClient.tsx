'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CheckCircle, Clock, Truck, Printer, Phone, MessageSquare, ShieldCheck, Filter, AlertCircle, Eye } from 'lucide-react';
import { Order } from '@/types';

interface AdminOrdersClientProps {
  initialOrders: Order[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    const matchPayment = paymentFilter === 'ALL' || o.paymentMethod === paymentFilter;
    return matchStatus && matchPayment;
  });

  const handleUpdateStatus = async (orderId: string, orderStatus?: string, paymentStatus?: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus, paymentStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status');

      setOrders(orders.map((o) => (o.id === orderId ? data.order : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(data.order);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Order Management System (OMS)</h1>
          <p className="text-xs text-slate-400">Verify bKash / Nagad TrxIDs, update shipping status, and generate shipping invoices</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-amber-500" />
          <span className="text-slate-300 font-bold">Filter Status:</span>
          <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                  statusFilter === st ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-300 font-bold">Payment Method:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl py-1.5 px-3 outline-none"
          >
            <option value="ALL">All Methods</option>
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="BKASH">bKash Manual</option>
            <option value="NAGAD">Nagad Manual</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Customer & Phone</th>
                <th className="p-3.5">Address & Thana</th>
                <th className="p-3.5">Payment Details</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5 text-right">Total (BDT)</th>
                <th className="p-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-mono font-bold text-amber-400">
                    {ord.orderNumber}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-100">{ord.customerName}</div>
                    <a
                      href={`tel:${ord.phone}`}
                      className="text-amber-400 hover:underline text-[11px] font-mono flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" /> {ord.phone}
                    </a>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-200 line-clamp-1">{ord.deliveryAddress}</div>
                    <span className="text-[10px] text-slate-400 font-semibold">{ord.thana}, {ord.district}</span>
                  </td>
                  <td className="p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentMethod === 'COD' ? 'bg-amber-500/20 text-amber-400' : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {ord.paymentMethod}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </div>

                    {ord.bkashTrxId && (
                      <div className="text-[10px] text-amber-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        TrxID: <strong>{ord.bkashTrxId}</strong>
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      ord.orderStatus === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400' :
                      ord.orderStatus === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                      ord.orderStatus === 'CONFIRMED' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-black text-white">
                    ৳{ord.totalAmount.toLocaleString('en-BD')}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500" /> Manage Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Verification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">
                  Order Details: <span className="text-amber-400 font-mono">{selectedOrder.orderNumber}</span>
                </h3>
                <p className="text-xs text-slate-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white font-bold">
                ✕ Close
              </button>
            </div>

            {/* Customer Contact & Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Customer Contact</span>
                <p className="font-bold text-slate-100 text-sm">{selectedOrder.customerName}</p>
                <p className="text-slate-300 font-mono">{selectedOrder.phone}</p>
                <p className="text-slate-400 mt-1">{selectedOrder.deliveryAddress}, {selectedOrder.thana}, {selectedOrder.district}</p>
              </div>

              <div className="flex flex-col justify-between items-start sm:items-end space-y-2">
                <div className="flex gap-2">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" /> Call Customer
                  </a>
                  <a
                    href={`https://wa.me/88${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>

                <Link
                  href={`/admin/orders/invoice/${selectedOrder.id}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center gap-1.5 border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-amber-500" /> Print Shipping Invoice (PDF)
                </Link>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">Ordered Products Breakdown</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-1 border-b border-slate-800/60 last:border-0">
                    <div>
                      <span className="font-semibold text-slate-100">{item.product.title}</span>
                      {item.variant && <span className="text-amber-400 text-[10px] block">Unit: {item.variant.name}</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">{item.quantity} x ৳{item.unitPrice.toLocaleString('en-BD')} = </span>
                      <span className="font-bold text-amber-400"> ৳{(item.quantity * item.unitPrice).toLocaleString('en-BD')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* bKash / Nagad Transaction ID Verification Box */}
            {(selectedOrder.paymentMethod === 'BKASH' || selectedOrder.paymentMethod === 'NAGAD') && (
              <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> {selectedOrder.paymentMethod} Manual Transaction Verification
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${selectedOrder.paymentStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    Status: {selectedOrder.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-slate-300 pt-1 font-mono">
                  <div>Sender Mobile: <strong className="text-white">{selectedOrder.paymentSenderNo || selectedOrder.phone}</strong></div>
                  <div>TrxID Submitted: <strong className="text-amber-400 text-sm">{selectedOrder.bkashTrxId || 'N/A'}</strong></div>
                </div>

                {selectedOrder.paymentStatus !== 'VERIFIED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, undefined, 'VERIFIED')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition"
                  >
                    ✓ Mark Payment as VERIFIED
                  </button>
                )}
              </div>
            )}

            {/* Status Transition Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Update Order Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                  className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-xl font-bold text-xs"
                >
                  Mark CONFIRMED
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                  className="px-3.5 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 rounded-xl font-bold text-xs"
                >
                  Mark SHIPPED
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                  className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl font-bold text-xs"
                >
                  Mark DELIVERED
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                  className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl font-bold text-xs"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
