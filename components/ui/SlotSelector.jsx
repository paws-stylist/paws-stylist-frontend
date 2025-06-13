'use client';
import { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useGet } from '@/hooks/useApi';

const SlotSelector = ({ selectedSlotId, onSlotSelect, className = '' }) => {
  const [selectedDate, setSelectedDate] = useState('');
  
  // Fetch available slots from API
  const { data: apiResponse, loading, error, refetch } = useGet('/slots/available');
  
  // Extract slots data from API response
  const slotsData = apiResponse?.data || apiResponse || {};
  
  useEffect(() => {
    // Auto-select first available date when slots load
    if (slotsData && Object.keys(slotsData).length > 0 && !selectedDate) {
      const firstDate = Object.keys(slotsData).sort()[0];
      setSelectedDate(firstDate);
    }
  }, [slotsData, selectedDate]);

  const formatDateLabel = (dateString) => {
    try {
      // Parse date string in YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      // Reset time for comparison
      const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

      if (targetDate.getTime() === todayDate.getTime()) {
        return 'Today';
      } else if (targetDate.getTime() === tomorrowDate.getTime()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  };

  const formatTimeSlot = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', timeString, error);
      return timeString;
    }
  };

  const formatShortDate = (dateString) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      console.error('Error formatting short date:', dateString, error);
      return dateString;
    }
  };

  const availableDates = slotsData ? Object.keys(slotsData).sort() : [];
  const selectedDateSlots = selectedDate && slotsData ? slotsData[selectedDate] || [] : [];

  const navigateDate = (direction) => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
    }
  };

  // Handler for slot selection that includes event prevention
  const handleSlotClick = (slot, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Slot clicked, calling onSlotSelect:', slot);
    onSlotSelect(slot);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !slotsData || Object.keys(slotsData).length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No slots available</h3>
        <p className="text-gray-500 mb-4">
          {error ? 'Failed to load available slots.' : 'No appointment slots are currently available.'}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Refresh Slots
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <FiCalendar className="w-4 h-4 inline mr-2" />
          Select Date
        </label>
        
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
          <button
            type="button"
            onClick={() => navigateDate('prev')}
            disabled={availableDates.indexOf(selectedDate) === 0}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2 overflow-x-auto">
            {availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedDate === date
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{formatDateLabel(date)}</div>
                  <div className="text-xs opacity-75">
                    {formatShortDate(date)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => navigateDate('next')}
            disabled={availableDates.indexOf(selectedDate) === availableDates.length - 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FiClock className="w-4 h-4 inline mr-2" />
            Select Time ({selectedDateSlots.length} slots available)
          </label>
          
          {selectedDateSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedDateSlots.map((slot) => (
                <button
                  key={slot._id}
                  type="button"
                  onClick={(e) => handleSlotClick(slot, e)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedSlotId === slot._id
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>{formatTimeSlot(slot.time)}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiClock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No time slots available for this date</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Slot Info */}
      {selectedSlotId && selectedDate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800">
            <FiCalendar className="w-4 h-4" />
            <span className="font-medium">Selected Appointment:</span>
          </div>
          <div className="mt-2 text-green-700">
            <span className="font-semibold">
              {formatDateLabel(selectedDate)} - {formatTimeSlot(
                selectedDateSlots.find(slot => slot._id === selectedSlotId)?.time || ''
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotSelector; 