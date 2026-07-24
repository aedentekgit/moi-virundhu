import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  loadEntriesFromStorage,
  saveEntriesToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  loadPrinterSettingsFromStorage,
  savePrinterSettingsToStorage
} from '../utils/storage';
import { getTodayDateString, formatTime12Hour, isDuplicateWithinMinutes } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.VITE_API_URL || '';

const MoiContext = createContext();

export const MoiProvider = ({ children }) => {
  const [entries, setEntries] = useState(() => loadEntriesFromStorage());
  const [settings, setSettings] = useState(() => loadSettingsFromStorage());
  const [printerSettings, setPrinterSettings] = useState(() => loadPrinterSettingsFromStorage());
  const [lastDeletedEntry, setLastDeletedEntry] = useState(null);
  const [lastInsertedId, setLastInsertedId] = useState(null);
  const [isAmountHidden, setIsAmountHidden] = useState(false);

  // Modals & UI states
  const [viewModalEntry, setViewModalEntry] = useState(null);
  const [editModalEntry, setEditModalEntry] = useState(null);
  const [deleteModalEntry, setDeleteModalEntry] = useState(null);
  const [printModalEntry, setPrintModalEntry] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const [isReceiptNoModalOpen, setIsReceiptNoModalOpen] = useState(false);
  const [pendingSettingsAccess, setPendingSettingsAccess] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [customDate, setCustomDate] = useState('');

  const [dbStatus, setDbStatus] = useState('checking'); // 'connected', 'error', 'checking'
  const [dbError, setDbError] = useState(null);

  const isInitialMount = useRef(true);

  // Check DB health and load initial data from Backend APIs on mount
  useEffect(() => {
    const initFetch = async () => {
      try {
        const resHealth = await fetch(`${API_BASE}/api/health`);
        if (resHealth.ok) {
          const healthData = await resHealth.json();
          if (healthData.dbConnected) {
            setDbStatus('connected');
            setDbError(null);
          } else {
            setDbStatus('error');
            setDbError(healthData.error || 'Database connection error');
          }
        } else {
          const healthErr = await resHealth.json().catch(() => ({}));
          setDbStatus('error');
          setDbError(healthErr.error || `Server error (HTTP ${resHealth.status})`);
        }
      } catch (err) {
        console.warn('Backend server un-reachable or offline:', err);
        setDbStatus('error');
        setDbError('Backend server un-reachable');
      }

      try {
        const resEntries = await fetch(`${API_BASE}/api/entries`);
        if (resEntries.ok) {
          const data = await resEntries.json();
          if (Array.isArray(data)) {
            setEntries(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch entries, falling back to LocalStorage', err);
        setEntries(loadEntriesFromStorage());
      }

      try {
        const resSettings = await fetch(`${API_BASE}/api/settings`);
        if (resSettings.ok) {
          const data = await resSettings.json();
          if (data && !data.error) {
            setSettings(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings, falling back to LocalStorage', err);
        setSettings(loadSettingsFromStorage());
      }

      try {
        const resPrinter = await fetch(`${API_BASE}/api/printer-settings`);
        if (resPrinter.ok) {
          const data = await resPrinter.json();
          if (data && !data.error) {
            setPrinterSettings(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch printer settings, falling back to LocalStorage', err);
        setPrinterSettings(loadPrinterSettingsFromStorage());
      }

      setTimeout(() => {
        isInitialMount.current = false;
      }, 500);
    };
    initFetch();
  }, []);

  // Auto save to LocalStorage (as offline fallback) and Backend DB
  useEffect(() => {
    saveEntriesToStorage(entries);
  }, [entries]);

  useEffect(() => {
    saveSettingsToStorage(settings);
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');

    if (!isInitialMount.current) {
      fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      }).catch(err => console.error('Error saving settings to db:', err));
    }
  }, [settings]);

  useEffect(() => {
    savePrinterSettingsToStorage(printerSettings);

    if (!isInitialMount.current) {
      fetch(`${API_BASE}/api/printer-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(printerSettings)
      }).catch(err => console.error('Error saving printer settings to db:', err));
    }
  }, [printerSettings]);

  const toggleHideAmounts = () => {
    setIsAmountHidden((prev) => !prev);
  };

  // Compute Next Receipt Number
  const generateNextReceiptNo = () => {
    const prefix = settings.receiptPrefix || 'MOI-';
    const nextNum = settings.receiptNextNum || (entries.length + 1);
    const formattedNum = String(nextNum).padStart(6, '0');
    return `${prefix}${formattedNum}`;
  };

  // Add New Entry
  const addEntry = (formData) => {
    const now = new Date();
    const receiptNo = generateNextReceiptNo();
    
    const newEntry = {
      id: 'moi-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      receiptNo,
      name: formData.name.trim(),
      address: formData.address.trim(),
      amount: Number(formData.amount),
      mobile: formData.mobile ? formData.mobile.trim() : '',
      remarks: formData.remarks ? formData.remarks.trim() : '',
      date: getTodayDateString(),
      time: formatTime12Hour(now),
      createdAt: now.toISOString()
    };

    const isDup = isDuplicateWithinMinutes(newEntry, entries, 5);

    // Save entry to server in background
    fetch(`${API_BASE}/api/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    })
    .then(async (res) => {
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error('Error saving entry to backend DB:', errJson);
        setDbStatus('error');
        setDbError(errJson.details || errJson.error || `HTTP ${res.status}`);
      } else {
        setDbStatus('connected');
        setDbError(null);
      }
    })
    .catch(err => {
      console.error('Error saving entry to backend:', err);
      setDbStatus('error');
      setDbError('Network connection failed');
    });

    // Update settings (receiptNextNum) on client & server
    const updatedSettings = {
      ...settings,
      receiptNextNum: (settings.receiptNextNum || 100) + 1
    };

    fetch(`${API_BASE}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings)
    }).catch(err => console.error('Error saving updated settings:', err));

    setEntries((prev) => [newEntry, ...prev]);
    setLastInsertedId(newEntry.id);
    setSettings(updatedSettings);

    if (newEntry.amount >= 10000) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    // Auto-open print receipt modal if Auto-Print On Save is enabled
    if (printerSettings.autoPrintOnSave !== false) {
      setTimeout(() => {
        setPrintModalEntry(newEntry);
      }, 300);
    }

    return { entry: newEntry, isDuplicate: isDup };
  };

  const updateEntry = (id, updatedFields) => {
    const targetEntry = entries.find((e) => e.id === id);
    if (targetEntry) {
      const mergedEntry = { ...targetEntry, ...updatedFields, amount: Number(updatedFields.amount) };
      // Update entry on server in background
      fetch(`${API_BASE}/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedEntry)
      }).catch(err => console.error('Error updating entry in backend:', err));
    }

    setEntries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields, amount: Number(updatedFields.amount) } : item
      )
    );
  };

  const deleteEntry = (id) => {
    // Delete entry on server in background
    fetch(`${API_BASE}/api/entries/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error('Error deleting entry in backend:', err));

    const target = entries.find((e) => e.id === id);
    if (target) {
      setLastDeletedEntry(target);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const undoDelete = () => {
    if (lastDeletedEntry) {
      // Re-add entry to server in background
      fetch(`${API_BASE}/api/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lastDeletedEntry)
      }).catch(err => console.error('Error restoring entry in backend:', err));

      setEntries((prev) => [lastDeletedEntry, ...prev]);
      setLastDeletedEntry(null);
    }
  };

  const importBackupData = (backupObj) => {
    if (backupObj && Array.isArray(backupObj.entries)) {
      // Send bulk import request
      fetch(`${API_BASE}/api/backup/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: backupObj.entries,
          settings: backupObj.settings
        })
      }).catch(err => console.error('Error importing backup to db:', err));

      setEntries(backupObj.entries);
      if (backupObj.settings) {
        setSettings((prev) => ({ ...prev, ...backupObj.settings }));
      }
      return true;
    }
    return false;
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.receiptNo.toLowerCase().includes(q) ||
        String(item.amount).includes(q) ||
        (item.mobile && item.mobile.includes(q));

      if (!matchSearch) return false;

      const today = getTodayDateString();
      if (filterPeriod === 'today') {
        return item.date === today;
      }
      if (filterPeriod === 'yesterday') {
        const yDate = new Date();
        yDate.setDate(yDate.getDate() - 1);
        const yString = yDate.toISOString().slice(0, 10);
        return item.date === yString;
      }
      if (filterPeriod === 'custom' && customDate) {
        return item.date === customDate;
      }

      return true;
    });
  }, [entries, searchQuery, filterPeriod, customDate]);

  const analytics = useMemo(() => {
    const todayStr = getTodayDateString();
    const todayEntries = entries.filter((e) => e.date === todayStr);

    const totalCollection = entries.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const todayCollection = todayEntries.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const amounts = entries.map((e) => Number(e.amount)).filter((a) => !isNaN(a) && a > 0);
    const highestMoi = amounts.length ? Math.max(...amounts) : 0;
    const lowestMoi = amounts.length ? Math.min(...amounts) : 0;
    const averageMoi = amounts.length ? Math.round(totalCollection / amounts.length) : 0;

    const lastEntry = entries.length > 0 ? entries[0] : null;

    return {
      totalGuests: entries.length,
      todayGuests: todayEntries.length,
      totalCollection,
      todayCollection,
      highestMoi,
      lowestMoi,
      averageMoi,
      lastEntry
    };
  }, [entries]);

  const updateStartingReceiptNo = (newNum, newPrefix) => {
    const num = Math.max(1, parseInt(newNum, 10) || 1);
    const prefix = newPrefix !== undefined ? newPrefix : (settings.receiptPrefix || 'MOI-');
    const updatedSettings = {
      ...settings,
      receiptPrefix: prefix,
      receiptNextNum: num
    };
    setSettings(updatedSettings);
    saveSettingsToStorage(updatedSettings);
    fetch(`${API_BASE}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings)
    }).catch(err => console.error('Error saving updated receipt number settings:', err));
  };

  return (
    <MoiContext.Provider
      value={{
        dbStatus,
        dbError,
        entries,
        filteredEntries,
        settings,
        setSettings,
        printerSettings,
        setPrinterSettings,
        lastDeletedEntry,
        lastInsertedId,
        isAmountHidden,
        toggleHideAmounts,
        addEntry,
        updateEntry,
        deleteEntry,
        undoDelete,
        importBackupData,
        analytics,
        updateStartingReceiptNo,
        // Modals & UI state
        viewModalEntry,
        setViewModalEntry,
        editModalEntry,
        setEditModalEntry,
        deleteModalEntry,
        setDeleteModalEntry,
        printModalEntry,
        setPrintModalEntry,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isPasswordModalOpen,
        setIsPasswordModalOpen,
        isPrinterModalOpen,
        setIsPrinterModalOpen,
        isReceiptNoModalOpen,
        setIsReceiptNoModalOpen,
        pendingSettingsAccess,
        setPendingSettingsAccess,
        searchQuery,
        setSearchQuery,
        filterPeriod,
        setFilterPeriod,
        customDate,
        setCustomDate
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

export const useMoi = () => {
  const context = useContext(MoiContext);
  if (!context) {
    throw new Error('useMoi must be used within a MoiProvider');
  }
  return context;
};
