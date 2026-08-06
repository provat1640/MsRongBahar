import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function InvoicePage({
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

  if (!order) notFound();

  return (
    <div className="bg-white text-slate-950 min-h-screen p-8 max-w-3xl mx-auto font-sans">
      {/* Printable Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">M/S RONG BAHAR</h1>
          <p className="text-xs font-semibold text-slate-600">Hardware & Paint Retailer BD</p>
          <p className="text-xs text-slate-600">Mothkhola Road, Pakundia, Kishoreganj</p>
          <p className="text-xs text-slate-600">Hotline: 01621962897 / 01722452836</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-slate-900 text-white font-mono font-bold px-3 py-1 text-sm rounded">
            INVOICE #{order.orderNumber}
          </div>
          <p className="text-xs text-slate-500 mt-2">Date: {new Date(order.createdAt).toLocaleDateString('en-BD')}</p>
          <p className="text-xs font-bold text-slate-800">Status: {order.orderStatus}</p>
        </div>
      </div>

      {/* Dispatch Address Grid */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 border border-slate-300 rounded-lg text-xs bg-slate-50">
        <div>
          <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Customer / Recipient</h4>
          <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
          <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">📞 {order.phone}</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Delivery Destination</h4>
          <p className="text-slate-800 font-medium">{order.deliveryAddress}</p>
          <p className="font-bold text-slate-900">{order.thana}, {order.district}</p>
        </div>
      </div>

      {/* Payment Meta */}
      <div className="mb-6 p-3 border border-slate-200 rounded text-xs flex justify-between">
        <span>Payment Method: <strong className="uppercase">{order.paymentMethod}</strong></span>
        <span>Payment Status: <strong>{order.paymentStatus}</strong></span>
        {order.bkashTrxId && <span>TrxID: <strong className="font-mono">{order.bkashTrxId}</strong></span>}
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs mb-6 border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-700 uppercase">
            <th className="py-2.5 px-3">Item Description</th>
            <th className="py-2.5 px-3 text-center">Unit / Variant</th>
            <th className="py-2.5 px-3 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Price (BDT)</th>
            <th className="py-2.5 px-3 text-right">Total (BDT)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {order.items.map((item: any) => (
            <tr key={item.id}>
              <td className="py-2.5 px-3 font-semibold text-slate-900">{item.product.title}</td>
              <td className="py-2.5 px-3 text-center text-slate-600">{item.variant ? item.variant.name : 'Base'}</td>
              <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
              <td className="py-2.5 px-3 text-right">৳{item.unitPrice.toLocaleString('en-BD')}</td>
              <td className="py-2.5 px-3 text-right font-bold">৳{(item.quantity * item.unitPrice).toLocaleString('en-BD')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Invoice Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1.5 text-xs text-slate-700">
          <div className="flex justify-between">
            <span>Items Subtotal:</span>
            <span className="font-semibold">৳{(order.totalAmount - order.deliveryFee).toLocaleString('en-BD')}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span className="font-semibold">৳{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
            <span>Total Payable Amount:</span>
            <span>৳{order.totalAmount.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </div>

      {/* Signature & Print */}
      <div className="pt-12 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
        <div>
          <p>Thank you for shopping at M/S Rong Bahar!</p>
          <p className="text-[10px]">For queries call hotline: 01621962897</p>
        </div>
        <div className="text-center border-t border-slate-400 pt-2 w-48 font-semibold text-slate-800">
          Authorized Store Stamp & Signature
        </div>
      </div>
    </div>
  );
}
