'use client';

import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, EventProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';
import EventModal from '@/components/calendar/EventModal';
import { CalendarEvent } from '@/types/calendar';
import enUS from 'date-fns/locale/en-US';
import DeleteConfirmModal from '@/components/calendar/DeleteConfirmModal';

// Import styles - order is important
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS
  },
});

// Add this interface inside your file
interface ExpandedDescriptions {
  [key: string]: boolean;
}

// Add this helper function at the top of your file
const formatEventTime = (event: CalendarEvent) => {
  if (event.allDay) {
    return 'all day';
  }

  const startTime = format(event.start, 'h:mm a');
  const endTime = format(event.end, 'h:mm a');
  
  // If start and end are on the same day
  if (format(event.start, 'yyyy-MM-dd') === format(event.end, 'yyyy-MM-dd')) {
    return `${startTime} - ${endTime}`;
  }
  
  // If multi-day event
  return `${startTime} → ${endTime}`;
};

export default function CalendarPage() {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [expandedDescriptions, setExpandedDescriptions] = useState<ExpandedDescriptions>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, [user]);

  // Load events from database
  const loadEvents = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        // Only set to 'No description' if actually empty
        description: event.description?.trim() || 'No description',
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        allDay: event.all_day,
        user_id: event.user_id
      }));

      console.log('Loaded events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error in loadEvents:', error);
      alert('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save event to database
  const handleSaveEvent = async (event: CalendarEvent) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        user_id: user.id,
        title: event.title,
        description: event.description || '',
        start_time: event.start.toISOString(),
        end_time: event.end.toISOString(),
        all_day: event.allDay || false
      };

      console.log('Attempting to save event:', eventData);

      let result;
      // Check if this is an update or new event
      if (selectedEvent?.id) {
        // Update existing event
        result = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', selectedEvent.id)
          .select();
        
        console.log('Updating existing event:', selectedEvent.id);
      } else {
        // Create new event
        result = await supabase
          .from('calendar_events')
          .insert([eventData])
          .select();
        
        console.log('Creating new event');
      }

      const { data, error } = result;

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No data returned after save');
        throw new Error('Failed to save event - no data returned');
      }

      console.log('Successfully saved event:', data[0]);
      await loadEvents();
      setShowEventModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      await loadEvents();
      setShowEventModal(false);
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  // Handle slot selection (clicking on calendar)
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: '',
      title: '',
      start,
      end,
      description: '',
      allDay: false,
    });
    setShowEventModal(true);
  }, []);

  // Add these new functions for navigation
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: typeof Views[keyof typeof Views]) => {
    setView(newView);
  };

  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const formatAgendaEvent = ({ event }: { event: CalendarEvent }) => {
    // Only show "No description" if description is actually empty
    const description = event.description && event.description.trim().length > 0 
      ? event.description 
      : 'No description';
      
    const isExpanded = expandedDescriptions[event.id];
    const shouldTruncate = description.length > 100;

    console.log('Event description:', {
      original: event.description,
      formatted: description,
      isEmpty: !event.description || event.description.trim().length === 0
    });

    return (
      <div className="agenda-event-content">
        <div className="agenda-event-title">
          {event.title}
        </div>
        <div className="agenda-event-description">
          {shouldTruncate && !isExpanded ? (
            <>
              {description.slice(0, 100)}...
              <button
                className="agenda-view-more ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDescription(event.id);
                }}
              >
                Read more
              </button>
            </>
          ) : shouldTruncate && isExpanded ? (
            <>
              {description}
              <button
                className="agenda-view-more ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDescription(event.id);
                }}
              >
                Show less
              </button>
            </>
          ) : (
            description
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Check for pending suggestions when component mounts
    const pendingSuggestion = localStorage.getItem('pendingEventSuggestion');
    if (pendingSuggestion) {
      try {
        const suggestion = JSON.parse(pendingSuggestion);
        setSelectedEvent({
          id: '',
          title: suggestion.title || '',
          description: suggestion.description || '',
          start: new Date(suggestion.start),
          end: new Date(suggestion.end),
          allDay: suggestion.allDay || false
        });
        setShowEventModal(true);
        // Clear the pending suggestion
        localStorage.removeItem('pendingEventSuggestion');
      } catch (error) {
        console.error('Error processing suggestion:', error);
      }
    }
  }, []); // Run once when component mounts

  return (
    <div className="min-h-screen bg-black px-1 sm:px-4 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Calendar</h1>
            <p className="text-gray-400">Manage your schedule and events</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center text-white/80 hover:text-white transition-colors text-sm sm:text-base mt-4 sm:mt-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="ml-2">Back to Dashboard</span>
          </Link>
        </div>

        {/* Calendar Container */}
        <div 
          className="mx-4 sm:mx-6 bg-[#1a1d21] rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden" 
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            views={['month', 'week', 'day', 'agenda']}
            defaultView={Views.MONTH}
            view={view}
            date={date}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            style={{ 
              height: '100%',
              backgroundColor: '#1a1d21',
              border: 'none',
              maxHeight: '100%'
            }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#3B82F6',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                padding: '2px 8px'
              }
            })}
            messages={{
              today: 'Today',
              previous: 'Back',
              next: 'Next',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              agenda: 'Agenda'
            }}
            components={{
              toolbar: props => (
                <div className="rbc-toolbar flex-col sm:flex-row gap-4 sm:gap-0">
                  <span className="rbc-btn-group mb-4 sm:mb-0">
                    <button type="button" onClick={() => props.onNavigate('TODAY')}>
                      Today
                    </button>
                    <button type="button" onClick={() => props.onNavigate('PREV')}>
                      Back
                    </button>
                    <button type="button" onClick={() => props.onNavigate('NEXT')}>
                      Next
                    </button>
                  </span>
                  <span className="rbc-toolbar-label text-base sm:text-lg">{props.label}</span>
                  <span className="rbc-btn-group grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0">
                    {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(viewName => (
                      <button
                        key={viewName}
                        type="button"
                        className={viewName === props.view ? 'rbc-active' : ''}
                        onClick={() => props.onView(viewName)}
                      >
                        {viewName.charAt(0).toUpperCase() + viewName.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </span>
                </div>
              ),
              agenda: {
                event: formatAgendaEvent,
                time: ({ event, label }: any) => (
                  <span className="rbc-agenda-time-cell">
                    {formatEventTime(event)}
                  </span>
                )
              }
            }}
          />
        </div>

        {/* Modals */}
        {showEventModal && (
          <EventModal
            event={selectedEvent}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
            onSave={handleSaveEvent}
            onDelete={(event) => {
              setEventToDelete(event);
              setShowDeleteModal(true);
            }}
          />
        )}

        {showDeleteModal && eventToDelete && (
          <DeleteConfirmModal
            eventTitle={eventToDelete.title}
            onConfirm={() => handleDeleteEvent(eventToDelete.id)}
            onCancel={() => {
              setShowDeleteModal(false);
              setEventToDelete(null);
            }}
          />
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a1d21] rounded-xl p-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}

        {/* Calendar styles */}
        <style jsx global>{`
          .rbc-calendar {
            min-height: auto;
            height: 100%;
            background: #1a1d21;
            padding: 0.5rem;
            border-radius: 0.75rem;
            display: flex;
            flex-direction: column;
          }

          .rbc-calendar .rbc-toolbar {
            flex-shrink: 0;
          }

          .rbc-calendar .rbc-month-view,
          .rbc-calendar .rbc-agenda-view,
          .rbc-calendar .rbc-time-view {
            flex: 1;
            min-height: 0;
          }

          @media (min-width: 640px) {
            .rbc-calendar {
              padding: 1rem;
              border-radius: 1rem;
            }
          }

          /* Make agenda view scrollable horizontally on mobile */
          @media (max-width: 639px) {
            .rbc-agenda-view {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }

            .rbc-agenda-view table.rbc-agenda-table {
              font-size: 0.75rem; /* Even smaller font */
              min-width: 500px; /* Ensure minimum width for content */
            }

            .rbc-agenda-view table.rbc-agenda-table thead > tr > th,
            .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
              padding: 0.25rem;
              white-space: nowrap;
            }

            .rbc-agenda-date-cell,
            .rbc-agenda-time-cell {
              font-size: 0.7rem;
              min-width: 80px;
            }

            .rbc-agenda-event-cell {
              font-size: 0.75rem;
              min-width: 200px;
            }

            /* Add visual indicator for scroll */
            .rbc-agenda-content {
              position: relative;
            }

            .rbc-agenda-content::after {
              content: '';
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 20px;
              background: linear-gradient(to right, transparent, rgba(26, 29, 33, 0.5));
              pointer-events: none;
            }
          }

          /* Adjust month view for mobile */
          @media (max-width: 639px) {
            .rbc-month-view {
              font-size: 0.75rem;
            }

            .rbc-header {
              padding: 0.25rem;
            }

            .rbc-date-cell {
              padding: 0.125rem;
            }

            .rbc-event {
              padding: 0.125rem 0.25rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
} 