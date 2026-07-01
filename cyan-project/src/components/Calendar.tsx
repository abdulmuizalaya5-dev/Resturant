'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate = new Date().toISOString().split('T')[0]
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    return value ? new Date(value + 'T00:00:00') : new Date();
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  // First day of month (0 = Sun, 1 = Mon, etc.)
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate calendar grid
  const daysGrid: (number | null)[] = [];
  // Fill leading empty cells
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(null);
  }
  // Fill actual days
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(year, month, day);
    // Format to YYYY-MM-DD local time
    const formatted = selectedDate.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD
    onChange(formatted);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const [valY, valM, valD] = value.split('-').map(Number);
    return valY === year && valM === month + 1 && valD === day;
  };

  const isPast = (day: number) => {
    const target = new Date(year, month, day);
    target.setHours(23, 59, 59, 999); // Allow today
    const min = minDate ? new Date(minDate + 'T00:00:00') : new Date();
    return target < min;
  };

  return (
    <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white text-sm">
          {monthNames[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-500 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysGrid.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const selected = isSelected(day);
          const past = isPast(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={past}
              onClick={() => handleSelectDay(day)}
              className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selected
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20'
                  : past
                  ? 'text-neutral-700 cursor-not-allowed'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
