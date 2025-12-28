'use client';

import React from 'react';
import { Receipt } from 'lucide-react';

interface SidebarFooterProps {
  total: number;
  tax: number;
  subtotal: number;
  onCheckout: () => void;
}

export const SidebarFooter = ({ total, tax, subtotal, onCheckout }: SidebarFooterProps) => {
  return (
    <div className="p-8 bg-black/40 backdrop-blur-xl border-t border-white/5 space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between text-slate-500 font-bold text-sm">
          <span>Subtotal</span>
          <span className="text-white">{subtotal.toLocaleString()} ₭</span>
        </div>
        <div className="flex justify-between text-slate-500 font-bold text-sm">
          <span>Service Tax (10%)</span>
          <span className="text-white">{tax.toLocaleString()} ₭</span>
        </div>
        <div className="flex justify-between items-end pt-2 border-t border-white/5">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Grand Total</span>
          <span className="text-3xl font-black text-white">
            {total.toLocaleString()} ₭
          </span>
        </div>
      </div>

      <button 
        onClick={onCheckout}
        disabled={subtotal === 0}
        className="w-full py-6 bg-emerald-500 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
      >
        <Receipt size={24} />
        PROCEED TO CHECKOUT
      </button>
    </div>
  );
};
