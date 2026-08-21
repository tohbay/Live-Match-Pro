'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Match, MatchStatus } from '@/types/match';
import { ScoreUpdatePayload, StatusChangePayload } from '@/context/SocketContext';
import { Socket } from 'socket.io-client';
import { ChevronRight, Clock, Flame, Calendar, Activity } from 'lucide-react';

interface MatchCardProps {
  initialMatch: Match;
  socket: Socket | null;
}

export const MatchCard: React.FC<MatchCardProps> = ({ initialMatch, socket }) => {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [isScoreFlashing, setIsScoreFlashing] = useState(false);

  useEffect(() => {
    setMatch(initialMatch);
  }, [initialMatch]);

  // Listen to socket updates for this specific match
  useEffect(() => {
    if (!socket) return;

    const handleScoreUpdate = (payload: ScoreUpdatePayload) => {
      if (payload.matchId === match.id) {
        setMatch((prev) => ({
          ...prev,
          homeScore: payload.homeScore,
          awayScore: payload.awayScore,
        }));
        setIsScoreFlashing(true);
        setTimeout(() => setIsScoreFlashing(false), 2000);
      }
    };

    const handleStatusChange = (payload: StatusChangePayload) => {
      if (payload.matchId === match.id) {
        setMatch((prev) => ({
          ...prev,
          status: payload.status,
          minute: payload.minute,
        }));
      }
    };

    socket.on('score_update', handleScoreUpdate);
    socket.on('status_change', handleStatusChange);

    return () => {
      socket.off('score_update', handleScoreUpdate);
      socket.off('status_change', handleStatusChange);
    };
  }, [socket, match.id]);

  const isLive = match.status === 'FIRST_HALF' || match.status === 'SECOND_HALF' || match.status === 'HALF_TIME';
  const isFinished = match.status === 'FULL_TIME';

  return (
    <Link
      href={`/match/${match.id}`}
      className="group block relative glass-panel glass-panel-hover rounded-2xl p-5 overflow-hidden transition-all duration-300 border border-slate-800 hover:border-cyan-500/40"
    >
      {/* Background Subtle Gradient Glow for Live Matches */}
      {isLive && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-transparent pointer-events-none" />
      )}

      {/* Header Info: Status Badge & Start Time */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <StatusPill status={match.status} minute={match.minute} />

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatStartTime(match.startTime)}</span>
        </div>
      </div>

      {/* Main Scoreboard Content */}
      <div className="grid grid-cols-12 items-center gap-3 py-2">
        {/* Home Team */}
        <div className="col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center font-bold text-lg text-emerald-400 mb-2 shadow-inner group-hover:scale-105 transition-transform">
            {match.homeTeam.shortName || match.homeTeam.name.substring(0, 3).toUpperCase()}
          </div>
          <span className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {match.homeTeam.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">HOME</span>
        </div>

        {/* Score Display */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div
            className={`px-4 py-2 rounded-xl glass-panel border transition-all duration-500 flex items-center gap-3 ${
              isScoreFlashing
                ? 'bg-emerald-500/30 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30'
                : 'border-slate-700/80 bg-slate-900/60'
            }`}
          >
            <span
              className={`font-black text-2xl sm:text-3xl font-mono ${
                match.homeScore > match.awayScore ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {match.homeScore}
            </span>
            <span className="text-slate-500 font-bold text-lg">:</span>
            <span
              className={`font-black text-2xl sm:text-3xl font-mono ${
                match.awayScore > match.homeScore ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {match.awayScore}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Match Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Away Team */}
        <div className="col-span-4 flex flex-col items-center sm:items-end text-center sm:text-right">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center font-bold text-lg text-cyan-400 mb-2 shadow-inner group-hover:scale-105 transition-transform">
            {match.awayTeam.shortName || match.awayTeam.name.substring(0, 3).toUpperCase()}
          </div>
          <span className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {match.awayTeam.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">AWAY</span>
        </div>
      </div>
    </Link>
  );
};

export const StatusPill: React.FC<{ status: MatchStatus; minute: number }> = ({ status, minute }) => {
  switch (status) {
    case 'FIRST_HALF':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>1ST HALF ({minute}')</span>
        </span>
      );
    case 'SECOND_HALF':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>2ND HALF ({minute}')</span>
        </span>
      );
    case 'HALF_TIME':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Activity className="w-3 h-3 text-amber-400 animate-spin" />
          <span>HALF TIME</span>
        </span>
      );
    case 'FULL_TIME':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
          <span>FULL TIME</span>
        </span>
      );
    case 'NOT_STARTED':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Calendar className="w-3 h-3 text-blue-400" />
          <span>UPCOMING</span>
        </span>
      );
  }
};

function formatStartTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'TBD';
  }
}
