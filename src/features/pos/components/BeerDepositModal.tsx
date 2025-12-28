'use client';

import React, { useState } from 'react';
import { Beer, X, Save, Search, User, Phone } from 'lucide-react';
import { usePOSStore } from '../store';

interface BeerDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeerDepositModal = ({ isOpen, onClose }: BeerDepositModalProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    brand: 'Beerlao Gold',
    quantity: 1,
    note: '',
  });

  const addBeerDeposit = usePOSStore((state) => state.addBeerDeposit);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBeerDeposit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-[#12141a] w-full max-w-lg rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <Beer size={28} className="text-orange-500" />
              ຝາກເບຍ (Beer Deposit)
            </h2>
            <p className="text-slate-500 text-sm font-medium">Create a new beer deposit record</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Customer Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  required
                  type="text" 
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="ຊື່ລູກຄ້າ"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  required
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="เบอร์โทร"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Beer Brand & Brand</label>
            <select 
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all appearance-none"
            >
              <option value="Beerlao Gold" className="bg-[#12141a]">Beerlao Gold</option>
              <option value="Beerlao Lager" className="bg-[#12141a]">Beerlao Lager</option>
              <option value="Heineken" className="bg-[#12141a]">Heineken</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Quantity (Bottles/Cans)</label>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})}
                className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white font-bold text-xl hover:bg-white/10 transition-all"
              >
                -
              </button>
              <input 
                type="number"
                value={formData.quantity}
                readOnly
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 text-center text-2xl font-black text-orange-500 outline-none"
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, quantity: formData.quantity + 1})}
                className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Notes (Optional)</label>
            <textarea 
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700 h-24 resize-none"
              placeholder="ໝາຍເຫດເພີ່ມເຕີມ..."
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            <Save size={20} />
            CONFIRM DEPOSIT
          </button>
        </form>
      </div>
    </div>
  );
};
