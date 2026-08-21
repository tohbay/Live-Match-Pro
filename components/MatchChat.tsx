'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket, UserPresencePayload } from '@/context/SocketContext';
import { ChatMessage, TypingIndicatorPayload } from '@/types/match';
import { UserIdentityModal } from './UserIdentityModal';
import { Send, MessageSquare, User, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface MatchChatProps {
  matchId: string;
}

export const MatchChat: React.FC<MatchChatProps> = ({ matchId }) => {
  const { socket, joinChat, leaveChat, sendChatMessage, sendTypingStart, sendTypingStop } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map()); // userId -> username
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or fetch user ID & Username
  useEffect(() => {
    let uId = localStorage.getItem('livematch_user_id');
    if (!uId) {
      uId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('livematch_user_id', uId);
    }
    setUserId(uId);

    const storedName = localStorage.getItem('livematch_username');
    if (storedName) {
      setUsername(storedName);
    } else {
      setIsIdentityModalOpen(true);
    }

    const handleNameUpdated = () => {
      const updated = localStorage.getItem('livematch_username');
      if (updated) setUsername(updated);
    };

    window.addEventListener('username_updated', handleNameUpdated);
    return () => window.removeEventListener('username_updated', handleNameUpdated);
  }, []);

  // Join chat room on mount/username ready and cleanup on unmount
  useEffect(() => {
    if (!matchId || !userId || !username) return;

    joinChat(matchId, userId, username);

    return () => {
      leaveChat(matchId, userId);
    };
  }, [matchId, userId, username, joinChat, leaveChat]);

  // Handle Socket Events for Chat
  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg: ChatMessage) => {
      if (msg.matchId === matchId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUserJoined = (payload: UserPresencePayload) => {
      if (payload.matchId === matchId && payload.userId !== userId) {
        setMessages((prev) => [
          ...prev,
          {
            matchId,
            userId: 'system',
            username: 'System',
            message: `${payload.username} joined the chat room.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    const handleUserLeft = (payload: UserPresencePayload) => {
      if (payload.matchId === matchId && payload.userId !== userId) {
        setMessages((prev) => [
          ...prev,
          {
            matchId,
            userId: 'system',
            username: 'System',
            message: `${payload.username} left the chat room.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    const handleTypingIndicator = (payload: TypingIndicatorPayload) => {
      if (payload.matchId === matchId && payload.userId !== userId) {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          if (payload.isTyping) {
            next.set(payload.userId, payload.username);
          } else {
            next.delete(payload.userId);
          }
          return next;
        });
      }
    };

    const handleSocketError = (err: { code?: string; message: string }) => {
      setChatError(err.message || 'Rate limit or chat error occurred.');
      setTimeout(() => setChatError(null), 5000);
    };

    socket.on('chat_message', handleChatMessage);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('typing_indicator', handleTypingIndicator);
    socket.on('error', handleSocketError);

    return () => {
      socket.off('chat_message', handleChatMessage);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('typing_indicator', handleTypingIndicator);
      socket.off('error', handleSocketError);
    };
  }, [socket, matchId, userId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Handle Typing Indicator debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 500) return;
    setInputText(val);

    if (!socket || !userId || !username) return;

    sendTypingStart(matchId, userId, username);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop(matchId, userId);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!username) {
      setIsIdentityModalOpen(true);
      return;
    }

    sendChatMessage(matchId, userId, username, inputText.trim());
    sendTypingStop(matchId, userId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setInputText('');
  };

  const handleSaveIdentity = (name: string) => {
    setUsername(name);
    localStorage.setItem('livematch_username', name);
    setIsIdentityModalOpen(false);
    window.dispatchEvent(new Event('username_updated'));
  };

  const typingArray = Array.from(typingUsers.values());

  return (
    <div className="relative overflow-hidden glass-panel rounded-3xl border border-slate-800 flex flex-col h-[400px] sm:h-[480px] lg:h-[calc(100vh-340px)] min-h-[380px] shadow-2xl">
      {/* Background Stadium Crowd Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none filter brightness-75"
        style={{ backgroundImage: `url('/images/stadium_hero.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95 pointer-events-none" />

      {/* User Identity Modal */}
      <UserIdentityModal
        isOpen={isIdentityModalOpen}
        onSave={handleSaveIdentity}
        initialName={username}
      />

      {/* Chat Header */}
      <div className="relative z-10 p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Live Match Fan Chat</h3>
            <p className="text-[10px] text-slate-400">Real-time chat room</p>
          </div>
        </div>

        <button
          onClick={() => setIsIdentityModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-panel text-xs text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
        >
          <User className="w-3 h-3 text-cyan-400" />
          <span className="font-medium max-w-[90px] truncate">{username || 'Set Name'}</span>
        </button>
      </div>

      {/* Chat Message Stream */}
      <div className="relative z-10 flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 space-y-2 px-6">
            <Sparkles className="w-8 h-8 text-slate-600" />
            <p className="text-xs">No messages yet in this room. Be the first fan to say hi!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSystem = msg.userId === 'system';
            const isSelf = msg.userId === userId;

            if (isSystem) {
              return (
                <div key={index} className="text-center py-1">
                  <span className="text-[11px] px-3 py-0.5 rounded-full bg-slate-900/80 text-slate-500 border border-slate-800/60 inline-block font-mono">
                    {msg.message}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1">
                  <span className="font-semibold text-slate-300">{msg.username}</span>
                  <span>•</span>
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
                <div
                  className={`px-3.5 py-2 rounded-2xl text-xs max-w-[82%] break-words shadow ${
                    isSelf
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800/90 border border-slate-700/60 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicators */}
        {typingArray.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic pt-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>
              {typingArray.length === 1
                ? `${typingArray[0]} is typing...`
                : `${typingArray.join(', ')} are typing...`}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rate Limit Error Banner */}
      {chatError && (
        <div className="bg-rose-950/80 border-t border-rose-500/30 text-rose-200 text-xs px-4 py-1.5 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">{chatError}</span>
        </div>
      )}

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="relative z-10 p-3 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={username ? 'Type a message (max 500 chars)...' : 'Set username to chat...'}
            maxLength={500}
            className="w-full pl-4 pr-12 py-2.5 rounded-xl glass-panel border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono ${
              inputText.length > 450 ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            {inputText.length}/500
          </span>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 font-bold" />
        </button>
      </form>
    </div>
  );
};

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
