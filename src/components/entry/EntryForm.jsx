import React, { useState, useRef, useEffect } from 'react';
import { useMoi } from '../../context/MoiContext';
import { formatIndianCurrency } from '../../utils/currencyFormatter';
import { Save, Eraser, Printer, User, MapPin, IndianRupee, Phone, FileText, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { TransliteratedInput } from '../common/TransliteratedInput';

export const EntryForm = ({ nameInputRef, onPrintLastEntry }) => {
  const { addEntry, settings, setIsReceiptNoModalOpen } = useMoi();

  // Controlled form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    amount: '',
    mobile: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [lastSavedInfo, setLastSavedInfo] = useState(null);

  // Input refs for smooth Tab / Enter navigation
  const addressRef = useRef(null);
  const amountRef = useRef(null);
  const mobileRef = useRef(null);
  const remarksRef = useRef(null);

  // Auto focus Name field on mount
  useEffect(() => {
    if (nameInputRef && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [nameInputRef]);

  // Handle Input Changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Quick Amount preset buttons
  const setQuickAmount = (val) => {
    setFormData((prev) => ({ ...prev, amount: String(val) }));
    if (amountRef.current) amountRef.current.focus();
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Guest Name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    const amt = Number(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0 || !Number.isInteger(amt)) {
      newErrors.amount = 'Valid positive whole number required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!validate()) {
      return;
    }

    const { entry, isDuplicate } = addEntry(formData);

    // Show toast message
    const msg = isDuplicate
      ? `⚠️ Duplicate entry detected for ${entry.name} (₹${entry.amount})`
      : `✅ Saved! Receipt: ${entry.receiptNo} - ${entry.name}`;

    setToastMessage({ text: msg, type: isDuplicate ? 'warning' : 'success' });
    setLastSavedInfo(entry);

    // Auto Clear Form
    setFormData({
      name: '',
      address: '',
      amount: '',
      mobile: '',
      remarks: ''
    });

    setErrors({});

    // Auto Focus back to Name field
    setTimeout(() => {
      if (nameInputRef && nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 50);

    // Clear toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Form Keydown for Enter Key Workflow
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      address: '',
      amount: '',
      mobile: '',
      remarks: ''
    });
    setErrors({});
    if (nameInputRef && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-[#7A001E]/30 flex flex-col w-full h-auto lg:h-full overflow-visible lg:overflow-hidden select-none">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#7A001E] to-[#560015] text-white px-3.5 py-2 flex items-center justify-between flex-shrink-0">
        <h2 className="font-bold text-sm tracking-wide text-yellow-300 flex items-center gap-2">
          <User size={16} />
          GUEST MOI ENTRY FORM
        </h2>
        <button
          type="button"
          onClick={() => setIsReceiptNoModalOpen(true)}
          title="Click to set/change starting receipt number"
          className="text-xs font-mono bg-yellow-400 hover:bg-yellow-300 text-maroon-950 font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow transition transform active:scale-95"
        >
          <span>{settings.receiptPrefix}{String(settings.receiptNextNum || 101).padStart(6, '0')}</span>
          <Edit2 size={12} className="text-maroon-900" />
        </button>
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`px-3 py-1 text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
            toastMessage.type === 'warning'
              ? 'bg-amber-100 text-amber-900 border-b border-amber-300'
              : 'bg-emerald-100 text-emerald-900 border-b border-emerald-300'
          }`}
        >
          {toastMessage.type === 'warning' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between overflow-visible lg:overflow-y-auto">
        <div className="space-y-2 sm:space-y-2.5">
          {/* Guest Name */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-0.5 sm:mb-1">
              Guest Name (பெயர்) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                <User size={15} />
              </div>
              <TransliteratedInput
                ref={nameInputRef}
                placeholder="Enter Guest Name (பெயர்)"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addressRef)}
                className={`w-full pl-8 pr-9 py-1.5 text-xs sm:text-sm font-medium border rounded-md focus:ring-2 focus:ring-[#7A001E] focus:outline-none dark:bg-slate-900 dark:text-white ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-500 font-medium mt-0.5">{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-0.5 sm:mb-1">
              Address / Oor (ஊர் / முகவரி) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                <MapPin size={15} />
              </div>
              <TransliteratedInput
                ref={addressRef}
                placeholder="Enter Address / Oor (ஊர் / முகவரி)"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, amountRef)}
                className={`w-full pl-8 pr-9 py-1.5 text-xs sm:text-sm font-medium border rounded-md focus:ring-2 focus:ring-[#7A001E] focus:outline-none dark:bg-slate-900 dark:text-white ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.address && <p className="text-[11px] text-red-500 font-medium mt-0.5">{errors.address}</p>}
          </div>

          {/* Amount (₹) */}
          <div>
            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Moi Amount (தொகை ₹) <span className="text-red-500">*</span>
              </label>
              {formData.amount > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {formatIndianCurrency(formData.amount)}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A001E] font-bold text-sm">
                ₹
              </div>
              <input
                ref={amountRef}
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 500, 1000, 5000"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, mobileRef)}
                className={`w-full pl-8 pr-3 py-1.5 text-sm font-bold font-mono border rounded-md focus:ring-2 focus:ring-[#7A001E] focus:outline-none dark:bg-slate-900 dark:text-white ${
                  errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.amount && <p className="text-[11px] text-red-500 font-medium mt-0.5">{errors.amount}</p>}

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[500, 1000, 2000, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuickAmount(preset)}
                  className="px-2 py-0.5 text-xs font-medium font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#7A001E] hover:text-white dark:hover:bg-amber-600 dark:hover:text-white border border-slate-200 dark:border-slate-600 rounded-md transition-all cursor-pointer"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile & Remarks */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
                Mobile (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={14} />
                </div>
                <input
                  ref={mobileRef}
                  type="tel"
                  placeholder="98421xxxxx"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, remarksRef)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#7A001E] focus:outline-none dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
                Remarks (குறிப்பு)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <FileText size={14} />
                </div>
                <TransliteratedInput
                  ref={remarksRef}
                  placeholder="e.g. Relative / Friend"
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#7A001E] focus:outline-none dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="w-full py-2 px-2.5 bg-[#7A001E] hover:bg-[#560015] text-white font-bold text-xs rounded-md shadow-sm flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              <Save size={14} className="text-yellow-300" />
              SAVE ENTRY [ENTER]
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full py-2 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
            >
              <Eraser size={14} />
              Clear Form
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (lastSavedInfo && onPrintLastEntry) {
                onPrintLastEntry(lastSavedInfo);
              }
            }}
            disabled={!lastSavedInfo}
            className={`w-full py-1.5 px-2.5 border rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
              lastSavedInfo
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 dark:bg-slate-800 dark:border-amber-700 dark:text-amber-300 shadow-xs cursor-pointer'
                : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Printer size={14} />
            Print Last Receipt ({lastSavedInfo ? lastSavedInfo.receiptNo : 'Ctrl+P'})
          </button>
        </div>
      </form>
    </div>
  );
};
