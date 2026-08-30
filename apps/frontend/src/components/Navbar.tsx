'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ColorVisualizerModal } from './ColorVisualizerModal';
import { RequestItemModal } from './RequestItemModal';
import { AuthModal } from './AuthModal';
import { ImaginationStudio } from './ImaginationStudio';
import { SelfHealingDiagnosticsModal } from './SelfHealingDiagnosticsModal';
import { ProjectEstimatorCalculator } from './ProjectEstimatorCalculator';
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
  Sparkles,
  Wand2,
  Activity,
  Calculator,
  Package,
  ArrowRight,
} from 'lucide-react';

export function Navbar() {
  const { itemCount, reservationTimeLeft } = useCart();
  const { user, isAdmin, openAuthModal, logout } = useAuth();

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isImaginationOpen, setIsImaginationOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setMenuOpen(false);
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
      <header className="sticky top-0 z-40 bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <img
              src="/logo.jpg"
              alt="M/S Rong Bahar Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover border border-amber-500/40 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <span className="text-sm sm:text-lg lg:text-xl font-black tracking-tight text-white flex items-center gap-1 truncate">
                M/S Rong Bahar{' '}
                <span className="text-amber-400 text-[9px] sm:text-xs px-1.5 py-0.2 rounded-md bg-amber-500/10 border border-amber-500/30 shrink-0">
                  PRO
                </span>
              </span>
              <span className="hidden lg:block text-[11px] text-slate-400 font-medium truncate">
                Paint, Hardware &amp; Sanitary Superstore
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-md items-center relative mx-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Berger enamel, Fevicol, spray..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 transition"
              title={isLightMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {isLightMode ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Live Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-md shrink-0"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="bg-slate-950 text-amber-400 text-[10px] sm:text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-[16px] text-center">
                {itemCount}
              </span>
              {reservationTimeLeft > 0 && (
                <span className="hidden lg:inline bg-slate-950/20 text-slate-950 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  ⏱ {formatTimer(reservationTimeLeft)}
                </span>
              )}
            </Link>

            {/* Desktop Auth / User Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-1.5">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 text-xs font-black transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link
                    href="/track-order"
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold truncate max-w-[100px]"
                  >
                    {user.name?.split(' ')[0] || 'Account'}
                  </Link>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Login</span>
              </button>
            )}

            {/* ☰ MAIN MENU BUTTON (The marked box containing all essential tools) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center ${
                menuOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:text-amber-400 hover:border-amber-500/40'
              }`}
              title="Open Navigation & Superstore Tools Menu"
              aria-label="Navigation Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ☰ FULL-FEATURED MENU DRAWER PANEL */}
        {menuOpen && (
          <div className="bg-slate-950/98 backdrop-blur-2xl border-t border-slate-800/90 px-4 sm:px-6 lg:px-8 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Search Bar inside Menu (for Mobile / Quick Search) */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Berger paints, PUR glue, spray, padlocks..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                >
                  Search
                </button>
              </form>

              {/* 🛠️ THE 6 CORE REQUIRED TOOLS IN THIS BOX */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                  Superstore Tools &amp; Features
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {/* 1. Paint Coverage & Cost Estimator */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsEstimatorOpen(true);
                    }}
                    className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white group-hover:text-amber-300 transition truncate">
                          1. Paint Coverage Estimator
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Exact litres, gallons, coats &amp; price
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>

                  {/* 2. 3D Architectural Visualizer */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsColorOpen(true);
                    }}
                    className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition">
                        <Palette className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white group-hover:text-emerald-300 transition truncate">
                          2. 3D Color Visualizer
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Photorealistic rooms, exteriors &amp; autos
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>

                  {/* 3. Customer Imagination & Mood Studio */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsImaginationOpen(true);
                    }}
                    className="p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white group-hover:text-purple-300 transition truncate">
                          3. Imagination &amp; Moods
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          6 emotional profiles &amp; AI project kits
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>

                  {/* 4. Self-Healing Health Center */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsDiagnosticsOpen(true);
                    }}
                    className="p-3.5 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white group-hover:text-teal-300 transition truncate">
                          4. Self-Healing Diagnostics
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          100% Health score &amp; live repair stream
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>

                  {/* 5. Request Custom Hardware / Unlisted Item */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsRequestOpen(true);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white group-hover:text-amber-300 transition truncate">
                          5. Request Unlisted Item
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Special order paints, pur glues &amp; tools
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>

                  {/* 6. All Products Catalog */}
                  <Link
                    href="/products"
                    onClick={() => setMenuOpen(false)}
                    className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white group-hover:text-amber-300 transition truncate">
                          6. All Products Catalog
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Browse complete Pakundia inventory
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition shrink-0" />
                  </Link>
                </div>
              </div>

              {/* Order Tracking & Auth */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/track-order"
                  onClick={() => setMenuOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>🚚 Track Order &amp; Invoice Status</span>
                </Link>

                {user ? (
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <span className="text-slate-400">
                      Logged in: <strong className="text-white">{user.name || user.phone}</strong>
                    </span>
                    <div className="flex gap-2">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl font-bold"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="px-3 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <User className="w-4 h-4" /> Login or Register Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <ColorVisualizerModal isOpen={isColorOpen} onClose={() => setIsColorOpen(false)} />
      <RequestItemModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      <ImaginationStudio isModal isOpen={isImaginationOpen} onClose={() => setIsImaginationOpen(false)} />
      <SelfHealingDiagnosticsModal isOpen={isDiagnosticsOpen} onClose={() => setIsDiagnosticsOpen(false)} />
      <ProjectEstimatorCalculator isModal isOpen={isEstimatorOpen} onClose={() => setIsEstimatorOpen(false)} />
      <AuthModal />
    </>
  );
}
