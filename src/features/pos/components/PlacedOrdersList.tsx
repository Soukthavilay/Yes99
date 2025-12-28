'use client';

import React from 'react';
import { Clock, Utensils, CheckCircle2, XCircle } from 'lucide-react';
import { OrderItem } from '../types';

interface PlacedOrdersListProps {
  items: OrderItem[];
  activeTableId: string | null;
  onCancelItem: (tableId: string, itemId: string) => void;
}

const statusIcons: Record<OrderItem['status'], React.ReactNode> = {
  pending: <Clock size={14} className="text-amber-500" />,
  preparing: <Utensils size={14} className="text-orange-500" />,
  ready: <CheckCircle2 size={14} className="text-emerald-500" />,
  served: <CheckCircle2 size={14} className="text-blue-500" />,
  cancelled: <XCircle size={14} className="text-red-500" />,
};

const statusLabels: Record<OrderItem['status'], string> = {
  pending: 'ລໍຖ້າ (Pending)',
  preparing: 'ກຳລັງເຮັດ (Preparing)',
  ready: 'ສຳເລັດ (Ready)',
  served: 'ເສີບແລ້ວ (Served)',
  cancelled: 'ຍົກເລີກແລ້ວ (Cancelled)',
};

export const PlacedOrdersList = ({ items, activeTableId, onCancelItem }: PlacedOrdersListProps) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        Placed Orders (ເຮືອນຄົວ)
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className={`group bg-black/40 rounded-3xl p-4 border border-white/5 transition-all ${item.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {statusIcons[item.status]}
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {statusLabels[item.status]}
                  </span>
                  <span className="text-[10px] text-slate-700 font-bold">
                    {new Date(item.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-white text-sm">{item.price.toLocaleString()} ₭</p>
                <p className="text-[10px] text-slate-600 font-bold">x{item.quantity}</p>
              </div>
            </div>
            
            {item.status === 'pending' && activeTableId && (
              <button 
                onClick={() => onCancelItem(activeTableId, item.id)}
                className="mt-2 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                ຍົກເລີກເມນູນີ້ (Cancel)
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
