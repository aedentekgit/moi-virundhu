import React, { useState } from 'react';
import { EntryForm } from '../components/entry/EntryForm';
import { LiveEntryTable } from '../components/entry/LiveEntryTable';
import { useMoi } from '../context/MoiContext';
import { PlusCircle, List } from 'lucide-react';

export const MainCollectionPage = ({ nameInputRef, searchInputRef, onPrintLastEntry }) => {
  const [activeSubTab, setActiveSubTab] = useState('form'); // 'form' or 'table'
  const { filteredEntries } = useMoi();

  return (
    <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-2.5 p-2 sm:p-3 h-auto lg:h-full overflow-visible lg:overflow-hidden">
      {/* Mobile/Tablet Sub-Tab Toggle */}
      <div className="flex lg:hidden bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700/80 w-full flex-shrink-0 shadow-xs mb-1">
        <button
          onClick={() => setActiveSubTab('form')}
          className={`flex-1 py-2 text-xs font-semibold tracking-wide rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'form'
              ? 'bg-[#7A001E] text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/60'
          }`}
        >
          <PlusCircle size={15} />
          New Entry Form
        </button>
        <button
          onClick={() => setActiveSubTab('table')}
          className={`flex-1 py-2 text-xs font-semibold tracking-wide rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'table'
              ? 'bg-[#7A001E] text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/60'
          }`}
        >
          <List size={15} />
          View Table ({filteredEntries.length})
        </button>
      </div>

      {/* Left Column: Form Panel (5 cols on lg) */}
      <div className={`${activeSubTab === 'form' ? 'flex' : 'hidden'} lg:flex lg:col-span-5 flex-col h-auto lg:h-full overflow-visible lg:overflow-hidden`}>
        <EntryForm nameInputRef={nameInputRef} onPrintLastEntry={onPrintLastEntry} />
      </div>

      {/* Right Column: Live Data Table (7 cols on lg) */}
      <div className={`${activeSubTab === 'table' ? 'flex' : 'hidden'} lg:flex lg:col-span-7 flex-col h-auto lg:h-full overflow-visible lg:overflow-hidden`}>
        <LiveEntryTable searchInputRef={searchInputRef} />
      </div>
    </div>
  );
};
