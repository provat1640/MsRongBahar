import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle, Phone, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-center">
      <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full inline-block shadow-xl">
        <CheckCircle className="w-16 h-16 mx-auto animate-bounce" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Order Placed & Confirmed!</h1>
        <p className="text-sm text-slate-300">
          Thank you for ordering from <strong className="text-amber-400">M/S Rong Bahar</strong> (Pakundia, Kishoreganj).
        </p>
        <div className="pt-2">
          <span className="inline-block px-4 py-2 bg-slate-900 border border-amber-500/40 text-amber-400 text-lg font-mono font-bold rounded-xl shadow-lg">
            Invoice #{order.orderNumber}
          </span>
        </div>
      </div>

      {/* Structured Customer & Dispatch Address Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
          <span className="text-slate-400 font-medium">Order Status: <strong className="text-emerald-400 uppercase font-bold">{order.orderStatus}</strong></span>
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            Payment Option:
            {order.paymentMethod === 'BKASH' ? (
              <span className="px-2 py-0.5 bg-white text-slate-950 rounded font-black flex items-center gap-1">
                <img src="/images/bkash.png" alt="bKash" className="h-4 w-auto inline" /> bKash
              </span>
            ) : order.paymentMethod === 'NAGAD' ? (
              <span className="px-2 py-0.5 bg-white text-slate-950 rounded font-black flex items-center gap-1">
                <img src="/images/nagad.png" alt="Nagad" className="h-4 w-auto inline" /> Nagad
              </span>
            ) : (
              <strong className="text-amber-400 font-bold uppercase">{order.paymentMethod}</strong>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-500" /> Recipient Details
            </h4>
            <p className="font-bold text-slate-100 text-sm">{order.customerName}</p>
            <p className="font-mono text-slate-300">📞 {order.phone}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" /> Detailed Shipping Address
            </h4>
            <p className="font-bold text-amber-400">{order.district} District, {order.thana} Thana</p>
            <p className="text-slate-300 leading-relaxed">{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Authenticated Payment Metadata Box */}
        {(order.paymentMethod === 'BKASH' || order.paymentMethod === 'NAGAD') && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded border border-slate-200">
                  <img
                    src={order.paymentMethod === 'BKASH' ? '/images/bkash.png' : '/images/nagad.png'}
                    alt="Logo"
                    className="h-5 w-auto"
                  />
                </div>
                <span className="font-bold text-white uppercase">{order.paymentMethod} Authenticated Transfer</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Trx Auth Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
              <div>Sender Mobile: <strong className="font-mono text-slate-200">{order.paymentSenderNo || order.phone}</strong></div>
              <div>Transaction ID: <strong className="font-mono text-amber-400 uppercase">{order.bkashTrxId}</strong></div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ordered Items & Sub-Units</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs py-1.5 border-b border-slate-800/50">
              <span className="text-slate-200">
                {item.product.title} {item.variant ? `(${item.variant.name})` : ''} x {item.quantity}
              </span>
              <span className="font-bold text-amber-400">৳{(item.unitPrice * item.quantity).toLocaleString('en-BD')}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Items Subtotal:</span>
            <span>৳{(order.totalAmount - order.deliveryFee).toLocaleString('en-BD')}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Delivery Fee:</span>
            <span>৳{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
            <span>Grand Total Payable:</span>
            <span className="text-amber-500">৳{order.totalAmount.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
        >
          Continue Catalog Shopping
        </Link>
        <a
          href="tel:+8801621962897"
          className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4 text-amber-500" /> Call Hotline (01621962897)
        </a>
      </div>
    </div>
  );
}
