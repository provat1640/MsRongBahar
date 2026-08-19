import React from 'react';
import Link from 'next/link';
import { fetchProducts, fetchCategories } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
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
  PlusCircle,
} from 'lucide-react';

export default async function HomePage() {
  const products = await fetchProducts();
  const categories = await fetchCategories();
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800/80">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[450px] h-[320px] bg-emerald-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authorized Berger Paints &amp; Industrial Hardware Dealer</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] drop-shadow-xs">
                Authentic Paints, <br />
                <span className="gradient-text font-black">Industrial Hardware</span> &amp; Glues.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Direct authorized distributor in Pakundia Bazar for Berger Robbialac synthetic enamels, Aqua Paints CNG Green, Fevicol 1K PUR waterproof adhesives, JM lacquer spray cans, and HMBR security padlocks.
              </p>

              {/* Action Buttons with Shop Berger & Shop Aqua */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-sm transition shadow-xl shadow-amber-500/25 flex items-center gap-2"
                >
                  Browse Full Catalog <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products?category=synthetic-enamel-paints"
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 dark:border-slate-800 font-bold text-sm transition flex items-center gap-2 shadow-md"
                >
                  <Paintbrush className="w-4 h-4 text-amber-400" />
                  Shop Berger Paints
                </Link>

                {/* Shop Aqua Paints Button */}
                <Link
                  href="/products?search=Aqua"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/25 border border-emerald-400/40"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Shop Aqua Paints
                </Link>
              </div>

              {/* Quick stats */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">100%</div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Original Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">2 Hours</div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Local Delivery</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">12+ Cats</div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Paints &amp; Tools</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="glass-panel rounded-3xl p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative border border-slate-200 dark:border-slate-800">
                  <img
                    src="/products/2412.jpg"
                    alt="Berger Robbialac Paints"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-white">
                    <div>
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Featured Item</div>
                      <div className="text-xs font-black text-white">Berger Robbialac Synthetic Enamel</div>
                    </div>
                    <span className="text-xs font-black text-amber-400 font-mono">From ৳240</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2.5 shadow-xs">
                    <Truck className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">Pakundia Local</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">৳40 Express Van</div>
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2.5 shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">Verified Shop</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Pakundia Bazar</div>
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">✨ New Arrivals &amp; Fresh Inventory</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Browse All ({newArrivals.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute -top-2 left-4 z-20 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
                ★ New Arrival
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORIES GRID */}
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

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider block mb-1">
              In Stock &amp; Ready for Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Featured Hardware &amp; Paints</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            View All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. VALUE-ADD PROMO BANNER (Express Delivery & Visualizer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Express Local Pakundia Delivery */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Pakundia 2-Hour Express Delivery</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Fast local motorcycle and van dispatch across Pakundia Bazar, Mothkhola Road, and neighboring unions in under 2 hours.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline"
              >
                Browse Available Store Stock <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: 3D Color Visualizer */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Berger &amp; Aqua Wall Color Visualizer</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Preview real-world shades including Berger CNG Green, Silk Coral, and WeatherCoat Pearl White on perspective walls before ordering your cans.
            </p>
            <div className="pt-2">
              <Link
                href="/products?category=synthetic-enamel-paints"
                className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Explore Paint Color Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 🌟 CUSTOMER REVIEWS & CONTRACTOR FEEDBACK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4" /> Customer &amp; Contractor Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">What Pakundia Customers Say</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">4.9 / 5.0 (150+ Verified Orders)</span>
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
