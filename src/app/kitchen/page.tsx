'use client';

import React from 'react';
import { usePOSStore } from '@/features/pos/store';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Clock, CheckCircle2, Utensils, XCircle, ChevronRight, Play } from 'lucide-react';

export default function KitchenPage() {
  const { tableOrders, updateItemStatus } = usePOSStore();

  // Flatten all table orders into a single list for the kitchen
  const allOrders = Object.entries(tableOrders).flatMap(([tableId, items]) => 
    items
      .filter(item => item.status !== 'cancelled' && item.status !== 'served')
      .map(item => ({ ...item, tableId }))
  ).sort((a, b) => new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime());

  const statusColors: any = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    preparing: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    ready: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };

  return (
    <DashboardLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Kitchen Display System</h1>
            <p className="text-slate-500 font-medium">Manage incoming orders and cooking status</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500 font-bold">{allOrders.length} Active Orders</span>
          </div>
        </div>

        {allOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
            <Utensils size={80} className="text-slate-800 mb-6" />
            <p className="text-xl font-bold text-slate-600">No pending orders. Take a breath!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allOrders.map((item) => (
              <div key={item.id} className="bg-[#12141a] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl transition-all hover:border-orange-500/30">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-orange-500/20">
                      {item.tableId}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Table</p>
                      <p className="text-sm font-bold text-white">Table {item.tableId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Time</p>
                    <p className="text-sm font-bold text-white">{new Date(item.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-black text-white mb-2">{item.name}</h3>
                  <p className="text-orange-500 font-black text-lg mb-4">x {item.quantity}</p>
                  
                  {item.note && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Note:</p>
                      <p className="text-sm text-amber-200 font-medium">{item.note}</p>
                    </div>
                  )}

                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${statusColors[item.status]}`}>
                    {item.status === 'pending' && <Clock size={12} />}
                    {item.status === 'preparing' && <Utensils size={12} />}
                    {item.status === 'ready' && <CheckCircle2 size={12} />}
                    {item.status}
                  </div>
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 mt-auto">
                  {item.status === 'pending' && (
                    <button 
                      onClick={() => updateItemStatus(item.tableId, item.id, 'preparing')}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <Play size={18} />
                      ເລີ່ມປຸງແຕ່ງ (Start Cooking)
                    </button>
                  )}
                  {item.status === 'preparing' && (
                    <button 
                      onClick={() => updateItemStatus(item.tableId, item.id, 'ready')}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <CheckCircle2 size={18} />
                      ສຳເລັດ (Mark Ready)
                    </button>
                  )}
                  {item.status === 'ready' && (
                    <button 
                      onClick={() => updateItemStatus(item.tableId, item.id, 'served')}
                      className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <CheckCircle2 size={18} />
                      ເສີບແລ້ວ (Mark Served)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
