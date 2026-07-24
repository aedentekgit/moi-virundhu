import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { formatIndianCurrency } from '../../utils/currencyFormatter';
import { numberToWords } from '../../utils/numberToWords';
import { X, Printer, User, MapPin, Calendar, Clock, Phone, FileText } from 'lucide-react';

export const ViewModal = () => {
  const { viewModalEntry, setViewModalEntry, setPrintModalEntry } = useMoi();

  if (!viewModalEntry) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-[#7A001E] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-[#7A001E] text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
            <User size={16} />
            MOI ENTRY DETAILS
          </h3>
          <button
            onClick={() => setViewModalEntry(null)}
            className="text-white hover:text-yellow-300 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 dark:bg-slate-900 p-3 rounded-lg border border-amber-200 dark:border-slate-700 flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-gray-500 font-bold">Receipt No:</span>{' '}
              <strong className="text-[#7A001E] dark:text-yellow-400 text-sm">{viewModalEntry.receiptNo}</strong>
            </div>
            <div className="text-right text-gray-600 dark:text-gray-300">
              <div>{viewModalEntry.date}</div>
              <div>{viewModalEntry.time}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1.5 dark:border-slate-700">
              <span className="text-gray-500 font-bold">Guest Name:</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm">{viewModalEntry.name}</span>
            </div>

            <div className="flex justify-between border-b pb-1.5 dark:border-slate-700">
              <span className="text-gray-500 font-bold">Address / Oor:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{viewModalEntry.address}</span>
            </div>

            {viewModalEntry.mobile && (
              <div className="flex justify-between border-b pb-1.5 dark:border-slate-700">
                <span className="text-gray-500 font-bold">Mobile Number:</span>
                <span className="font-mono">{viewModalEntry.mobile}</span>
              </div>
            )}

            {viewModalEntry.remarks && (
              <div className="flex justify-between border-b pb-1.5 dark:border-slate-700">
                <span className="text-gray-500 font-bold">Remarks:</span>
                <span>{viewModalEntry.remarks}</span>
              </div>
            )}
          </div>

          <div className="bg-[#7A001E] text-yellow-300 p-3 rounded-md text-center shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-100">
              Moi Gift Amount
            </div>
            <div className="text-2xl font-black font-mono mt-0.5">
              {formatIndianCurrency(viewModalEntry.amount)}
            </div>
            <div className="text-xs italic text-yellow-100 mt-1 font-serif">
              ({numberToWords(viewModalEntry.amount)})
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-100 dark:bg-slate-900 px-4 py-3 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-2">
          <button
            onClick={() => {
              const item = viewModalEntry;
              setViewModalEntry(null);
              setPrintModalEntry(item);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer size={14} />
            Print Receipt
          </button>
          <button
            onClick={() => setViewModalEntry(null)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
