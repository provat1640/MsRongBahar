import React from 'react';
import { PowerOff, ShieldAlert, ServerOff, DatabaseZap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
          <PowerOff className="w-3.5 h-3.5" />
          <span>Website &amp; Services Shut Down</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          M/S Rong Bahar
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
          The online storefront, cloud microservices, and database connections have been decommissioned and taken offline.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
            <ServerOff className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Domain &amp; Hosting</div>
              <div className="text-xs text-rose-400 font-medium mt-0.5">Disconnected</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
            <DatabaseZap className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Database Pool</div>
              <div className="text-xs text-rose-400 font-medium mt-0.5">Severed</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
            <PowerOff className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Storefront API</div>
              <div className="text-xs text-rose-400 font-medium mt-0.5">Offline</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Order System</div>
              <div className="text-xs text-rose-400 font-medium mt-0.5">Terminated</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          Pakundia Bazar, Kishoreganj &bull; System Decommissioned
        </div>
      </div>
    </div>
  );
}
