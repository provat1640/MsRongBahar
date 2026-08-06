'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CheckCircle, AlertTriangle, ShieldCheck, Truck, Plus, Minus, ArrowRight, Layers } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/lib/cart-context';

interface ProductDetailClientProps {
  product: Product;
  images: string[];
}

export default function ProductDetailClient({ product, images }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const formattedImages = images.length > 0 ? images : ['/products/2412.jpg'];
  const [selectedImage, setSelectedImage] = useState(formattedImages[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const isLowStock = currentStock > 0 && currentStock <= 5;
  const isOutOfStock = currentStock === 0;

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/products/2412.jpg';
            }}
          />

          <div className="absolute top-4 left-4">
            {isOutOfStock ? (
              <span className="px-3 py-1.5 bg-red-600/90 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Low Stock ({currentStock} Left!)
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> In Stock at M/S Rong Bahar
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {formattedImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {formattedImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                  selectedImage === img ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info & Sub-Unit Selection */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2">
          {product.category && (
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-md border border-amber-500/20 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-white">{product.title}</h1>
          <p className="text-xs text-slate-400">SKU Code: <span className="text-slate-200 font-mono">{selectedVariant ? selectedVariant.sku : product.sku}</span></p>
        </div>

        {/* Selected Sub-Unit Price Badge */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">
              Selected Sub-Unit: <strong className="text-white">{selectedVariant ? selectedVariant.name : 'Standard'}</strong>
            </span>
            <span className="text-3xl font-black text-amber-500">৳{currentPrice.toLocaleString('en-BD')}</span>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1">
            <Layers className="w-4 h-4" /> {product.unit || 'Sub-Unit'}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Product Description & Specifications</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            {product.description}
          </p>
        </div>

        {/* Interactive Sub-Unit Variant Selector Module */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Select Sub-Unit Size / Dimension:
              </label>
              <span className="text-[11px] text-slate-400">Click any size to update price</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-start transition border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg font-bold scale-[1.02]'
                        : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm">{v.name}</span>
                    <span className={isSelected ? 'text-slate-950 font-black text-base' : 'text-amber-400 font-bold text-sm'}>
                      ৳{v.price.toLocaleString('en-BD')}
                    </span>
                    <span className={`text-[10px] mt-1 ${v.stock <= 5 ? 'text-red-400 font-bold' : 'opacity-70'}`}>
                      {v.stock <= 5 ? `Only ${v.stock} left!` : `Stock: ${v.stock}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Quantity</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-slate-400 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-400">Total Payable: <strong className="text-amber-400 text-base">৳{(currentPrice * quantity).toLocaleString('en-BD')}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => addToCart(product, selectedVariant, quantity)}
            disabled={isOutOfStock}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5" /> Add Selected Sub-Unit
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-xl ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
            }`}
          >
            Buy Sub-Unit Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Local Delivery to Pakundia & BD (৳60)</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>COD & bKash / Nagad Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
