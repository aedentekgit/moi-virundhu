import React, { useState } from 'react';
import { useMoi } from '../context/MoiContext';
import { exportBackupJSON } from '../utils/exportUtils';
import { Download, Upload, Database, AlertCircle, CheckCircle, FileJson } from 'lucide-react';

export const BackupPage = () => {
  const { entries, settings, importBackupData } = useMoi();
  const [importStatus, setImportStatus] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json && Array.isArray(json.entries)) {
          setPreviewData(json);
          setImportStatus({ text: `File parsed successfully! Contains ${json.entries.length} entries.`, type: 'info' });
        } else {
          setImportStatus({ text: 'Invalid JSON backup format. Required "entries" array missing.', type: 'error' });
          setPreviewData(null);
        }
      } catch (err) {
        setImportStatus({ text: 'Error reading JSON file. File may be corrupted.', type: 'error' });
        setPreviewData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!previewData) return;
    const success = importBackupData(previewData);
    if (success) {
      setImportStatus({ text: '🎉 Backup Data Restored Successfully!', type: 'success' });
      setPreviewData(null);
    } else {
      setImportStatus({ text: 'Failed to restore backup data.', type: 'error' });
    }
  };

  return (
    <div className="h-full p-4 overflow-y-auto bg-gray-100 dark:bg-slate-900 select-none space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-300 dark:border-slate-700">
          <h2 className="text-lg font-extrabold text-[#7A001E] dark:text-yellow-400 flex items-center gap-2">
            <Database size={20} />
            BACKUP & RESTORE DATA
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Safely export your collection database to a JSON file or restore from an existing backup.
          </p>
        </div>

        {/* Status Alert */}
        {importStatus && (
          <div
            className={`p-4 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
              importStatus.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : importStatus.type === 'error'
                ? 'bg-red-100 text-red-900 border-red-300'
                : 'bg-blue-100 text-blue-900 border-blue-300'
            }`}
          >
            {importStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{importStatus.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Backup JSON */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-300 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-[#7A001E] flex items-center justify-center mb-3">
                <Download size={24} />
              </div>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Export Database Backup</h3>
              <p className="text-xs text-gray-500 mt-1">
                Save a complete offline backup file containing all {entries.length} Moi records and software settings.
              </p>
            </div>

            <button
              onClick={() => exportBackupJSON(entries, settings)}
              className="mt-6 w-full py-2.5 bg-[#7A001E] hover:bg-[#560015] text-white font-extrabold text-xs rounded-md shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileJson size={16} className="text-yellow-300" />
              Download JSON Backup
            </button>
          </div>

          {/* Card 2: Restore JSON */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-300 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Restore From Backup</h3>
              <p className="text-xs text-gray-500 mt-1">
                Select a previously saved `.json` file to restore entries and settings into local database.
              </p>
            </div>

            <div className="mt-6">
              <label className="block w-full text-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded cursor-pointer transition-all border border-dashed border-gray-400">
                Choose Backup File (.json)
                <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Restore Preview Confirmation */}
        {previewData && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border-2 border-emerald-600 space-y-4">
            <h3 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle size={18} />
              BACKUP PREVIEW CONFIRMATION
            </h3>

            <div className="bg-emerald-50 dark:bg-slate-900 p-4 rounded text-xs space-y-2 font-mono">
              <div><strong>Backup App:</strong> {previewData.app || 'Unknown'}</div>
              <div><strong>Export Date:</strong> {previewData.exportTimestamp || 'Unknown'}</div>
              <div><strong>Total Records to Import:</strong> {previewData.entries.length}</div>
              <div><strong>Marriage Title:</strong> {previewData.settings?.marriageTitle || '-'}</div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmImport}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded shadow transition-all cursor-pointer"
              >
                Confirm & Overwrite Local Database
              </button>
              <button
                onClick={() => setPreviewData(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-bold text-xs rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
