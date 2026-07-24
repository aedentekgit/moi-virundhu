import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/currencyFormatter';

export const DeleteModal = () => {
  const { deleteModalEntry, setDeleteModalEntry, deleteEntry } = useMoi();

  if (!deleteModalEntry) return null;

  const handleConfirm = () => {
    deleteEntry(deleteModalEntry.id);
    setDeleteModalEntry(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-red-600 w-full max-w-sm overflow-hidden">
        <div className="bg-red-700 text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <AlertTriangle size={18} className="text-yellow-300" />
            CONFIRM DELETE
          </h3>
          <button
            onClick={() => setDeleteModalEntry(null)}
            className="text-white hover:text-yellow-300 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 text-xs space-y-3">
          <p className="text-gray-800 dark:text-gray-200 font-semibold">
            Are you sure you want to delete this Moi entry?
          </p>

          <div className="bg-red-50 dark:bg-slate-900 p-3 rounded border border-red-200 dark:border-slate-700 space-y-1 font-mono">
            <div><strong>Receipt No:</strong> {deleteModalEntry.receiptNo}</div>
            <div><strong>Guest:</strong> {deleteModalEntry.name}</div>
            <div><strong>Amount:</strong> <span className="text-red-700 dark:text-red-400 font-extrabold">{formatIndianCurrency(deleteModalEntry.amount)}</span></div>
          </div>

          <p className="text-[11px] text-gray-500 italic">
            * Note: You can undo this deletion using the status bar button.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-slate-900 px-4 py-3 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-2">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs rounded flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 size={14} />
            Yes, Delete Entry
          </button>
          <button
            onClick={() => setDeleteModalEntry(null)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
