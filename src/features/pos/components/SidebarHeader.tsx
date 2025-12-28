'use client';

import React from 'react';
import { ReceiptText, QrCode, Users } from 'lucide-react';

interface SidebarHeaderProps {
  activeTableId: string | null;
  total: number;
  onOpenQR: () => void;
  onOpenSplit: () => void;
}

export const SidebarHeader = ({ 
  activeTableId, 
  total, 
  onOpenQR, 
  onOpenSplit 
}: SidebarHeaderProps) => {
  return (
    <div className="p-8 border-b border-white/5 bg-gradient-to-br from-orange-500/5 to-transparent">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <ReceiptText className="text-orange-500" />
          Current Order
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={onOpenQR}
            disabled={!activeTableId}
            className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5 disabled:opacity-30"
            title="Table QR Order Link"
          >
            <QrCode size={20} />
          </button>
          <button 
            onClick={onOpenSplit}
            className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5"
          >
            <Users size={20} />
          </button>
        </div>
      </div>
      
      <div className="bg-black/20 p-4 rounded-3xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-orange-500/20">
            {activeTableId || 'TA'}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Table</p>
            <p className="text-sm font-black text-white">{activeTableId ? `Table ${activeTableId}` : 'Take Away'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-emerald-500 font-bold">Active Order</p>
          <p className="text-lg font-black text-white">{total.toLocaleString()} ₭</p>
        </div>
      </div>
    </div>
  );
};
