'use client';

import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

interface UserIdentityModalProps {
  isOpen: boolean;
  onSave: (username: string) => void;
  initialName?: string;
}

export const UserIdentityModal: React.FC<UserIdentityModalProps> = ({
  isOpen,
  onSave,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a username');
      return;
    }
    if (name.trim().length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">Join Match Fan Chat</h3>
          <p className="text-xs text-slate-400">
            Choose a handle to send messages and interact with fans watching this live match.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. RedDevil99 or Culer_Fan"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl glass-panel border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Chatting</span>
          </button>
        </form>
      </div>
    </div>
  );
};
