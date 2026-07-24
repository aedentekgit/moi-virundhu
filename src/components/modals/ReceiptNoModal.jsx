import React, { useState, useEffect } from 'react';
import { useMoi } from '../../context/MoiContext';
import { Hash, X, Check, RefreshCw, Zap } from 'lucide-react';

export const ReceiptNoModal = () => {
  const {
    isReceiptNoModalOpen,
    setIsReceiptNoModalOpen,
    settings,
    updateStartingReceiptNo
  } = useMoi();

  const [prefix, setPrefix] = useState(settings.receiptPrefix || 'MOI-');
  const [nextNum, setNextNum] = useState(settings.receiptNextNum || 101);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (isReceiptNoModalOpen) {
      setPrefix(settings.receiptPrefix || 'MOI-');
      setNextNum(settings.receiptNextNum || 101);
    }
  }, [isReceiptNoModalOpen, settings]);

  if (!isReceiptNoModalOpen) return null;

  const handleClose = () => {
    setIsReceiptNoModalOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const num = Math.max(1, parseInt(nextNum, 10) || 1);
    updateStartingReceiptNo(num, prefix);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setIsReceiptNoModalOpen(false);
    }, 1000);
  };

  const handlePreset = (presetVal) => {
    setNextNum(presetVal);
  };

  const formattedPreview = `${prefix || ''}${String(Math.max(1, parseInt(nextNum, 10) || 1)).padStart(6, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-[#7A001E]/40 w-full max-w-md overflow-hidden select-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A001E] to-[#560015] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-300">
              <Hash size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-yellow-300 tracking-wide">
                SET STARTING RECEIPT NUMBER
              </h3>
              <p className="text-[11px] text-yellow-100/90 font-medium">
                ரசீது தொடக்க எண் / அடுத்த ரசீது எண் அமைப்பது
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Live Preview Card */}
          <div className="bg-amber-50 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-700/50 rounded-lg p-3 text-center">
            <span className="text-[11px] font-extrabold uppercase text-amber-800 dark:text-amber-300 block mb-1">
              Next Generated Receipt Preview
            </span>
            <div className="text-2xl font-mono font-black text-[#7A001E] dark:text-yellow-400 tracking-wider">
              {formattedPreview}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Prefix Field */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Prefix (முன்னொட்டு)
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. MOI-"
                className="w-full px-3 py-2 text-xs font-mono font-extrabold border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-[#7A001E]"
              />
            </div>

            {/* Starting Number Field */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Starting Number (தொடக்க எண்) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={nextNum}
                onChange={(e) => setNextNum(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono font-black border border-amber-400 dark:border-amber-600 rounded-lg dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-[#7A001E]"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1">
              <Zap size={13} className="text-yellow-600 dark:text-yellow-400" />
              Quick Presets:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 101, 501, 1001].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`py-1 px-2 text-xs font-mono font-bold rounded-md border transition ${
                    Number(nextNum) === preset
                      ? 'bg-[#7A001E] text-white border-[#7A001E]'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-amber-100 dark:hover:bg-slate-600'
                  }`}
                >
                  #{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold text-white bg-[#7A001E] hover:bg-[#560015] rounded-lg shadow-md flex items-center gap-1.5 transition"
            >
              {toast ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                <>
                  <RefreshCw size={14} /> Update Starting No.
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
