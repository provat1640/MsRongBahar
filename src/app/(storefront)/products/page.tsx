import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/storefront/ProductCard';
import { Filter, SlidersHorizontal, Search, RotateCcw, PackageX } from 'lucide-react';

export const revalidate = 0;

interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category, minPrice, maxPrice, inStock, sort } = searchParams;

  const categories = await prisma.category.findMany();

  const where: any = { isActive: true };

  if (q && q.trim()) {
    const cleanQ = q.trim();
    where.OR = [
      { title: { contains: cleanQ } },
      { description: { contains: cleanQ } },
      { sku: { contains: cleanQ } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) where.basePrice.gte = parseFloat(minPrice);
    if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
  }

  if (inStock === 'true') {
    where.stock = { gt: 0 };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
  if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
  if (sort === 'popular') orderBy = { stock: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      variants: true,
    },
  });

  const activeCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <span className="text-slate-200">Product Catalog</span>
          {activeCategoryObj && (
            <>
              <span>/</span>
              <span className="text-amber-400 font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Hardware & Product Catalog</h1>
        <p className="text-xs text-slate-400">
          Showing {products.length} products available for immediate order at M/S Rong Bahar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-fit shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500" /> Filter Options
            </h3>
            <Link href="/products" className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Clear All
            </Link>
          </div>

          {/* Search Input */}
          <form method="GET" action="/products" className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={q || ''}
                placeholder="Search paints, locks, spray..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-amber-400">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Categories</label>
            <div className="space-y-1.5 text-xs">
              <Link
                href={`/products?${new URLSearchParams({ ...(q ? { q } : {}), category: '' }).toString()}`}
                className={`block px-3 py-2 rounded-xl transition ${
                  !category ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                All Departments
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?${new URLSearchParams({ ...(q ? { q } : {}), category: c.slug }).toString()}`}
                  className={`block px-3 py-2 rounded-xl transition ${
                    category === c.slug ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* In Stock Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">Availability</label>
            <div className="flex items-center gap-2">
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, inStock: inStock === 'true' ? '' : 'true' }).toString()}`}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl border w-full transition ${
                  inStock === 'true'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Only Show In-Stock Items</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid & Sorting */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">
              Showing <span className="text-white font-bold">{products.length}</span> items
            </span>

            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span className="text-slate-400">Sort by:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <Link
                  href={`/products?${new URLSearchParams({ ...searchParams, sort: 'latest' }).toString()}`}
                  className={`px-2.5 py-1 rounded-lg transition ${!sort || sort === 'latest' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Latest
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({ ...searchParams, sort: 'price_asc' }).toString()}`}
                  className={`px-2.5 py-1 rounded-lg transition ${sort === 'price_asc' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({ ...searchParams, sort: 'price_desc' }).toString()}`}
                  className={`px-2.5 py-1 rounded-lg transition ${sort === 'price_desc' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>

          {/* Products Grid or Robust Empty Fallback State */}
          {products.length === 0 ? (
            <div className="py-16 px-6 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-full inline-block text-amber-500">
                <PackageX className="w-12 h-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No products found matching your search</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  We couldn&apos;t find any products for {q ? <strong className="text-amber-400">&quot;{q}&quot;</strong> : 'the selected filters'}
                  {activeCategoryObj ? ` in category "${activeCategoryObj.name}"` : ''}.
                </p>
              </div>

              {/* Reset Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {q && category && (
                  <Link
                    href={`/products?q=${encodeURIComponent(q)}`}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 transition"
                  >
                    Search &quot;{q}&quot; in All Categories
                  </Link>
                )}
                <Link
                  href="/products"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
