'use client';

import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { usePOSStore } from '../store';
import { ReservationList } from './ReservationList';
import { ReservationForm } from './ReservationForm';
import { Reservation } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ReservationModal Container
 * Orchestrates reservation list and booking form.
 * Modularized for production readiness and easier API binding.
 */
export const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
  const { reservations, addReservation, cancelReservation, markAsSeated } = usePOSStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  if (!isOpen) return null;

  const handleAddReservation = (data: Omit<Reservation, 'id' | 'status'>) => {
    addReservation(data);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-[#12141a] w-full max-w-4xl h-[80vh] rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-br from-indigo-500/5 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <Calendar className="text-indigo-500" />
              Table Reservations
            </h2>
            <p className="text-slate-500 text-sm font-medium">Manage upcoming customer bookings</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={18} />
              {showAddForm ? 'View List' : 'New Reservation'}
            </button>
            <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <ReservationList 
            reservations={reservations}
            showAddForm={showAddForm}
            onCheckIn={markAsSeated}
            onCancel={cancelReservation}
          />

          {showAddForm && (
            <ReservationForm onSubmit={handleAddReservation} />
          )}
        </div>
      </div>
    </div>
  );
};
