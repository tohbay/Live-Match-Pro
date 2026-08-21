import { Match } from "@/types/match";
import { ChatMessage } from "@/types/match";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://profootball.srv883830.hstgr.cloud";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface MatchesResponseData {
  matches: Match[];
  total: number;
}

export interface ChatHistoryResponseData {
  messages: ChatMessage[];
}

export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch matches: HTTP status ${res.status}`);
    }
    const json: ApiResponse<MatchesResponseData> = await res.json();
    return json.success ? json.data.matches : [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches/live`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch live matches: HTTP status ${res.status}`,
      );
    }
    const json: ApiResponse<MatchesResponseData> = await res.json();
    return json.success ? json.data.matches : [];
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch match details for ${id}: HTTP status ${res.status}`,
      );
    }
    const json: ApiResponse<Match> = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Error fetching match ${id}:`, error);
    return null;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchChatHistory(
  matchId: string,
): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches/${matchId}/chat`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`Failed to fetch chat history: HTTP status ${res.status}`);
      return [];
    }
    const json: ApiResponse<ChatHistoryResponseData> = await res.json();
    return json.success ? json.data.messages : [];
  } catch (error) {
    console.error(`Error fetching chat history for match ${matchId}:`, error);
    return [];
  }
}
