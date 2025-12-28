'use client';

import React, { useState } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { Ingredient } from '../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onConfirm: (ingredientId: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason: string) => void;
}

export const StockAdjustmentModal = ({ isOpen, onClose, ingredient, onConfirm }: StockAdjustmentModalProps) => {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

  if (!isOpen || !ingredient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 && type !== 'adjustment') return;
    onConfirm(ingredient.id, quantity, type, reason);
    onClose();
    // Reset
    setQuantity(0);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-[#12141a] w-full max-w-lg rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-br from-orange-500/5 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Stock Adjustment</h2>
            <p className="text-slate-500 text-sm font-medium">{ingredient.name}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Adjustment Type */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setType('in')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                type === 'in' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/5 text-slate-500'
              }`}
            >
              <ArrowUpCircle size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Stock In</span>
            </button>
            <button
              type="button"
              onClick={() => setType('out')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                type === 'out' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-slate-500'
              }`}
            >
              <ArrowDownCircle size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Stock Out</span>
            </button>
            <button
              type="button"
              onClick={() => setType('adjustment')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                type === 'adjustment' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-white/5 border-white/5 text-slate-500'
              }`}
            >
              <AlertCircle size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Manual</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {type === 'adjustment' ? 'Target Stock Level' : 'Quantity to Add/Remove'}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-black text-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{ingredient.unit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Reason / Note</label>
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g., Weekly Restock, Spoilage, Error correction..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white h-24 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${
              type === 'in' ? 'bg-emerald-500 shadow-emerald-500/20' : 
              type === 'out' ? 'bg-red-500 shadow-red-500/20' : 'bg-orange-500 shadow-orange-500/20'
            }`}
          >
            CONFIRM ADJUSTMENT
          </button>
        </form>
      </div>
    </div>
  );
};
