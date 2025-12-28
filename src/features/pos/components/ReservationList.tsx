'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { Reservation } from '../types';
import { ReservationItem } from './ReservationItem';

interface ReservationListProps {
  reservations: Reservation[];
  showAddForm: boolean;
  onCheckIn: (id: string) => void;
  onCancel: (id: string) => void;
}

export const ReservationList = ({ reservations, showAddForm, onCheckIn, onCancel }: ReservationListProps) => {
  return (
    <div className={`flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide ${showAddForm ? 'hidden lg:block border-r border-white/5' : ''}`}>
      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full opacity-20">
          <Calendar size={80} className="mb-6" />
          <p className="text-xl font-bold">No reservations found</p>
        </div>
      ) : (
        reservations.map((res) => (
          <ReservationItem 
            key={res.id} 
            reservation={res} 
            onCheckIn={onCheckIn} 
            onCancel={onCancel} 
          />
        ))
      )}
    </div>
  );
};
