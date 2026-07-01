import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  value: string; // "19:00"
  onChange: (time: string) => void;
  slots?: { time: string; available: boolean }[];
}

const defaultSlots = [
  { time: '12:00', available: true },
  { time: '12:30', available: true },
  { time: '13:00', available: false },
  { time: '13:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: true },
  { time: '18:30', available: true },
  { time: '19:00', available: true },
  { time: '19:30', available: true },
  { time: '20:00', available: true },
  { time: '20:30', available: false },
  { time: '21:00', available: true },
  { time: '21:30', available: true },
  { time: '22:00', available: true }
];

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  value,
  onChange,
  slots = defaultSlots
}) => {
  const lunchSlots = slots.filter(s => parseInt(s.time.split(':')[0]) < 16);
  const dinnerSlots = slots.filter(s => parseInt(s.time.split(':')[0]) >= 16);

  const renderSlotGrid = (items: typeof slots) => (
    <div className="grid grid-cols-4 gap-2">
      {items.map(slot => {
        const selected = value === slot.time;
        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onChange(slot.time)}
            className={`py-2 px-1 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              selected
                ? 'bg-amber-500 border-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/10'
                : slot.available
                ? 'bg-neutral-900/60 border-neutral-850 hover:border-neutral-700 text-neutral-200 hover:bg-neutral-900'
                : 'bg-neutral-950/20 border-neutral-900 text-neutral-600 line-through cursor-not-allowed'
            }`}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {lunchSlots.length > 0 && (
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
            <Clock size={10} />
            Lunch Slots
          </h5>
          {renderSlotGrid(lunchSlots)}
        </div>
      )}

      {dinnerSlots.length > 0 && (
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
            <Clock size={10} />
            Dinner Slots
          </h5>
          {renderSlotGrid(dinnerSlots)}
        </div>
      )}
    </div>
  );
};
