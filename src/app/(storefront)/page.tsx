import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Paintbrush, ArrowRight, Phone } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/storefront/ProductCard';

export const revalidate = 0;

export default async function HomePage() {
  const categories = await prisma.category.findMany();
  const popularProducts = await prisma.product.findMany({
    take: 8,
    where: { isActive: true },
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 pt-12 pb-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wide">
              <Paintbrush className="w-3.5 h-3.5" /> Hardware & Paint Hub Pakundia, Kishoreganj
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Quality Paints & Hardware <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                Delivered Direct to Site
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              M/S Rong Bahar provides authentic Berger emulsions, high gloss enamel, anti-corrosive red oxide, clear varnishes, Fevicol 1K PUR, HMBR padlocks & contractor tools.
            </p>

            {/* Quick Hero Search Input */}
            <form action="/products" method="GET" className="max-w-xl mx-auto lg:mx-0 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="q"
                  placeholder="Search Berger enamel, HMBR lock, Fevicol PUR, brush..."
                  className="w-full bg-slate-950/90 border-2 border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-100 placeholder-slate-400 outline-none transition shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shrink-0 flex items-center gap-2 text-sm"
              >
                Search Catalog
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs font-semibold text-slate-400">
              <span className="text-slate-500">Popular:</span>
              <Link href="/products?q=Berger" className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 transition">
                Berger Enamel
              </Link>
              <Link href="/products?q=Fevicol" className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 transition">
                Fevicol 1K PUR
              </Link>
              <Link href="/products?q=HMBR" className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 transition">
                HMBR Padlock
              </Link>
              <Link href="/products?q=Aqua" className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 transition">
                Aqua Rangila
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">M/S Rong Bahar Shop</h3>
                  <p className="text-xs text-amber-400">Mothkhola Road, Pakundia, Kishoreganj</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                  In Stock
                </span>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src="/products/2412.jpg"
                  alt="M/S Rong Bahar Shop"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Fast Local Delivery</span>
                  <span className="font-bold text-slate-100">Pakundia & Kishoreganj</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Payment Options</span>
                  <span className="font-bold text-emerald-400">COD & bKash / Nagad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Shop by Category</h2>
            <p className="text-xs text-slate-400 mt-1">Browse hardware, paint finishes & contractor supplies</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/60 shadow-lg transition-all duration-300 flex flex-col justify-end p-6"
            >
              <img
                src={cat.image || '/products/2412.jpg'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40 group-hover:opacity-50"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Department
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hardware Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Hardware & Paints</h2>
            <p className="text-xs text-slate-400 mt-1">Top demanded products at M/S Rong Bahar retail shop</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
            Explore All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* Contractor & Bulk Order Callout Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 lg:p-12 text-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="px-3 py-1 bg-slate-950 text-amber-400 rounded-full text-xs font-black uppercase tracking-wider">
              Pakundia Contractor Special Rate
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Need Bulk Paint Drums, Locks, or Construction Glue?
            </h2>
            <p className="text-slate-900 font-medium text-sm sm:text-base">
              Call shop management directly for contractor discount rates on Berger enamel, Fevicol PUR, HMBR locks, or project supplies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="tel:+8801722452836"
              className="px-6 py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black rounded-2xl shadow-xl transition flex items-center gap-2 text-sm"
            >
              <Phone className="w-5 h-5 fill-current" /> Call 01722452836
            </a>
            <a
              href="https://wa.me/8801722452836"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-xl transition text-sm flex items-center gap-2"
            >
              WhatsApp Quote (01722452836)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
