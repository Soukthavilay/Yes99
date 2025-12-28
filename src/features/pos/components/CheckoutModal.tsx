'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PaymentMethod } from '../types';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentProcessing } from './PaymentProcessing';
import { PaymentSuccess } from './PaymentSuccess';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  tableId: string | null;
  onConfirm: (method: PaymentMethod) => void;
}

/**
 * CheckoutModal Container
 * Orchestrates the payment flow steps.
 * Refactored into granular sub-components for production modularity.
 */
export const CheckoutModal = ({ isOpen, onClose, totalAmount, tableId, onConfirm }: CheckoutModalProps) => {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  if (!isOpen) return null;

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('processing');
    
    // Simulate payment processing (will be replaced by useCheckout mutation)
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleFinalize = () => {
    if (selectedMethod) {
      onConfirm(selectedMethod);
      onClose();
      // Reset for next time
      setTimeout(() => setStep('method'), 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-[#12141a] w-full max-w-lg rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Checkout</h2>
            <p className="text-slate-500 text-sm font-medium">Table {tableId || '--'}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {step === 'method' && (
            <PaymentMethodSelector 
              totalAmount={totalAmount} 
              onSelectMethod={handleSelectMethod} 
            />
          )}

          {step === 'processing' && (
            <PaymentProcessing selectedMethod={selectedMethod} />
          )}

          {step === 'success' && (
            <PaymentSuccess onFinalize={handleFinalize} />
          )}
        </div>
      </div>
    </div>
  );
};
