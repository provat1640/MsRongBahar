'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../lib/api';
import Link from 'next/link';
import { Truck, ShieldCheck, Camera, Sparkles } from 'lucide-react';

interface Props {
  initialProduct?: Product | null;
}

export function HomeHeroPreview({ initialProduct }: Props) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null);

  useEffect(() => {
    const loadHeroProduct = () => {
      try {
        const stored = localStorage.getItem('rong_bahar_products_list');
        if (stored) {
          const list: Product[] = JSON.parse(stored);
          const clean = Array.isArray(list)
            ? list.filter((p: Product) => !['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'].includes(p.id))
            : [];
          if (clean.length > 0) {
            setProduct(clean[0]);
            return;
          }
        }
      } catch {}
      setProduct(initialProduct || null);
    };

    loadHeroProduct();
    window.addEventListener('rong_bahar_products_changed', loadHeroProduct);
    window.addEventListener('storage', loadHeroProduct);
    return () => {
      window.removeEventListener('rong_bahar_products_changed', loadHeroProduct);
      window.removeEventListener('storage', loadHeroProduct);
    };
  }, [initialProduct]);

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative border border-slate-200 dark:border-slate-800 flex items-center justify-center group">
        {product && product.images?.[0] ? (
          <Link href={`/products/${product.slug}`} className="w-full h-full block relative">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-black border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Store Item
            </div>
          </Link>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 text-white relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl mb-3">
              RB
            </div>
            <div className="text-base font-black text-white">M/S Rong Bahar</div>
            <p className="text-xs text-amber-400 font-bold mt-1">Pakundia Bazar • Authorized Dealer</p>
            <Link
              href="/admin"
              className="mt-3 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5" /> + Upload Store Photo
            </Link>
          </div>
        )}

        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 p-2.5 sm:p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-white">
          <div className="min-w-0 pr-2">
            <div className="text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {product ? product.vendor || 'Featured Item' : 'Store Catalog'}
            </div>
            <div className="text-[11px] sm:text-xs font-black text-white truncate">
              {product ? product.title : 'M/S Rong Bahar Paints & Hardware'}
            </div>
          </div>
          <span className="text-[11px] sm:text-xs font-black text-amber-400 font-mono shrink-0">
            {product ? `৳${product.basePrice}` : 'Pakundia'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-2.5 shadow-xs">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white truncate">
              Pakundia Local
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              ৳40 Express Van
            </div>
          </div>
        </div>
        <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-2.5 shadow-xs">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white truncate">
              Verified Shop
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Pakundia Bazar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
