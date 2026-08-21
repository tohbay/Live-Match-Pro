"use client";

import React, { useState, use } from "react";
import { Match } from "@/types/match";
import { MatchScoreboard } from "@/features/match/components/MatchScoreboard";
import { MatchTimeline } from "@/features/match/components/MatchTimeline";
import { MatchStatistics } from "@/features/match/components/MatchStatistics";
import { MatchChat } from "@/features/match/components/MatchChat";
import { MatchTabSelector } from "@/features/match/components/MatchTabSelector";
import { MatchLoadingError } from "@/features/match/components/MatchLoadingError";
import { MessageSquare } from "lucide-react";
import { useMatchData } from "@/features/match/hooks/useMatchData";
import { useMatchSocketEvents } from "@/features/match/hooks/useMatchSocketEvents";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailPage({ params }: MatchPageProps) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState<"timeline" | "stats">("timeline");

  const { match, setMatch, isLoading, error, redirectCountdown, loadMatch } =
    useMatchData(matchId);
  const { isScoreFlashing } = useMatchSocketEvents(matchId, setMatch);

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
        <MatchLoadingError
          error={error}
          redirectCountdown={redirectCountdown}
          onRetry={loadMatch}
        />
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
              <MatchTabSelector
                activeTab={activeTab}
                onTabChange={setActiveTab}
                eventsCount={match.events?.length}
              />

              {/* Tab Panels */}
              {activeTab === "timeline" ? (
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
