'use client';

import React from 'react';
import { QrCode } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentProcessingProps {
  selectedMethod: PaymentMethod | null;
}

export const PaymentProcessing = ({ selectedMethod }: PaymentProcessingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <QrCode size={40} className="text-orange-500 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {selectedMethod?.startsWith('QR') ? 'Generating QR Code...' : 'Processing Payment...'}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">
        Please wait while we establish a secure connection with the payment provider.
      </p>
    </div>
  );
};
