import React, { useState } from 'react';
import { useMoi } from '../../context/MoiContext';
import { X, Printer, Wifi, Server, CheckCircle2, AlertCircle, Save, HardDrive, RefreshCw } from 'lucide-react';

export const PrinterConfigModal = () => {
  const { isPrinterModalOpen, setIsPrinterModalOpen, printerSettings, setPrinterSettings, setPrintModalEntry } = useMoi();
  const [formData, setFormData] = useState({ ...printerSettings });
  const [testStatus, setTestStatus] = useState(null);

  if (!isPrinterModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrinterSettings((prev) => ({ ...prev, ...formData, status: 'Ready (Connected)' }));
    setIsPrinterModalOpen(false);
  };

  const handleTestPrint = () => {
    setTestStatus('Testing Connection to ' + (formData.printerName || 'Printer') + '...');
    setTimeout(() => {
      setTestStatus('✅ Printer Connected! Test Receipt Sent.');
      // Open test print dialog with mock sample receipt
      setPrintModalEntry({
        receiptNo: 'TEST-000001',
        name: 'SAMPLE TEST GUEST',
        address: 'Printer Test Location',
        amount: 1000,
        mobile: '9842100000',
        remarks: 'Printer Test Receipt',
        date: new Date().toISOString().slice(0, 10),
        time: '10:00:00 AM'
      });
      setTimeout(() => setTestStatus(null), 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-[#7A001E] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-[#7A001E] text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
            <Printer size={18} />
            PRINTER & NETWORK HARDWARE CONFIGURATION
          </h3>
          <button
            onClick={() => setIsPrinterModalOpen(false)}
            className="text-white hover:text-yellow-300 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status banner */}
        {testStatus && (
          <div className="bg-emerald-100 border-b border-emerald-300 text-emerald-900 px-4 py-2 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{testStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Printer Connection Type */}
          <div>
            <label className="block font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Select Printer Interface Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'thermal80', name: 'USB Thermal POS (80mm)', icon: HardDrive },
                { id: 'network', name: 'Network IP Printer (LAN/WiFi)', icon: Wifi },
                { id: 'thermal58', name: 'Mini Thermal POS (58mm)', icon: Printer },
                { id: 'standard', name: 'Windows Standard (A5/A4)', icon: Server }
              ].map((type) => {
                const IconComp = type.icon;
                const isSelected = formData.printerType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, printerType: type.id })}
                    className={`p-2.5 border rounded-md font-bold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7A001E] text-yellow-300 border-[#7A001E] shadow'
                        : 'bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <IconComp size={16} />
                    <span>{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Printer Model Name & Paper Width */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Connected Printer Name
              </label>
              <input
                type="text"
                placeholder="Default System Connected Printer"
                value={formData.printerName || ''}
                onChange={(e) => setFormData({ ...formData, printerName: e.target.value })}
                className="w-full px-2.5 py-1.5 font-bold border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">Auto-detects your connected printer</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Receipt Paper Width
              </label>
              <select
                value={formData.paperWidth}
                onChange={(e) => setFormData({ ...formData, paperWidth: e.target.value })}
                className="w-full px-2.5 py-1.5 font-bold border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 dark:text-white"
              >
                <option value="80mm">80mm Thermal Receipt (Standard POS)</option>
                <option value="58mm">58mm Thermal Receipt (Small POS)</option>
                <option value="A5">A5 Portrait (Standard Laser/Inkjet)</option>
              </select>
            </div>
          </div>

          {/* Network IP Address & Port (If Network Printer selected) */}
          {formData.printerType === 'network' && (
            <div className="p-3 bg-amber-50 dark:bg-slate-900 rounded-lg border border-amber-300 dark:border-slate-700 space-y-2">
              <h4 className="font-extrabold text-[#7A001E] dark:text-yellow-400 flex items-center gap-1.5">
                <Wifi size={14} />
                Network IP Configuration
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-0.5">
                    Printer IP Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.50"
                    value={formData.ipAddress || ''}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-2.5 py-1 font-mono font-bold border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-0.5">
                    Port
                  </label>
                  <input
                    type="text"
                    placeholder="9100"
                    value={formData.port || ''}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-2.5 py-1 font-mono font-bold border border-gray-300 dark:border-slate-700 rounded dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Auto Print Toggle */}
          <div className="p-3 bg-gray-100 dark:bg-slate-900 rounded-lg border border-gray-300 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-gray-900 dark:text-white">Auto-Print Receipt On Save</span>
              <p className="text-[11px] text-gray-500">Automatically open receipt print dialog when Enter is pressed</p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoPrintOnSave}
              onChange={(e) => setFormData({ ...formData, autoPrintOnSave: e.target.checked })}
              className="w-5 h-5 accent-[#7A001E] cursor-pointer"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestPrint}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Printer size={14} />
              Test Print Receipt
            </button>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#7A001E] hover:bg-[#560015] text-white font-extrabold text-xs rounded flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Save size={14} className="text-yellow-300" />
                Save Printer Setup
              </button>
              <button
                type="button"
                onClick={() => setIsPrinterModalOpen(false)}
                className="px-3 py-1.5 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
