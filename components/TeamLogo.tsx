'use client';

import React from 'react';

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

  // Map team names / codes to crest files
  let logoSrc: string | null = null;
  let borderColor = 'border-slate-700/80';

  if (nameLower.includes('real madrid') || code === 'RMA') {
    logoSrc = '/images/crests/real_madrid.jpg';
    borderColor = 'border-amber-400/50';
  } else if (nameLower.includes('manchester united') || code === 'MUN') {
    logoSrc = '/images/crests/man_utd.jpg';
    borderColor = 'border-red-500/50';
  } else if (nameLower.includes('barcelona') || code === 'BAR' || code === 'FCB') {
    logoSrc = '/images/crests/barcelona.svg';
    borderColor = 'border-amber-400/50';
  } else if (nameLower.includes('chelsea') || code === 'CHE') {
    logoSrc = '/images/crests/chelsea.svg';
    borderColor = 'border-cyan-400/50';
  } else if (nameLower.includes('liverpool') || code === 'LIV') {
    logoSrc = '/images/crests/liverpool.svg';
    borderColor = 'border-rose-500/50';
  } else if (nameLower.includes('arsenal') || code === 'ARS') {
    logoSrc = '/images/crests/arsenal.svg';
    borderColor = 'border-red-500/50';
  } else if (nameLower.includes('bayern') || code === 'BAY') {
    logoSrc = '/images/crests/bayern.svg';
    borderColor = 'border-red-500/50';
  } else if (nameLower.includes('tottenham') || code === 'TOT') {
    logoSrc = '/images/crests/tottenham.svg';
    borderColor = 'border-slate-400/50';
  }

  // Render Image or SVG Crest
  if (logoSrc) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-lg border ${borderColor} ${dimensions} ${className}`}>
        <img
          src={logoSrc}
          alt={teamName}
          className="w-full h-full object-cover p-0.5"
        />
      </div>
    );
  }

  // Dynamic Stylized Fallback Shield Badge
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-cyan-500/40 flex flex-col items-center justify-center shadow-lg font-mono tracking-tight shrink-0 overflow-hidden ${dimensions} ${className}`}
      title={teamName}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      <span className="text-[10px] sm:text-xs opacity-75 font-sans leading-none mb-0.5">⚽</span>
      <span className="font-extrabold leading-none text-cyan-400 font-mono">{code}</span>
    </div>
  );
};
