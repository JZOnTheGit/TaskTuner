'use client';

import { useState } from 'react';

interface DeleteAccountModalProps {
  onConfirm: (password: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteAccountModal({ onConfirm, onCancel, loading }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1d21] rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Account</h2>
        <p className="text-gray-400 text-sm mb-6">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 