'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '../lib/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import { ShoppingCart, Check, Sparkles } from 'lucide-react';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  );
  const [added, setAdded] = useState(false);

  const activePrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const inStock = activeStock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      productTitle: product.title,
      variantName: selectedVariant?.name || null,
      unitPrice: activePrice,
      image: product.images[0] || '/products/2412.jpg',
      unit: product.unit,
      maxStock: activeStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative group transition">
      {/* Top Category & Vendor Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-500 dark:text-amber-400 text-[10px] font-black tracking-wide uppercase truncate">
          {product.category?.name || 'Hardware'}
        </span>
        {product.vendor && (
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
            {product.vendor}
          </span>
        )}
      </div>

      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/60 mb-4 border border-slate-200 dark:border-slate-800/80 group-hover:border-amber-500/40 transition">
        <img
          src={product.images[0] || '/products/2412.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Product Title & Unit Details */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
        </div>

        {/* Variants Selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="pt-2">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block mb-1">
              Select {product.unit}:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition ${
                    selectedVariant?.id === v.id
                      ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-3">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Retail Price</span>
            <span className="text-base font-black text-amber-500 dark:text-amber-400 font-mono">
              {formatCurrency(activePrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-md ${
              !inStock
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Buy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
