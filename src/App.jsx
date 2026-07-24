import React, { useState, useRef } from 'react';
import { MoiProvider, useMoi } from './context/MoiContext';
import { TopToolbar } from './components/layout/TopToolbar';
import { StatusBar } from './components/layout/StatusBar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { DashboardCards } from './components/dashboard/DashboardCards';
import { MainCollectionPage } from './pages/MainCollectionPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { BackupPage } from './pages/BackupPage';

// Modals
import { ViewModal } from './components/modals/ViewModal';
import { EditModal } from './components/modals/EditModal';
import { DeleteModal } from './components/modals/DeleteModal';
import { PrintReceiptModal } from './components/modals/PrintReceiptModal';
import { HelpShortcutsModal } from './components/modals/HelpShortcutsModal';
import { PasswordModal } from './components/modals/PasswordModal';
import { PrinterConfigModal } from './components/modals/PrinterConfigModal';
import { ReceiptNoModal } from './components/modals/ReceiptNoModal';

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('collection');
  const {
    setIsHelpModalOpen,
    setIsPasswordModalOpen,
    setPrintModalEntry,
    setEditModalEntry,
    entries,
    setSearchQuery,
    setFilterPeriod
  } = useMoi();

  // Focus Refs
  const nameInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Global Desktop Hotkeys Handlers
  useKeyboardShortcuts({
    onCtrlN: () => {
      setActiveTab('collection');
      setTimeout(() => {
        if (nameInputRef.current) nameInputRef.current.focus();
      }, 50);
    },
    onCtrlF: () => {
      setActiveTab('collection');
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    },
    onCtrlP: () => {
      if (entries.length > 0) {
        setPrintModalEntry(entries[0]);
      }
    },
    onF1: () => setIsHelpModalOpen(true),
    onF2: () => {
      if (entries.length > 0) {
        setEditModalEntry(entries[0]);
      }
    },
    onF5: () => {
      setSearchQuery('');
      setFilterPeriod('all');
    }
  });

  const handlePrintLastEntry = (entry) => {
    setPrintModalEntry(entry);
  };

  const handleUnlockSettings = () => {
    setActiveTab('settings');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 dark:bg-slate-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100">
      {/* Top Desktop Toolbar */}
      <TopToolbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dashboard Analytics Bar */}
      <DashboardCards />

      {/* Main Software Content View */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden relative">
        {activeTab === 'collection' && (
          <MainCollectionPage
            nameInputRef={nameInputRef}
            searchInputRef={searchInputRef}
            onPrintLastEntry={handlePrintLastEntry}
          />
        )}
        {activeTab === 'reports' && <ReportsPage />}
        {activeTab === 'settings' && <SettingsPage />}
        {activeTab === 'backup' && <BackupPage />}
      </main>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Dialog Overlay */}
      <ViewModal />
      <EditModal />
      <DeleteModal />
      <PrintReceiptModal />
      <HelpShortcutsModal />
      <PasswordModal onUnlockSuccess={handleUnlockSettings} />
      <PrinterConfigModal />
      <ReceiptNoModal />
    </div>
  );
};

export default function App() {
  return (
    <MoiProvider>
      <AppContent />
    </MoiProvider>
  );
}
