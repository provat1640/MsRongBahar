'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Palette,
  X,
  Sparkles,
  Check,
  Sun,
  Moon,
  Lamp,
  ArrowRight,
  Calculator,
  Brush,
  ShoppingBag,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SceneType = 'living' | 'bedroom' | 'exterior' | 'cng_rickshaw';

interface PaintColor {
  name: string;
  hex: string;
  code: string;
  brand: string;
  popularFor: string;
  litresNeeded: number;
  estPrice: number;
}

const colorPalettes: PaintColor[] = [
  { name: 'Berger CNG Royal Green', hex: '#166534', code: 'BG-702-GRN', brand: 'Berger Robbialac', popularFor: 'CNG Autos, Gates & Feature Walls', litresNeeded: 2.5, estPrice: 1150 },
  { name: 'Aqua Electric Marine Cyan', hex: '#0284c7', code: 'AQ-303-CYN', brand: 'Aqua Paints', popularFor: 'Living Rooms & Metal Sheet', litresNeeded: 2.5, estPrice: 980 },
  { name: 'Berger Robbialac Sunset Coral', hex: '#ea580c', code: 'RB-102-CRL', brand: 'Berger Robbialac', popularFor: 'Accent Dining & Bedroom Walls', litresNeeded: 2.5, estPrice: 1250 },
  { name: 'Berger Pearl Silk Cream Ivory', hex: '#fef08a', code: 'BER-201-IVR', brand: 'Berger Silk Emulsion', popularFor: 'Luxury Interior Living Rooms', litresNeeded: 3.64, estPrice: 2650 },
  { name: 'WeatherCoat Charcoal Slate', hex: '#334155', code: 'WC-904-CHR', brand: 'Berger WeatherCoat', popularFor: 'Exterior Building Walls & Pillars', litresNeeded: 4.0, estPrice: 3200 },
  { name: 'Aqua Emerald Forest Green', hex: '#065f46', code: 'AQ-405-PNE', brand: 'Aqua Paints', popularFor: 'Doors, Grills & Balconies', litresNeeded: 2.5, estPrice: 950 },
  { name: 'Luxury Royal Sapphire Blue', hex: '#1e3a8a', code: 'BER-510-BLU', brand: 'Berger Silk Emulsion', popularFor: 'Master Bedroom Bed Wall', litresNeeded: 3.64, estPrice: 2800 },
  { name: 'Pakundia Harvest Amber Gold', hex: '#d97706', code: 'PK-318-GLD', brand: 'Berger Robbialac', popularFor: 'Front Accents & Reception', litresNeeded: 2.5, estPrice: 1300 },
  { name: 'Cashmere Neutral Soft Grey', hex: '#94a3b8', code: 'BER-812-GRY', brand: 'Berger Easy Clean', popularFor: 'Washable Corridors & Hallways', litresNeeded: 3.64, estPrice: 2400 },
  { name: 'Terracotta Red Clay', hex: '#9a3412', code: 'WC-615-TER', brand: 'Berger WeatherCoat', popularFor: 'Exterior Facade & Roof Borders', litresNeeded: 4.0, estPrice: 3100 },
  { name: 'Pure Alpine Brilliant White', hex: '#f8fafc', code: 'BER-100-WHT', brand: 'Berger Robbialac', popularFor: 'Ceilings, Trims & Window Frames', litresNeeded: 3.64, estPrice: 2100 },
  { name: 'Lavender Mist Velvet', hex: '#7c3aed', code: 'BER-408-LAV', brand: 'Berger Silk Emulsion', popularFor: 'Children Rooms & Guest Suite', litresNeeded: 2.5, estPrice: 1950 },
];

