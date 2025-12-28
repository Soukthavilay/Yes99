'use client';

import React from 'react';
import { Clock, Users, Trash2, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationItemProps {
  reservation: Reservation;
  onCheckIn: (id: string) => void;
  onCancel: (id: string) => void;
}

export const ReservationItem = ({ reservation, onCheckIn, onCancel }: ReservationItemProps) => {
  return (
    <div className={`bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all ${reservation.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-black/40 rounded-2xl flex flex-col items-center justify-center border border-white/5">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Table</span>
          <span className="text-2xl font-black text-white">{reservation.tableId}</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-1">{reservation.customerName}</h4>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-500" /> {new Date(reservation.reservationTime).toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><Users size={12} className="text-indigo-500" /> {reservation.guestCount} Guests</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {reservation.status === 'confirmed' && (
          <>
            <button 
              onClick={() => onCheckIn(reservation.id)}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
            >
              Check In
            </button>
            <button 
              onClick={() => onCancel(reservation.id)}
              className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
        {reservation.status === 'seated' && (
          <span className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl">
            <CheckCircle2 size={14} /> Seated
          </span>
        )}
        {reservation.status === 'cancelled' && (
          <span className="text-red-500 font-bold text-xs uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-xl">
            Cancelled
          </span>
        )}
      </div>
    </div>
  );
};
