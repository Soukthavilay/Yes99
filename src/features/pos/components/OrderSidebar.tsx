'use client';

import React, { useState } from 'react';
import { usePOSStore } from '../store';
import { CheckoutModal } from './CheckoutModal';
import { SplitBillModal } from './SplitBillModal';
import { ReceiptModal } from './ReceiptModal';
import { SidebarHeader } from './SidebarHeader';
import { PlacedOrdersList } from './PlacedOrdersList';
import { DraftCartList } from './DraftCartList';
import { SidebarFooter } from './SidebarFooter';
import { TableQRCodeModal } from './TableQRCodeModal';
import { PaymentMethod, Receipt as ReceiptType } from '../types';

/**
 * OrderSidebar Container
 * Manages the high-level state and orchestrates sub-components.
 * Refactored into smaller, granular components for production readiness.
 */
export const OrderSidebar = () => {
  const { 
    cart, 
    tableOrders, 
    updateQuantity, 
    removeFromCart, 
    getTotal, 
    getTableTotal,
    activeTableId, 
    clearCart, 
    addToHistory,
    placeOrder,
    cancelOrderItem
  } = usePOSStore();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [isQRBoxOpen, setIsQRBoxOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptType | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  const draftTotal = getTotal();
  const activeTableItems = activeTableId ? (tableOrders[activeTableId] || []) : [];
  const placedTotal = activeTableId ? getTableTotal(activeTableId) : 0;
  
  const subtotal = draftTotal + placedTotal;
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + tax;

  const handlePayment = (method: PaymentMethod) => {
    const receipt: ReceiptType = {
      orderId: Math.random().toString(36).substr(2, 9),
      tableId: activeTableId || 'TAKE-AWAY',
      items: [...activeTableItems, ...cart],
      subtotal,
      tax,
      total,
      paidAmount: total,
      change: 0,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
    };
    
    addToHistory(receipt);
    setCurrentReceipt(receipt);
    setIsReceiptOpen(true);
    
    clearCart();
    if (activeTableId) {
      usePOSStore.setState((state) => {
        const newTableOrders = { ...state.tableOrders };
        delete newTableOrders[activeTableId];
        return { tableOrders: newTableOrders };
      });
    }
  };

  return (
    <div className="w-[400px] h-screen bg-[#12141a] border-l border-white/5 flex flex-col shadow-2xl overflow-hidden relative">
      <SidebarHeader 
        activeTableId={activeTableId}
        total={draftTotal + placedTotal}
        onOpenQR={() => setIsQRBoxOpen(true)}
        onOpenSplit={() => setIsSplitOpen(true)}
      />

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-8">
        <PlacedOrdersList 
          items={activeTableItems}
          activeTableId={activeTableId}
          onCancelItem={cancelOrderItem}
        />

        <DraftCartList 
          cart={cart}
          activeTableId={activeTableId}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onPlaceOrder={placeOrder}
        />
      </div>

      <SidebarFooter 
        subtotal={subtotal}
        tax={tax}
        total={total}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        totalAmount={total}
        tableId={activeTableId}
        onConfirm={handlePayment}
      />

      <SplitBillModal 
        isOpen={isSplitOpen}
        onClose={() => setIsSplitOpen(false)}
        items={[...activeTableItems, ...cart]}
        totalAmount={total}
      />

      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={currentReceipt}
      />

      <TableQRCodeModal 
        isOpen={isQRBoxOpen}
        onClose={() => setIsQRBoxOpen(false)}
        tableId={activeTableId}
      />
    </div>
  );
};
