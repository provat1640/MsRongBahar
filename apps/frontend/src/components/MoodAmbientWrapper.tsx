'use client';

import React, { useState, useEffect } from 'react';
import { CustomerMoodId, customerMoods, MoodProfile } from '../lib/imaginationEngine';

export function MoodAmbientWrapper({ children }: { children: React.ReactNode }) {
  const [activeMood, setActiveMood] = useState<MoodProfile>(customerMoods.royal);

  useEffect(() => {
    try {
      const savedMoodId = localStorage.getItem('rong_customer_mood') as CustomerMoodId;
      if (savedMoodId && customerMoods[savedMoodId]) {
        setActiveMood(customerMoods[savedMoodId]);
      }
    } catch {}

    const handleMoodChange = (e: CustomEvent) => {
      if (e.detail && customerMoods[e.detail as CustomerMoodId]) {
        setActiveMood(customerMoods[e.detail as CustomerMoodId]);
      }
    };

    window.addEventListener('rong_mood_change' as any, handleMoodChange);
    return () => window.removeEventListener('rong_mood_change' as any, handleMoodChange);
  }, []);

  return (
    <div className="relative min-h-screen w-full transition-colors duration-700">
      {/* Dynamic Ambient Aura Lighting Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-30 transition-all duration-1000"
      >
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] bg-gradient-to-b ${activeMood.auraGradient} transition-all duration-1000`}
        />
        <div
          className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full blur-[120px] opacity-60 transition-all duration-1000"
          style={{ backgroundColor: activeMood.accentColor }}
        />
      </div>

      {/* Main App Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
