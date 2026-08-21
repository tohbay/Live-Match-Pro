'use client';

import React from 'react';
import Link from 'next/link';
import { Match } from '@/types/match';
import { StatusPill } from '@/components/MatchCard';
import { Clock, Trophy, ArrowLeft } from 'lucide-react';
import { TeamLogo } from '@/components/TeamLogo';

interface MatchScoreboardProps {
  match: Match;
  isScoreFlashing: boolean;
}

export const MatchScoreboard: React.FC<MatchScoreboardProps> = ({ match, isScoreFlashing }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-3.5 sm:p-4 border border-slate-800 shadow-xl">
      {/* Background Football Action Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none filter brightness-90 saturate-120"
        style={{ backgroundImage: `url('/images/match_action.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Top Bar: Integrated Back Button + League Title + Status */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800/80">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg glass-panel text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/40 border border-slate-700/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to Matches</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Pro Champions Cup</span>
        </div>

        <StatusPill status={match.status} minute={match.minute} />
      </div>

      {/* Main Scoreboard Content */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-1.5 sm:gap-3">
        {/* Home Team */}
        <div className="col-span-4 flex items-center gap-1.5 sm:gap-3 min-w-0">
          <TeamLogo
            teamName={match.homeTeam.name}
            shortName={match.homeTeam.shortName}
            size="sm"
            className="shrink-0 sm:w-12 sm:h-12"
          />
          <div className="min-w-0">
            <h2 className="font-extrabold text-xs sm:text-base text-slate-100 truncate">{match.homeTeam.name}</h2>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">HOME</span>
          </div>
        </div>

        {/* Center Score */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl glass-panel border transition-all duration-500 flex items-center gap-2 sm:gap-3 ${
              isScoreFlashing
                ? 'bg-emerald-500/30 border-emerald-400 scale-105 shadow-lg shadow-emerald-500/30'
                : 'border-slate-700/80 bg-slate-900/90 shadow-md'
            }`}
          >
            <span
              className={`font-black text-xl sm:text-3xl font-mono ${
                match.homeScore > match.awayScore ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {match.homeScore}
            </span>
            <span className="text-slate-500 font-bold text-xs sm:text-base">:</span>
            <span
              className={`font-black text-xl sm:text-3xl font-mono ${
                match.awayScore > match.homeScore ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {match.awayScore}
            </span>
          </div>
        </div>

        {/* Away Team */}
        <div className="col-span-4 flex items-center justify-end gap-1.5 sm:gap-3 text-right min-w-0">
          <div className="min-w-0">
            <h2 className="font-extrabold text-xs sm:text-base text-slate-100 truncate">{match.awayTeam.name}</h2>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">AWAY</span>
          </div>
          <TeamLogo
            teamName={match.awayTeam.name}
            shortName={match.awayTeam.shortName}
            size="sm"
            className="shrink-0 sm:w-12 sm:h-12"
          />
        </div>
      </div>
    </div>
  );
};
