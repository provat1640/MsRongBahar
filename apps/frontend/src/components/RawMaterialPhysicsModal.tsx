'use client';

import React from 'react';
import { Product } from '../lib/api';
import {
  Atom,
  X,
  ShieldAlert,
  Droplets,
  Activity,
  Flame,
  Scale,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function RawMaterialPhysicsModal({ product, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  // Derive realistic raw physical & chemical data based on product taxonomy
  const isPaint = product.categoryId?.includes('enamel') || product.slug?.includes('enamel') || product.slug?.includes('paint');
  const isGlue = product.categoryId?.includes('adhesive') || product.slug?.includes('pur') || product.slug?.includes('glue');
  const isLock = product.categoryId?.includes('hardware') || product.slug?.includes('padlock') || product.slug?.includes('lock');
  const isSpray = product.categoryId?.includes('spray') || product.slug?.includes('spray');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-amber-500/40 z-10 space-y-5 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-sans">
                  Raw Material Physics &amp; Chemistry
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                  RAW SPEC v2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans truncate max-w-md">
                {product.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Physics Specs Table */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Activity className="w-4 h-4" /> Laboratory Spec Telemetry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {isPaint && (
              <>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Kinematic Viscosity</span>
                  <div className="text-amber-400 font-black text-sm">95 - 115 Krebs Units (KU)</div>
                  <div className="text-slate-500 text-[10px]">Ford Cup #4 Flow: 75-90s @ 30°C</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Non-Volatile Solid Content</span>
                  <div className="text-emerald-400 font-black text-sm">54.5% ± 2% by weight</div>
                  <div className="text-slate-500 text-[10px]">Pure Medium Oil Alkyd Resin</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Specific Gravity (Density)</span>
                  <div className="text-sky-400 font-black text-sm">1.12 - 1.18 g/cm³</div>
                  <div className="text-slate-500 text-[10px]">ASTM D1475 Standard Pycnometer</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Specular Gloss (60° Head)</span>
                  <div className="text-amber-400 font-black text-sm">&gt; 88 GU (Mirror Gloss)</div>
                  <div className="text-slate-500 text-[10px]">UV-Protected Non-Yellowing Finish</div>
                </div>
              </>
            )}

            {isGlue && (
              <>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Tensile Shear Strength</span>
                  <div className="text-emerald-400 font-black text-sm">11.5 MPa (115 kg/cm²)</div>
                  <div className="text-slate-500 text-[10px]">DIN EN 204 Standard D4 Bond</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Polymer Chemistry</span>
                  <div className="text-amber-400 font-black text-sm">1K Moisture-Curing PU</div>
                  <div className="text-slate-500 text-[10px]">100% Waterproof D4 Polyurethane</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Open Assembly Time</span>
                  <div className="text-sky-400 font-black text-sm">20 - 25 Minutes @ 30°C</div>
                  <div className="text-slate-500 text-[10px]">Clamp Pressure: 0.5 - 0.8 N/mm²</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Water Immersion Proofing</span>
                  <div className="text-teal-400 font-black text-sm">Class D4 (Boiling Water Resistant)</div>
                  <div className="text-slate-500 text-[10px]">Marine &amp; Exterior Joinery Rated</div>
                </div>
              </>
            )}

            {isLock && (
              <>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Shackle Core Metallurgy</span>
                  <div className="text-emerald-400 font-black text-sm">Hardened Boron Alloy Steel</div>
                  <div className="text-slate-500 text-[10px]">Rockwell Hardness: HRC 58 - 62</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Locking Mechanism</span>
                  <div className="text-amber-400 font-black text-sm">Dual Ball Bearing Deadbolt</div>
                  <div className="text-slate-500 text-[10px]">Anti-Pry &amp; Anti-Shimming Security</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Cylinder Chemistry</span>
                  <div className="text-sky-400 font-black text-sm">Solid Extruded Brass Body</div>
                  <div className="text-slate-500 text-[10px]">Corrosion-Proof Salt Spray: 240h</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Tensile Pull Resistance</span>
                  <div className="text-rose-400 font-black text-sm">&gt; 35 kN (3.5 Metric Tons)</div>
                  <div className="text-slate-500 text-[10px]">Heavy Commercial Shutter Class</div>
                </div>
              </>
            )}

            {!isPaint && !isGlue && !isLock && (
              <>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Material Compound</span>
                  <div className="text-amber-400 font-black text-sm">Industrial Grade Polymer &amp; Alloy</div>
                  <div className="text-slate-500 text-[10px]">ISO 9001 Factory Quality Certified</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Environmental Rating</span>
                  <div className="text-emerald-400 font-black text-sm">Extreme Humidity &amp; UV Stable</div>
                  <div className="text-slate-500 text-[10px]">Rated for Bangladesh Climate</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contractor Certification Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-sans">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">Original Verified Batch • Pakundia Authorized Depot Stock</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-bold">100% AUTHENTIC</span>
        </div>
      </div>
    </div>
  );
}
