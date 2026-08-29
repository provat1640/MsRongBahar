'use client';

import { useEffect } from 'react';

/**
 * Lightweight background keep-alive and pre-warming component.
 * Non-blocking: Silently pings the health endpoint once when customer arrives on the site
 * so Render's free container is awake before they proceed to checkout or search.
 */
export function BackendWakeup() {
  useEffect(() => {
    // Fire-and-forget silent pre-warming ping
    const warmUp = async () => {
      try {
        await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store',
        });
      } catch {
        // Silent catch: network failure will not affect user experience
      }
    };

    // Run after initial page render settles
    const timer = setTimeout(warmUp, 1500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
