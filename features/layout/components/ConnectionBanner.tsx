'use client';

import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { RefreshCw, WifiOff, AlertCircle } from 'lucide-react';

export const ConnectionStatusBadge: React.FC = () => {
  const { status, reconnect } = useSocket();

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        <span className="hidden sm:inline">Connected Live</span>
        <span className="sm:hidden text-[11px] font-bold">LIVE</span>
      </div>
    );
  }

  if (status === 'reconnecting') {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:inline">Reconnecting...</span>
        <span className="sm:hidden text-[11px] font-bold">Connecting</span>
      </div>
    );
  }

  return (
    <button
      onClick={reconnect}
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 transition-all cursor-pointer shrink-0"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Disconnected (Retry)</span>
      <span className="sm:hidden text-[11px] font-bold">Retry</span>
    </button>
  );
};

export const ConnectionBanner: React.FC = () => {
  const { status, reconnect } = useSocket();

  if (status === 'connected') return null;

  return (
    <div className="bg-amber-950/60 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs sm:text-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status === 'reconnecting' ? (
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>
            {status === 'reconnecting'
              ? 'Attempting to reconnect to live server...'
              : 'Connection lost. Real-time updates paused.'}
          </span>
        </div>
        <button
          onClick={reconnect}
          className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-100 font-medium transition-colors cursor-pointer shrink-0"
        >
          Reconnect
        </button>
      </div>
    </div>
  );
};
