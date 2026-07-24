/**
 * Date and Time utilities for Tamil Nadu Marriage Moi Software
 */

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime12Hour = (dateObj = new Date()) => {
  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const isDuplicateWithinMinutes = (newEntry, existingEntries, minutes = 5) => {
  if (!existingEntries || !existingEntries.length) return false;
  const now = new Date(newEntry.createdAt || Date.now()).getTime();
  const timeLimit = minutes * 60 * 1000;

  return existingEntries.some(entry => {
    const entryTime = new Date(entry.createdAt).getTime();
    const isSameName = entry.name.trim().toLowerCase() === newEntry.name.trim().toLowerCase();
    const isSameAmount = Number(entry.amount) === Number(newEntry.amount);
    const isWithinTime = (now - entryTime) <= timeLimit;

    return isSameName && isSameAmount && isWithinTime;
  });
};
