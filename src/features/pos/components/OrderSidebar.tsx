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
import { useAddOrderItems, useOrderItemsByTable, useCancelOrderItem } from '@/hooks/useOrderItems';
import { useCreateBill, useMarkBillComplete } from '@/hooks/useBills';
import { OrderItemBulkCreate } from '@/types/order-item';
import { PaymentType } from '@/types/bill';

/**
 * OrderSidebar Container
 * Manages the high-level state and orchestrates sub-components.
 * Refactored into smaller, granular components for production readiness.
 */
export const OrderSidebar = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getTotal,
    activeTableId, 
    clearCart
  } = usePOSStore();
  
  const addOrderItems = useAddOrderItems();
  const { data: tableOrdersData } = useOrderItemsByTable(activeTableId || undefined);
  const cancelOrderItem = useCancelOrderItem();
  const createBill = useCreateBill();
  const markBillComplete = useMarkBillComplete();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [isQRBoxOpen, setIsQRBoxOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptType | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  const draftTotal = getTotal();
  const activeTableItems = tableOrdersData || [];
  const placedTotal = activeTableItems
    .filter(item => item.status !== 'cancelled')
    .reduce((total, item) => total + item.total_price, 0);
  
  const subtotal = draftTotal + placedTotal;
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + tax;

  const handlePlaceOrder = async (tableId: string) => {
    if (cart.length === 0 || !tableId) return;

    const bulkData: OrderItemBulkCreate = {
      table_id: tableId,
      items: cart.map(item => ({
        menu_item_id: item.productId,
        quantity: item.quantity,
      })),
    };

    await addOrderItems.mutateAsync(bulkData);
    clearCart();
  };

  const handleCancelItem = async (itemId: string) => {
    const item = activeTableItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.status === 'pending') {
      await cancelOrderItem.mutateAsync({ id: itemId, data: {} });
    } else {
      alert("ອາຫານກຳລັງເຮັດ ຫຼື ສຳເລັດແລ້ວ, ບໍ່ສາມາດຍົກເລີກໄດ້!");
    }
  };

  const handlePayment = async (method: PaymentMethod) => {
    if (!activeTableId) return;

    try {
      const paymentType: PaymentType = method === 'CASH' ? 'cash' : 'bank';
      
      const bill = await createBill.mutateAsync({
        tableId: activeTableId,
        data: {
          payment_type: paymentType,
          tax_percentage: 10,
          service_charge_percentage: 0,
        },
      });

      if (!bill) {
        alert('Failed to create bill');
        return;
      }

      await markBillComplete.mutateAsync({
        tableId: activeTableId,
        billId: bill.id,
      });

      const receipt: ReceiptType = {
        orderId: bill.bill_number,
        tableId: activeTableId,
        items: activeTableItems.map(item => ({
          id: item.id,
          productId: item.menu_item.id,
          name: item.menu_item.name,
          price: item.unit_price,
          quantity: item.quantity,
          status: item.status as any,
          orderedAt: item.ordered_at,
        })),
        subtotal: bill.subtotal,
        tax: bill.tax_amount,
        total: bill.total_amount,
        paidAmount: bill.paid_amount,
        change: 0,
        paymentMethod: method,
        timestamp: bill.created_at,
      };
      
      setCurrentReceipt(receipt);
      setIsReceiptOpen(true);
      clearCart();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
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
          items={activeTableItems.map(item => ({
            id: item.id,
            productId: item.menu_item.id,
            name: item.menu_item.name,
            price: item.unit_price,
            quantity: item.quantity,
            status: item.status as any,
            orderedAt: item.ordered_at,
          }))}
          activeTableId={activeTableId}
          onCancelItem={handleCancelItem}
        />

        <DraftCartList 
          cart={cart}
          activeTableId={activeTableId}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onPlaceOrder={handlePlaceOrder}
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
