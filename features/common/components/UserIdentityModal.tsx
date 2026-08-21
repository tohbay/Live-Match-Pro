'use client';

import React, { useState } from 'react';
import { User, Check } from 'lucide-react';

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
  const [name, setName] = useState(initialName || '');
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
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-xl mx-auto">
            <img
              src="/images/user_avatar.svg"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">Join Match Fan Chat</h3>
          <p className="text-xs text-slate-400">
            Choose a handle to send messages and interact with fans watching this live match.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Display Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Alex10, FootballFan"
              maxLength={20}
              className="w-full px-4 py-2.5 rounded-xl glass-panel border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-extrabold text-slate-950 hover:from-cyan-400 hover:to-blue-500 text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Set Handle & Join Chat</span>
          </button>
        </form>
      </div>
    </div>
  );
};
