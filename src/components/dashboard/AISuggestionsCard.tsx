'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { useRouter } from 'next/navigation';

export default function AISuggestionsCard() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSuggest = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Failed to get suggestion');
      
      const suggestion = await response.json();
      
      // Store suggestion in localStorage to be used by calendar
      localStorage.setItem('pendingEventSuggestion', JSON.stringify(suggestion));
      
      // Redirect to calendar
      router.push('/dashboard/calendar');
    } catch (error) {
      console.error('Error getting suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">
        AI Suggestions
      </h2>
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your event in natural language..."
          className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        
        <button
          onClick={handleSuggest}
          disabled={loading || !prompt.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Creating Event...
            </span>
          ) : (
            'Create Event with AI'
          )}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Try saying: "Schedule a team meeting next Tuesday at 2pm for 1 hour" or "Set up a daily standup at 9am"
      </div>
    </div>
  );
} 