import React from 'react';
import { useMoi } from '../../context/MoiContext';
import { formatAmountOrMask } from '../../utils/currencyFormatter';
import { Users, IndianRupee, TrendingUp, Award, Clock, Eye, EyeOff } from 'lucide-react';

export const DashboardCards = () => {
  const { analytics, isAmountHidden, toggleHideAmounts } = useMoi();

  const cards = [
    {
      title: "Total Collection",
      value: formatAmountOrMask(analytics.totalCollection, isAmountHidden),
      subtitle: `Today: ${formatAmountOrMask(analytics.todayCollection, isAmountHidden)}`,
      icon: IndianRupee,
      iconBg: "bg-red-50 text-[#7A001E] dark:bg-red-950/40 dark:text-red-300",
      accent: "text-[#7A001E] dark:text-yellow-400"
    },
    {
      title: "Total Guests",
      value: analytics.totalGuests,
      subtitle: `Today's Entries: ${analytics.todayGuests}`,
      icon: Users,
      iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
      accent: "text-slate-900 dark:text-white"
    },
    {
      title: "Highest Moi",
      value: formatAmountOrMask(analytics.highestMoi, isAmountHidden),
      subtitle: "Top Contribution",
      icon: Award,
      iconBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      accent: "text-emerald-700 dark:text-emerald-300"
    },
    {
      title: "Average Moi",
      value: formatAmountOrMask(analytics.averageMoi, isAmountHidden),
      subtitle: `Lowest: ${formatAmountOrMask(analytics.lowestMoi, isAmountHidden)}`,
      icon: TrendingUp,
      iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
      accent: "text-slate-900 dark:text-white"
    },
    {
      title: "Last Entry",
      value: analytics.lastEntry ? analytics.lastEntry.name : "None",
      subtitle: analytics.lastEntry
        ? `${formatAmountOrMask(analytics.lastEntry.amount, isAmountHidden)} (${analytics.lastEntry.time})`
        : "No entries",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      accent: "text-amber-900 dark:text-amber-200",
      truncate: true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 sm:p-2.5 bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-all duration-150 select-none ${
              idx === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleHideAmounts}
                  title={isAmountHidden ? "Show Amounts" : "Hide Amounts"}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  {isAmountHidden ? <EyeOff size={13} className="text-amber-600 dark:text-amber-400" /> : <Eye size={13} />}
                </button>
                <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                  <Icon size={14} />
                </div>
              </div>
            </div>

            <div className={`text-base md:text-lg font-bold font-mono tracking-tight ${card.accent} ${card.truncate ? 'truncate' : ''}`}>
              {card.value}
            </div>

            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
