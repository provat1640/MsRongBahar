'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-amber-500" />
              <h2 className="text-lg font-bold">Your Cart ({itemCount} items)</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-500">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <p className="text-base font-medium">Your hardware cart is empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition text-sm"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                let imgUrl = 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800';
                try {
                  const parsed = JSON.parse(item.product.images);
                  if (parsed && parsed.length > 0) imgUrl = parsed[0];
                } catch (e) {}

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="relative w-20 h-20 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={imgUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{item.product.title}</h4>
                      {item.variant && (
                        <p className="text-xs text-amber-400 mt-0.5">Unit: {item.variant.name}</p>
                      )}
                      <p className="text-sm font-bold text-amber-500 mt-1">৳{item.price.toLocaleString('en-BD')}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">৳{cartTotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Est. Delivery (Inside BD)</span>
                  <span className="font-semibold text-slate-200">৳60</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-100 pt-2 border-t border-slate-800">
                  <span>Total Payable</span>
                  <span className="text-amber-500">৳{(cartTotal + 60).toLocaleString('en-BD')}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg transition"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
