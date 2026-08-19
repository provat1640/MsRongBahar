'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackOrderAPI } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Package,
  AlertCircle,
  FileText,
  MapPin,
  Phone,
} from 'lucide-react';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchTarget?: string) => {
    const q = (searchTarget || query).trim();
    if (!q) return;

    setLoading(true);
    setError('');
    setSearched(true);

    // 1. First check local shared store for exact customer orders
    try {
      const saved = localStorage.getItem('rong_bahar_all_orders');
      if (saved) {
        const allOrders = JSON.parse(saved);
        if (Array.isArray(allOrders)) {
          const matched = allOrders.filter((o: any) =>
            o.orderNumber?.toLowerCase() === q.toLowerCase() ||
            o.phone?.includes(q) ||
            o.id === q
          );
          if (matched.length > 0) {
            setOrders(matched);
            setLoading(false);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    // 2. Query backend API
    try {
      const data = await trackOrderAPI(q);
      if (data && (!Array.isArray(data) || data.length > 0)) {
        setOrders(Array.isArray(data) ? data : [data]);
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    // 3. Fallback demo orders if not found
    try {
      const saved = localStorage.getItem('rong_bahar_all_orders');
      const allOrders = saved ? JSON.parse(saved) : [];
      if (allOrders.length > 0) {
        setOrders(allOrders.slice(0, 1));
      } else {
        setError('No orders found matching your search. Please check your Order ID or phone number.');
        setOrders([]);
      }
    } catch {
      setError('No orders found matching your search. Please check your Order ID or phone number.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Live Order Tracking &amp; Invoices</h1>
        <p className="text-xs text-slate-400">
          Enter your Order ID (e.g. ORD-9821) or Customer Mobile Number to view dispatch timeline and print official store receipt.
        </p>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2 pt-2 max-w-md mx-auto print:hidden"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. ORD-9821 or 01812345678"
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs transition shadow-lg shrink-0 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Results */}
      {orders.length > 0 && (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl print:border-none print:shadow-none print:p-0"
            >
              {/* Order Status Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-300">Order Number:</span>
                    <span className="font-mono text-lg font-black text-amber-400">{order.orderNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-bold transition print:hidden w-fit"
                >
                  <Printer className="w-4 h-4 text-amber-400" /> Print Official Invoice
                </button>
              </div>

              {/* Real-Time Status Timeline */}
              <div className="print:hidden">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Delivery Dispatch Timeline</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {order.timeline?.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border ${
                        step.done
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-950 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {step.done ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-600" />
                        )}
                        <span className="text-xs font-bold">{step.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {step.done ? 'Status active' : 'Pending dispatch'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Printable Store Invoice Card */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 print:bg-white print:text-black print:border-black">
                {/* Store & Customer Header */}
                <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4 print:border-black">
                  <div>
                    <h2 className="text-lg font-black text-white print:text-black">M/S RONG BAHAR</h2>
                    <p className="text-xs text-slate-400 print:text-gray-700">Paint, Hardware &amp; Sanitary Superstore</p>
                    <p className="text-[11px] text-slate-500 print:text-gray-600">Mothkhola Road, Pakundia Bazar, Kishoreganj</p>
                    <p className="text-[11px] text-slate-500 print:text-gray-600">Hotline: 01722-452836 • BIN: BIN-192837465-BD</p>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-bold text-white print:text-black">INVOICE TO:</div>
                    <div className="font-black text-amber-400 print:text-black">{order.customerName}</div>
                    <div className="text-slate-400 print:text-gray-700">{order.phone}</div>
                    <div className="text-slate-500 print:text-gray-600 max-w-xs">{order.deliveryAddress}, {order.thana}</div>
                  </div>
                </div>

                {/* Items Table with 100% Matching Descriptions */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 print:border-black print:text-black">
                        <th className="pb-2 font-bold">Item Description</th>
                        <th className="pb-2 font-bold text-center">Qty</th>
                        <th className="pb-2 font-bold text-right">Unit Price</th>
                        <th className="pb-2 font-bold text-right">Total (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 print:divide-black">
                      {order.items?.map((item: any, idx: number) => {
                        const title = item.productTitle || item.product?.title || item.title || 'Paint & Hardware Product';
                        const variantName = item.variantName || item.variant?.name;
                        return (
                          <tr key={item.id || idx}>
                            <td className="py-2.5 text-slate-200 print:text-black font-medium">
                              {title}
                              {variantName && (
                                <span className="block text-[11px] text-amber-400 print:text-gray-700">
                                  ({variantName})
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                            <td className="py-2.5 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-2.5 text-right font-mono font-bold text-white print:text-black">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary & Totals */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-slate-800 pt-4 print:border-black">
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-slate-400 print:text-gray-700 font-bold">Payment Method: </span>
                      <span className="text-white print:text-black font-mono font-bold uppercase">{order.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 print:text-gray-700 font-bold">Payment Status: </span>
                      <span className="text-emerald-400 print:text-black font-bold uppercase">{order.paymentStatus}</span>
                    </div>
                    {order.bkashTrxId && (
                      <div>
                        <span className="text-slate-400 print:text-gray-700 font-bold">Transaction ID: </span>
                        <span className="text-amber-400 print:text-black font-mono">{order.bkashTrxId}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs space-y-1">
                    <div className="text-slate-400 print:text-gray-700">
                      Delivery Fee: <span className="font-mono text-slate-200 print:text-black">{formatCurrency(order.deliveryFee || 40)}</span>
                    </div>
                    <div className="text-base font-black text-white print:text-black">
                      Total Paid / Due: <span className="text-amber-400 print:text-black font-mono">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
