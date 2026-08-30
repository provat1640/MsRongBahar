'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  MoreVertical,
} from 'lucide-react';

export function Navbar() {
  const { itemCount, reservationTimeLeft } = useCart();
  const { user, isAdmin, openAuthModal, logout } = useAuth();

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isImaginationOpen, setIsImaginationOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close 3-dot dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            className="hidden md:flex flex-1 max-w-xs lg:max-w-md items-center relative mx-2"
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
            {/* Desktop: Imagination Studio */}
            <button
              onClick={() => setIsImaginationOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-black transition shadow-xs"
              title="Customer Imagination & Mood Studio"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Imagination</span>
            </button>

            {/* Desktop: 3D Color Visualizer */}
            <button
              onClick={() => setIsColorOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition shadow-xs"
              title="3D Room & Surface Color Visualizer"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Visualizer</span>
            </button>

            {/* 3-Dot More Tools Dropdown Menu (Accessible on Desktop & Mobile) */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center ${
                  isMoreMenuOpen
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400'
                }`}
                title="More Superstore Tools & Estimator"
                aria-label="More Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* 3-Dot Dropdown Panel */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-slate-950/98 backdrop-blur-2xl border border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-amber-400 border-b border-slate-800/80 tracking-wider">
                    Superstore Tools
                  </div>

                  {/* 1. Berger Paint Coverage & Cost Estimator */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsEstimatorOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-amber-500/15 text-left text-xs font-bold text-slate-200 hover:text-amber-300 transition flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">Paint Coverage Estimator</div>
                      <div className="text-[10px] text-slate-400 truncate">Calculate litres, coats &amp; price</div>
                    </div>
                  </button>

                  {/* 2. 3D Surface Color Visualizer */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsColorOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-emerald-500/15 text-left text-xs font-bold text-slate-200 hover:text-emerald-300 transition flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">3D Color Visualizer</div>
                      <div className="text-[10px] text-slate-400 truncate">Rooms, exteriors &amp; autos</div>
                    </div>
                  </button>

                  {/* 3. Customer Imagination Studio */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsImaginationOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-purple-500/15 text-left text-xs font-bold text-slate-200 hover:text-purple-300 transition flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">Imagination &amp; Moods</div>
                      <div className="text-[10px] text-slate-400 truncate">6 customer mood profiles</div>
                    </div>
                  </button>

                  {/* 4. Self-Healing Diagnostics */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsDiagnosticsOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-teal-500/15 text-left text-xs font-bold text-slate-200 hover:text-teal-300 transition flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">Self-Healing Diagnostics</div>
                      <div className="text-[10px] text-slate-400 truncate">System health &amp; auto-repair</div>
                    </div>
                  </button>

                  {/* 5. Request Custom Hardware */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsRequestOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-amber-500/15 text-left text-xs font-bold text-slate-200 hover:text-amber-300 transition flex items-center gap-2.5 border-t border-slate-800/80 pt-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">Request Unlisted Item</div>
                      <div className="text-[10px] text-slate-400 truncate">Special paints &amp; hardware</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 transition"
              title={isLightMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {isLightMode ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Live Cart Button (Always visible, prominent & tap-friendly) */}
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
                <span className="hidden xl:inline bg-slate-950/20 text-slate-950 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  ⏱ {formatTimer(reservationTimeLeft)}
                </span>
              )}
            </Link>

            {/* Desktop Auth / User */}
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

            {/* Mobile Menu Button (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/98 border-t border-slate-800 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search Box inside menu */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search paints, glues, tools..."
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

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Berger Estimator */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEstimatorOpen(true);
                }}
                className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center justify-between text-left"
              >
                <span>📐 Paint Estimator</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsColorOpen(true);
                }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between text-left"
              >
                <span>🎨 3D Visualizer</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsImaginationOpen(true);
                }}
                className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-between text-left"
              >
                <span>✨ Imagination Studio</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDiagnosticsOpen(true);
                }}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-between text-left"
              >
                <span>🛡️ Self-Healing Health</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRequestOpen(true);
                }}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-between text-left"
              >
                <span>📋 Request Item</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-between"
              >
                <span>📦 All Products</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
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
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <User className="w-4 h-4" /> Login or Register Account
                </button>
              )}
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
