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
  Menu,
  X,
  Phone,
  Layers,
  ChevronRight,
} from 'lucide-react';

export function Navbar() {
  const { itemCount, reservationTimeLeft } = useCart();
  const { user, isAdmin, openAuthModal, logout } = useAuth();

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
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
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-2 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-inner">
        <Truck className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">
          Pakundia &amp; Mothkhola Delivery: Under 2 Hours! Hotline:{' '}
          <a href="tel:01722452836" className="underline font-black hover:text-white transition">
            01722-452836
          </a>
        </span>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <img
              src="/logo.jpg"
              alt="M/S Rong Bahar Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover border border-amber-500/40 shadow-lg glow-amber shrink-0"
            />
            <div className="min-w-0">
              <span className="text-sm sm:text-lg lg:text-xl font-black tracking-tight text-white flex items-center gap-1 truncate">
                M/S Rong Bahar{' '}
                <span className="text-amber-400 text-[9px] sm:text-xs px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 shrink-0">
                  PRO
                </span>
              </span>
              <span className="hidden md:block text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                Paint, Hardware &amp; Sanitary Superstore
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm lg:max-w-md items-center relative mx-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Berger enamel, Fevicol PUR, sprays, locks..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Action Tools & Triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
              title="Search products"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 transition"
              title={isLightMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
            </button>

            {/* Color Visualizer Trigger (Adaptive) */}
            <button
              onClick={() => setIsColorOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition shadow-sm shrink-0"
              title="Interactive Modern Room & Surface Color Visualizer"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">3D Color</span>
            </button>

            {/* Request Unlisted Item (Tablet/Desktop) */}
            <button
              onClick={() => setIsRequestOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 text-xs font-bold transition shrink-0"
              title="Request unlisted paint/hardware"
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Item</span>
            </button>

            {/* Order Tracker (Desktop) */}
            <Link
              href="/track-order"
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 text-xs font-bold transition shrink-0"
              title="Track Order & Invoices"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Track Order</span>
            </Link>

            {/* Live Cart with Badge */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-lg shrink-0"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="bg-slate-950 text-amber-400 text-[10px] sm:text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-[16px] sm:min-w-[18px] text-center">
                {itemCount}
              </span>
              {reservationTimeLeft > 0 && (
                <span className="hidden xl:inline bg-slate-950/20 text-slate-950 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  ⏱ {formatTimer(reservationTimeLeft)}
                </span>
              )}
            </Link>

            {/* Auth / User Login (Tablet/Desktop) */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 text-xs font-black transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                ) : (
                  <Link
                    href="/track-order"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold truncate max-w-[100px]"
                  >
                    {user.name?.split(' ')[0] || 'Account'}
                  </Link>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-bold transition shrink-0"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition shrink-0"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 pb-3 pt-1 border-t border-slate-800/60 bg-slate-950">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Berger, Fevicol, spray..."
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* Mobile Slide-Down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-between"
              >
                <span>📦 All Catalog</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-between"
              >
                <span>🚚 Track Order</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsColorOpen(true);
                }}
                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between text-left"
              >
                <span>🎨 3D Visualizer</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRequestOpen(true);
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-between text-left"
              >
                <span>📋 Request Item</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-slate-800/80">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Logged in as</span>
                    <span className="font-bold text-white">{user.name || user.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl text-xs font-bold"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Login or Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <ColorVisualizerModal isOpen={isColorOpen} onClose={() => setIsColorOpen(false)} />
      <RequestItemModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      <AuthModal />
    </>
  );
}
