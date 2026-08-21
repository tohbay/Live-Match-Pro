"use client";

import React from "react";
import { Match } from "@/types/match";
import { Trophy, X, Home } from "lucide-react";
import { TeamLogo } from "@/features/common/components/TeamLogo";

interface MatchEndedModalProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchEndedModal: React.FC<MatchEndedModalProps> = ({
  match,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const homeGoals = (match.events || []).filter(
    (e) => e.type === "GOAL" && e.team === "home",
  );
  const awayGoals = (match.events || []).filter(
    (e) => e.type === "GOAL" && e.team === "away",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-6 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Full Time</h2>
                <p className="text-sm text-slate-400">Match has ended</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Final Score */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <TeamLogo
                teamName={match.homeTeam.name}
                shortName={match.homeTeam.shortName}
                size="md"
                className="w-16 h-16 mb-3"
              />
              <h3 className="font-bold text-sm text-slate-100 truncate w-full">
                {match.homeTeam.name}
              </h3>
              <span className="text-xs text-slate-400 font-mono">HOME</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-lg">
              <span className="font-black text-4xl font-mono text-slate-100">
                {match.homeScore}
              </span>
              <span className="text-2xl text-slate-500 font-bold">:</span>
              <span className="font-black text-4xl font-mono text-slate-100">
                {match.awayScore}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <TeamLogo
                teamName={match.awayTeam.name}
                shortName={match.awayTeam.shortName}
                size="md"
                className="w-16 h-16 mb-3"
              />
              <h3 className="font-bold text-sm text-slate-100 truncate w-full">
                {match.awayTeam.name}
              </h3>
              <span className="text-xs text-slate-400 font-mono">AWAY</span>
            </div>
          </div>

          {/* Goal Scorers */}
          {(homeGoals.length > 0 || awayGoals.length > 0) && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {homeGoals.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400">
                  <span className="font-semibold text-slate-300">Home:</span>
                  {homeGoals.map((g, idx) => (
                    <span key={g.id || `${g.player}-${g.minute}-${idx}`}>
                      {g.player} {g.minute}'
                      {idx < homeGoals.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              )}
              {awayGoals.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-400">
                  <span className="font-semibold text-slate-300">Away:</span>
                  {awayGoals.map((g, idx) => (
                    <span key={g.id || `${g.player}-${g.minute}-${idx}`}>
                      {g.player} {g.minute}'
                      {idx < awayGoals.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>View Full Statistics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
