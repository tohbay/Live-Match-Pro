import React from 'react';
import { Activity, BarChart3 } from 'lucide-react';

interface MatchTabSelectorProps {
  activeTab: 'timeline' | 'stats';
  onTabChange: (tab: 'timeline' | 'stats') => void;
  eventsCount?: number;
}

export function MatchTabSelector({ activeTab, onTabChange, eventsCount }: MatchTabSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800">
      <button
        onClick={() => onTabChange('timeline')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeTab === 'timeline'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Activity className="w-4 h-4" />
        <span>Timeline & Events</span>
        {eventsCount && eventsCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/30 font-mono">
            {eventsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onTabChange('stats')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeTab === 'stats'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span>Match Statistics</span>
      </button>
    </div>
  );
}
