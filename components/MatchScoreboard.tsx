'use client';

import React from 'react';
import { Match } from '@/types/match';
import { StatusPill } from '@/components/MatchCard';
import { Calendar, Clock, Trophy } from 'lucide-react';

interface MatchScoreboardProps {
  match: Match;
  isScoreFlashing: boolean;
}

export const MatchScoreboard: React.FC<MatchScoreboardProps> = ({ match, isScoreFlashing }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
      {/* Dynamic Background Football Action Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none filter brightness-90 saturate-120"
        style={{ backgroundImage: `url('/images/match_action.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 pointer-events-none" />

      {/* Top Bar: Status and League */}
      <div className="relative z-10 flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold text-slate-300">Pro Football Champions Cup</span>
        </div>

        <StatusPill status={match.status} minute={match.minute} />
      </div>

      {/* Main Scoreboard Banner */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-4">
        {/* Home Team */}
        <div className="col-span-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-emerald-400 shadow-lg mb-3">
            {match.homeTeam.shortName || match.homeTeam.name.substring(0, 3).toUpperCase()}
          </div>
          <h2 className="font-extrabold text-base sm:text-xl text-slate-100 line-clamp-1">{match.homeTeam.name}</h2>
          <span className="text-xs text-slate-400 font-mono mt-0.5">HOME</span>
        </div>

        {/* Center Score & Time */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div
            className={`px-5 py-3 rounded-2xl glass-panel border transition-all duration-500 flex items-center gap-4 ${
              isScoreFlashing
                ? 'bg-emerald-500/30 border-emerald-400 scale-110 shadow-2xl shadow-emerald-500/40'
                : 'border-slate-700/80 bg-slate-900/80'
            }`}
          >
            <span
              className={`font-black text-4xl sm:text-6xl font-mono ${
                match.homeScore > match.awayScore ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {match.homeScore}
            </span>
            <span className="text-slate-600 font-bold text-2xl">:</span>
            <span
              className={`font-black text-4xl sm:text-6xl font-mono ${
                match.awayScore > match.homeScore ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {match.awayScore}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Started {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="col-span-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-cyan-400 shadow-lg mb-3">
            {match.awayTeam.shortName || match.awayTeam.name.substring(0, 3).toUpperCase()}
          </div>
          <h2 className="font-extrabold text-base sm:text-xl text-slate-100 line-clamp-1">{match.awayTeam.name}</h2>
          <span className="text-xs text-slate-400 font-mono mt-0.5">AWAY</span>
        </div>
      </div>
    </div>
  );
};
