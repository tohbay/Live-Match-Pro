'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchMatchById } from '@/lib/api';
import { Match, MatchEvent, MatchStatistics as StatsType } from '@/types/match';
import {
  useSocket,
  ScoreUpdatePayload,
  StatusChangePayload,
  StatsUpdatePayload,
  MatchEventPayload,
} from '@/context/SocketContext';
import { MatchScoreboard } from '@/components/MatchScoreboard';
import { MatchTimeline } from '@/components/MatchTimeline';
import { MatchStatistics } from '@/components/MatchStatistics';
import { MatchChat } from '@/components/MatchChat';
import { ArrowLeft, Activity, BarChart3, MessageSquare, AlertCircle, RefreshCw, Home } from 'lucide-react';

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailPage({ params }: MatchPageProps) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.id;
  const router = useRouter();

  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [isScoreFlashing, setIsScoreFlashing] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats'>('timeline');

  const { socket, subscribeMatch, unsubscribeMatch } = useSocket();

  const loadMatch = async () => {
    try {
      setError(null);
      const data = await fetchMatchById(matchId);
      if (!data) {
        setError('Match session has concluded or data is no longer available.');
        setRedirectCountdown(4);
      } else {
        setMatch(data);
      }
    } catch (err) {
      setError('Unable to load match details.');
      setRedirectCountdown(4);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatic countdown timer to redirect to home screen gracefully
  useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, router]);

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  // Subscribe to live updates on socket
  useEffect(() => {
    if (!matchId) return;
    subscribeMatch(matchId);

    return () => {
      unsubscribeMatch(matchId);
    };
  }, [matchId, subscribeMatch, unsubscribeMatch]);

  // Listen for socket events
  useEffect(() => {
    if (!socket || !matchId) return;

    const handleScore = (payload: ScoreUpdatePayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                homeScore: payload.homeScore,
                awayScore: payload.awayScore,
              }
            : null
        );
        setIsScoreFlashing(true);
        setTimeout(() => setIsScoreFlashing(false), 2000);
      }
    };

    const handleStatus = (payload: StatusChangePayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                status: payload.status,
                minute: payload.minute,
              }
            : null
        );
      }
    };

    const handleStats = (payload: StatsUpdatePayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                statistics: payload.statistics,
              }
            : null
        );
      }
    };

    const handleEvent = (payload: MatchEventPayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev) => {
          if (!prev) return null;
          const newEvent: MatchEvent = {
            id: payload.id || Math.random().toString(),
            type: payload.type,
            minute: payload.minute,
            team: payload.team,
            player: payload.player,
            assistPlayer: payload.assistPlayer,
            playerOut: payload.playerOut,
            description: payload.description,
            timestamp: payload.timestamp || new Date().toISOString(),
          };

          const existingEvents = prev.events || [];
          // Avoid duplicate events if already present
          if (existingEvents.some((e) => e.id === newEvent.id)) return prev;

          return {
            ...prev,
            events: [newEvent, ...existingEvents],
          };
        });
      }
    };

    const handleSocketError = (err: { code?: string; message?: string }) => {
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('cannot subscribe') ||
        msg.toLowerCase().includes('match')
      ) {
        setError('Match not found or subscription unavailable.');
        setIsLoading(false);
        setRedirectCountdown(3);
        unsubscribeMatch(matchId);
      }
    };

    socket.on('score_update', handleScore);
    socket.on('status_change', handleStatus);
    socket.on('stats_update', handleStats);
    socket.on('match_event', handleEvent);
    socket.on('error', handleSocketError);

    return () => {
      socket.off('score_update', handleScore);
      socket.off('status_change', handleStatus);
      socket.off('stats_update', handleStats);
      socket.off('match_event', handleEvent);
      socket.off('error', handleSocketError);
    };
  }, [socket, matchId]);

  return (
    <div className="space-y-4">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="glass-panel h-64 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel h-96 rounded-3xl" />
            <div className="glass-panel h-96 rounded-3xl" />
          </div>
        </div>
      )}

      {/* Error / Match Concluded Message */}
      {error && !isLoading && (
        <div className="glass-panel border border-rose-500/30 p-8 rounded-3xl text-center space-y-5 max-w-md mx-auto my-12 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{error}</h3>
            {redirectCountdown !== null && (
              <p className="text-xs text-slate-400 mt-2">
                Redirecting to Live Match Center in{' '}
                <span className="font-bold text-cyan-400 font-mono text-sm">{redirectCountdown}s</span>...
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home Now</span>
            </button>
            <button
              onClick={loadMatch}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer border border-slate-700"
            >
              Retry Loading
            </button>
          </div>
        </div>
      )}

      {/* Match Content */}
      {!isLoading && !error && match && (
        <>
          {/* Main Scoreboard */}
          <MatchScoreboard match={match} isScoreFlashing={isScoreFlashing} />

          {/* Grid Layout: Details & Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Main Column: Timeline & Stats */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'timeline'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Timeline & Events</span>
                  {match.events && match.events.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/30 font-mono">
                      {match.events.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
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

              {/* Tab Panels */}
              {activeTab === 'timeline' ? (
                <MatchTimeline
                  events={match.events || []}
                  homeTeamName={match.homeTeam.name}
                  awayTeamName={match.awayTeam.name}
                />
              ) : (
                <MatchStatistics
                  statistics={match.statistics}
                  homeTeamName={match.homeTeam.name}
                  awayTeamName={match.awayTeam.name}
                />
              )}
            </div>

            {/* Right Column: Live Fan Chat */}
            <div className="lg:col-span-5 space-y-6">
              {/* Header Bar to match Left Column Tab Selector */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800">
                <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Live Fan Chat</span>
                </div>
              </div>

              <MatchChat matchId={matchId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
