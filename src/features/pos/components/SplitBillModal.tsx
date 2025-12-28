'use client';

import React, { useState } from 'react';
import { Users, Receipt, UserMinus, UserPlus, Info } from 'lucide-react';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  totalAmount: number;
}

export const SplitBillModal = ({ isOpen, onClose, items, totalAmount }: SplitBillModalProps) => {
  const [splitCount, setSplitCount] = useState(2);
  
  if (!isOpen) return null;

  const perPerson = totalAmount / splitCount;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-[#12141a] w-full max-w-md rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users size={24} className="text-orange-500" />
            Split Bill
          </h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <Receipt size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Split Selector */}
          <div className="bg-white/5 border border-white/5 p-6 rounded-3xl text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-6">NUMBER OF PEOPLE</p>
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold text-2xl"
              >
                <UserMinus size={24} />
              </button>
              <span className="text-5xl font-black text-white w-12">{splitCount}</span>
              <button 
                onClick={() => setSplitCount(Math.min(20, splitCount + 1))}
                className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all font-bold text-2xl"
              >
                <UserPlus size={24} />
              </button>
            </div>
          </div>

          {/* Calculation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500 italic flex items-center gap-1.5">
                <Info size={14} />
                Calculated per person
              </span>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl text-center">
              <h3 className="text-3xl font-black text-orange-500">{perPerson.toLocaleString()} ₭</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">FOR EACH PERSON</p>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onClose}
              className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl transition-all active:scale-95"
            >
              Confirm Split & Checkout
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 mt-2 text-slate-500 font-bold hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
