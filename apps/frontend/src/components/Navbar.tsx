'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ColorVisualizerModal } from './ColorVisualizerModal';
import { RequestItemModal } from './RequestItemModal';
import { AuthModal } from './AuthModal';
import {
  ShoppingCart,
  Search,
  Palette,
  ClipboardList,
  Truck,
  ShieldCheck,
  User,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar() {
  const { itemCount, reservationTimeLeft } = useCart();
  const { user, isAdmin, openAuthModal, logout } = useAuth();

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);

  // Load Day / Night mode from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('rong_bahar_theme_mode');
      if (savedTheme === 'light') {
        setIsLightMode(true);
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        setIsLightMode(false);
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleThemeMode = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rong_bahar_theme_mode', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('rong_bahar_theme_mode', 'dark');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Top Banner for Local Pakundia Delivery Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-inner">
        <Truck className="w-3.5 h-3.5" />
        <span>Pakundia Bazar &amp; Mothkhola Express Delivery: Under 2 Hours! Call Hotline: 01722-452836</span>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.jpg"
              alt="M/S Rong Bahar Logo"
              className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40 shadow-lg glow-amber"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                M/S Rong Bahar <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">PRO</span>
              </span>
              <span className="text-[11px] text-slate-400 block font-medium">Paint, Hardware &amp; Sanitary Superstore</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              placeholder="Search Berger enamel, Fevicol PUR, spray paints, locks..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
          </div>

          {/* Quick Action Tools & Triggers */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 transition"
              title={isLightMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {isLightMode ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Color Visualizer Trigger */}
            <button
              onClick={() => setIsColorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition shadow-sm"
              title="Interactive Modern Room & Surface Color Visualizer"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Color Visualizer</span>
            </button>

            {/* Request Unlisted Item */}
            <button
              onClick={() => setIsRequestOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 text-xs font-bold transition"
              title="Request unlisted paint/hardware"
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Item</span>
            </button>

            {/* Order Tracker */}
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 text-xs font-bold transition"
              title="Track Order & Invoices"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Track Order</span>
            </Link>

            {/* Live Cart with Redis Reservation Indicator */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="bg-slate-950 text-amber-400 text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-[18px] text-center">
                {itemCount}
              </span>
              {reservationTimeLeft > 0 && (
                <span className="hidden sm:inline bg-slate-950/20 text-slate-950 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  ⏱ {formatTimer(reservationTimeLeft)}
                </span>
              )}
            </Link>

            {/* Auth / Admin Navigation */}
            {user ? (
              <div className="flex items-center gap-1.5">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 text-xs font-black transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Control Panel</span>
                  </Link>
                ) : (
                  <Link
                    href="/track-order"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"
                  >
                    {user.name.split(' ')[0]}
                  </Link>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <ColorVisualizerModal isOpen={isColorOpen} onClose={() => setIsColorOpen(false)} />
      <RequestItemModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      <AuthModal />
    </>
  );
}
