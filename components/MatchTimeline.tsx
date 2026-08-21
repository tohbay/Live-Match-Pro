'use client';

import React from 'react';
import { MatchEvent, EventType } from '@/types/match';
import { Zap, Repeat, Target, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

interface MatchTimelineProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export const MatchTimeline: React.FC<MatchTimelineProps> = ({ events, homeTeamName, awayTeamName }) => {
  if (!events || events.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
        <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">No match events recorded yet.</p>
      </div>
    );
  }

  // Sort events chronologically descending (newest on top) or ascending
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  return (
    <div className="relative overflow-hidden glass-panel rounded-3xl border border-slate-800 flex flex-col h-[400px] sm:h-[480px] lg:h-[calc(100vh-340px)] min-h-[380px] shadow-2xl">
      {/* Background Football Image Overlay with Fade Mask */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[65%] bg-cover bg-center opacity-30 pointer-events-none filter brightness-95 saturate-110"
        style={{
          backgroundImage: `url('/images/match_ball.jpg')`,
          maskImage: 'linear-gradient(to right, transparent 0%, black 70%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 70%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 backdrop-blur-md">
        <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
          <span>Match Timeline</span>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {events.length} Events
          </span>
        </h3>
        <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-400">
          <span className="text-emerald-400 truncate max-w-[100px] sm:max-w-none">{homeTeamName} (Home)</span>
          <span>•</span>
          <span className="text-cyan-400 truncate max-w-[100px] sm:max-w-none">{awayTeamName} (Away)</span>
        </div>
      </div>

      {/* Scrollable Event Stream Container */}
      <div className="relative z-10 flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 sm:space-y-3.5 sm:before:absolute sm:before:inset-0 sm:before:left-1/2 sm:before:-translate-x-1/2 sm:before:w-0.5 sm:before:bg-slate-800/80">
        {sortedEvents.map((ev) => (
          <TimelineEventItem key={ev.id || `${ev.type}-${ev.minute}-${Math.random()}`} event={ev} />
        ))}
      </div>
    </div>
  );
};

const TimelineEventItem: React.FC<{ event: MatchEvent }> = ({ event }) => {
  const isHome = event.team === 'home';

  return (
    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      {/* Mobile Minute & Team Badge */}
      <div className="flex items-center gap-2 sm:hidden">
        <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-slate-200 shadow">
          {event.minute}'
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isHome ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
          {isHome ? 'HOME' : 'AWAY'}
        </span>
      </div>

      {/* Event Details Card (Desktop 2-Column Symmetrical vs Mobile 100% Width) */}
      <div className={`w-full sm:w-1/2 flex ${isHome ? 'sm:justify-end sm:pr-3' : 'sm:justify-start sm:pl-3'} ${!isHome && 'sm:order-last'}`}>
        <div
          className={`w-full p-2.5 sm:p-3 rounded-2xl border text-xs sm:text-sm space-y-1 transition-all ${
            event.type === 'GOAL'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-lg shadow-emerald-950/30'
              : event.type === 'RED_CARD'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
              : event.type === 'YELLOW_CARD'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
              : 'bg-slate-900/60 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-1.5 font-bold">
            <EventIcon type={event.type} />
            <span className="truncate max-w-[150px] sm:max-w-none">{event.player}</span>
            {event.assistPlayer && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">
                (Assist: {event.assistPlayer})
              </span>
            )}
            {event.playerOut && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">
                (Off: {event.playerOut})
              </span>
            )}
          </div>
          {event.description && <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">{event.description}</p>}
        </div>
      </div>

      {/* Desktop Center Minute Marker */}
      <div className="hidden sm:flex z-10 shrink-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 items-center justify-center font-mono font-bold text-xs text-slate-200 shadow">
        {event.minute}'
      </div>

      {/* Desktop Spacer for symmetrical alignment */}
      <div className={`hidden sm:block w-1/2 ${!isHome && 'sm:order-first'}`} />
    </div>
  );
};

const EventIcon: React.FC<{ type: EventType }> = ({ type }) => {
  switch (type) {
    case 'GOAL':
      return <span className="text-base">⚽</span>;
    case 'YELLOW_CARD':
      return <span className="w-3 h-4 rounded-sm bg-amber-400 inline-block shadow-sm" title="Yellow Card" />;
    case 'RED_CARD':
      return <span className="w-3 h-4 rounded-sm bg-rose-600 inline-block shadow-sm" title="Red Card" />;
    case 'SUBSTITUTION':
      return <Repeat className="w-4 h-4 text-cyan-400" />;
    case 'SHOT':
      return <Target className="w-4 h-4 text-blue-400" />;
    case 'FOUL':
      return <Zap className="w-3.5 h-3.5 text-slate-500" />;
    default:
      return <Activity className="w-3.5 h-3.5 text-slate-400" />;
  }
};
