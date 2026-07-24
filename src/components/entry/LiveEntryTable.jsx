import React, { useState, useRef } from 'react';
import { useMoi } from '../../context/MoiContext';
import { formatAmountOrMask } from '../../utils/currencyFormatter';
import { SearchBar } from '../common/SearchBar';
import {
  Printer,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportUtils';

export const LiveEntryTable = ({ searchInputRef }) => {
  const {
    filteredEntries,
    settings,
    lastInsertedId,
    setViewModalEntry,
    setEditModalEntry,
    setDeleteModalEntry,
    setPrintModalEntry,
    filterPeriod,
    setFilterPeriod,
    customDate,
    setCustomDate,
    isAmountHidden,
    toggleHideAmounts
  } = useMoi();

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' newest on top
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Process Sorting
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'amount') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Slice
  const totalPages = Math.ceil(sortedEntries.length / rowsPerPage) || 1;
  const currentPageEntries = sortedEntries.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-300 dark:border-slate-700 flex flex-col w-full h-auto md:h-full overflow-visible md:overflow-hidden select-none">
      {/* Top Filter & Action Header */}
      <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-2">
          {/* Search input */}
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <SearchBar searchInputRef={searchInputRef} />
          </div>

          {/* Filters & Export Options */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <Filter size={13} className="text-slate-500" />
              <select
                value={filterPeriod}
                onChange={(e) => {
                  setFilterPeriod(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="all">All Entries</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="custom">Custom</option>
              </select>

              {filterPeriod === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="text-xs font-semibold px-1.5 py-1 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              )}
            </div>

            {/* Quick Export options */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => exportToPDF(sortedEntries, settings)}
                title="Export Table to PDF"
                className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md flex items-center gap-1 transition-all shadow-xs"
              >
                <FileText size={12} className="text-red-600 dark:text-red-400" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => exportToExcel(sortedEntries, settings)}
                title="Export Table to Excel (.xlsx)"
                className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md flex items-center gap-1 transition-all shadow-xs"
              >
                <FileSpreadsheet size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>

      {/* Mobile Cards View (< md screens) */}
      <div className="w-full md:flex-1 overflow-visible md:overflow-y-auto md:hidden p-2 space-y-2.5">
        {currentPageEntries.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">No Moi Records Found</p>
            <p className="text-xs text-slate-400 mt-1">Start entering guest details in the form</p>
          </div>
        ) : (
          currentPageEntries.map((item, index) => {
            const serialNo = (page - 1) * rowsPerPage + index + 1;
            const isNewlyAdded = item.id === lastInsertedId;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border shadow-xs transition-all ${
                  isNewlyAdded
                    ? 'bg-amber-50/90 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Header: Receipt #, Time & Amount */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      #{serialNo}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#7A001E] dark:text-yellow-400">
                      {item.receiptNo}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      • {item.time}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    {formatAmountOrMask(item.amount, isAmountHidden)}
                  </div>
                </div>

                {/* Content: Guest Name & Address */}
                <div className="space-y-1 mb-2.5">
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.mobile && (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-normal">
                        Ph: {item.mobile}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>
                </div>

                {/* Mobile Touch Action Bar */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => setPrintModalEntry(item)}
                    className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-900 dark:bg-slate-700 dark:text-amber-300 rounded-md border border-amber-200 dark:border-slate-600 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setViewModalEntry(item)}
                    className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-900 dark:bg-slate-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-slate-600 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => setEditModalEntry(item)}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-900 dark:bg-slate-700 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-slate-600 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteModalEntry(item)}
                    className="p-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-md transition-all active:scale-95"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Scrollable Table Area (>= md screens) */}
      <div className="hidden md:block flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead className="bg-[#7A001E] text-yellow-200 text-xs uppercase font-bold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center border-b border-maroon-900">#</th>
              <th
                onClick={() => handleSort('time')}
                className="py-2.5 px-3 cursor-pointer hover:bg-maroon-900 border-b border-maroon-900"
              >
                <div className="flex items-center gap-1">
                  <span>Time</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('receiptNo')}
                className="py-2.5 px-3 cursor-pointer hover:bg-maroon-900 border-b border-maroon-900"
              >
                <div className="flex items-center gap-1">
                  <span>Receipt No</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 cursor-pointer hover:bg-maroon-900 border-b border-maroon-900"
              >
                <div className="flex items-center gap-1">
                  <span>Guest Name</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-2.5 px-3 border-b border-maroon-900">Address / Oor</th>
              <th
                onClick={() => handleSort('amount')}
                className="py-2.5 px-3 text-right cursor-pointer hover:bg-maroon-900 border-b border-maroon-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount (₹)</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHideAmounts();
                    }}
                    title={isAmountHidden ? "Show Amounts" : "Hide Amounts"}
                    className="p-0.5 rounded hover:bg-maroon-800 text-yellow-300"
                  >
                    {isAmountHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center border-b border-maroon-900 w-36">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/70 text-xs font-normal">
            {currentPageEntries.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No Moi Records Found</p>
                  <p className="text-xs text-slate-400 mt-1">Start entering guest details in the form</p>
                </td>
              </tr>
            ) : (
              currentPageEntries.map((item, index) => {
                const serialNo = (page - 1) * rowsPerPage + index + 1;
                const isNewlyAdded = item.id === lastInsertedId;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      isNewlyAdded ? 'row-new font-semibold bg-amber-50/90 dark:bg-amber-900/30' : 'even:bg-slate-50/40 dark:even:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px] font-semibold">{serialNo}</td>
                    <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">{item.time}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-[#7A001E] dark:text-yellow-400">
                      {item.receiptNo}
                    </td>
                    <td className="py-2 px-3 text-slate-900 dark:text-slate-100 font-semibold text-xs">
                      {item.name}
                      {item.mobile && (
                        <span className="block text-[10px] text-slate-400 font-mono font-normal">
                          Ph: {item.mobile}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{item.address}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                      {formatAmountOrMask(item.amount, isAmountHidden)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintModalEntry(item)}
                          title="Print Receipt"
                          className="p-1 rounded-md text-slate-600 hover:text-amber-700 hover:bg-amber-50 dark:text-slate-300 dark:hover:text-amber-300 dark:hover:bg-slate-700 transition-all"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() => setViewModalEntry(item)}
                          title="View Details"
                          className="p-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-300 dark:hover:bg-slate-700 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditModalEntry(item)}
                          title="Edit Entry (F2)"
                          className="p-1 rounded-md text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-slate-300 dark:hover:text-emerald-300 dark:hover:bg-slate-700 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModalEntry(item)}
                          title="Delete Entry"
                          className="p-1 rounded-md text-slate-600 hover:text-red-700 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-slate-700 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-2 bg-gray-100 dark:bg-slate-900 border-t border-gray-300 dark:border-slate-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div>
          Showing {sortedEntries.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} to{' '}
          {Math.min(page * rowsPerPage, sortedEntries.length)} of <strong>{sortedEntries.length}</strong> records
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-1 rounded border border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="p-1 rounded border border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};