'use client';

import React from 'react';
import { Trash2, Minus, Plus, Receipt, Send } from 'lucide-react';
import { Product } from '../types';

interface DraftCartListProps {
  cart: (Product & { quantity: number; productId: string })[];
  activeTableId: string | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (tableId: string) => void;
}

export const DraftCartList = ({ 
  cart, 
  activeTableId, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onPlaceOrder 
}: DraftCartListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        New Items (ລໍຖ້າສົ່ງຄົວ)
      </h3>
      {cart.length === 0 ? (
        <div className="py-10 text-center opacity-20">
          <Receipt size={48} className="mx-auto mb-4" />
          <p className="text-sm font-medium">Empty Draft Cart</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="group bg-white/5 rounded-[2rem] p-5 border border-white/5 hover:border-orange-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <h4 className="font-bold text-white leading-tight mb-1">{item.name}</h4>
                  <p className="text-xs text-orange-500 font-black">{item.price.toLocaleString()} ₭</p>
                </div>
                <button 
                  onClick={() => onRemoveFromCart(item.productId)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-black/40 rounded-2xl p-1 border border-white/5">
                  <button 
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-black text-white text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-black text-white">{(item.price * item.quantity).toLocaleString()} ₭</p>
              </div>
            </div>
          ))}
          
          {activeTableId && (
            <button 
              onClick={() => onPlaceOrder(activeTableId)}
              className="w-full py-5 bg-orange-500 text-white font-black rounded-3xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Send size={20} />
              ສົ່ງເຂົ້າເຮືອນຄົວ (Send to Kitchen)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
