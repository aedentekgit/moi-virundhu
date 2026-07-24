import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ searchInputRef }) => {
  const { searchQuery, setSearchQuery } = useMoi();

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
        <Search size={15} />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search Name, Address, Receipt #..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-8 pr-8 py-1.5 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A001E]"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
