'use client';

import React, { useState } from 'react';
import { ClipboardList, X, CheckCircle, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestItemModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [item, setItem] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newRequest = {
      id: `req-${Date.now()}`,
      customerName: name,
      phone,
      productName: item,
      brand: brand || 'Any Brand',
      notes,
      status: 'PENDING SOURCING',
      createdAt: new Date().toISOString(),
    };

    // Save to shared localStorage requests store for Admin Control Panel
    try {
      const existing = JSON.parse(localStorage.getItem('rong_bahar_customer_requests') || '[]');
      localStorage.setItem('rong_bahar_customer_requests', JSON.stringify([newRequest, ...existing]));
    } catch {
      // ignore
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      await fetch(`${API_URL}/products/request-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          productName: item,
          brand,
          notes,
        }),
      });
    } catch {
      // ignore network failure in demo mode
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 z-10 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Request Unlisted Product</h3>
              <p className="text-xs text-amber-400">Can&apos;t find a specific paint or hardware item? We&apos;ll source it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Item Request Received!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Manager Habib from M/S Rong Bahar will check distributor inventory and call you at <strong className="text-slate-200">{phone}</strong> with pricing &amp; arrival timeline.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kabir Hossain"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Product Name &amp; Specifications *</label>
              <input
                type="text"
                required
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. Berger WeatherCoat Glow White 20L Drum"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Preferred Brand / Manufacturer (Optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Berger, Elite, Aqua, Fevicol, HMBR"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Additional Notes / Quantity Required</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need 4 drums for delivery to Mothkhola Bazar road project"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Submitting Request...' : 'Submit Request to Manager'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
