'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CalendarEvent } from '@/types/calendar';

interface EventModalProps {
  event?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

export default function EventModal({ event, onClose, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.start || new Date());
  const [endDate, setEndDate] = useState(event?.end || new Date());
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for the event');
      return;
    }

    setLoading(true);
    try {
      const newEvent: CalendarEvent = {
        id: '',
        title: title.trim(),
        description: description.trim(),
        start: startDate,
        end: endDate,
        allDay,
      };

      await onSave(newEvent);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1d21] rounded-xl p-6 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            {event ? 'Update your event details' : 'Add a new event to your TaskTuner calendar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Event description (optional)"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-1">Start</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date || new Date())}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-1">End</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date || new Date())}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                minDate={startDate}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-white">
              All Day Event
            </label>
          </div>

          <div className="flex justify-between space-x-2 mt-6">
            {event?.id && (
              <button
                type="button"
                onClick={() => onDelete(event)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-[#2d3238]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 