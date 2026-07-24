import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { Home, FileText, Database, Settings } from 'lucide-react';

export const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const { setIsPasswordModalOpen } = useMoi();

  const handleTabClick = (tab) => {
    if (tab === 'settings') {
      setIsPasswordModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const navItems = [
    { id: 'collection', label: 'Moi Entry', icon: Home },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="flex lg:hidden bg-white dark:bg-slate-900 border-t border-gray-300 dark:border-slate-800 w-full justify-around py-2 z-10 shadow-lg flex-shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center gap-1 text-[11px] font-extrabold transition-colors px-3 py-1 rounded-lg ${
              isActive
                ? 'text-[#7A001E] dark:text-yellow-400'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
