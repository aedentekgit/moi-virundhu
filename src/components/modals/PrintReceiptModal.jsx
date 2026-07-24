import React, { useEffect } from 'react';
import { useMoi } from '../../context/MoiContext';
import { ReceiptTemplate } from '../../print/ReceiptTemplate';
import { X, Printer } from 'lucide-react';

export const PrintReceiptModal = () => {
  const { printModalEntry, setPrintModalEntry, settings } = useMoi();

  const triggerPrint = () => {
    const originalTitle = document.title;
    try {
      document.title = '';
      window.print();
    } finally {
      document.title = originalTitle;
    }
  };

  useEffect(() => {
    if (printModalEntry) {
      const timer = setTimeout(() => {
        triggerPrint();
        setPrintModalEntry(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [printModalEntry]);

  if (!printModalEntry) return null;

  const handlePrint = () => {
    triggerPrint();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-[#7A001E] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#7A001E] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h3 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
            <Printer size={16} />
            PRINT MOI RECEIPT (ATM / POS SLIP)
          </h3>
          <button
            onClick={() => setPrintModalEntry(null)}
            className="text-white hover:text-yellow-300 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Printable Receipt Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-gray-100 dark:bg-slate-900 flex justify-center items-center">
          <ReceiptTemplate entry={printModalEntry} settings={settings} />
        </div>

        {/* Footer Action Buttons */}
        <div className="bg-gray-200 dark:bg-slate-800 px-4 py-2.5 border-t border-gray-300 dark:border-slate-700 flex justify-between items-center flex-shrink-0 text-xs">
          <span className="font-semibold text-gray-600 dark:text-gray-400 text-[11px]">
            Size: 80mm POS Slip / ATM Format
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#7A001E] hover:bg-[#560015] text-white font-extrabold text-xs rounded flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer size={15} className="text-yellow-300" />
              PRINT RECEIPT NOW [Ctrl+P]
            </button>
            <button
              onClick={() => setPrintModalEntry(null)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
