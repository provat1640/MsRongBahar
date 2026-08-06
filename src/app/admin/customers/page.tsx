import React from 'react';
import { prisma } from '@/lib/prisma';
import { Phone, MessageSquare, ShoppingBag, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    include: {
      orders: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Database</h1>
          <p className="text-xs text-slate-400">View customer contact details, order frequency, and lifetime spend</p>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Mobile Phone</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Total Orders</th>
                <th className="p-3.5">Lifetime Spend (BDT)</th>
                <th className="p-3.5 text-right">Quick Contact Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No registered customer profiles found.
                  </td>
                </tr>
              ) : (
                users.map((u: any) => {
                  const lifetimeSpend = u.orders.reduce((sum: number, o: any) => sum + (o.orderStatus !== 'CANCELLED' ? o.totalAmount : 0), 0);
                  const cleanPhone = u.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-bold text-slate-100">{u.name}</td>
                      <td className="p-3.5 font-mono text-amber-400 font-semibold">{u.phone}</td>
                      <td className="p-3.5 text-slate-400">{u.email || 'N/A'}</td>
                      <td className="p-3.5 font-bold text-slate-200">
                        {u.orders.length} orders
                      </td>
                      <td className="p-3.5 font-black text-emerald-400">
                        ৳{lifetimeSpend.toLocaleString('en-BD')}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${u.phone}`}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="w-3.5 h-3.5 fill-current" /> Call
                          </a>
                          <a
                            href={`https://wa.me/88${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
