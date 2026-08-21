'use client';

import React from 'react';
import { useSocket, ToastAlert } from '@/context/SocketContext';
import { X, Flame, AlertOctagon, Info, CheckCircle2 } from 'lucide-react';

export const GoalToast: React.FC<{ toast: ToastAlert; onClose: () => void }> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'goal':
        return <span className="text-xl animate-bounce">⚽</span>;
      case 'card':
        return <AlertOctagon className="w-5 h-5 text-rose-500" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      case 'status':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'goal':
        return 'border-emerald-500/60 bg-emerald-950/80 shadow-emerald-500/20';
      case 'card':
        return 'border-rose-500/60 bg-rose-950/80 shadow-rose-500/20';
      case 'error':
        return 'border-rose-500/60 bg-rose-950/80 shadow-rose-500/20';
      default:
        return 'border-cyan-500/60 bg-slate-900/90 shadow-cyan-500/20';
    }
  };

  return (
    <div
      className={`max-w-sm w-full glass-panel border rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 animate-fade-in ${getBorderColor()}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-extrabold text-sm text-slate-100 truncate">{toast.title}</h4>
        <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{toast.description}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSocket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <GoalToast toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};
