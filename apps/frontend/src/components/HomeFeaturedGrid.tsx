'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../lib/api';
import { ProductCard } from './ProductCard';
import { Package, Camera } from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialProducts: Product[];
  type?: 'new-arrivals' | 'featured';
}

export function HomeFeaturedGrid({ initialProducts, type = 'featured' }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rong_bahar_products_list');
      if (stored) {
        const customList: Product[] = JSON.parse(stored);
        if (Array.isArray(customList) && customList.length > 0) {
          const serverIds = new Set(initialProducts.map((p) => p.id));
          const uniqueCustom = customList.filter((p) => !serverIds.has(p.id));

          const combined = [...uniqueCustom, ...initialProducts];
          if (type === 'new-arrivals') {
            const arrivals = combined.filter((p) => p.isNewArrival);
            setProducts(arrivals.length > 0 ? arrivals.slice(0, 4) : combined.slice(0, 4));
          } else {
            setProducts(combined.slice(0, 8));
          }
          return;
        } else {
          setProducts([]);
          return;
        }
      }
    } catch {}
    setProducts(initialProducts);
  }, [initialProducts, type]);

  if (products.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <Package className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {type === 'new-arrivals' ? 'New Arrivals Ready for Store Inventory' : 'Store Catalog Ready for Real Products'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Take product photos using your camera or upload from your device gallery in the Store Manager Panel to display live store items here.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md"
        >
          <Camera className="w-4 h-4" /> Start Adding Products with Camera
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <div key={product.id} className="relative">
          {type === 'new-arrivals' && (
            <div className="absolute -top-2 left-4 z-20 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
              ★ New Arrival
            </div>
          )}
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
