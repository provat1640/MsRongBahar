import React from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, AlertTriangle, Users, ArrowUpRight, CheckCircle2, Clock, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // 1. Total Sales
  const totalSalesResult = await prisma.order.aggregate({
    where: { orderStatus: { notIn: ['CANCELLED'] } },
    _sum: { totalAmount: true },
  });
  const totalSales = totalSalesResult._sum.totalAmount || 0;

  // 2. Pending Orders
  const pendingOrdersCount = await prisma.order.count({
    where: { orderStatus: 'PENDING' },
  });

  // 3. Low Stock Items (< 5 units)
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lt: 5 } },
    include: { category: true },
  });

  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lt: 5 } },
    include: { product: true },
  });

  const totalLowStockAlerts = lowStockProducts.length + lowStockVariants.length;

  // 4. Total Customers
  const totalCustomers = await prisma.user.count({ where: { role: 'USER' } });

  // 5. Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400">Live operational metrics & hardware store inventory alerts</p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition w-fit shadow-md"
        >
          + Manage Products & Stock
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">৳{totalSales.toLocaleString('en-BD')}</h3>
            <span className="text-[11px] text-emerald-400 font-medium">Verified store revenue</span>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">{pendingOrdersCount}</h3>
            <span className="text-[11px] text-amber-400 font-medium">Awaiting confirmation/shipping</span>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts (RED HIGHLIGHT) */}
        <div className={`bg-slate-900 border rounded-2xl p-5 space-y-3 relative overflow-hidden transition ${
          totalLowStockAlerts > 0 ? 'border-red-600/80 shadow-lg shadow-red-950/50' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className={`p-2.5 rounded-xl ${totalLowStockAlerts > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl font-black ${totalLowStockAlerts > 0 ? 'text-red-400' : 'text-white'}`}>
              {totalLowStockAlerts} <span className="text-xs font-normal">items</span>
            </h3>
            <span className="text-[11px] text-red-400 font-medium block">
              {totalLowStockAlerts > 0 ? '⚠️ Stock < 5 units requires restock!' : 'All stock levels healthy'}
            </span>
          </div>
        </div>

        {/* Card 4: Total Customers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">{totalCustomers}</h3>
            <span className="text-[11px] text-slate-400">Registered Bangladeshi buyers</span>
          </div>
        </div>
      </div>

      {/* Low Stock Items Red Banner & Table */}
      {totalLowStockAlerts > 0 && (
        <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> CRITICAL LOW STOCK WARNING (SKU Stock &lt; 5 Units)
            </h3>
            <Link href="/admin/products" className="text-xs text-red-300 font-bold hover:underline">
              Restock Inventory Now →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-3.5 bg-slate-900 border border-red-900/50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-100">{p.title}</h4>
                  <span className="text-slate-400 font-mono">SKU: {p.sku}</span>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white font-black rounded-lg text-xs">
                  {p.stock} Left!
                </span>
              </div>
            ))}

            {lowStockVariants.map((v) => (
              <div key={v.id} className="p-3.5 bg-slate-900 border border-red-900/50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-100">{v.product.title} - <span className="text-amber-400">{v.name}</span></h4>
                  <span className="text-slate-400 font-mono">SKU: {v.sku}</span>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white font-black rounded-lg text-xs">
                  {v.stock} Left!
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders Feed</h3>
          <Link href="/admin/orders" className="text-xs text-amber-500 hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                  <td className="p-3 font-semibold text-slate-200">
                    {ord.customerName}
                    <span className="block text-[10px] text-slate-400 font-normal">{ord.phone}</span>
                  </td>
                  <td className="p-3 font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      ord.paymentMethod === 'COD' ? 'bg-amber-500/20 text-amber-400' : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      {ord.paymentMethod} {ord.bkashTrxId ? `(${ord.bkashTrxId})` : ''}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400' :
                      ord.orderStatus === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-100">
                    ৳{ord.totalAmount.toLocaleString('en-BD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
