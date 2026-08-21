import { useEffect, useState, useRef } from "react";
import {
  useSocket,
  ScoreUpdatePayload,
  StatusChangePayload,
  StatsUpdatePayload,
  MatchEventPayload,
} from "@/context/SocketContext";
import { Match, MatchEvent } from "@/types/match";

export function useMatchSocketEvents(
  matchId: string,
  setMatch: React.Dispatch<React.SetStateAction<Match | null>>,
  setShowEndedModal?: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { socket, subscribeMatch, unsubscribeMatch, addToast } = useSocket();
  const [isScoreFlashing, setIsScoreFlashing] = useState(false);
  const previousStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    subscribeMatch(matchId);

    return () => {
      unsubscribeMatch(matchId);
    };
  }, [matchId, subscribeMatch, unsubscribeMatch]);

  useEffect(() => {
    if (!socket || !matchId) return;

    // Initialize previous status from current match data
    setMatch((prev) => {
      if (prev) {
        previousStatusRef.current = prev.status;
      }
      return prev;
    });

    const handleScore = (payload: ScoreUpdatePayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev: Match | null) =>
          prev
            ? {
                ...prev,
                homeScore: payload.homeScore,
                awayScore: payload.awayScore,
              }
            : null,
        );
        setIsScoreFlashing(true);
        setTimeout(() => setIsScoreFlashing(false), 2000);
      }
    };

    const handleStatus = (payload: StatusChangePayload) => {
      if (payload.matchId === matchId) {
        const previousStatus = previousStatusRef.current;

        setMatch((prev: Match | null) =>
          prev
            ? {
                ...prev,
                status: payload.status,
                minute: payload.minute,
              }
            : null,
        );

        // Show toast when match ends (status changes to FULL_TIME)
        if (
          previousStatus &&
          previousStatus !== "FULL_TIME" &&
          payload.status === "FULL_TIME"
        ) {
          addToast({
            title: "🏁 Full Time",
            description:
              "The match has ended. Check the final score and statistics!",
            type: "status",
          });
          // Show modal if callback provided
          if (setShowEndedModal) {
            setShowEndedModal(true);
          }
        }

        previousStatusRef.current = payload.status;
      }
    };

    const handleStats = (payload: StatsUpdatePayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev: Match | null) =>
          prev
            ? {
                ...prev,
                statistics: payload.statistics,
              }
            : null,
        );
      }
    };

    const handleEvent = (payload: MatchEventPayload) => {
      if (payload.matchId === matchId) {
        setMatch((prev: Match | null) => {
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
          if (existingEvents.some((e: MatchEvent) => e.id === newEvent.id))
            return prev;

          return {
            ...prev,
            events: [newEvent, ...existingEvents],
          };
        });
      }
    };

    const handleSocketError = (err: { code?: string; message?: string }) => {
      const msg = err.message || "";
      if (
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("cannot subscribe") ||
        msg.toLowerCase().includes("match")
      ) {
        // Error handling is done in the parent component
        unsubscribeMatch(matchId);
      }
    };

    socket.on("score_update", handleScore);
    socket.on("status_change", handleStatus);
    socket.on("stats_update", handleStats);
    socket.on("match_event", handleEvent);
    socket.on("error", handleSocketError);

    return () => {
      socket.off("score_update", handleScore);
      socket.off("status_change", handleStatus);
      socket.off("stats_update", handleStats);
      socket.off("match_event", handleEvent);
      socket.off("error", handleSocketError);
    };
  }, [socket, matchId, setMatch, unsubscribeMatch, setShowEndedModal]);

  return { isScoreFlashing };
}
