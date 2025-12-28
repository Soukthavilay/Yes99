'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PaymentSuccessProps {
  onFinalize: () => void;
}

export const PaymentSuccess = ({ onFinalize }: PaymentSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20">
        <CheckCircle2 size={64} className="text-emerald-500" />
      </div>
      <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Payment Success!</h3>
      <p className="text-slate-500 font-medium mb-10">
        Transaction confirmed. You can now close the table and print the receipt.
      </p>
      
      <button 
        onClick={onFinalize}
        className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform active:scale-95"
      >
        Done & Print Receipt
      </button>
    </div>
  );
};
