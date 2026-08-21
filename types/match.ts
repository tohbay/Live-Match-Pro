export type MatchStatus = 
  | 'NOT_STARTED' 
  | 'FIRST_HALF' 
  | 'HALF_TIME' 
  | 'SECOND_HALF' 
  | 'FULL_TIME';

export type EventType = 
  | 'GOAL' 
  | 'YELLOW_CARD' 
  | 'RED_CARD' 
  | 'SUBSTITUTION' 
  | 'FOUL' 
  | 'SHOT';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
}

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  team: 'home' | 'away';
  player: string;
  assistPlayer?: string;
  playerOut?: string;
  description: string;
  timestamp: string;
}

export interface StatPair {
  home: number;
  away: number;
}

export interface MatchStatistics {
  possession: StatPair;
  shots: StatPair;
  shotsOnTarget: StatPair;
  corners: StatPair;
  fouls: StatPair;
  yellowCards: StatPair;
  redCards: StatPair;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: MatchStatus;
  startTime: string;
  events?: MatchEvent[];
  statistics?: MatchStatistics;
}

export interface ChatMessage {
  id?: string;
  matchId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

export interface TypingIndicatorPayload {
  matchId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

export type SocketConnectionStatus = 'connected' | 'reconnecting' | 'disconnected' | 'error';
