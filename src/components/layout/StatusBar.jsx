import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { formatAmountOrMask } from '../../utils/currencyFormatter';
import { CheckCircle2, RotateCcw, Database } from 'lucide-react';

export const StatusBar = () => {
  const { analytics, lastDeletedEntry, undoDelete, isAmountHidden } = useMoi();

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-t border-slate-800 select-none z-10">
      {/* Left side: System status & Storage status */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400 text-[11px]">
          <CheckCircle2 size={13} />
          SYSTEM READY
        </span>
        <span className="h-3 w-px bg-slate-700"></span>
        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Database size={13} className="text-amber-400" />
          Auto-Saved Local DB
        </span>
        
        {lastDeletedEntry && (
          <button
            onClick={undoDelete}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold transition-all shadow-xs"
          >
            <RotateCcw size={12} />
            Undo Delete ({lastDeletedEntry.name})
          </button>
        )}
      </div>

      {/* Center: Live summary count */}
      <div className="hidden md:flex items-center gap-4 font-medium text-slate-300 text-[11px]">
        <span>
          Guests: <strong className="text-white">{analytics.totalGuests}</strong>
        </span>
        <span className="text-slate-700">|</span>
        <span>
          Collection: <strong className="text-emerald-400 font-mono">{formatAmountOrMask(analytics.totalCollection, isAmountHidden)}</strong>
        </span>
      </div>

      {/* Right side: Keyboard Shortcut cheat sheet */}
      <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-400">
        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300"><kbd>Enter</kbd> Save</span>
        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300"><kbd>Ctrl+N</kbd> New</span>
        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300"><kbd>Ctrl+F</kbd> Search</span>
        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300"><kbd>Ctrl+P</kbd> Print</span>
        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300"><kbd>F1</kbd> Help</span>
      </div>
    </footer>
  );
};
