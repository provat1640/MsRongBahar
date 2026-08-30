'use client';

import React, { useState } from 'react';
import {
  CustomerMoodId,
  customerMoods,
  MoodProfile,
  analyzeCustomerIntent,
} from '../lib/imaginationEngine';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import {
  Sparkles,
  Wand2,
  Check,
  ShoppingCart,
  ArrowRight,
  Lightbulb,
  Palette,
  ShieldCheck,
  Send,
  Heart,
} from 'lucide-react';

interface Props {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ImaginationStudio({ isModal = false, isOpen = true, onClose }: Props) {
  const { addItem } = useCart();
  const [selectedMoodId, setSelectedMoodId] = useState<CustomerMoodId>('royal');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [kitAdded, setKitAdded] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (isModal && !isOpen) return null;

  const activeMood: MoodProfile = customerMoods[selectedMoodId];

  const handleMoodSelect = (moodId: CustomerMoodId) => {
    setSelectedMoodId(moodId);
    try {
      localStorage.setItem('rong_customer_mood', moodId);
      window.dispatchEvent(new CustomEvent('rong_mood_change', { detail: moodId }));
    } catch {}
  };

  const handlePromptAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      const matched = analyzeCustomerIntent(userPrompt);
      handleMoodSelect(matched.id);
      setAnalyzing(false);
    }, 400);
  };

  const handleAddKitToCart = () => {
    activeMood.suggestedKit.items.forEach((item) => {
      addItem({
        productId: item.productId,
        variantName: item.variantName || null,
        productTitle: item.productTitle,
        unitPrice: item.unitPrice,
        image: item.image,
        unit: item.unit,
        maxStock: item.maxStock,
        quantity: item.quantity,
      });
    });

    setKitAdded(true);
    setTimeout(() => setKitAdded(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Title & Tagline */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black tracking-wide uppercase">
          <Wand2 className="w-3.5 h-3.5" />
          Rong Bahar Imagination Studio &amp; Mood Engine
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          What Is Your Vision &amp; Mood Today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          Select an emotional aesthetic or describe your dream space in words. Our AI engine curates matching Berger swatches, architectural coatings, and hardware bundles.
        </p>
      </div>

      {/* Natural Language Prompt Search Bar */}
      <form
        onSubmit={handlePromptAnalyze}
        className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-slate-900/90 dark:bg-slate-950/90 p-2 rounded-2xl sm:rounded-3xl border border-slate-700 dark:border-slate-800 shadow-xl"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g. 'I want to paint a quiet monsoon-proof bedroom with rain resistance'..."
            className="w-full pl-4 pr-3 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={analyzing}
          className="px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl transition flex items-center justify-center gap-2 shadow-md shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{analyzing ? 'Matching...' : 'Imagine Project'}</span>
        </button>
      </form>

      {/* 6 Mood Selector Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {(Object.keys(customerMoods) as CustomerMoodId[]).map((moodId) => {
          const mood = customerMoods[moodId];
          const isSelected = selectedMoodId === moodId;

          return (
            <button
              key={moodId}
              onClick={() => handleMoodSelect(moodId)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105 ring-2 ring-amber-500/30'
                  : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className="text-base">{mood.emoji}</span>
              <span>{mood.name.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Mood Showcase Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Banner with Quote */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeMood.emoji}</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeMood.name}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic font-medium">
              &quot;{activeMood.quote}&quot;
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">
            Ideal For: {activeMood.idealFor}
          </div>
        </div>

        {/* Color Harmony Swatches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Curated Color &amp; Tone Harmony
            </span>
            <span className="text-[10px] text-slate-500">Click swatch to copy shade code</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeMood.colorPalette.map((color) => (
              <button
                key={color.code}
                onClick={() => handleCopyCode(color.code)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition flex items-center gap-3 text-left group shadow-xs"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 shadow-md border border-white/20 transition group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {color.name}
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                    {copiedCode === color.code ? '✓ Copied!' : color.code}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {color.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Complete Dream Kit */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-black tracking-wider block">
                Recommended Setup
              </span>
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {activeMood.suggestedKit.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeMood.suggestedKit.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Complete Bundle</span>
                <span className="text-base sm:text-lg font-black text-amber-500 dark:text-amber-400 font-mono">
                  {formatCurrency(activeMood.suggestedKit.estimatedCost)}
                </span>
              </div>

              <button
                onClick={handleAddKitToCart}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shrink-0"
              >
                {kitAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add Complete Kit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contractor Wisdom Tip */}
        <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl">
          <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-white font-bold">Pakundia Contractor Tip: </strong>
            <span>{activeMood.contractorTip}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-800 z-10">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
