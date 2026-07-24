import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatIndianCurrency } from './currencyFormatter';
import { formatDisplayDate } from './dateUtils';

/**
 * Export entries array to PDF document
 */
export const exportToPDF = (entries, settings, title = 'Marriage Moi Collection Report') => {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(122, 0, 30); // Royal Maroon
  doc.text(settings.marriageTitle || title, 14, 15);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Bride: ${settings.brideName} | Groom: ${settings.groomName}`, 14, 22);
  doc.text(`Venue: ${settings.venue} | Date: ${formatDisplayDate(settings.date)}`, 14, 28);

  const totalAmount = entries.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 0);
  doc.text(`Total Entries: ${entries.length} | Total Moi Collection: ${formatIndianCurrency(totalAmount)}`, 14, 35);

  // Table Data
  const tableRows = entries.map((item, index) => [
    index + 1,
    item.receiptNo,
    item.date,
    item.time,
    item.name,
    item.address,
    item.mobile || '-',
    formatIndianCurrency(item.amount, false)
  ]);

  doc.autoTable({
    startY: 40,
    head: [['S.No', 'Receipt No', 'Date', 'Time', 'Guest Name', 'Address', 'Mobile', 'Amount (₹)']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [122, 0, 30],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 25 },
      7: { halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`Moi_Collection_${settings.date || 'Report'}.pdf`);
};

/**
 * Export entries to XLSX spreadsheet
 */
export const exportToExcel = (entries, settings) => {
  const data = entries.map((item, index) => ({
    'S.No': index + 1,
    'Receipt No': item.receiptNo,
    'Date': item.date,
    'Time': item.time,
    'Guest Name': item.name,
    'Address': item.address,
    'Amount (₹)': Number(item.amount),
    'Mobile': item.mobile || '',
    'Remarks': item.remarks || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Moi Collection');

  XLSX.writeFile(workbook, `Moi_Collection_${settings.date || 'Report'}.xlsx`);
};

/**
 * Export entries to CSV
 */
export const exportToCSV = (entries, settings) => {
  const headers = ['S.No,Receipt No,Date,Time,Guest Name,Address,Amount,Mobile,Remarks'];
  const rows = entries.map((item, index) => [
    index + 1,
    `"${item.receiptNo}"`,
    `"${item.date}"`,
    `"${item.time}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.address.replace(/"/g, '""')}"`,
    item.amount,
    `"${item.mobile || ''}"`,
    `"${(item.remarks || '').replace(/"/g, '""')}"`
  ].join(','));

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Moi_Collection_${settings.date || 'Report'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download complete JSON backup file
 */
export const exportBackupJSON = (entries, settings) => {
  const backupObject = {
    app: 'Tamil Nadu Marriage Moi Software',
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    settings,
    entries
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObject, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `Moi_Backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
