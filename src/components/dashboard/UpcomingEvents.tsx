'use client';

import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

interface UpcomingEventsProps {
  events: CalendarEvent[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p>No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
          <h3 className="font-medium text-white">{event.title}</h3>
          <p className="text-sm text-gray-400">
            {format(new Date(event.start), 'MMM d, yyyy h:mm a')}
          </p>
          {event.description && (
            <p className="text-sm text-gray-400 mt-2">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  );
} 