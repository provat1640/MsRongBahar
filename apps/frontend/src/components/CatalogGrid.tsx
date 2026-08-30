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
  const [allStoreProducts, setAllStoreProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const stored = localStorage.getItem('rong_bahar_products_list');
        let customList: Product[] = [];
        if (stored) {
          customList = JSON.parse(stored);
        }
        const cleanCustom = Array.isArray(customList)
          ? customList.filter((p: Product) => !['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'].includes(p.id))
          : [];

        const serverIds = new Set(initialProducts.map((p) => p.id));
        const uniqueCustom = cleanCustom.filter((p) => !serverIds.has(p.id));
        const combined = [...uniqueCustom, ...initialProducts];
        setAllStoreProducts(combined);

        let filtered = [...combined];

        if (categoryFilter) {
          const cat = categoryFilter.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.category?.slug?.toLowerCase() === cat ||
              p.categoryId?.toLowerCase() === cat ||
              p.category?.name?.toLowerCase() === cat ||
              p.category?.id?.toLowerCase() === cat,
          );
        }

        if (searchFilter) {
          const q = searchFilter.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.vendor?.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q),
          );
        }

        setProducts(filtered);
      } catch {
        setProducts(initialProducts);
      }
    };

    loadProducts();
    window.addEventListener('rong_bahar_products_changed', loadProducts);
    window.addEventListener('storage', loadProducts);
    return () => {
      window.removeEventListener('rong_bahar_products_changed', loadProducts);
      window.removeEventListener('storage', loadProducts);
    };
  }, [initialProducts, categoryFilter, searchFilter]);

  if (products.length === 0) {
    if (allStoreProducts.length > 0) {
      return (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                No items found for &quot;{categoryFilter || searchFilter}&quot;.
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">
                Showing all {allStoreProducts.length} live products currently in store:
              </span>
            </div>
            <Link
              href="/products"
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs w-fit transition shadow-xs"
            >
              Clear Filter
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allStoreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="glass-panel rounded-3xl p-12 sm:p-16 text-center space-y-4 border border-slate-200 dark:border-slate-800">
        <Filter className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Store Catalog Ready for Real Products</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Start uploading items from your store using your camera or gallery in the Store Manager Panel.
        </p>
        <Link
          href="/admin"
          className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:bg-amber-400 transition"
        >
          + Add Products with Camera
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
