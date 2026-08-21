'use client';

import React from 'react';
import { MatchStatistics as StatisticsType } from '@/types/match';
import { BarChart3 } from 'lucide-react';

interface MatchStatisticsProps {
  statistics?: StatisticsType;
  homeTeamName: string;
  awayTeamName: string;
}

export const MatchStatistics: React.FC<MatchStatisticsProps> = ({
  statistics,
  homeTeamName,
  awayTeamName,
}) => {
  if (!statistics) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
        <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Statistics not available yet for this match.</p>
      </div>
    );
  }

  const statItems = [
    { label: 'Ball Possession', home: statistics.possession.home, away: statistics.possession.away, isPercentage: true },
    { label: 'Total Shots', home: statistics.shots.home, away: statistics.shots.away },
    { label: 'Shots on Target', home: statistics.shotsOnTarget.home, away: statistics.shotsOnTarget.away },
    { label: 'Corner Kicks', home: statistics.corners.home, away: statistics.corners.away },
    { label: 'Fouls Committed', home: statistics.fouls.home, away: statistics.fouls.away },
    { label: 'Yellow Cards', home: statistics.yellowCards.home, away: statistics.yellowCards.away },
    { label: 'Red Cards', home: statistics.redCards.home, away: statistics.redCards.away },
  ];

  return (
    <div className="relative overflow-hidden glass-panel rounded-3xl border border-slate-800 flex flex-col h-[calc(100vh-310px)] min-h-[520px] shadow-2xl">
      {/* Tactical Pitch Background Image Overlay with Fade Mask */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[65%] bg-cover bg-center opacity-35 pointer-events-none filter brightness-95 saturate-120"
        style={{ 
          backgroundImage: `url('/images/stadium_pitch_tactical.jpg')`,
          maskImage: 'linear-gradient(to right, transparent 0%, black 70%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 70%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Match Statistics</span>
        </h3>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="text-emerald-400">{homeTeamName}</span>
          <span>vs</span>
          <span className="text-cyan-400">{awayTeamName}</span>
        </div>
      </div>

      {/* Scrollable Statistics Body */}
      <div className="relative z-10 flex-1 p-5 overflow-y-auto space-y-4">
        {statItems.map((item) => (
          <StatBarRow
            key={item.label}
            label={item.label}
            home={item.home}
            away={item.away}
            isPercentage={item.isPercentage}
          />
        ))}
      </div>
    </div>
  );
};

const StatBarRow: React.FC<{
  label: string;
  home: number;
  away: number;
  isPercentage?: boolean;
}> = ({ label, home, away, isPercentage }) => {
  const total = home + away || 1;
  const homePercent = Math.round((home / total) * 100);
  const awayPercent = Math.round((away / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-300">
        <span className="font-bold text-emerald-400 font-mono">
          {home}
          {isPercentage ? '%' : ''}
        </span>
        <span className="text-slate-400 text-xs">{label}</span>
        <span className="font-bold text-cyan-400 font-mono">
          {away}
          {isPercentage ? '%' : ''}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-2 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 rounded-l-full"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="h-full bg-cyan-500 transition-all duration-500 rounded-r-full"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
};
