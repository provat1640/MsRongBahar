'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../lib/api';
import { ProductCard } from './ProductCard';

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

          let combined = [...uniqueCustom, ...initialProducts];
          if (type === 'new-arrivals') {
            const arrivals = combined.filter((p) => p.isNewArrival);
            setProducts(arrivals.length > 0 ? arrivals.slice(0, 4) : combined.slice(0, 4));
          } else {
            setProducts(combined.slice(0, 8));
          }
          return;
        }
      }
    } catch {}
    setProducts(initialProducts);
  }, [initialProducts, type]);

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
