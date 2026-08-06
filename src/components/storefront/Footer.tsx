'use client';

import React from 'react';
import Link from 'next/link';
import { Paintbrush, Phone, MapPin, Mail, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Trust Badges */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">100% Genuine Products</h4>
              <p className="text-xs text-slate-400">Directly sourced from Berger, Fevicol, Aqua & HMBR.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Fast Local BD Delivery</h4>
              <p className="text-xs text-slate-400">Quick delivery across Pakundia, Kishoreganj & Greater Dhaka.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">COD & bKash / Nagad</h4>
              <p className="text-xs text-slate-400">Pay cash on delivery or instant bKash / Nagad transfer.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Paintbrush className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-black text-white">M/S RONG BAHAR</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your trusted hardware and paint shop in Pakundia, Kishoreganj. Supplying top grade Berger emulsions, Fevicol 1K PUR, HMBR locks, spray paints & contractor tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Product Catalog</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products?category=architectural-paints-and-coatings" className="hover:text-amber-400 transition">Paints & Coatings</Link></li>
            <li><Link href="/products?category=adhesives-and-chemicals" className="hover:text-amber-400 transition">Fevicol 1K PUR Glue</Link></li>
            <li><Link href="/products?category=security-hardware" className="hover:text-amber-400 transition">HMBR Padlocks</Link></li>
            <li><Link href="/products?category=aerosol-spray-paints" className="hover:text-amber-400 transition">Spray Paint Cans</Link></li>
          </ul>
        </div>

        {/* Shop Hours */}
        <div>
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Store Hours</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between"><span>Saturday - Thursday:</span> <span className="text-slate-200">8:00 AM - 10:00 PM</span></li>
            <li className="flex justify-between"><span>Friday:</span> <span className="text-slate-200">3:00 PM - 10:00 PM</span></li>
            <li className="text-emerald-400 pt-2 font-medium">✓ Open for Contractor & Retail Orders</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs">
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Contact Shop</h4>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Mothkhola Road, Pakundia, Kishoreganj</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
            <span>01621962897 / 01722452836</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
            <span>sales@rongbahar.com</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center text-xs py-4 text-slate-500">
        © 2026 M/S Rong Bahar. Mothkhola Road, Pakundia, Kishoreganj. All Rights Reserved.
      </div>
    </footer>
  );
}
