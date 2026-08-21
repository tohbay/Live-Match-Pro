'use client';

import React from 'react';
import { Search, Flame, LayoutGrid, CheckCircle2, Calendar } from 'lucide-react';

export type MatchFilterTab = 'ALL' | 'LIVE' | 'UPCOMING' | 'FINISHED';

interface DashboardFiltersProps {
  activeTab: MatchFilterTab;
  setActiveTab: (tab: MatchFilterTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  counts: {
    all: number;
    live: number;
    upcoming: number;
    finished: number;
  };
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  counts,
}) => {
  const tabs: { id: MatchFilterTab; label: string; count: number; icon: React.ReactNode; color?: string }[] = [
    {
      id: 'ALL',
      label: 'All Matches',
      count: counts.all,
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'LIVE',
      label: 'Live Now',
      count: counts.live,
      icon: <Flame className="w-4 h-4 text-rose-500 animate-pulse" />,
      color: 'text-rose-400',
    },
    {
      id: 'UPCOMING',
      label: 'Upcoming',
      count: counts.upcoming,
      icon: <Calendar className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'FINISHED',
      label: 'Finished',
      count: counts.finished,
      icon: <CheckCircle2 className="w-4 h-4 text-slate-400" />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-slate-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-slate-950/30 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[240px] sm:min-w-[280px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team or league..."
          className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
