import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMatchById } from "@/lib/api";
import { Match } from "@/types/match";
import { useSocket } from "@/context/SocketContext";

export function useMatchData(matchId: string) {
  const router = useRouter();
  const { addToast } = useSocket();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null,
  );

  const loadMatch = async () => {
    try {
      setError(null);
      const data = await fetchMatchById(matchId);
      if (!data) {
        setError("Match session has concluded or data is no longer available.");
        setRedirectCountdown(4);
      } else {
        setMatch(data);
      }
    } catch (err: any) {
      // Check if it's a 404 error specifically
      if (err.message?.includes("404") || err.message?.includes("Not Found")) {
        setError("Match not found. It may have ended or been removed.");
        addToast({
          title: "Match Not Available",
          description:
            "This match is no longer available. Redirecting to home page...",
          type: "error",
        });
      } else {
        setError("Unable to load match details.");
      }
      setRedirectCountdown(4);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  // Automatic countdown timer to redirect to home screen gracefully
  useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown <= 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, router]);

  return {
    match,
    setMatch,
    isLoading,
    error,
    redirectCountdown,
    loadMatch,
  };
}
