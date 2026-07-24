import React, { useState } from 'react';
import { useMoi } from '../../context/MoiContext';
import { useLiveClock } from '../../hooks/useLiveClock';
import { formatAmountOrMask } from '../../utils/currencyFormatter';
import { FUNCTION_TYPES } from '../../utils/storage';
import {
  Printer,
  Download,
  Upload,
  Settings,
  HelpCircle,
  Clock,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Heart,
  Eye,
  EyeOff,
  Sparkles,
  Home,
  Baby,
  Wifi,
  HardDrive,
  Hash
} from 'lucide-react';
import { exportBackupJSON } from '../../utils/exportUtils';

export const TopToolbar = ({ activeTab, setActiveTab }) => {
  const {
    settings,
    setSettings,
    analytics,
    setIsHelpModalOpen,
    setIsPasswordModalOpen,
    setIsPrinterModalOpen,
    setIsReceiptNoModalOpen,
    printerSettings,
    entries,
    isAmountHidden,
    toggleHideAmounts
  } = useMoi();
  const { currentTime, currentDate } = useLiveClock();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  const handleOpenSettings = () => {
    setIsPasswordModalOpen(true);
  };

  const currentFuncConfig = FUNCTION_TYPES.find((f) => f.id === settings.functionType) || FUNCTION_TYPES[0];

  const host1 = settings.hostName1 || settings.brideName;
  const host2 = settings.hostName2 || settings.groomName;
  const hostText = host2 ? `${host1} & ${host2}` : host1;

  const renderFunctionIcon = () => {
    switch (settings.functionType) {
      case 'marriage':
        return <Heart size={13} className="text-pink-300 fill-pink-300" />;
      case 'kaathukuthu':
      case 'sadagu':
      case 'birthday':
        return <Baby size={13} className="text-yellow-300" />;
      case 'housewarming':
        return <Home size={13} className="text-emerald-300" />;
      default:
        return <Sparkles size={13} className="text-yellow-300 fill-yellow-300" />;
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#7A001E] via-[#560015] to-[#7A001E] text-white shadow-md select-none border-b-2 border-[#D4AF37]">
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Dynamic Title & Function Details */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#D4AF37] text-[#7A001E] flex items-center justify-center font-bold text-base md:text-xl shadow-inner border border-yellow-200 flex-shrink-0">
            மொ
          </div>
          <div>
            <h1 className="text-sm md:text-lg lg:text-xl font-bold tracking-wide text-yellow-300 flex flex-wrap items-center gap-1 md:gap-2">
              {settings.marriageTitle || currentFuncConfig.defaultTitle}
              <span className="text-[9px] md:text-[10px] bg-yellow-400 text-maroon-950 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {currentFuncConfig.id === 'marriage' ? 'MARRIAGE POS' : `${currentFuncConfig.id.toUpperCase()} POS`}
              </span>
            </h1>
            <div className="text-[10px] md:text-xs text-yellow-100 flex flex-wrap items-center gap-1.5 md:gap-3 font-medium">
              <span className="flex items-center gap-1 font-semibold">
                {renderFunctionIcon()}
                {hostText}
              </span>
              <span className="hidden xs:inline">•</span>
              <span>{settings.venue}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Clock, Today's Collection & Printer Hardware Box */}
        <div className="hidden lg:flex items-center gap-4 bg-maroon-950/40 px-4 py-1.5 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2 text-yellow-200 font-mono text-sm">
            <Clock size={16} className="text-yellow-400 animate-pulse" />
            <span className="font-semibold">{currentTime}</span>
            <span className="text-xs text-gray-300">({currentDate})</span>
          </div>

          <div className="h-5 w-px bg-yellow-500/30"></div>

          <div className="text-right flex items-center gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-yellow-200 font-semibold">Today's Collection</div>
              <div className="text-base font-bold text-yellow-300 font-mono">
                {formatAmountOrMask(analytics.todayCollection, isAmountHidden)}
              </div>
            </div>
            <button
              onClick={toggleHideAmounts}
              title={isAmountHidden ? "Show Amounts" : "Hide Amounts"}
              className="p-1 rounded bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 transition-all cursor-pointer ml-1"
            >
              {isAmountHidden ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div className="h-5 w-px bg-yellow-500/30"></div>

          {/* SET STARTING RECEIPT NUMBER BUTTON */}
          <button
            onClick={() => setIsReceiptNoModalOpen(true)}
            title="Set Starting Receipt Number & Prefix"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 border border-yellow-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm font-mono"
          >
            <Hash size={15} className="text-yellow-400" />
            <span className="hidden xl:inline">
              Next: #{settings.receiptPrefix}{String(settings.receiptNextNum || 101).padStart(6, '0')}
            </span>
          </button>
        </div>

        {/* Right Side: Navigation & Actions */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="hidden lg:flex bg-maroon-950/60 p-1 rounded-lg items-center border border-yellow-500/30 mr-2">
            <button
              onClick={() => setActiveTab('collection')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'collection'
                  ? 'bg-[#D4AF37] text-maroon-950 shadow-sm'
                  : 'text-yellow-100 hover:text-white'
              }`}
            >
              Main Table
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'reports'
                  ? 'bg-[#D4AF37] text-maroon-950 shadow-sm'
                  : 'text-yellow-100 hover:text-white'
              }`}
            >
              Reports & Analytics
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'backup'
                  ? 'bg-[#D4AF37] text-maroon-950 shadow-sm'
                  : 'text-yellow-100 hover:text-white'
              }`}
            >
              Backup & Restore
            </button>
          </div>

          {/* Mobile Quick Action Buttons */}
          <button
            onClick={() => setIsReceiptNoModalOpen(true)}
            title="Set Starting Receipt Number & Prefix"
            className="flex lg:hidden items-center gap-1 p-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-mono font-semibold"
          >
            <Hash size={15} />
            <span className="text-[11px]">{settings.receiptPrefix}{String(settings.receiptNextNum || 101).padStart(4, '0')}</span>
          </button>

          <button
            onClick={toggleHideAmounts}
            title={isAmountHidden ? "Show Amounts" : "Hide Amounts"}
            className="p-1.5 md:p-2 rounded-lg bg-maroon-900/60 hover:bg-yellow-500 hover:text-maroon-950 text-yellow-200 border border-yellow-500/30 transition-all"
          >
            {isAmountHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            onClick={() => exportBackupJSON(entries, settings)}
            title="Quick Backup JSON"
            className="hidden md:inline-flex p-2 rounded-lg bg-maroon-900/60 hover:bg-yellow-500 hover:text-maroon-950 text-yellow-200 border border-yellow-500/30 transition-all"
          >
            <Download size={16} />
          </button>

          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-1.5 md:p-2 rounded-lg bg-maroon-900/60 hover:bg-yellow-500 hover:text-maroon-950 text-yellow-200 border border-yellow-500/30 transition-all"
          >
            {settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen Desktop Mode"
            className="hidden md:inline-flex p-2 rounded-lg bg-maroon-900/60 hover:bg-yellow-500 hover:text-maroon-950 text-yellow-200 border border-yellow-500/30 transition-all"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            onClick={() => setIsHelpModalOpen(true)}
            title="Keyboard Shortcuts (F1)"
            className="hidden md:inline-flex p-2 rounded-lg bg-maroon-900/60 hover:bg-yellow-500 hover:text-maroon-950 text-yellow-200 border border-yellow-500/30 transition-all"
          >
            <HelpCircle size={16} />
          </button>

          <button
            onClick={handleOpenSettings}
            title="Software Settings (PIN Protected)"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#560015] font-semibold text-xs hover:bg-yellow-400 shadow-md transition-all"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
