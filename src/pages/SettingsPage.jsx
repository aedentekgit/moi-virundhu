import React, { useState } from 'react';
import { useMoi } from '../context/MoiContext';
import { FUNCTION_TYPES } from '../utils/storage';
import { Save, Settings as SettingsIcon, CheckCircle, Shield, Heart, Hash, Layers } from 'lucide-react';

export const SettingsPage = () => {
  const { settings, setSettings } = useMoi();
  const [formData, setFormData] = useState({
    ...settings,
    functionType: settings.functionType || 'marriage',
    hostName1: settings.hostName1 || settings.brideName || '',
    hostName2: settings.hostName2 || settings.groomName || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active function configuration definition
  const currentFuncConfig = FUNCTION_TYPES.find((f) => f.id === formData.functionType) || FUNCTION_TYPES[0];

  const handleFunctionTypeChange = (typeId) => {
    const targetConfig = FUNCTION_TYPES.find((f) => f.id === typeId) || FUNCTION_TYPES[0];
    setFormData((prev) => ({
      ...prev,
      functionType: typeId,
      marriageTitle: targetConfig.defaultTitle
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Maintain backward compatibility for brideName/groomName
    const updated = {
      ...formData,
      brideName: formData.hostName1,
      groomName: formData.hostName2
    };
    setSettings((prev) => ({ ...prev, ...updated }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="h-full w-full p-3 bg-gray-100 dark:bg-slate-900 select-none lg:overflow-hidden overflow-y-auto flex flex-col">
      <div className="w-full h-auto lg:h-full bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-300 dark:border-slate-700 flex flex-col lg:overflow-hidden">
        {/* Full Width Top Header Banner */}
        <div className="bg-[#7A001E] text-white px-4 py-2 flex items-center justify-between border-b-2 border-[#D4AF37] flex-shrink-0">
          <div>
            <h2 className="text-sm md:text-base font-extrabold text-yellow-300 flex items-center gap-2">
              <SettingsIcon size={18} />
              SOFTWARE & FUNCTION SETTINGS (தமிழ்நாடு சுப நிகழ்வுகள்)
            </h2>
            <p className="text-[11px] text-yellow-100">
              Customize function type (திருமணம், காது குத்து, சடங்கு, கிடா வெட்டு, கிரகப்பிரவேசம்), receipts, and security
            </p>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-extrabold flex items-center gap-1.5 shadow animate-in fade-in">
              <CheckCircle size={15} />
              Settings Saved Successfully!
            </div>
          )}
        </div>

        {/* Main Settings Form Grid (Full Width, No Scrollbar) */}
        <form onSubmit={handleSubmit} className="p-3.5 flex-1 flex flex-col justify-between lg:overflow-hidden overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:overflow-hidden">
            {/* Left Column (6 Cols): Function Type & Details */}
            <div className="lg:col-span-6 space-y-2.5 bg-gray-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-gray-200 dark:border-slate-700">
              <h3 className="text-xs font-extrabold uppercase text-[#7A001E] dark:text-yellow-400 border-b pb-1 flex items-center gap-1.5">
                <Layers size={15} />
                1. Function Type & Details (நிகழ்ச்சி விவரங்கள்)
              </h3>

              <div className="space-y-2">
                {/* Function Type Selector Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Select Function Type (விழா வகை)
                  </label>
                  <select
                    value={formData.functionType}
                    onChange={(e) => handleFunctionTypeChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold border border-amber-300 rounded-md bg-amber-50 text-amber-950 dark:bg-slate-900 dark:text-yellow-300 focus:ring-2 focus:ring-[#7A001E]"
                  >
                    {FUNCTION_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Function Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Function Title (விழா தலைப்பு)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.marriageTitle}
                    onChange={(e) => setFormData({ ...formData, marriageTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white focus:ring-1 focus:ring-[#7A001E]"
                  />
                </div>

                {/* Dynamic Host Name Inputs based on Function Type */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {currentFuncConfig.h1}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hostName1}
                      onChange={(e) => setFormData({ ...formData, hostName1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {currentFuncConfig.h2}
                    </label>
                    <input
                      type="text"
                      value={formData.hostName2}
                      onChange={(e) => setFormData({ ...formData, hostName2: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Venue / Mahal (மண்டபம் / இடம்)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Function Date (தேதி)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (6 Cols): Receipt & Security Settings */}
            <div className="lg:col-span-6 space-y-2.5 bg-gray-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase text-[#7A001E] dark:text-yellow-400 border-b pb-1 flex items-center gap-1.5">
                  <Hash size={15} />
                  2. Receipt Generator & Printing Format
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Receipt Prefix
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.receiptPrefix}
                      onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Starting / Next Receipt No (ரசீது தொடக்க எண்)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.receiptNextNum}
                      onChange={(e) => setFormData({ ...formData, receiptNextNum: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-amber-400 dark:border-amber-600 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                    <div className="flex gap-1 mt-1">
                      {[1, 101, 501, 1001].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, receiptNextNum: p })}
                          className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border ${
                            formData.receiptNextNum === p
                              ? 'bg-[#7A001E] text-white border-[#7A001E]'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:bg-amber-100'
                          }`}
                        >
                          #{p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.currencySymbol}
                      onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Print Footer Thank You Message (நன்றி உரை)
                  </label>
                  <input
                    type="text"
                    value={formData.printFooter}
                    onChange={(e) => setFormData({ ...formData, printFooter: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Security PIN Section */}
              <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-xs font-extrabold uppercase text-[#7A001E] dark:text-yellow-400 mb-1 flex items-center gap-1.5">
                  <Shield size={14} />
                  Security Lock PIN
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.securityPin}
                      onChange={(e) => setFormData({ ...formData, securityPin: e.target.value })}
                      className="w-full px-3 py-1.5 text-center font-mono font-bold text-xs border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500">
                    PIN code required to open settings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Bottom Action Bar */}
          <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 flex-shrink-0">
            <button
              type="submit"
              className="px-8 py-2 bg-[#7A001E] hover:bg-[#560015] text-white font-extrabold text-xs rounded-md shadow-md flex items-center gap-2 border border-yellow-500/40 active:scale-95 transition-all cursor-pointer"
            >
              <Save size={15} className="text-yellow-300" />
              SAVE ALL SETTINGS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
