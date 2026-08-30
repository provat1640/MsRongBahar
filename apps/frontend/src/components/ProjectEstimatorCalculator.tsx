'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import {
  Calculator,
  Paintbrush,
  Droplets,
  Layers,
  Check,
  ShoppingCart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function ProjectEstimatorCalculator() {
  const { addItem } = useCart();

  const [lengthFeet, setLengthFeet] = useState<number>(14);
  const [heightFeet, setHeightFeet] = useState<number>(10);
  const [doorsWindows, setDoorsWindows] = useState<number>(2);
  const [coats, setCoats] = useState<number>(2);
  const [surfaceType, setSurfaceType] = useState<'interior' | 'exterior' | 'wood_metal'>('interior');
  const [added, setAdded] = useState<boolean>(false);

  // Calculations
  const grossArea = lengthFeet * heightFeet * 4; // 4 walls of standard room
  const deduction = doorsWindows * 21; // ~21 sq ft per door/window
  const netArea = Math.max(50, grossArea - deduction);

  // Coverage rates per litre
  const coveragePerLitre = surfaceType === 'interior' ? 130 : surfaceType === 'exterior' ? 100 : 120;
  const litresNeeded = +((netArea * coats) / coveragePerLitre).toFixed(1);
  const gallonsNeeded = Math.ceil(litresNeeded / 3.64);
  const estPaintPrice = gallonsNeeded * 1700;
  const brushCost = 130 * 2;
  const totalCost = estPaintPrice + brushCost;

  const handleAddEstimateToCart = () => {
    // Add calculated paint gallon
    addItem({
      productId: 'prod-1',
      variantName: `3.64L Gallon – CNG Royal Green (${gallonsNeeded} Gallons)`,
      productTitle: 'Berger Robbialac Super Gloss Synthetic Enamel',
      unitPrice: 1700,
      quantity: gallonsNeeded,
      image: '/products/2412.jpg',
      unit: 'Volume & Color',
      maxStock: 20,
    });

    // Add 2x 3-inch Brushes
    addItem({
      productId: 'prod-6',
      variantName: '75 mm (3 Inch) Brush',
      productTitle: 'Professional Industrial Paint Brush Series (White Bristle)',
      unitPrice: 130,
      quantity: 2,
      image: '/products/2417.jpg',
      unit: 'Width (mm / Inch)',
      maxStock: 30,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Berger Paint Coverage &amp; Cost Estimator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate exact litres, gallons, and matching brushes for your Pakundia project
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-amber-500 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Instant Accuracy
        </span>
      </div>

      {/* Input Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
        {/* Room Dimensions */}
        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300">Room Wall Length (Feet):</label>
          <input
            type="number"
            min="6"
            max="60"
            value={lengthFeet}
            onChange={(e) => setLengthFeet(Number(e.target.value) || 1)}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300">Wall Height (Feet):</label>
          <input
            type="number"
            min="6"
            max="25"
            value={heightFeet}
            onChange={(e) => setHeightFeet(Number(e.target.value) || 1)}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300">Coats Needed:</label>
          <select
            value={coats}
            onChange={(e) => setCoats(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
          >
            <option value={1}>1 Coat (Touchup / Refresh)</option>
            <option value={2}>2 Coats (Standard Full Finish)</option>
            <option value={3}>3 Coats (High Protection Outdoor)</option>
          </select>
        </div>
      </div>

      {/* Surface Type Selection */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold pt-1">
        <span className="text-slate-500 dark:text-slate-400 mr-2 shrink-0">Surface Type:</span>
        {[
          { id: 'interior', label: '🏠 Interior Smooth Wall' },
          { id: 'exterior', label: '🏡 Exterior Concrete Facade' },
          { id: 'wood_metal', label: '🚪 Hardwood / Metal Gate' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setSurfaceType(type.id as any)}
            className={`px-3 py-1.5 rounded-xl transition border whitespace-nowrap ${
              surfaceType === type.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Calculation Results Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="grid grid-cols-3 gap-4 text-center sm:text-left min-w-0">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Area</div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">
              {netArea} sq. ft
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Paint Volume</div>
            <div className="text-sm sm:text-base font-black text-amber-500 dark:text-amber-400 font-mono">
              {litresNeeded} L (~{gallonsNeeded} Gal)
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Estimated Cost</div>
            <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(totalCost)}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddEstimateToCart}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Add Calculated Paint &amp; Brushes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
