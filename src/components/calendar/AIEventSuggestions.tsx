'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';

interface AIEventSuggestionsProps {
  onSuggest: (event: Partial<CalendarEvent>) => void;
}

export default function AIEventSuggestions({ onSuggest }: AIEventSuggestionsProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

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
      onSuggest(suggestion);
      setPrompt('');
    } catch (error) {
      console.error('Error getting suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your event in natural language (e.g., 'Schedule a team meeting next Tuesday at 2pm for 1 hour to discuss project updates')"
          className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <button
        onClick={handleSuggest}
        disabled={loading || !prompt.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Thinking...
          </span>
        ) : (
          'Get AI Suggestion'
        )}
      </button>
    </div>
  );
} 