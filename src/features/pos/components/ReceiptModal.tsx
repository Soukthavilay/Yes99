'use client';

import React from 'react';
import { Printer, Download, Share2, X } from 'lucide-react';
import { Receipt as ReceiptType } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptType | null;
}

export const ReceiptModal = ({ isOpen, onClose, receipt }: ReceiptModalProps) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-[400px] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Receipt Header */}
        <div className="p-8 text-black text-center border-b border-dashed border-slate-200">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black italic text-2xl">
            Y99
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest">YES99 Restaurant</h2>
          <p className="text-xs text-slate-500 font-medium">Pakse Branch, Champasack, Laos</p>
          <p className="text-xs text-slate-500">Tel: +856 20 77XX XXXX</p>
        </div>

        {/* Receipt Content */}
        <div className="flex-1 overflow-y-auto p-8 text-black font-mono text-sm">
          <div className="flex justify-between mb-4 border-b border-dashed border-slate-200 pb-2">
            <span>Date: {new Date(receipt.timestamp).toLocaleDateString()}</span>
            <span>Table: {receipt.tableId}</span>
          </div>
          
          <div className="space-y-3 mb-6">
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.quantity} x {item.price.toLocaleString()} ₭</p>
                </div>
                <span className="font-bold">{(item.quantity * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-dashed border-slate-300 pt-4 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{receipt.subtotal.toLocaleString()} ₭</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Service Tax (10%)</span>
              <span>{receipt.tax.toLocaleString()} ₭</span>
            </div>
            <div className="flex justify-between text-lg font-black border-t border-black pt-2">
              <span>TOTAL</span>
              <span>{receipt.total.toLocaleString()} ₭</span>
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Paid via {receipt.paymentMethod}</span>
              <span>{receipt.paidAmount.toLocaleString()} ₭</span>
            </div>
            <div className="flex justify-between">
              <span>Change</span>
              <span>{receipt.change.toLocaleString()} ₭</span>
            </div>
          </div>
          
          <div className="mt-10 text-center text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
            Thank you for visiting us!<br />
            Please keep your receipt.<br />
            Powered by YES99 RMS
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
          >
            <Printer size={18} />
            Print
          </button>
          <button className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} />
          </button>
          <button onClick={onClose} className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
