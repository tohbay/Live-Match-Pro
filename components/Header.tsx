'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, User, ShieldCheck, Trophy, Radio } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import { ConnectionStatusBadge } from './ConnectionBanner';

export const Header: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [username, setUsername] = useState<string>('Guest');

  useEffect(() => {
    setIsMuted(soundManager.getMutedState());
    const storedName = localStorage.getItem('livematch_username');
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleToggleMute = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const handleChangeUsername = () => {
    const input = prompt('Enter your display name for match chat:', username);
    if (input && input.trim()) {
      const cleanName = input.trim().substring(0, 20);
      setUsername(cleanName);
      localStorage.setItem('livematch_username', cleanName);
      window.dispatchEvent(new Event('username_updated'));
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                LiveMatch
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Real-Time Football Center</p>
          </div>
        </Link>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ConnectionStatusBadge />

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? 'Unmute match audio alerts' : 'Mute match audio alerts'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* User Handle Button */}
          <button
            onClick={handleChangeUsername}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel border border-slate-700 text-xs sm:text-sm text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[100px] truncate font-medium">{username}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
