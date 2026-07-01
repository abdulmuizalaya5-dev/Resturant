import React from 'react';
import { Calendar, Clock, Users, XCircle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Booking } from '@/types';
import { Card } from './Card';
import { Button } from './Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onViewDetails?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onViewDetails
}) => {
  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 size={12} />;
      case 'pending':
        return <AlertCircle size={12} />;
      case 'completed':
        return <CheckCircle2 size={12} />;
      case 'cancelled':
        return <XCircle size={12} />;
    }
  };

  return (
    <Card variant="glass" className="p-5 border-neutral-800/80">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Restaurant Thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
            <img
              src={booking.restaurantImage}
              alt={booking.restaurantName}
              className="object-cover w-full h-full"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h4 className="font-bold text-white tracking-tight">{booking.restaurantName}</h4>
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="capitalize">{booking.status}</span>
              </span>
            </div>
            
            {/* Booking Specs */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-neutral-500" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-neutral-500" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} className="text-neutral-500" />
                <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              {booking.tableNumber && (
                <div className="px-1.5 py-0.5 bg-neutral-850 rounded border border-neutral-800 text-[10px] text-amber-400 uppercase font-mono tracking-wider">
                  Table {booking.tableNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800/40">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(booking)}
              className="px-3"
            >
              <Info size={14} className="mr-1.5" />
              Details
            </Button>
          )}

          {onCancel && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(booking.id)}
              className="px-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20"
            >
              <XCircle size={14} className="mr-1.5" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
