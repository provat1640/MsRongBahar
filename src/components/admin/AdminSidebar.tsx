'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft, Paintbrush, AlertTriangle } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Inventory', href: '/admin/products', icon: Package },
    { name: 'Order Management (OMS)', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customer Database', href: '/admin/customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Paintbrush className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">RONG BAHAR</h2>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Storefront */}
      <div className="p-5 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" /> Customer Storefront
        </Link>
      </div>
    </aside>
  );
}
