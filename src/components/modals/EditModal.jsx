import React, { useState, useEffect } from 'react';
import { useMoi } from '../../context/MoiContext';
import { X, Save, Edit3 } from 'lucide-react';
import { TransliteratedInput } from '../common/TransliteratedInput';

export const EditModal = () => {
  const { editModalEntry, setEditModalEntry, updateEntry } = useMoi();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    amount: '',
    mobile: '',
    remarks: ''
  });

  useEffect(() => {
    if (editModalEntry) {
      setFormData({
        name: editModalEntry.name || '',
        address: editModalEntry.address || '',
        amount: editModalEntry.amount || '',
        mobile: editModalEntry.mobile || '',
        remarks: editModalEntry.remarks || ''
      });
    }
  }, [editModalEntry]);

  if (!editModalEntry) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim() || !formData.amount) {
      return;
    }

    updateEntry(editModalEntry.id, formData);
    setEditModalEntry(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-[#7A001E] w-full max-w-md overflow-hidden">
        <div className="bg-[#7A001E] text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
            <Edit3 size={16} />
            EDIT MOI ENTRY ({editModalEntry.receiptNo})
          </h3>
          <button
            onClick={() => setEditModalEntry(null)}
            className="text-white hover:text-yellow-300 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Guest Name
            </label>
            <TransliteratedInput
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-3 pr-10 py-1.5 text-xs font-bold border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Address / Oor
            </label>
            <TransliteratedInput
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-3 pr-10 py-1.5 text-xs font-bold border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-1.5 text-sm font-extrabold font-mono border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                Mobile
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                Remarks
              </label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-slate-700">
            <button
              type="submit"
              className="px-4 py-2 bg-[#7A001E] hover:bg-maroon-900 text-white font-bold text-xs rounded flex items-center gap-1.5 shadow-sm"
            >
              <Save size={14} className="text-yellow-300" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditModalEntry(null)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
