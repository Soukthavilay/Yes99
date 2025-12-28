'use client';

import React from 'react';
import { QrCode, Banknote, CreditCard, ChevronRight } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'indigo' | 'emerald' | 'orange';
  onClick: () => void;
}

const PaymentOption = ({ icon, title, description, color, onClick }: PaymentOptionProps) => {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-5 p-5 rounded-3xl border bg-white/5 hover:bg-white/10 transition-all group text-left w-full`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white mb-0.5 tracking-tight">{title}</h4>
        <p className="text-slate-500 text-xs font-medium">{description}</p>
      </div>
      <ChevronRight size={20} className="text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
    </button>
  );
};

interface PaymentMethodSelectorProps {
  totalAmount: number;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ totalAmount, onSelectMethod }: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl text-center mb-8">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Amount Due</p>
        <h3 className="text-4xl font-black text-orange-500">{totalAmount.toLocaleString()} ₭</h3>
      </div>

      <div className="grid gap-4">
        <PaymentOption 
          icon={<QrCode size={24} />} 
          title="BCEL One (QR)" 
          description="Scan to pay with BCEL One"
          color="indigo"
          onClick={() => onSelectMethod('QR_BCEL')}
        />
        <PaymentOption 
          icon={<Banknote size={24} />} 
          title="Cash (ເງິນສົດ)" 
          description="Pay with physical currency"
          color="emerald"
          onClick={() => onSelectMethod('CASH')}
        />
        <PaymentOption 
          icon={<CreditCard size={24} />} 
          title="Credit Card" 
          description="Visa, Mastercard, UnionPay"
          color="orange"
          onClick={() => onSelectMethod('CREDIT_CARD')}
        />
      </div>
    </div>
  );
};
