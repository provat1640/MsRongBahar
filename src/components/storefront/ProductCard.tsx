'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  let imageUrl = '/products/2412.jpg';
  try {
    if (product.images) {
      const parsed = typeof product.images === 'string' && product.images.startsWith('[')
        ? JSON.parse(product.images)
        : product.images;
      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
      else if (typeof parsed === 'string') imageUrl = parsed;
    }
  } catch (e) {
    if (typeof product.images === 'string') imageUrl = product.images;
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const isLowStock = currentStock > 0 && currentStock <= 5;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col">
      {/* Product Image & Badges */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-slate-950 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/products/2412.jpg';
          }}
        />

        {/* Stock Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 bg-red-600/90 backdrop-blur text-white text-[11px] font-bold rounded-md shadow flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur text-slate-950 text-[11px] font-bold rounded-md shadow flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Only {currentStock} left!
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur text-white text-[11px] font-bold rounded-md shadow flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> In Stock
            </span>
          )}
        </div>

        {/* Category & Unit Indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.category && (
            <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] font-semibold rounded border border-slate-700">
              {product.category.name}
            </span>
          )}
          {product.unit && (
            <span className="px-2 py-0.5 bg-amber-500/90 text-slate-950 text-[10px] font-black rounded shadow flex items-center gap-1">
              <Layers className="w-3 h-3" /> {product.unit}
            </span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-100 line-clamp-2 hover:text-amber-400 transition">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Interactive Sub-Unit Selector Pills (e.g. 50mm, 60mm, 70mm / 125g, 500g, 1kg) */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Select Size / Sub-Unit:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className={isSelected ? 'text-slate-950 font-black' : 'text-amber-400 font-bold'}>
                      ৳{v.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Add Sub-Unit to Cart Action */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">
              {selectedVariant ? selectedVariant.name : 'Selected Price'}
            </span>
            <span className="text-base font-black text-amber-500">
              ৳{currentPrice.toLocaleString('en-BD')}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, selectedVariant)}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Sub-Unit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
