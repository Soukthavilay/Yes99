'use client';

import React from 'react';
import { X, Receipt, Hash, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { Receipt as ReceiptType } from '../types';

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: ReceiptType | null;
}

export const BillDetailModal = ({ isOpen, onClose, bill }: BillDetailModalProps) => {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-[#12141a] w-full max-w-2xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-br from-orange-500/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20">
              <Receipt size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Order Details</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Hash size={14} />
                <span>{bill.orderId}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Date & Time</span>
              <p className="text-white font-bold flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                {new Date(bill.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Payment Method</span>
              <p className="text-white font-bold flex items-center gap-2">
                <CreditCard size={16} className="text-slate-400" />
                {bill.paymentMethod.replace('_', ' ')}
              </p>
            </div>
            <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Table Number</span>
              <p className="text-orange-500 font-black text-xl">Table {bill.tableId || 'N/A'}</p>
            </div>
            <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Guest Count</span>
              <p className="text-white font-black text-xl">0</p> 
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Item Breakdown</h3>
            <div className="bg-black/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bill.items.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{item.name}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-slate-400 font-bold">x{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-white font-bold">{(item.price * item.quantity).toLocaleString()} ₭</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-orange-500/70 text-[10px] font-black uppercase tracking-widest mb-1">Total Paid</p>
                <h3 className="text-4xl font-black text-orange-500">{bill.total.toLocaleString()} ₭</h3>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 flex gap-4 bg-black/40">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all"
          >
            Close
          </button>
          <button 
            className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
          >
            Reprint Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
