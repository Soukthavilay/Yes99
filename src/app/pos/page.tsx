'use client';

import React, { useState } from 'react';
import { usePOSStore } from '@/features/pos/store';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TableCard } from '@/features/pos/components/TableCard';
import { ReservationModal } from '@/features/pos/components/ReservationModal';
import { Search, Filter, Plus, Home, Trees, ShieldCheck, Calendar } from 'lucide-react';

const zones = [
  { id: 'all', name: 'All Tables', icon: <Home size={18} /> },
  { id: 'A', name: 'Indoor Zone', icon: <Home size={18} /> },
  { id: 'B', name: 'Terrace (ບ່ອນນັ່ງນອກ)', icon: <Trees size={18} /> },
  { id: 'VIP', name: 'VIP Rooms', icon: <ShieldCheck size={18} /> },
];

const mockTables = [
  { id: '1', name: 'Table 01', status: 'occupied', zone: 'A', guestCount: 4, duration: '45m', totalAmount: '450,000' },
  { id: '2', name: 'Table 02', status: 'available', zone: 'A' },
  { id: '3', name: 'Table 03', status: 'occupied', zone: 'A', guestCount: 2, duration: '1h 20m', totalAmount: '1,200,000' },
  { id: '4', name: 'Table 04', status: 'cleaning', zone: 'A' },
  { id: '5', name: 'Table 05', status: 'available', zone: 'B' },
  { id: '6', name: 'Table 06', status: 'reserved', zone: 'VIP', guestCount: 8 },
  { id: '7', name: 'Table 07', status: 'available', zone: 'B' },
  { id: '8', name: 'Table 08', status: 'occupied', zone: 'B', guestCount: 5, duration: '15m', totalAmount: '180,000' },
];

export default function POSPage() {
  const [activeZone, setActiveZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const filteredTables = (activeZone === 'all' 
    ? mockTables 
    : mockTables.filter(t => t.zone === activeZone)
  ).filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Table Management</h1>
            <p className="text-slate-500 font-medium">Manage and track restaurant table availability</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
            <button 
              onClick={() => setIsReservationOpen(true)}
              className="flex items-center gap-3 px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all font-bold whitespace-nowrap active:scale-95"
            >
              <Calendar size={20} />
              Reservations
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12141a] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#12141a] border border-white/5 p-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Filter size={20} />
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95">
              <Plus size={20} />
              Open New Table
            </button>
          </div>
        </div>

        {/* Zones Navigation */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                activeZone === zone.id
                  ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                  : 'bg-[#12141a] text-slate-400 border-white/5 hover:border-white/20'
              }`}
            >
              {zone.icon}
              {zone.name}
              <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${
                activeZone === zone.id ? 'bg-black/10 text-black' : 'bg-white/5 text-slate-500'
              }`}>
                {zone.id === 'all' ? mockTables.length : mockTables.filter(t => t.zone === zone.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              {...table as any}
            />
          ))}
        </div>
      </div>

      <ReservationModal 
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </DashboardLayout>
  );
}
