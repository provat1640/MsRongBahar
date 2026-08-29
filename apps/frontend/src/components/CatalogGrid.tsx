'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../lib/api';
import { ProductCard } from './ProductCard';
import { Filter } from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialProducts: Product[];
  categoryFilter?: string;
  searchFilter?: string;
}

export function CatalogGrid({ initialProducts, categoryFilter, searchFilter }: Props) {
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

          if (categoryFilter) {
            combined = combined.filter(
              (p) =>
                p.category?.slug === categoryFilter ||
                p.categoryId === categoryFilter ||
                p.category?.name?.toLowerCase() === categoryFilter.toLowerCase(),
            );
          }

          if (searchFilter) {
            const q = searchFilter.toLowerCase();
            combined = combined.filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.vendor?.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q),
            );
          }

          setProducts(combined);
        }
      }
    } catch {
      // fallback
    }
  }, [initialProducts, categoryFilter, searchFilter]);

  if (products.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-16 text-center space-y-4">
        <Filter className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We couldn&apos;t find any items matching your filter criteria. Try resetting your search or request an unlisted product.
        </p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
        >
          Clear Filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
