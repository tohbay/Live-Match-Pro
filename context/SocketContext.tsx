'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketConnectionStatus, ChatMessage, TypingIndicatorPayload, MatchEvent, MatchStatistics, MatchStatus } from '@/types/match';
import { soundManager } from '@/lib/sound';

const SOCKET_URL = 'wss://profootball.srv883830.hstgr.cloud';

export interface ScoreUpdatePayload {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export interface StatusChangePayload {
  matchId: string;
  status: MatchStatus;
  minute: number;
}

export interface StatsUpdatePayload {
  matchId: string;
  statistics: MatchStatistics;
}

export interface MatchEventPayload extends MatchEvent {
  matchId: string;
}

export interface UserPresencePayload {
  matchId: string;
  userId: string;
  username: string;
}

export interface SocketErrorPayload {
  code?: string;
  message: string;
}

export interface ToastAlert {
  id: string;
  title: string;
  description: string;
  type: 'goal' | 'card' | 'status' | 'error' | 'info';
  timestamp: Date;
}

interface SocketContextValue {
  socket: Socket | null;
  status: SocketConnectionStatus;
  reconnect: () => void;
  subscribeMatch: (matchId: string) => void;
  unsubscribeMatch: (matchId: string) => void;
  joinChat: (matchId: string, userId: string, username: string) => void;
  leaveChat: (matchId: string, userId: string) => void;
  sendChatMessage: (matchId: string, userId: string, username: string, message: string) => void;
  sendTypingStart: (matchId: string, userId: string, username: string) => void;
  sendTypingStop: (matchId: string, userId: string) => void;
  toasts: ToastAlert[];
  removeToast: (id: string) => void;
  activeSubscriptions: Set<string>;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<SocketConnectionStatus>('disconnected');
  const [activeSubscriptions] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastAlert, 'id' | 'timestamp'>) => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newToast: ToastAlert = {
      ...toast,
      id: newId,
      timestamp: new Date(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      removeToast(newId);
    }, 5000);
  }, [removeToast]);

  const initSocket = useCallback(() => {
    setStatus('reconnecting');
    
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socketInstance.on('connect', () => {
      setStatus('connected');
      // Resubscribe to matches if reconnected
      activeSubscriptions.forEach((mId) => {
        socketInstance.emit('subscribe_match', { matchId: mId });
      });
    });

    socketInstance.on('disconnect', () => {
      setStatus('disconnected');
    });

    socketInstance.on('connect_error', () => {
      setStatus('error');
    });

    // Global listener for GOAL and Card sound/toast effects
    socketInstance.on('match_event', (payload: MatchEventPayload) => {
      if (payload.type === 'GOAL') {
        soundManager.playGoalSound(payload.player);
        addToast({
          title: `⚽ GOAL! (${payload.minute}')`,
          description: payload.description || `${payload.player} scores!`,
          type: 'goal',
        });
      } else if (payload.type === 'RED_CARD') {
        soundManager.playCardSound(payload.player);
        addToast({
          title: `🔴 RED CARD! (${payload.minute}')`,
          description: payload.description,
          type: 'card',
        });
      }
    });

    socketInstance.on('error', (err: SocketErrorPayload) => {
      addToast({
        title: 'Notice',
        description: err.message || 'An error occurred on the live connection.',
        type: 'error',
      });
    });

    setSocket(socketInstance);

    return socketInstance;
  }, [activeSubscriptions, addToast]);

  useEffect(() => {
    const instance = initSocket();
    return () => {
      instance.disconnect();
    };
  }, [initSocket]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
    initSocket();
  }, [socket, initSocket]);

  const subscribeMatch = useCallback((matchId: string) => {
    activeSubscriptions.add(matchId);
    if (socket && socket.connected) {
      socket.emit('subscribe_match', { matchId });
    }
  }, [socket, activeSubscriptions]);

  const unsubscribeMatch = useCallback((matchId: string) => {
    activeSubscriptions.delete(matchId);
    if (socket && socket.connected) {
      socket.emit('unsubscribe_match', { matchId });
    }
  }, [socket, activeSubscriptions]);

  const joinChat = useCallback((matchId: string, userId: string, username: string) => {
    if (socket && socket.connected) {
      socket.emit('join_chat', { matchId, userId, username });
    }
  }, [socket]);

  const leaveChat = useCallback((matchId: string, userId: string) => {
    if (socket && socket.connected) {
      socket.emit('leave_chat', { matchId, userId });
    }
  }, [socket]);

  const sendChatMessage = useCallback((matchId: string, userId: string, username: string, message: string) => {
    if (socket && socket.connected) {
      socket.emit('send_message', { matchId, userId, username, message, text: message });
    }
  }, [socket]);

  const sendTypingStart = useCallback((matchId: string, userId: string, username: string) => {
    if (socket && socket.connected) {
      socket.emit('typing_start', { matchId, userId, username });
    }
  }, [socket]);

  const sendTypingStop = useCallback((matchId: string, userId: string) => {
    if (socket && socket.connected) {
      socket.emit('typing_stop', { matchId, userId });
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        status,
        reconnect,
        subscribeMatch,
        unsubscribeMatch,
        joinChat,
        leaveChat,
        sendChatMessage,
        sendTypingStart,
        sendTypingStop,
        toasts,
        removeToast,
        activeSubscriptions,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
