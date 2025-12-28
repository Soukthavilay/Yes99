'use client';

import React, { useState } from 'react';
import { Reservation } from '../types';

interface ReservationFormProps {
  onSubmit: (data: Omit<Reservation, 'id' | 'status'>) => void;
}

export const ReservationForm = ({ onSubmit }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    tableId: '',
    customerName: '',
    phoneNumber: '',
    guestCount: 2,
    reservationTime: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tableId || !formData.customerName || !formData.reservationTime) return;

    onSubmit({
      ...formData,
      reservationTime: new Date(formData.reservationTime).toISOString(),
    });

    setFormData({
      tableId: '',
      customerName: '',
      phoneNumber: '',
      guestCount: 2,
      reservationTime: '',
      note: ''
    });
  };

  return (
    <div className="w-full lg:w-[400px] bg-black/20 p-8 overflow-y-auto scrollbar-hide">
      <h3 className="text-xl font-bold text-white mb-8">New Reservation</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Table Number</label>
          <input 
            type="text" 
            value={formData.tableId}
            onChange={e => setFormData({...formData, tableId: e.target.value})}
            placeholder="e.g. 01, 15, B02"
            className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Customer Name</label>
          <input 
            type="text" 
            value={formData.customerName}
            onChange={e => setFormData({...formData, customerName: e.target.value})}
            placeholder="Full name"
            className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
          <input 
            type="tel" 
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
            placeholder="20 XXXX XXXX"
            className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Guests</label>
            <input 
              type="number" 
              value={formData.guestCount}
              onChange={e => setFormData({...formData, guestCount: parseInt(e.target.value)})}
              className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Time</label>
            <input 
              type="datetime-local" 
              value={formData.reservationTime}
              onChange={e => setFormData({...formData, reservationTime: e.target.value})}
              className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Note (Optional)</label>
          <textarea 
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
            className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-white h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button 
          type="submit"
          className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
        >
          SAVE RESERVATION
        </button>
      </form>
    </div>
  );
};
