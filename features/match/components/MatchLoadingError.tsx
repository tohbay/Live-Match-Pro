import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Home } from 'lucide-react';

interface MatchLoadingErrorProps {
  error: string;
  redirectCountdown: number | null;
  onRetry: () => void;
}

export function MatchLoadingError({ error, redirectCountdown, onRetry }: MatchLoadingErrorProps) {
  const router = useRouter();

  return (
    <div className="glass-panel border border-rose-500/30 p-8 rounded-3xl text-center space-y-5 max-w-md mx-auto my-12 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-100">{error}</h3>
        {redirectCountdown !== null && (
          <p className="text-xs text-slate-400 mt-2">
            Redirecting to Live Match Center in{' '}
            <span className="font-bold text-cyan-400 font-mono text-sm">{redirectCountdown}s</span>...
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => router.push('/')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home Now</span>
        </button>
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer border border-slate-700"
        >
          Retry Loading
        </button>
      </div>
    </div>
  );
}
