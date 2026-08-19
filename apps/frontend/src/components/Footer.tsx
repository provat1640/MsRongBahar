import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      {/* Trust & Guarantee Badges Bar */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">100% Genuine Paint</h4>
              <p className="text-[11px] text-slate-500">Authorized Berger & Aqua dealer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Fast Local Delivery</h4>
              <p className="text-[11px] text-slate-500">Pakundia express van delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Safe bKash & COD</h4>
              <p className="text-[11px] text-slate-500">Verified mobile transaction lock</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Contractor Supply</h4>
              <p className="text-[11px] text-slate-500">Bulk building materials support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-xl object-cover" />
            <h3 className="font-black text-white text-sm">M/S Rong Bahar</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pakundia&apos;s leading authorized paint, industrial hardware, sanitary, and construction adhesive superstore. Serving contractors, master carpenters, and homeowners with authentic materials.
          </p>
          <div className="text-[11px] text-slate-500">
            Trade License / BIN: <span className="text-slate-300 font-mono">BIN-192837465-BD</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Product Categories</h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/products?category=synthetic-enamel-paints" className="hover:text-amber-400 transition">Synthetic Enamel Paints</Link></li>
            <li><Link href="/products?category=acrylic-lacquer-sprays" className="hover:text-amber-400 transition">Acrylic Lacquer Spray Cans</Link></li>
            <li><Link href="/products?category=adhesives-and-glues" className="hover:text-amber-400 transition">Fevicol 1K PUR & Glues</Link></li>
            <li><Link href="/products?category=padlocks-and-security" className="hover:text-amber-400 transition">HMBR Security Padlocks</Link></li>
            <li><Link href="/products?category=interior-paints" className="hover:text-amber-400 transition">Berger Interior Emulsions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Customer Services</h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/track-order" className="hover:text-amber-400 transition">Track Live Order & Receipts</Link></li>
            <li><Link href="/cart" className="hover:text-amber-400 transition">View Shopping Cart</Link></li>
            <li><Link href="/products" className="hover:text-amber-400 transition">Browse Full Catalog</Link></li>
            <li><span className="text-slate-500">bKash Merchant: 01722-452836 (Personal/Agent)</span></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Store Location & Contact</h4>
          <div className="flex items-start gap-2.5 text-[11px]">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Mothkhola Road, Pakundia Bazar, Kishoreganj, Dhaka Division, Bangladesh</span>
          </div>
          <div className="flex items-center gap-2.5 text-[11px]">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Hotline / WhatsApp: <strong className="text-white">01722-452836</strong> (Manager Habib)</span>
          </div>
          <div className="pt-2 text-[11px] text-slate-500">
            Open 7 Days a Week: 7:30 AM – 10:00 PM
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-[11px] text-slate-600">
        © {new Date().getFullYear()} M/S Rong Bahar. Enterprise Next.js & NestJS Cloud Architecture. All Rights Reserved.
      </div>
    </footer>
  );
}
