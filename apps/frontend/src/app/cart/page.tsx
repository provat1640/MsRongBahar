'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Truck,
  AlertTriangle,
} from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, itemCount, reservationTimeLeft, updateQuantity, removeItem, clearCart } = useCart();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const estimatedDelivery = 40; // Pakundia default
  const total = subtotal + (items.length > 0 ? estimatedDelivery : 0);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white">Your Shopping Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Explore our authorized collection of Berger paints, Fevicol glues, and hardware tools in Pakundia.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs transition shadow-lg"
        >
          Browse Catalog Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Heading & Reservation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review your hardware & paint items before final checkout</p>
        </div>

        {/* Live Redis Lock Status Bar */}
        {reservationTimeLeft > 0 ? (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              Inventory Reserved: <strong className="font-mono text-white text-sm">{formatTimer(reservationTimeLeft)}</strong> remaining
            </span>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Reservation expired. Final stock locked at checkout.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || 'base'}`}
                className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800/80"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{item.productTitle}</h3>
                    {item.variantName && (
                      <p className="text-xs text-amber-400 font-medium">Variant: {item.variantName}</p>
                    )}
                    <div className="text-xs text-slate-400 mt-1">
                      {formatCurrency(item.unitPrice)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                  {/* Quantity adjustment */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 font-bold hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 font-bold hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <div className="text-xs text-slate-500">Line Total</div>
                    <div className="text-sm font-black text-amber-400">{formatCurrency(item.lineTotal)}</div>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/products"
              className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-400/80 hover:text-rose-400 hover:underline"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3">Order Summary</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-200">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Local Pakundia Delivery (Est.)</span>
              <span className="font-bold text-slate-200">{formatCurrency(estimatedDelivery)}</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-sm">
              <span className="font-bold text-white">Estimated Total</span>
              <span className="text-xl font-black text-amber-400">{formatCurrency(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe & Guaranteed Dispatch</span>
            </div>
            <p>
              Your order is processed directly at M/S Rong Bahar (Pakundia Bazar). Pay easily with bKash, Nagad, or Cash on Delivery upon arrival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
