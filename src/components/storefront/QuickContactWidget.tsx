'use client';

import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export default function QuickContactWidget() {
  const shopPhone = '+8801722452836';
  const whatsappUrl = `https://wa.me/8801722452836?text=${encodeURIComponent('Assalamu Alaikum, I am inquiring about product availability at M/S Rong Bahar (Pakundia, Kishoreganj).')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
        title="Chat on WhatsApp (01722452836)"
      >
        <MessageSquare className="w-5 h-5 animate-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-sm font-semibold">
          WhatsApp Order (01722452836)
        </span>
      </a>

      {/* Direct Call Button */}
      <a
        href={`tel:${shopPhone}`}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
        title="Call Shop Directly"
      >
        <Phone className="w-5 h-5 fill-current" />
        <span className="text-sm font-bold">Call Shop</span>
      </a>
    </div>
  );
}
