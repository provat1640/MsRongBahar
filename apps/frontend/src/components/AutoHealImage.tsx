'use client';

import React, { useState, useEffect } from 'react';
import { selfHealingEngine } from '../lib/selfHealing';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackCategory?: string;
  className?: string;
}

/**
 * 🖼️ AutoHealImage: Self-Repairing Image Component
 * Detects 404 or broken assets, auto-generates a dynamic SVG replacement canvas,
 * and logs self-repair telemetry into the Self-Healing Engine.
 */
export function AutoHealImage({
  src,
  alt,
  fallbackCategory = 'Hardware & Paint',
  className = '',
  ...props
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [healed, setHealed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setHealed(false);
  }, [src]);

  const handleError = () => {
    if (hasError) return;
    setHasError(true);

    const generatedSvg = selfHealingEngine.generateFallbackSvg(alt || 'Product Item', fallbackCategory);
    setCurrentSrc(generatedSvg);
    setHealed(true);

    // Record self-healing telemetry
    selfHealingEngine.recordEvent({
      category: 'IMAGE_ASSET',
      severity: 'HEALED',
      message: `Repaired broken asset reference for "${alt || 'Unknown Product'}" with dynamic canvas.`,
      details: `Original URL: ${src}`,
      repairedSuccessfully: true,
    });
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        className={className}
        {...props}
      />
      {healed && (
        <span
          title="Asset self-healed by AutoDoctor"
          className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[8px] font-black text-emerald-300 backdrop-blur-xs flex items-center gap-1 shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Healed
        </span>
      )}
    </div>
  );
}
