'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Phone, Paintbrush, Menu, X, ShieldAlert } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      {/* Top Urgent Info Helpline Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Phone className="w-3.5 h-3.5" /> Hotline: 01621962897
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline">Mothkhola Road, Pakundia, Kishoreganj</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium hidden md:inline">✓ Cash on Delivery & bKash / Nagad Accepted</span>
            <Link href="/admin" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <Paintbrush className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              M/S RONG BAHAR <span className="text-amber-500 text-xs px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded">BD</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Pakundia, Kishoreganj</p>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search paints, locks, varnish, brushes, hammers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 pl-4 pr-11 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition font-bold flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition text-sm font-medium"
          >
            <User className="w-4 h-4 text-amber-500" />
            <span>Account</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-md transition text-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 bg-red-600 text-white rounded-full text-xs font-black flex items-center justify-center border-2 border-slate-900">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Navigation Bar */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-slate-800 pt-3 space-y-3 bg-slate-900">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search paints, locks, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-4 pr-11 text-sm text-slate-100"
            />
            <button type="submit" className="absolute right-2 top-2 p-1.5 bg-amber-500 text-slate-950 rounded-lg">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link href="/products" className="p-2.5 bg-slate-800 rounded-lg text-center text-slate-200">
              All Catalog
            </Link>
            <Link href="/products?category=architectural-paints-and-coatings" className="p-2.5 bg-slate-800 rounded-lg text-center text-slate-200">
              Paints & Coatings
            </Link>
            <Link href="/products?category=security-hardware" className="p-2.5 bg-slate-800 rounded-lg text-center text-slate-200">
              Locks & Security
            </Link>
            <Link href="/login" className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg text-center">
              Account / Login
            </Link>
          </div>
        </div>
      )}

      {/* Category Sub-Nav (Desktop) */}
      <div className="hidden md:block bg-slate-950/60 border-t border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-6">
            <Link href="/products" className="hover:text-amber-500 transition">
              All Catalog
            </Link>
            <Link href="/products?category=architectural-paints-and-coatings" className="hover:text-amber-500 transition flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Paints & Coatings
            </Link>
            <Link href="/products?category=adhesives-and-chemicals" className="hover:text-amber-500 transition flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Fevicol Adhesives
            </Link>
            <Link href="/products?category=security-hardware" className="hover:text-amber-500 transition flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> HMBR Locks
            </Link>
          </div>
          <div className="text-slate-400">
            Open Daily: <span className="text-slate-200">8:00 AM - 10:00 PM</span>
          </div>
        </div>
      </div>
    </header>
  );
}
