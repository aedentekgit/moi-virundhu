import React, { useState } from 'react';
import { useMoi } from '../../context/MoiContext';
import { Lock, X, KeyRound } from 'lucide-react';

export const PasswordModal = ({ onUnlockSuccess }) => {
  const { isPasswordModalOpen, setIsPasswordModalOpen, settings } = useMoi();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!isPasswordModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPin = settings.securityPin || '1234';

    if (pinInput === correctPin) {
      setIsPasswordModalOpen(false);
      setPinInput('');
      setError(false);
      if (onUnlockSuccess) onUnlockSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-[#7A001E] w-full max-w-sm overflow-hidden select-none">
        <div className="bg-[#7A001E] text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
            <Lock size={16} />
            SETTINGS SECURITY LOCK
          </h3>
          <button
            onClick={() => setIsPasswordModalOpen(false)}
            className="text-white hover:text-yellow-300 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-[#7A001E] dark:text-yellow-300 mx-auto flex items-center justify-center">
              <KeyRound size={24} />
            </div>
            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">
              Enter Administrator PIN
            </h4>
          </div>

          <div>
            <input
              type="password"
              maxLength={8}
              autoFocus
              placeholder="Enter PIN Code"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setError(false);
              }}
              className={`w-full px-3 py-2 text-center text-lg font-mono font-bold tracking-widest border rounded-md focus:ring-2 focus:ring-[#7A001E] focus:outline-none dark:bg-slate-900 dark:text-white ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-slate-700'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 font-bold text-center mt-1">
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#7A001E] hover:bg-maroon-900 text-white font-extrabold text-xs rounded shadow transition-all cursor-pointer"
            >
              Unlock Settings
            </button>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="w-full py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
