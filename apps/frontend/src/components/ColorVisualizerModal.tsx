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
  Sliders,
  Layers,
  Eye,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SceneType = 'living' | 'bedroom' | 'exterior' | 'cng_rickshaw';
type FinishType = 'gloss' | 'satin' | 'matte';

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
  const [finish, setFinish] = useState<FinishType>('gloss');

  if (!isOpen) return null;

  const getLightingFilter = () => {
    switch (lighting) {
      case 'warm':
        return 'sepia(25%) saturate(125%) brightness(98%)';
      case 'cool':
        return 'saturate(95%) brightness(105%) hue-rotate(6deg)';
      case 'daylight':
      default:
        return 'none';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-slate-800 z-10 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-inner shrink-0">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-base sm:text-lg lg:text-xl font-black text-white truncate">
                  3D Architectural Surface Visualizer
                </h3>
                <span className="hidden xs:inline px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase shrink-0">
                  Berger &amp; Aqua Pro
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Photorealistic lighting, specular gloss reflections &amp; real shade mapping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls: Scene Selector, Lighting & Specular Finish */}
        <div className="space-y-3 bg-slate-950/90 p-3 sm:p-4 rounded-2xl border border-slate-800 text-xs">
          {/* Scenes Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-slate-400 font-bold text-[11px] mr-1 shrink-0">Room / Surface:</span>
              {[
                { id: 'living', label: '🛋️ Modern Living Room' },
                { id: 'bedroom', label: '🛏️ Master Bedroom Suite' },
                { id: 'exterior', label: '🏡 Villa Building Facade' },
                { id: 'cng_rickshaw', label: '🛺 Auto Rickshaw & Steel' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScene(sc.id as SceneType)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap text-xs ${
                    activeScene === sc.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lighting & Finish Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Lighting */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px] mr-1">Lighting:</span>
              <button
                onClick={() => setLighting('daylight')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                  lighting === 'daylight'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" /> 6500K True Daylight
              </button>
              <button
                onClick={() => setLighting('warm')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                  lighting === 'warm'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Lamp className="w-3.5 h-3.5 text-amber-400" /> 3000K Warm Evening
              </button>
            </div>

            {/* Specular Paint Finish */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px] mr-1">Paint Finish:</span>
              {[
                { id: 'gloss', label: '✨ Super High Gloss (88+ GU)' },
                { id: 'satin', label: '🌟 Silk Satin Sheen' },
                { id: 'matte', label: '🛡️ Velvet Matte' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinish(f.id as FinishType)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition ${
                    finish === f.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🎨 PHOTOREALISTIC ARCHITECTURAL CANVAS */}
        <div
          className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl transition-all duration-700 select-none"
          style={{ filter: getLightingFilter() }}
        >
          {/* ========================================================
              1. SCENE: PHOTOREALISTIC MODERN LIVING ROOM
             ======================================================== */}
          {activeScene === 'living' && (
            <div className="absolute inset-0 bg-slate-950 overflow-hidden">
              {/* Back Wall with Dynamic Paint Shade */}
              <div
                className="absolute inset-0 transition-colors duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              >
                {/* Ceiling with Recessed Ambient Cove Light */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 via-slate-200/90 to-transparent flex items-center justify-center">
                  <div className="w-3/4 h-1 bg-amber-200/80 rounded-full blur-[2px]" />
                </div>

                {/* Left Floor-To-Ceiling Perspective Window Casting Real Light Rays */}
                <div className="absolute top-0 left-0 bottom-24 w-32 bg-gradient-to-r from-white/30 via-white/10 to-transparent pointer-events-none transform -skew-x-6 origin-top" />

                {/* Specular Paint Sheen Overlay based on Finish */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                    finish === 'gloss'
                      ? 'opacity-40 bg-gradient-to-tr from-transparent via-white/25 to-transparent'
                      : finish === 'satin'
                      ? 'opacity-20 bg-gradient-to-t from-transparent via-white/15 to-transparent'
                      : 'opacity-5 bg-black/20'
                  }`}
                />

                {/* Wall Moulding / Geometric Architectural Panels */}
                <div className="absolute top-20 left-12 right-12 bottom-36 border border-white/20 rounded-2xl shadow-inner pointer-events-none" />

                {/* Architectural Artwork Frame */}
                <div className="absolute top-24 right-16 sm:right-28 w-36 sm:w-44 h-24 sm:h-28 rounded-xl border-4 border-slate-900 bg-slate-950 shadow-2xl p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Berger Original</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white truncate">{selectedColor.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{selectedColor.code}</div>
                  </div>
                </div>

                {/* Parquet Hardwood Flooring */}
                <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-36 bg-gradient-to-t from-[#2a1708] via-[#45270f] to-[#5c3514] border-t-2 border-[#1f1005] shadow-2xl">
                  {/* Subtle Floor Plank Reflections */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                  {/* Furniture Drop Shadow */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 sm:w-[480px] h-12 bg-black/60 rounded-full blur-xl" />
                </div>

                {/* Photorealistic Designer Sectional Sofa */}
                <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-72 sm:w-[440px] z-10 pointer-events-none">
                  {/* Sofa Backrest */}
                  <div className="w-full h-16 bg-gradient-to-b from-[#334155] to-[#1e293b] rounded-t-3xl border-t border-slate-600 shadow-2xl flex justify-between px-6">
                    <div className="w-1/3 h-full border-r border-slate-700/60" />
                    <div className="w-1/3 h-full border-r border-slate-700/60" />
                    <div className="w-1/3 h-full" />
                  </div>
                  {/* Sofa Cushion Seat */}
                  <div className="w-full h-16 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-2xl border-t border-slate-500/50 shadow-2xl flex items-center justify-around px-4">
                    {/* Plush Accent Throw Pillows */}
                    <div className="w-16 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg border border-amber-500/40 transform -rotate-6" />
                    <div className="w-16 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 shadow-lg border border-white/50" />
                    <div className="w-16 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 shadow-lg border border-teal-500/40 transform rotate-6" />
                  </div>
                  {/* Metallic Legs */}
                  <div className="flex justify-between px-6 pt-1">
                    <div className="w-2.5 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b shadow" />
                    <div className="w-2.5 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b shadow" />
                  </div>
                </div>

                {/* Minimalist Floor Arc Lamp */}
                <div className="absolute bottom-16 left-6 sm:left-12 z-10 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-amber-400/40 blur-lg" />
                  <div className="w-8 h-6 bg-amber-300 rounded-t-full shadow-md border border-amber-200" />
                  <div className="w-1 h-36 bg-gradient-to-b from-slate-700 to-slate-900 mx-auto" />
                  <div className="w-8 h-2 bg-slate-900 rounded-full mx-auto shadow" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. SCENE: PHOTOREALISTIC MASTER BEDROOM SUITE
             ======================================================== */}
          {activeScene === 'bedroom' && (
            <div className="absolute inset-0 bg-slate-950 overflow-hidden">
              <div
                className="absolute inset-0 transition-colors duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              >
                {/* Ceiling Cove Lighting */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-slate-100/95 to-transparent flex justify-center">
                  <div className="w-2/3 h-1 bg-amber-300/80 rounded-full blur-[2px]" />
                </div>

                {/* Wall Niche with Acoustic Wooden Slats */}
                <div className="absolute top-14 left-8 right-8 bottom-32 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,#000000,#000000_6px,transparent_6px,transparent_18px)]" />
                </div>

                {/* Headboard Upholstered Feature Wall Panel */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 sm:w-[420px] h-36 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-t-3xl border-t-2 border-x-2 border-slate-600/80 shadow-2xl p-4 flex flex-col justify-between items-center text-center">
                  <div className="text-xs font-black text-amber-400 font-mono tracking-wider">
                    {selectedColor.brand} • {selectedColor.name}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium">
                    Velvet Smooth Silk Emulsion Finish
                  </div>
                </div>

                {/* Bed Platform & Linen */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-[460px] h-32 bg-gradient-to-t from-[#020617] via-[#0f172a] to-[#1e293b] rounded-t-3xl border-t-2 border-slate-500 shadow-2xl p-4 z-10 flex flex-col justify-between items-center">
                  <div className="flex gap-4 -mt-6">
                    <div className="w-20 h-10 bg-gradient-to-b from-white to-slate-200 rounded-xl shadow-lg border border-slate-300 transform -rotate-3" />
                    <div className="w-20 h-10 bg-gradient-to-b from-white to-slate-200 rounded-xl shadow-lg border border-slate-300 transform rotate-3" />
                  </div>
                  <div className="w-full h-1 bg-amber-500/40 rounded-full" />
                  <div className="text-[11px] font-bold text-slate-300">
                    Master Bedroom Accent Wall • Anti-Fungal Protective Coating
                  </div>
                </div>

                {/* Modern Pendant Sconces on Bedside */}
                <div className="absolute top-20 left-14 z-10 pointer-events-none">
                  <div className="w-0.5 h-16 bg-slate-400 mx-auto" />
                  <div className="w-5 h-5 rounded-full bg-amber-400/90 shadow-[0_0_20px_#f59e0b]" />
                </div>
                <div className="absolute top-20 right-14 z-10 pointer-events-none">
                  <div className="w-0.5 h-16 bg-slate-400 mx-auto" />
                  <div className="w-5 h-5 rounded-full bg-amber-400/90 shadow-[0_0_20px_#f59e0b]" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. SCENE: VILLA BUILDING EXTERIOR FACADE
             ======================================================== */}
          {activeScene === 'exterior' && (
            <div className="absolute inset-0 bg-slate-950 overflow-hidden">
              {/* Sky Background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#bae6fd] flex items-center justify-between px-8">
                <div className="w-12 h-12 rounded-full bg-amber-300/80 blur-md shadow-[0_0_40px_#fef08a]" />
                <div className="text-3xl opacity-80">⛅</div>
              </div>

              {/* Concrete Villa Facade with Painted Texture */}
              <div
                className="absolute top-24 left-0 right-0 bottom-0 transition-colors duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              >
                {/* Roof Border Trim */}
                <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-md flex items-center justify-center">
                  <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                    Berger WeatherCoat Long Life Protection
                  </span>
                </div>

                {/* Modern Architectural Balcony Glass & Frame */}
                <div className="absolute top-10 left-12 right-12 h-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/40 shadow-2xl p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-xs font-black drop-shadow">Exterior Facade Preview</span>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-[9px] font-mono text-amber-400">
                      UV &amp; Heavy Rain Resistant
                    </span>
                  </div>
                  {/* Glass Railing Posts */}
                  <div className="flex justify-around border-t border-white/30 pt-2">
                    <div className="w-1 h-12 bg-slate-300" />
                    <div className="w-1 h-12 bg-slate-300" />
                    <div className="w-1 h-12 bg-slate-300" />
                  </div>
                </div>

                {/* Ground Landscaping */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#14532d] via-[#166534] to-[#15803d] border-t-2 border-emerald-900" />
              </div>
            </div>
          )}

          {/* ========================================================
              4. SCENE: AUTHENTIC CNG AUTO RICKSHAW & STEEL
             ======================================================== */}
          {activeScene === 'cng_rickshaw' && (
            <div className="absolute inset-0 bg-slate-950 overflow-hidden flex flex-col justify-between">
              {/* Workshop Studio Background */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700/60 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-white">Pakundia Commercial Enamel Studio</div>
                  <div className="text-[10px] text-amber-400 font-mono">High Gloss Mirror Sheen (Berger / Aqua)</div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                  Auto Rickshaw Coating
                </span>
              </div>

              {/* Asphalt Road Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 border-t border-slate-700">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/70 rounded-full blur-lg" />
              </div>

              {/* CNG Auto Body Shell with Selected Enamel Paint */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-48 z-10">
                {/* Auto Rickshaw Curved Hood */}
                <div
                  className="w-full h-32 rounded-3xl border-4 border-slate-900 shadow-2xl relative overflow-hidden transition-colors duration-700"
                  style={{ backgroundColor: selectedColor.hex }}
                >
                  {/* High Gloss Specular Automotive Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none" />
                  {/* Front Grille */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-950 rounded-xl border border-slate-700 flex items-center justify-around px-2">
                    <div className="w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b]" />
                    <div className="w-12 h-1 bg-slate-600 rounded-full" />
                    <div className="w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b]" />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950/90 border border-slate-700 text-[9px] font-black text-amber-400 font-mono">
                    {selectedColor.name}
                  </div>
                </div>

                {/* Front Chrome Bumper & Wheels */}
                <div className="flex justify-between items-center px-4 -mt-2">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border-4 border-slate-700 shadow-2xl flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-slate-500" />
                  </div>
                  <div className="flex-1 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full shadow mx-2 border border-slate-300" />
                  <div className="w-12 h-12 rounded-full bg-slate-950 border-4 border-slate-700 shadow-2xl flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-slate-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Shade Floating Info Badge */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 flex items-center justify-between text-white z-20 shadow-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-xl shrink-0 shadow-md border border-white/20"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div className="min-w-0">
                <div className="text-xs font-black truncate">{selectedColor.name}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {selectedColor.code} • {selectedColor.brand} • Finish: {finish.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-[9px] text-slate-400 block">Estimated Can</span>
                <span className="text-xs font-black text-amber-400 font-mono">
                  {formatCurrency(selectedColor.estPrice)}
                </span>
              </div>

              <Link
                href="/products?category=synthetic-enamel-paints"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1 shadow-md"
              >
                <span>Order Shade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 12 Genuine Paint Swatches Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" />
              Click any genuine Berger or Aqua shade to paint:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">12 Genuine Store Shades</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {colorPalettes.map((col) => {
              const isSelected = selectedColor.code === col.code;
              return (
                <button
                  key={col.code}
                  onClick={() => setSelectedColor(col)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 shadow-md ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 shadow-md border border-black/30 flex items-center justify-center"
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">{col.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{col.code}</div>
                    <div className="text-[9px] text-amber-400 font-bold truncate">{col.brand}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
