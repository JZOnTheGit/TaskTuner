'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';
import { CalendarEvent } from '@/types/calendar';
import StatsCard from '@/components/dashboard/StatsCard';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import AISuggestionsCard from '@/components/dashboard/AISuggestionsCard';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    loadEvents();
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (data?.username) {
        setUsername(data.username);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        allDay: event.all_day,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const todaysEvents = events.filter(event =>
    isWithinInterval(new Date(event.start), { start: todayStart, end: todayEnd })
  );

  const thisWeeksEvents = events.filter(event =>
    isWithinInterval(new Date(event.start), { start: weekStart, end: weekEnd })
  );

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= now)
    .slice(0, 5); // Show only next 5 events

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Welcome back, {username || 'User'}
      </h1>
      <p className="text-gray-400 mb-6 sm:mb-8">Here's what's happening with your schedule</p>

      {/* Stats Grid - Stack on mobile */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatsCard
          title="Today's Events"
          value={todaysEvents.length}
          bgColor="bg-blue-600"
        />
        <StatsCard
          title="This Week"
          value={thisWeeksEvents.length}
          bgColor="bg-purple-600"
        />
        <StatsCard
          title="Total Events"
          value={events.length}
          bgColor="bg-pink-600"
        />
      </div>

      {/* Main Content Grid - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Quick Actions & AI Assistant */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/calendar?new=true')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span className="text-xl">+</span>
                Create New Event
              </button>
              <button
                onClick={() => router.push('/dashboard/calendar')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Calendar
              </button>
            </div>
          </div>

          {/* AI Event Assistant */}
          <AISuggestionsCard />
        </div>

        {/* Upcoming Events - Full width on mobile */}
        <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Upcoming Events</h2>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <UpcomingEvents events={upcomingEvents} />
          )}
        </div>
      </div>
    </div>
  );
} 