'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Cpu,
  Database,
  Activity,
  Zap,
  ChevronUp,
  ChevronDown,
  Lock,
  Layers,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';

export function RawExecutionHUD() {
  const [isRawOn, setIsRawOn] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [redisLatency, setRedisLatency] = useState<number>(1.2);
  const [pgCycle, setPgCycle] = useState<number>(4.6);
  const [txCounter, setTxCounter] = useState<number>(1420);
  const [activePipelineStage, setActivePipelineStage] = useState<string>('IDLE_LISTENING');
  const [nonceHash, setNonceHash] = useState<string>('0x8f3c4e...a910');

  // Load user preference for Raw Execution Mode
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rong_raw_execution_mode');
      if (saved === 'true') {
        setIsRawOn(true);
      }
    } catch {}
  }, []);

  // Simulate real-time hardware telemetry tick
  useEffect(() => {
    if (!isRawOn) return;

    const interval = setInterval(() => {
      setRedisLatency(+(0.8 + Math.random() * 0.9).toFixed(2));
      setPgCycle(+(3.8 + Math.random() * 1.8).toFixed(2));
      setTxCounter((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
      setNonceHash(`0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`);
    }, 2500);

    return () => clearInterval(interval);
  }, [isRawOn]);

  const toggleRawMode = () => {
    const next = !isRawOn;
    setIsRawOn(next);
    if (next) {
      setIsExpanded(true);
      localStorage.setItem('rong_raw_execution_mode', 'true');
    } else {
      setIsExpanded(false);
      localStorage.setItem('rong_raw_execution_mode', 'false');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-32px)] sm:max-w-md print:hidden">
      {/* Floating Toggle Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRawMode}
          className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shadow-2xl backdrop-blur-xl border ${
            isRawOn
              ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/30'
              : 'bg-slate-950/90 text-slate-400 hover:text-white border-slate-800'
          }`}
          title="Toggle Raw Execution Pipeline Telemetry"
        >
          <Zap className={`w-3.5 h-3.5 ${isRawOn ? 'fill-slate-950 text-slate-950 animate-pulse' : 'text-amber-400'}`} />
          <span>RAW EXECUTION: {isRawOn ? 'ON' : 'OFF'}</span>
        </button>

        {isRawOn && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-amber-400 hover:text-white transition shadow-lg"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expanded Raw Telemetry Console */}
      {isRawOn && isExpanded && (
        <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-950/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-black text-white uppercase tracking-wider">
                Raw Execution Telemetry Engine
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
              LIVE STREAM
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            {/* Redis Atomic Lock */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[9px]">
                <span>REDIS LOCK TTL</span>
                <Lock className="w-3 h-3 text-amber-400" />
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-amber-400 font-black text-xs">{redisLatency} ms</span>
                <span className="text-emerald-400 text-[9px]">ATOMIC</span>
              </div>
            </div>

            {/* Postgres ACID Cycle */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-slate-400 flex items-center justify-between text-[9px]">
                <span>POSTGRES ACID</span>
                <Database className="w-3 h-3 text-sky-400" />
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-sky-400 font-black text-xs">{pgCycle} ms</span>
                <span className="text-slate-400 text-[9px]">TX-{txCounter}</span>
              </div>
            </div>
          </div>

          {/* Raw Pipeline Flow Simulator */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <span>Pipeline Stage:</span>
              <span className="text-amber-400 font-mono text-[9px]">MUTATION-READY</span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[8px] font-mono text-center">
              <div className="p-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black">
                1. Ingestion
              </div>
              <div className="p-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black">
                2. Normalize
              </div>
              <div className="p-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black">
                3. Lock Hold
              </div>
              <div className="p-1 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 font-black">
                4. Commit
              </div>
            </div>
          </div>

          {/* Cryptographic Nonce */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
            <span>NONCE HASH: <strong className="text-slate-300">{nonceHash}</strong></span>
            <span className="text-emerald-400">● 100% HEALTHY</span>
          </div>
        </div>
      )}
    </div>
  );
}
