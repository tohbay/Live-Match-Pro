'use client';

import React from 'react';
import { useSocket, ToastAlert } from '@/context/SocketContext';
import { BellRing, X, AlertTriangle, Info, Zap } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSocket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastAlert; onClose: () => void }> = ({ toast, onClose }) => {
  const isGoal = toast.type === 'goal';
  const isCard = toast.type === 'card';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
        isGoal
          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-900/30 animate-bounce'
          : isCard
          ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-900/30'
          : isError
          ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-900/30'
          : 'bg-slate-900/90 border-slate-700 text-slate-100'
      } backdrop-blur-md`}
    >
      <div className="mt-0.5 shrink-0">
        {isGoal ? (
          <span className="text-xl">⚽</span>
        ) : isCard ? (
          <Zap className="w-5 h-5 text-rose-400" />
        ) : isError ? (
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        ) : (
          <Info className="w-5 h-5 text-blue-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
          {toast.title}
        </h4>
        <p className="text-xs mt-1 text-slate-300 line-clamp-2">{toast.description}</p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
