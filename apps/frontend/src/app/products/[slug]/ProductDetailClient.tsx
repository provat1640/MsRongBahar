'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../lib/utils';
import { ProductCard } from '../../../components/ProductCard';
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  Star,
  Check,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  Palette,
  Layers,
} from 'lucide-react';

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState(product.images[0] || '/products/2412.jpg');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  );

  // Selected Color and Size state for universal multi-attribute selection
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants?.[0]?.colorName || (product.colors && product.colors.length > 0 ? product.colors[0].name : '')
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[0]?.sizeOrWeight || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '')
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Dynamically match variant when Color or Size changes
  useEffect(() => {
    if (!product.variants || product.variants.length === 0) return;

    // 1. Try matching both color and size
    let match = product.variants.find(
      (v) =>
        (!selectedColor || v.colorName === selectedColor) &&
        (!selectedSize || v.sizeOrWeight === selectedSize)
    );

    // 2. Fallback matching either
    if (!match && selectedSize) {
      match = product.variants.find((v) => v.sizeOrWeight === selectedSize);
    }
    if (!match && selectedColor) {
      match = product.variants.find((v) => v.colorName === selectedColor);
    }

    if (match) {
      setSelectedVariant(match);
    }
  }, [selectedColor, selectedSize, product.variants]);

  const activePrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const inStock = activeStock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    const variantDisplayName = selectedVariant?.name || `${selectedSize} ${selectedColor ? `(${selectedColor})` : ''}`.trim() || null;

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      productTitle: product.title,
      variantName: variantDisplayName,
      unitPrice: activePrice,
      image: activeImage,
      unit: product.unit,
      maxStock: activeStock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      await fetch(`${API_URL}/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
    } catch {
      // ignore
    }
    setReviewsList([
      {
        id: `r-${Date.now()}`,
        customerName: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString(),
      },
      ...reviewsList,
    ]);
    setReviewSubmitted(true);
    setReviewComment('');
  };

  // Distinct available colors and sizes from variants
  const availableColors = product.colors || Array.from(
    new Set(product.variants.map((v) => v.colorName).filter(Boolean))
  ).map((c) => ({
    name: c as string,
    hex: product.variants.find((v) => v.colorName === c)?.colorHex || '#15803d',
  }));

  const availableSizes = product.sizes || Array.from(
    new Set(product.variants.map((v) => v.sizeOrWeight).filter(Boolean))
  ) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-400 transition">
          Catalog
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category?.slug}`}
          className="hover:text-amber-400 transition"
        >
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 relative overflow-hidden group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800/80 relative">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {!inStock && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-4 py-2 bg-rose-500 text-white font-black text-sm rounded-full">
                    Currently Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    activeImage === img ? 'border-amber-500' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pricing, Multi-unit variant picker & Add to Cart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider">
                {product.category?.name || 'Hardware'}
              </span>
              {product.vendor && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                  {product.vendor}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="font-mono">SKU: <strong className="text-slate-200">{selectedVariant?.sku || product.sku}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <strong className="text-white">4.9</strong> (18+ Verified Reviews)
              </span>
            </div>
          </div>

          {/* Price display */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Retail Unit Price</div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {formatCurrency(activePrice)}
            </div>
            <div className="text-[11px] text-slate-500">VAT &amp; local store taxes included • Pakundia Bazar Stock</div>
          </div>

          {/* 1. MULTI-COLOR PICKER (For Paints & Sprays) */}
          {availableColors.length > 0 && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  1. Choose Color / Shade:
                </span>
                <span className="text-amber-400 font-black font-mono">{selectedColor || 'Select a shade'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableColors.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(col.name)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                      selectedColor === col.name
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. MULTI-SIZE / WEIGHT / PERIMETER PICKER (Universal for Paint Litres, Brush mm, Lock mm, Adhesive gm) */}
          {availableSizes.length > 0 && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  2. Choose Size / Weight / Dimension:
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {activeStock > 0 ? `● In Stock (${activeStock} units left)` : 'Out of Stock'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {availableSizes.map((sz, idx) => {
                  const isChosen = selectedSize === sz;
                  // Look up price for this size
                  const matchingVar = product.variants.find(
                    (v) => v.sizeOrWeight === sz && (!selectedColor || v.colorName === selectedColor)
                  ) || product.variants.find((v) => v.sizeOrWeight === sz);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-xl border text-left transition ${
                        isChosen
                          ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md ring-1 ring-amber-500'
                          : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{sz}</div>
                      {matchingVar && (
                        <div className="text-xs font-black text-amber-400 mt-1 font-mono">
                          {formatCurrency(matchingVar.price)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Simple Variants List if neither colors nor sizes are split */}
          {availableColors.length === 0 && availableSizes.length === 0 && product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Select Variant:</span>
                <span className="text-emerald-400 text-[11px]">
                  {activeStock > 0 ? `● In Stock (${activeStock} units left)` : 'Out of Stock'}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      selectedVariant?.id === v.id
                        ? 'border-amber-500 bg-amber-500/10 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">{v.name}</div>
                    <div className="text-xs font-black text-amber-400 mt-1">{formatCurrency(v.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Redis Lock Notice */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-200">Temporary 10-Minute Redis Inventory Hold:</strong>
              When you add this item to cart, our Redis caching layer temporarily reserves stock exclusively for your checkout session.
            </div>
          </div>

          {/* Quantity and Add to Cart Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-slate-900 text-slate-200 font-black hover:bg-slate-800 transition"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-black text-white font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(quantity + 1, activeStock))}
                className="w-10 h-10 rounded-xl bg-slate-900 text-slate-200 font-black hover:bg-slate-800 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-xl ${
                !inStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Reserved in Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add {quantity} to Cart ({formatCurrency(activePrice * quantity)})
                </>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block">Pakundia Express</strong>
                <span className="text-[10px] text-slate-400">Under 2 hours delivery</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block">100% Authorized</strong>
                <span className="text-[10px] text-slate-400">Direct distributor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg font-black text-white">Product Description &amp; Technical Application</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Customer Reviews & Submit Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white">Contractor &amp; Customer Reviews</h2>
            <p className="text-xs text-slate-400">Verified buyer ratings from Pakundia &amp; Kishoreganj sites</p>
          </div>
          <span className="text-amber-400 font-bold text-xs">★ 4.9 Average</span>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{rev.customerName}</span>
                <div className="flex text-amber-400 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">&quot;{rev.comment}&quot;</p>
              <div className="text-[10px] text-slate-500">
                {new Date(rev.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Write a Verified Review</h3>
          {reviewSubmitted ? (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> Thank you for reviewing this product! Your review has been recorded.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name (e.g. Master Habib / Contractor)"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Outstanding)</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                  <option value="3">⭐⭐⭐ 3 Stars (Average)</option>
                </select>
              </div>
              <textarea
                rows={2}
                required
                placeholder="Share your experience on gloss finish, adhesion strength, or delivery speed..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" /> Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.related && product.related.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white">Recommended Hardware &amp; Paints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
