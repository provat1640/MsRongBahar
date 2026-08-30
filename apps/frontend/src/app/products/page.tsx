import React from 'react';
import { fetchProducts, fetchCategories } from '../../lib/api';
import { ProductCard } from '../../components/ProductCard';
import { CatalogGrid } from '../../components/CatalogGrid';
import { sortCategoriesDFS } from '../../lib/graphEngine';
import Link from 'next/link';
import { Filter, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface Props {
  searchParams: {
    category?: string;
    unit?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ProductsCatalogPage({ searchParams }: Props) {
  const products = await fetchProducts(searchParams);
  const rawCategories = await fetchCategories();
  const categories = sortCategoriesDFS(rawCategories);

  const selectedCategory = searchParams.category || '';
  const selectedUnit = searchParams.unit || '';
  const searchQuery = searchParams.search || '';
  const initialSort = searchParams.sort || 'intelligent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/" className="hover:text-amber-500 dark:hover:text-amber-400">Home</Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-200">Catalog</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold capitalize">{selectedCategory.replace(/-/g, ' ')}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {selectedCategory ? `${selectedCategory.replace(/-/g, ' ').toUpperCase()} Catalog` : 'Hardware & Paint Catalog'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showing {products.length} products available for immediate Pakundia local dispatch
          </p>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white text-xs font-bold transition w-fit shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
            !selectedCategory
              ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          All Products
        </Link>
        {categories.map((cat: any) => (
          <Link
            key={cat.slug || cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedCategory === cat.slug
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Main Grid with Dynamic Client Synchronization */}
      <CatalogGrid
        initialProducts={products}
        categoryFilter={selectedCategory}
        searchFilter={searchQuery}
      />
    </div>
  );
}
