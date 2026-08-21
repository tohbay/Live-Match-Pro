'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchMatches } from '@/lib/api';
import { Match } from '@/types/match';
import { useSocket, ScoreUpdatePayload, StatusChangePayload } from '@/context/SocketContext';
import { MatchCard } from '@/components/MatchCard';
import { DashboardFilters, MatchFilterTab } from '@/components/DashboardFilters';
import { RefreshCw, Flame, AlertCircle, Radio, Trophy, SearchX } from 'lucide-react';

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MatchFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { socket, subscribeMatch } = useSocket();

  const loadMatches = async () => {
    try {
      setError(null);
      const data = await fetchMatches();
      setMatches(data);
      // Subscribe socket to all loaded matches
      data.forEach((m) => subscribeMatch(m.id));
    } catch (err) {
      setError('Unable to load matches. Please check connection.');
      console.error('Fetch matches error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();

    // Fallback REST refresh every 12 seconds to ensure list updates when new matches spawn
    const interval = setInterval(() => {
      fetchMatches().then((data) => {
        if (data && data.length > 0) {
          setMatches(data);
          data.forEach((m) => subscribeMatch(m.id));
        }
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Listen to socket global updates for match status and scores to keep match array synced
  useEffect(() => {
    if (!socket) return;

    const handleScore = (payload: ScoreUpdatePayload) => {
      setMatches((prev) =>
        prev.map((m) => (m.id === payload.matchId ? { ...m, homeScore: payload.homeScore, awayScore: payload.awayScore } : m))
      );
    };

    const handleStatus = (payload: StatusChangePayload) => {
      setMatches((prev) =>
        prev.map((m) => (m.id === payload.matchId ? { ...m, status: payload.status, minute: payload.minute } : m))
      );
    };

    socket.on('score_update', handleScore);
    socket.on('status_change', handleStatus);

    return () => {
      socket.off('score_update', handleScore);
      socket.off('status_change', handleStatus);
    };
  }, [socket]);

  // Calculate counters
  const counts = useMemo(() => {
    const live = matches.filter((m) => m.status === 'FIRST_HALF' || m.status === 'SECOND_HALF' || m.status === 'HALF_TIME').length;
    const upcoming = matches.filter((m) => m.status === 'NOT_STARTED').length;
    const finished = matches.filter((m) => m.status === 'FULL_TIME').length;
    return {
      all: matches.length,
      live,
      upcoming,
      finished,
    };
  }, [matches]);

  // Filter matches based on active tab and search query
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Tab filter
      if (activeTab === 'LIVE') {
        const isLive = match.status === 'FIRST_HALF' || match.status === 'SECOND_HALF' || match.status === 'HALF_TIME';
        if (!isLive) return false;
      } else if (activeTab === 'UPCOMING') {
        if (match.status !== 'NOT_STARTED') return false;
      } else if (activeTab === 'FINISHED') {
        if (match.status !== 'FULL_TIME') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const homeName = match.homeTeam.name.toLowerCase();
        const homeShort = match.homeTeam.shortName.toLowerCase();
        const awayName = match.awayTeam.name.toLowerCase();
        const awayShort = match.awayTeam.shortName.toLowerCase();
        return homeName.includes(q) || homeShort.includes(q) || awayName.includes(q) || awayShort.includes(q);
      }

      return true;
    });
  }, [matches, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800">
        {/* Background Football Stadium Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none filter brightness-90 saturate-110"
          style={{ backgroundImage: `url('/images/stadium_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Real-Time Football API Sync</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Live Match Center
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl font-medium drop-shadow-sm">
              Track live scores, match timelines, possession statistics, and fan chat as fixtures unfold in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shrink-0 shadow-xl">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-emerald-400 font-mono">{counts.live}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Live Now</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-cyan-400 font-mono">{counts.all}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Matches</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-slate-300 font-mono">{counts.finished}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <DashboardFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={counts}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="h-16 bg-slate-800/60 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && !isLoading && (
        <div className="glass-panel border border-rose-500/30 p-6 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-semibold text-rose-200">{error}</h3>
          <button
            onClick={loadMatches}
            className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold cursor-pointer"
          >
            Retry Loading Matches
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredMatches.length === 0 && (
        <div className="glass-panel border border-slate-800 p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No Matches Found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery
              ? `No fixtures matching "${searchQuery}". Try a different team name.`
              : `There are currently no matches in the ${activeTab.toLowerCase()} category.`}
          </p>
          {(searchQuery || activeTab !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Match Cards Grid */}
      {!isLoading && !error && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} initialMatch={match} socket={socket} />
          ))}
        </div>
      )}
    </div>
  );
}
