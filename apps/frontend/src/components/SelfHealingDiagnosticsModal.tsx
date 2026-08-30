'use client';

import React, { useState, useEffect } from 'react';
import { selfHealingEngine, SystemHealthMetrics, HealingEvent } from '../lib/selfHealing';
import {
  ShieldCheck,
  X,
  Activity,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Wifi,
  Sparkles,
  Layers,
  Clock,
  Terminal,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SelfHealingDiagnosticsModal({ isOpen, onClose }: Props) {
  const [metrics, setMetrics] = useState<SystemHealthMetrics>(selfHealingEngine.getMetrics());
  const [repairing, setRepairing] = useState(false);
  const [repairSuccess, setRepairSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = selfHealingEngine.subscribe((updated) => {
      setMetrics(updated);
    });
    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeepRepair = () => {
    setRepairing(true);
    setRepairSuccess(false);

    setTimeout(() => {
      selfHealingEngine.runDeepSystemRepair();
      setRepairing(false);
      setRepairSuccess(true);
      setTimeout(() => setRepairSuccess(false), 3000);
    }, 800);
  };

  const getSeverityBadge = (severity: HealingEvent['severity']) => {
    switch (severity) {
      case 'HEALED':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'CRITICAL':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-400';
      case 'WARNING':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'INFO':
      default:
        return 'bg-sky-500/15 border-sky-500/30 text-sky-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  System Health &amp; Self-Repair Center
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                  AutoDoctor v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous fault interception, broken asset healing, and memory buffer reconciliation
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

        {/* Health Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Health Score */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Health Score</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {metrics.score}%
              </span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase">Optimal</span>
            </div>
          </div>

          {/* Autonomous Repairs */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Auto Repairs</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {metrics.totalRepairs}
              </span>
              <span className="text-[10px] text-amber-500 font-bold uppercase">Resolved</span>
            </div>
          </div>

          {/* Storage State */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Storage State</span>
              <Database className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2">
              <span className="text-sm font-black text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {metrics.storageIntegrity}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Reconciled</span>
            </div>
          </div>

          {/* Network Link */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Resilience</span>
              <Wifi className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2">
              <span className="text-sm font-black text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                {metrics.networkResilience}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Auto-Retrying</span>
            </div>
          </div>
        </div>

        {/* Action Bar: Deep Diagnostic Trigger */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-black text-white">Autonomous Self-Healing Protocol</div>
              <div className="text-[11px] text-slate-400">
                Purges corrupted nodes, sanitizes storage keys, and tests API responsiveness.
              </div>
            </div>
          </div>

          <button
            onClick={handleDeepRepair}
            disabled={repairing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${repairing ? 'animate-spin' : ''}`} />
            <span>{repairing ? 'Diagnosing & Healing...' : repairSuccess ? '✓ System Healed!' : 'Run 1-Click Deep Repair'}</span>
          </button>
        </div>

        {/* Real-time Telemetry & Repair Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" /> Live Autonomous Event Log
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Auto-refreshed stream ({metrics.activeRepairs.length} records)
            </span>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 max-h-60 overflow-y-auto space-y-2 font-mono text-[11px]">
            {metrics.activeRepairs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No anomalies detected. System operating at 100% peak integrity.
              </div>
            ) : (
              metrics.activeRepairs.map((event) => (
                <div
                  key={event.id}
                  className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3 text-slate-300"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-black border uppercase ${getSeverityBadge(
                          event.severity,
                        )}`}
                      >
                        {event.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">[{event.category}]</span>
                      <span className="text-[10px] text-slate-500">{event.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">{event.message}</p>
                    {event.details && (
                      <p className="text-[10px] text-slate-500 truncate">{event.details}</p>
                    )}
                  </div>

                  <span className="shrink-0 text-emerald-400 text-[10px] font-black flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Repaired
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-500 border-t border-slate-800 pt-3">
          M/S Rong Bahar Self-Healing Engine • Continuous Background Watchdog • Pakundia, Kishoreganj
        </div>
      </div>
    </div>
  );
}
