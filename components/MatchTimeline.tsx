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
    <div className="relative overflow-hidden glass-panel rounded-3xl border border-slate-800 flex flex-col h-[460px] shadow-2xl">
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
      <div className="relative z-10 p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <span>Match Timeline</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {events.length} Events
          </span>
        </h3>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="text-emerald-400">{homeTeamName} (Home)</span>
          <span>•</span>
          <span className="text-cyan-400">{awayTeamName} (Away)</span>
        </div>
      </div>

      {/* Scrollable Event Stream Container */}
      <div className="relative z-10 flex-1 p-5 overflow-y-auto space-y-3.5 before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800/80">
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
    <div className={`relative flex items-center gap-4 ${isHome ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Event Details Card */}
      <div className={`w-1/2 flex ${isHome ? 'justify-end pr-3' : 'justify-start pl-3'}`}>
        <div
          className={`p-3 rounded-2xl border text-xs sm:text-sm max-w-xs sm:max-w-md space-y-1 transition-all ${
            event.type === 'GOAL'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-lg shadow-emerald-950/30'
              : event.type === 'RED_CARD'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
              : event.type === 'YELLOW_CARD'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
              : 'bg-slate-900/60 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            <EventIcon type={event.type} />
            <span className="truncate">{event.player}</span>
            {event.assistPlayer && (
              <span className="text-[11px] text-slate-400 font-normal truncate">
                (Assist: {event.assistPlayer})
              </span>
            )}
            {event.playerOut && (
              <span className="text-[11px] text-slate-400 font-normal truncate">
                (Off: {event.playerOut})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{event.description}</p>
        </div>
      </div>

      {/* Center Minute Marker */}
      <div className="z-10 shrink-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-200 shadow">
        {event.minute}'
      </div>

      {/* Spacer for symmetrical alignment */}
      <div className="w-1/2" />
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