export function ColorVisualizerModal({ isOpen, onClose }: Props) {
  const [activeScene, setActiveScene] = useState<SceneType>('living');
  const [selectedColor, setSelectedColor] = useState<PaintColor>(colorPalettes[0]);
  const [lighting, setLighting] = useState<'daylight' | 'warm' | 'cool'>('daylight');

  if (!isOpen) return null;

  const getLightingFilter = () => {
    switch (lighting) {
      case 'warm':
        return 'sepia(30%) saturate(130%) brightness(95%)';
      case 'cool':
        return 'saturate(95%) brightness(105%) hue-rotate(5deg)';
      case 'daylight':
      default:
        return 'none';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-800 z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-inner">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">Live Room &amp; Surface Color Visualizer</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                  Berger &amp; Aqua Paints
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Select a paint color to instantly see how real rooms, furniture, and vehicles look with authentic paint finishes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scene Selector & Lighting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          {/* Scenes */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 font-bold text-[11px] mr-1">Choose Room / Object:</span>
            {[
              { id: 'living', label: '🛋️ Modern Living Room' },
              { id: 'bedroom', label: '🛏️ Master Bedroom' },
              { id: 'exterior', label: '🏡 Building Exterior' },
              { id: 'cng_rickshaw', label: '🛺 Auto Rickshaw & Gate' },
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScene(sc.id as SceneType)}
                className={`px-3 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                  activeScene === sc.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Lighting Mode */}
          <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
            <span className="text-slate-400 font-bold text-[11px] mr-1">Lighting:</span>
            <button
              onClick={() => setLighting('daylight')}
              title="Daylight (6500K True Solar)"
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                lighting === 'daylight'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Daylight
            </button>
            <button
              onClick={() => setLighting('warm')}
              title="Warm Evening Lamp"
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                lighting === 'warm'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Lamp className="w-3.5 h-3.5 text-amber-400" /> Warm
            </button>
          </div>
        </div>

        {/* 🎨 REALISTIC VISUAL CANVAS WITH OBJECTS & FURNITURE */}
        <div
          className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl transition-all duration-500 select-none flex flex-col justify-between"
          style={{ filter: getLightingFilter() }}
        >
          {/* 1. SCENE: MODERN LIVING ROOM */}
          {activeScene === 'living' && (
            <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: selectedColor.hex }}>
              {/* Ceiling */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/95 to-slate-200 border-b border-slate-400/30 flex items-center justify-center">
                <div className="w-32 h-1.5 bg-amber-400/80 rounded-full blur-xs" />
              </div>

              {/* Wooden Flooring */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-amber-950 via-amber-900 to-amber-800/90 border-t-4 border-amber-950/80 shadow-2xl flex items-center justify-center">
                <div className="w-64 h-12 bg-slate-900/60 rounded-full blur-md" />
              </div>

              {/* Wall Art Frame on the Painted Wall */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-44 h-28 rounded-xl border-4 border-slate-900 bg-slate-950/90 shadow-2xl p-2 flex flex-col items-center justify-center text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-black text-white">{selectedColor.name}</div>
                <div className="text-[9px] font-mono text-amber-400 font-bold">{selectedColor.code} • {selectedColor.brand}</div>
              </div>

              {/* Real Living Room Furniture: Modern Couch & Plant */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 sm:w-96 flex flex-col items-center z-10 pointer-events-none">
                {/* Couch Body */}
                <div className="w-full h-24 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 rounded-3xl border-2 border-slate-600/80 shadow-2xl p-3 flex justify-between items-end">
                  <div className="w-20 h-12 bg-slate-700 rounded-2xl border border-slate-600 flex items-center justify-center text-[10px] text-slate-300 font-bold">Cushion</div>
                  <div className="w-24 h-12 bg-amber-500/20 rounded-2xl border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">Silk Pillow</div>
                  <div className="w-20 h-12 bg-slate-700 rounded-2xl border border-slate-600 flex items-center justify-center text-[10px] text-slate-300 font-bold">Cushion</div>
                </div>
                {/* Couch Legs */}
                <div className="w-72 flex justify-between px-4 pt-1">
                  <div className="w-2.5 h-4 bg-amber-500 rounded-b" />
                  <div className="w-2.5 h-4 bg-amber-500 rounded-b" />
                </div>
              </div>

              {/* Floor Lamp & Plant on Sides */}
              <div className="absolute bottom-12 left-8 z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-300/60 blur-md" />
                <div className="w-8 h-8 bg-amber-200 rounded-t-full border border-amber-400" />
                <div className="w-1 h-28 bg-slate-800" />
                <div className="w-6 h-2 bg-slate-900 rounded-full" />
              </div>

              <div className="absolute bottom-10 right-8 z-10 flex flex-col items-center">
                <div className="text-2xl">🌿</div>
                <div className="w-8 h-10 bg-amber-800 rounded-b-xl border border-amber-900" />
              </div>
            </div>
          )}

          {/* 2. SCENE: MASTER BEDROOM */}
          {activeScene === 'bedroom' && (
            <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: selectedColor.hex }}>
              {/* Ambient Ceiling & Wall Glow */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-slate-900/40 backdrop-blur-xs border-b border-white/10" />

              {/* Wooden Headboard Wall Mount */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-36 bg-gradient-to-b from-amber-950 to-amber-900 rounded-t-3xl border-4 border-amber-900 shadow-2xl p-4 text-center">
                <div className="text-xs font-black text-amber-300">{selectedColor.name}</div>
                <div className="text-[10px] font-mono text-white/80">Master Bedroom Feature Headboard</div>
              </div>

              {/* Bed & Pillows */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-96 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 rounded-t-3xl border-t-4 border-slate-700 shadow-2xl p-6 flex flex-col justify-between items-center z-10">
                <div className="flex gap-4 mb-2">
                  <div className="w-20 h-10 bg-white rounded-xl shadow border border-slate-300 flex items-center justify-center text-[10px] text-slate-800 font-bold">Pillow</div>
                  <div className="w-20 h-10 bg-white rounded-xl shadow border border-slate-300 flex items-center justify-center text-[10px] text-slate-800 font-bold">Pillow</div>
                </div>
                <div className="text-xs font-black text-amber-400">Cozy Bedroom Suite • Silk Emulsion Sheen</div>
              </div>

              {/* Nightstand Lamps */}
              <div className="absolute bottom-16 left-6 z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-400/40 blur-md" />
                <div className="w-6 h-6 bg-amber-200 rounded-t-full" />
                <div className="w-12 h-14 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-400">Drawer</div>
              </div>

              <div className="absolute bottom-16 right-6 z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-400/40 blur-md" />
                <div className="w-6 h-6 bg-amber-200 rounded-t-full" />
                <div className="w-12 h-14 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-400">Drawer</div>
              </div>
            </div>
          )}

          {/* 3. SCENE: EXTERIOR BUILDING / VILLA */}
          {activeScene === 'exterior' && (
            <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: selectedColor.hex }}>
              {/* Sky */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-sky-400 to-sky-200 flex items-center justify-between px-8">
                <span className="text-2xl">☀️</span>
                <span className="text-2xl opacity-70">☁️</span>
              </div>

              {/* Roof Gables & Trims */}
              <div className="absolute top-20 left-0 right-0 h-8 bg-slate-950 border-b-4 border-amber-500 flex items-center justify-center">
                <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">WeatherCoat All-Weather Facade</span>
              </div>

              {/* Villa Windows & Entryway Door */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 sm:w-96 flex justify-around items-end z-10">
                {/* Left Window */}
                <div className="w-18 h-24 bg-sky-200/90 border-4 border-slate-950 rounded-xl shadow-2xl flex items-center justify-center">
                  <div className="w-full h-0.5 bg-slate-950" />
                </div>

                {/* Main Entry Door */}
                <div className="w-24 h-40 bg-gradient-to-b from-amber-950 to-amber-900 border-4 border-slate-950 rounded-t-2xl shadow-2xl flex flex-col items-center justify-between p-3">
                  <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600" />
                  <div className="text-[9px] font-bold text-amber-200">Main Door</div>
                  <div className="w-12 h-1 bg-amber-400 rounded-full" />
                </div>

                {/* Right Window */}
                <div className="w-18 h-24 bg-sky-200/90 border-4 border-slate-950 rounded-xl shadow-2xl flex items-center justify-center">
                  <div className="w-full h-0.5 bg-slate-950" />
                </div>
              </div>

              {/* Front Lawn */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-emerald-800 to-emerald-600 border-t-2 border-emerald-900" />
            </div>
          )}

          {/* 4. SCENE: AUTO RICKSHAW & COMMERCIAL GATE */}
          {activeScene === 'cng_rickshaw' && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
              {/* Background Garage / Shop Wall */}
              <div className="absolute inset-0 bg-slate-950 opacity-90" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-bold z-10">
                Commercial Metal / CNG Green Super Gloss Enamel
              </div>

              {/* Rendered Auto Rickshaw (CNG) Vehicle Body painted in selectedColor.hex */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Canopy Roof */}
                <div className="w-48 h-12 bg-slate-950 rounded-t-3xl border-2 border-slate-700 flex items-center justify-center text-[10px] font-black text-amber-400">
                  Black Top Canopy
                </div>

                {/* Windshield Glass */}
                <div className="w-44 h-16 bg-sky-200/80 border-x-4 border-slate-950 flex items-center justify-center">
                  <span className="text-xs font-black text-slate-900">Front Windshield</span>
                </div>

                {/* Painted Metal Front Body */}
                <div
                  className="w-56 h-28 rounded-b-3xl border-4 border-slate-950 shadow-2xl flex flex-col items-center justify-between p-3 transition-colors duration-500"
                  style={{ backgroundColor: selectedColor.hex }}
                >
                  <div className="w-full flex justify-between items-center px-3">
                    <div className="w-6 h-6 rounded-full bg-amber-300 border-2 border-slate-950 shadow flex items-center justify-center">💡</div>
                    <div className="px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-black">{selectedColor.code}</div>
                    <div className="w-6 h-6 rounded-full bg-amber-300 border-2 border-slate-950 shadow flex items-center justify-center">💡</div>
                  </div>

                  <div className="text-center font-black text-white text-xs drop-shadow">
                    {selectedColor.name}
                  </div>

                  <div className="w-24 h-4 bg-slate-950 rounded-md border border-slate-700 flex items-center justify-center text-[8px] font-mono text-amber-400">
                    DHAKA METRO
                  </div>
                </div>

                {/* Front Wheel */}
                <div className="w-14 h-8 bg-slate-950 rounded-b-full border-2 border-slate-700 flex items-center justify-center text-[8px] text-slate-400 font-bold">
                  Tyre
                </div>
              </div>
            </div>
          )}

          {/* Overlay Info Card */}
          <div className="relative z-20 m-4 flex justify-between items-end pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 space-y-1 shadow-2xl">
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
                Active Paint Color
              </span>
              <div className="text-base font-black text-white">{selectedColor.name}</div>
              <div className="text-xs text-slate-300">
                Code: <strong className="text-amber-400 font-mono">{selectedColor.code}</strong> • {selectedColor.brand}
              </div>
              <div className="text-[10px] text-slate-400 italic">
                Best For: {selectedColor.popularFor}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xl flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 100% Genuine Paint
            </div>
          </div>
        </div>

        {/* 12 REAL BERGER & AQUA COLOR SWATCHES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-300 font-bold flex items-center gap-2">
              <Brush className="w-4 h-4 text-amber-400" />
              Click any color to paint the room / object:
            </label>
            <span className="text-[11px] text-slate-500 font-mono">12 Genuine Store Shades</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {colorPalettes.map((c) => {
              const isSelected = selectedColor.code === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setSelectedColor(c)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 shadow-lg scale-[1.02]'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl border border-white/20 shrink-0 shadow-md flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-100 truncate">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {c.code} • <span className="text-amber-400">{c.brand.split(' ')[0]}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Paint Calculation & 1-Click Order Link */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <strong className="text-white text-xs">Estimated Paint Required for Room / Vehicle:</strong>
            </div>
            <p className="text-slate-300 text-[11px]">
              2 Coats of <strong className="text-amber-300">{selectedColor.name}</strong> = Approx.{' '}
              <strong className="text-emerald-400 font-mono">{selectedColor.litresNeeded} Litres ({formatCurrency(selectedColor.estPrice)})</strong>. Fresh stock ready in Pakundia Bazar.
            </p>
          </div>

          <Link
            href={`/products?search=${encodeURIComponent(selectedColor.brand.split(' ')[0])}`}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-1.5 shrink-0 justify-center"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order This Paint Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
