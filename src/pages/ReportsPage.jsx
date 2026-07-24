import React, { useState, useMemo } from 'react';
import { useMoi } from '../context/MoiContext';
import { formatIndianCurrency } from '../utils/currencyFormatter';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
import { FileText, FileSpreadsheet, Printer, Award, TrendingUp, Calendar, Users, IndianRupee } from 'lucide-react';

export const ReportsPage = () => {
  const { entries, settings } = useMoi();
  const [reportType, setReportType] = useState('all'); // 'all', 'today', 'monthly', 'top'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Filtered dataset for report
  const reportEntries = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    if (reportType === 'today') {
      return entries.filter((e) => e.date === today);
    }
    if (reportType === 'monthly') {
      return entries.filter((e) => e.date && e.date.startsWith(selectedMonth));
    }
    if (reportType === 'top') {
      return [...entries].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 20);
    }
    return entries;
  }, [entries, reportType, selectedMonth]);

  // Report Metrics
  const totalAmount = reportEntries.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const amounts = reportEntries.map((e) => Number(e.amount)).filter((a) => a > 0);
  const highest = amounts.length ? Math.max(...amounts) : 0;
  const lowest = amounts.length ? Math.min(...amounts) : 0;
  const average = amounts.length ? Math.round(totalAmount / amounts.length) : 0;

  // Print bulk summary handler
  const handleBulkPrint = () => {
    window.print();
  };

  return (
    <div className="h-full p-4 overflow-y-auto bg-gray-100 dark:bg-slate-900 select-none space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-[#7A001E] dark:text-yellow-400 flex items-center gap-2">
            <FileText size={18} />
            COLLECTION REPORTS & ANALYTICS
          </h2>
          <p className="text-xs text-gray-500">Filter, summarize and export function collection lists</p>
        </div>

        {/* Report type selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReportType('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
              reportType === 'all'
                ? 'bg-[#7A001E] text-white shadow'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Collections
          </button>
          <button
            onClick={() => setReportType('today')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
              reportType === 'today'
                ? 'bg-[#7A001E] text-white shadow'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Today's Report
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
              reportType === 'monthly'
                ? 'bg-[#7A001E] text-white shadow'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Monthly Report
          </button>
          <button
            onClick={() => setReportType('top')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
              reportType === 'top'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Top Contributors (Top 20)
          </button>

          {reportType === 'monthly' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold px-2 py-1 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
            />
          )}
        </div>

        {/* Exports */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToPDF(reportEntries, settings, `Moi Report (${reportType.toUpperCase()})`)}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded flex items-center gap-1 shadow"
          >
            <FileText size={14} />
            Export PDF
          </button>
          <button
            onClick={() => exportToExcel(reportEntries, settings)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded flex items-center gap-1 shadow"
          >
            <FileSpreadsheet size={14} />
            Export Excel
          </button>
          <button
            onClick={handleBulkPrint}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded flex items-center gap-1 shadow"
          >
            <Printer size={14} />
            Print Report
          </button>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Filtered Records</span>
          <div className="text-xl font-extrabold font-mono text-gray-900 dark:text-white mt-0.5">
            {reportEntries.length} Guests
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Amount</span>
          <div className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
            {formatIndianCurrency(totalAmount)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Highest Gift</span>
          <div className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
            {formatIndianCurrency(highest)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Average Gift</span>
          <div className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
            {formatIndianCurrency(average)}
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-300 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#7A001E] text-yellow-200 uppercase font-extrabold">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-3">Receipt No</th>
              <th className="py-2.5 px-3">Date & Time</th>
              <th className="py-2.5 px-3">Guest Name</th>
              <th className="py-2.5 px-3">Address</th>
              <th className="py-2.5 px-3">Mobile</th>
              <th className="py-2.5 px-3 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700 font-semibold">
            {reportEntries.map((item, index) => (
              <tr key={item.id} className="hover:bg-amber-50 dark:hover:bg-slate-700/50">
                <td className="py-2 px-3 text-center text-gray-500 font-mono">{index + 1}</td>
                <td className="py-2 px-3 font-mono font-bold text-[#7A001E] dark:text-yellow-400">
                  {item.receiptNo}
                </td>
                <td className="py-2 px-3 text-gray-600 dark:text-gray-300 font-mono">
                  {item.date} {item.time}
                </td>
                <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">{item.name}</td>
                <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{item.address}</td>
                <td className="py-2 px-3 text-gray-600 dark:text-gray-400 font-mono">{item.mobile || '-'}</td>
                <td className="py-2 px-3 text-right font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatIndianCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
