import { Match } from '@/types/match';

const API_BASE_URL = 'https://profootball.srv883830.hstgr.cloud';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface MatchesResponseData {
  matches: Match[];
  total: number;
}

export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch matches: HTTP status ${res.status}`);
    }
    const json: ApiResponse<MatchesResponseData> = await res.json();
    return json.success ? json.data.matches : [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches/live`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch live matches: HTTP status ${res.status}`);
    }
    const json: ApiResponse<MatchesResponseData> = await res.json();
    return json.success ? json.data.matches : [];
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/matches/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch match details for ${id}: HTTP status ${res.status}`);
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
    const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}
