'use client';

import React from 'react';
import Image from 'next/image';
import { Shield } from 'lucide-react';

interface TeamLogoProps {
  teamName: string;
  shortName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({
  teamName,
  shortName = '',
  size = 'md',
  className = '',
}) => {
  const code = (shortName || teamName.substring(0, 3)).toUpperCase();
  const nameLower = teamName.toLowerCase();

  // Size dimensions
  const dimensions = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }[size];

  // Check for image crests
  if (nameLower.includes('real madrid') || code === 'RMA') {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-lg border border-amber-400/40 ${dimensions} ${className}`}>
        <img
          src="/images/crests/real_madrid.jpg"
          alt={teamName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (nameLower.includes('manchester united') || code === 'MUN') {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-lg border border-red-500/40 ${dimensions} ${className}`}>
        <img
          src="/images/crests/man_utd.jpg"
          alt={teamName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Styled Vector Shield Badges for European Powerhouses
  const clubThemes: Record<string, { bg: string; border: string; text: string; subText?: string; accent: string; icon: string }> = {
    BAY: {
      bg: 'bg-gradient-to-br from-red-600 via-red-700 to-blue-900',
      border: 'border-red-400/50',
      text: 'text-white font-black',
      accent: 'FCB',
      icon: '🔴',
    },
    CHE: {
      bg: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900',
      border: 'border-cyan-400/50',
      text: 'text-white font-black',
      accent: 'CFC',
      icon: '🦁',
    },
    LIV: {
      bg: 'bg-gradient-to-br from-red-700 via-rose-800 to-amber-900',
      border: 'border-amber-400/50',
      text: 'text-amber-200 font-black',
      accent: 'LFC',
      icon: '🦅',
    },
    ARS: {
      bg: 'bg-gradient-to-br from-red-600 via-rose-700 to-slate-900',
      border: 'border-amber-300/50',
      text: 'text-white font-black',
      accent: 'AFC',
      icon: '💥',
    },
    TOT: {
      bg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800',
      border: 'border-slate-400/50',
      text: 'text-cyan-200 font-black',
      accent: 'THFC',
      icon: '🐓',
    },
    FCB: {
      bg: 'bg-gradient-to-br from-blue-800 via-purple-900 to-rose-800',
      border: 'border-amber-400/50',
      text: 'text-yellow-300 font-black',
      accent: 'BAR',
      icon: '🔵🔴',
    },
    BAR: {
      bg: 'bg-gradient-to-br from-blue-800 via-purple-900 to-rose-800',
      border: 'border-amber-400/50',
      text: 'text-yellow-300 font-black',
      accent: 'BAR',
      icon: '🔵🔴',
    },
    MCI: {
      bg: 'bg-gradient-to-br from-sky-400 via-cyan-600 to-blue-900',
      border: 'border-sky-300/50',
      text: 'text-slate-950 font-black',
      accent: 'MCFC',
      icon: '⛵',
    },
    PSG: {
      bg: 'bg-gradient-to-br from-blue-950 via-indigo-900 to-red-800',
      border: 'border-red-500/50',
      text: 'text-white font-black',
      accent: 'PSG',
      icon: '🗼',
    },
    JUV: {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800',
      border: 'border-amber-400/60',
      text: 'text-amber-300 font-black',
      accent: 'JUV',
      icon: '⚡',
    },
  };

  const theme = clubThemes[code] || {
    bg: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400 font-black',
    accent: code,
    icon: '⚽',
  };

  return (
    <div
      className={`relative rounded-2xl ${theme.bg} border ${theme.border} flex flex-col items-center justify-center shadow-lg font-mono tracking-tight shrink-0 overflow-hidden group ${dimensions} ${className}`}
      title={teamName}
    >
      {/* Background Accent Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

      <span className="text-[10px] sm:text-xs opacity-75 font-sans leading-none mb-0.5">{theme.icon}</span>
      <span className={`font-extrabold leading-none ${theme.text}`}>{code}</span>
    </div>
  );
};
