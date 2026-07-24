import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { HelpCircle, X, Keyboard } from 'lucide-react';

export const HelpShortcutsModal = () => {
  const { isHelpModalOpen, setIsHelpModalOpen } = useMoi();

  if (!isHelpModalOpen) return null;

  const shortcuts = [
    { key: 'Enter', action: 'Save Entry, Clear Form & Focus Name Field' },
    { key: 'Ctrl + N', action: 'Focus Guest Name Input (New Entry)' },
    { key: 'Ctrl + F', action: 'Focus Instant Search Bar' },
    { key: 'Ctrl + P', action: 'Print Last / Selected Receipt' },
    { key: 'F1', action: 'Open Keyboard Shortcuts Help Guide' },
    { key: 'F2', action: 'Quick Edit Last Selected Record' },
    { key: 'F5', action: 'Refresh & Reset Table Filters' },
    { key: 'Tab', action: 'Move to Next Input Field' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-[#7A001E] w-full max-w-md overflow-hidden">
        <div className="bg-[#7A001E] text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
            <Keyboard size={18} />
            KEYBOARD SHORTCUTS GUIDE (POS SPEED)
          </h3>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="text-white hover:text-yellow-300 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Use these keyboard hotkeys to operate the reception table at ultra-high speed without relying on mouse clicks.
          </p>

          <div className="divide-y divide-gray-200 dark:divide-slate-700 border rounded-md overflow-hidden">
            {shortcuts.map((item, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50 text-xs">
                <kbd className="font-mono bg-yellow-100 text-maroon-950 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-400 px-2 py-0.5 rounded font-extrabold">
                  {item.key}
                </kbd>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{item.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-slate-900 px-4 py-2.5 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="px-4 py-1.5 bg-[#7A001E] text-white font-bold text-xs rounded hover:bg-maroon-900"
          >
            Got it (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
