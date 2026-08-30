import React from 'react';
import Link from 'next/link';
import { fetchProducts, fetchCategories } from '../lib/api';
import { HomeFeaturedGrid } from '../components/HomeFeaturedGrid';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Paintbrush,
  Layers,
  Wrench,
  Lock,
  Palette,
  Star,
  CheckCircle2,
  Flame,
  MessageSquareQuote,
  Clock,
  Wand2,
  Cpu,
  Phone,
  Droplets,
  Atom,
} from 'lucide-react';

export default async function HomePage() {
  const products = await fetchProducts();
  const categories = await fetchCategories();

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION (Luxury Aesthetics & Glare-Free) */}
      <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-18 lg:pt-18 lg:pb-22 border-b border-slate-200 dark:border-slate-800/80 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-black tracking-wide shadow-xs max-w-full">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Authorized Berger Paints &amp; Hardware Superstore</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.1]">
                Authentic Paints, <br className="hidden sm:inline" />
                <span className="text-amber-500 dark:text-amber-400 font-black">Industrial Hardware</span> &amp; Glues.
              </h1>

              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Direct authorized distributor in Pakundia Bazar for Berger Robbialac synthetic enamels, Aqua Paints CNG Green, Fevicol 1K PUR waterproof adhesives, JM lacquer spray cans, and HMBR security padlocks.
              </p>

              {/* Action Buttons with Shop Berger & Shop Aqua */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  Browse Full Catalog <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/products?category=synthetic-enamel-paints"
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 dark:border-slate-800 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Paintbrush className="w-4 h-4 text-amber-400" />
                    <span>Shop Berger</span>
                  </Link>

                  {/* Shop Aqua Paints Button */}
                  <Link
                    href="/products?search=Aqua"
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs border border-emerald-400/40"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Shop Aqua</span>
                  </Link>
                </div>
              </div>

              {/* Quick stats (Compact & non-breaking on all phones) */}
              <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-around sm:justify-start sm:gap-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">
                    100%
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                    Original Stock
                  </div>
                </div>
                <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                    2-Hour
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                    Local Delivery
                  </div>
                </div>
                <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                    🛡️ AutoHeal
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                    Self-Repairing
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="glass-panel rounded-3xl p-4 sm:p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative border border-slate-200 dark:border-slate-800">
                  <img
                    src="/products/2412.jpg"
                    alt="Berger Robbialac Paints"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 p-2.5 sm:p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-white">
                    <div className="min-w-0 pr-2">
                      <div className="text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        Featured Item
                      </div>
                      <div className="text-[11px] sm:text-xs font-black text-white truncate">
                        Berger Robbialac Synthetic Enamel
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-black text-amber-400 font-mono shrink-0">
                      From ৳240
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-2.5 shadow-xs">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        Pakundia Local
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        ৳40 Express Van
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-2.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        Verified Shop
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Pakundia Bazar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ✨ NEW ARRIVALS & FRESH INVENTORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wide uppercase mb-2">
              <Flame className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              Fresh Pakundia Stock
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ✨ New Arrivals &amp; Fresh Inventory
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HomeFeaturedGrid initialProducts={products} type="new-arrivals" />
      </section>

      {/* 5. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider block mb-1">
              Organized Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Shop By Category</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: any) => (
            <Link
              key={cat.slug || cat.id}
              href={`/products?category=${cat.slug}`}
              className="glass-panel glass-panel-hover rounded-2xl p-4 flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 group-hover:border-amber-500/50 transition">
                <img
                  src={cat.image || '/products/2412.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider block mb-1">
              In Stock &amp; Ready for Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Featured Hardware &amp; Paints
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HomeFeaturedGrid initialProducts={products} type="featured" />
      </section>

      {/* 7. ⚡ RAW EXECUTION & SELF-HEALING ARCHITECTURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black tracking-wide uppercase">
                <Atom className="w-3.5 h-3.5" />
                Raw Execution Engine &amp; Self-Healing Infrastructure
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Engineered for High Concurrency, Atomic Locks &amp; Auto-Repair
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                M/S Rong Bahar is backed by Redis distributed atomic lock sessions, PostgreSQL ACID isolation, and an autonomous Self-Healing runtime that silently neutralizes anomalies, recovers corrupted states, and generates dynamic asset fallbacks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 text-white border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Redis Lock Hold</span>
                <div className="text-lg font-black text-amber-300">~1.2 ms TTL</div>
                <div className="text-[9px] text-slate-400">Atomic Stock Reservation</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 text-white border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Self-Healing Status</span>
                <div className="text-lg font-black text-emerald-300">100% Guarded</div>
                <div className="text-[9px] text-slate-400">AutoDoctor Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 🌟 CUSTOMER REVIEWS & CONTRACTOR FEEDBACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4" /> Customer &amp; Contractor Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              What Pakundia Customers Say
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              4.9 / 5.0 (150+ Verified Orders)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ✓ Verified Order
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
              &quot;M/S Rong Bahar delivered 4 gallons of Berger Robbialac to my site in Mothkhola in less than 2 hours. 100% original product with deep high-gloss shine.&quot;
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900 dark:text-white">Kabir Ahmed</span>
              <span className="text-slate-500">Building Contractor, Pakundia</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ✓ Verified Order
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
              &quot;The Fevicol 1K PUR is genuine moisture-curing polyurethane. Perfect waterproof bond for our custom hardwood furniture and door fittings.&quot;
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900 dark:text-white">Salam Carpenter</span>
              <span className="text-slate-500">Pakundia Bazar Workshop</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ✓ Verified Order
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
              &quot;HMBR heavy steel padlocks provide great security for shop shutters. Ordering online and paying with bKash was seamless. Tracking invoice was exact.&quot;
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900 dark:text-white">Mahmudul Hasan</span>
              <span className="text-slate-500">Local Business Owner</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
