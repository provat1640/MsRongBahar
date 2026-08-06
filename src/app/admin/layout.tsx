import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();

  // Protect Admin Portal Route
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs text-slate-300 font-semibold">Store Operational System: Online</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <span className="text-slate-100 font-bold block">{session.name}</span>
              <span className="text-amber-400 font-mono text-[10px]">{session.phone}</span>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-lg text-xs transition">
                Logout
              </button>
            </form>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
