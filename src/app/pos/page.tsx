'use client';

import React, { useMemo, useState } from 'react';
import { usePOSStore } from '@/features/pos/store';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TableCard } from '@/features/pos/components/TableCard';
import { ReservationModal } from '@/features/pos/components/ReservationModal';
import { Search, Filter, Plus, Home, Trees, ShieldCheck, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useZones } from '@/hooks/useZones';
import { useCreateTable, useTables } from '@/hooks/useTables';
import { TableResponse } from '@/types/table';

export default function POSPage() {
  const router = useRouter();
  const [activeZone, setActiveZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createZoneId, setCreateZoneId] = useState<string>('');
  const [createName, setCreateName] = useState<string>('');

  const { data: zonesRes } = useZones({ page: 1, paging: 100 });
  const zones = zonesRes?.data ?? [];

  const { data: allTablesRes } = useTables({
    page: 1,
    paging: 100,
  });
  const allTables = allTablesRes?.data ?? [];

  const { data: tablesRes, isLoading: isTablesLoading } = useTables({
    page: 1,
    paging: 100,
    zone_id: activeZone === 'all' ? undefined : activeZone,
  });
  const tables = tablesRes?.data ?? [];

  const createTable = useCreateTable();

  const tableCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const toCardStatus = (t: TableResponse): 'available' | 'occupied' | 'reserved' | 'cleaning' => {
      if (t.status === 'available') return 'available';
      if (t.status === 'reserved') return 'reserved';
      if (t.status === 'maintenance') return 'cleaning';
      return 'occupied';
    };

    return tables
      .filter((t) => {
        if (!q) return true;
        const name = (t.table_name ?? `Table ${t.table_number}`).toLowerCase();
        return name.includes(q) || String(t.table_number).includes(q);
      })
      .map((t) => ({
        id: t.id,
        name: t.table_name ?? `Table ${String(t.table_number).padStart(2, '0')}`,
        status: toCardStatus(t),
        zone: t.zone_id,
      }));
  }, [tables, searchQuery]);

  const zoneTabs = useMemo(() => {
    const allCount = allTables.length;
    const result: Array<{ id: string; name: string; icon: React.ReactNode; count: number }> = [
      { id: 'all', name: 'All Tables', icon: <Home size={18} />, count: allCount },
    ];

    zones.forEach((z) => {
      const count = allTables.filter((t) => t.zone_id === z.id).length;
      result.push({
        id: z.id,
        name: z.name,
        icon: <Home size={18} />,
        count,
      });
    });

    return result;
  }, [zones, allTables]);

  const onOpenCreate = () => {
    const defaultZoneId = zones[0]?.id ?? '';
    setCreateZoneId(defaultZoneId);
    setCreateName('');
    setIsCreateOpen(true);
  };

  const onCreate = async () => {
    if (!createZoneId) return;
    const created = await createTable.mutateAsync({
      zone_id: createZoneId,
      table_name: createName.trim() || undefined,
    });
    setIsCreateOpen(false);
    if (created?.id) {
      router.push(`/pos/order?tableId=${created.id}`);
    }
  };

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
            <button
              onClick={onOpenCreate}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              <Plus size={20} />
              Open New Table
            </button>
          </div>
        </div>

        {/* Zones Navigation */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {zoneTabs.map((zone) => (
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
                {zone.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isTablesLoading ? (
            <div className="text-slate-500">Loading...</div>
          ) : (
            tableCards.map((table) => <TableCard key={table.id} {...(table as any)} />)
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setIsCreateOpen(false)}
          />
          <div className="bg-[#12141a] w-full max-w-lg rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-black text-white">Open New Table</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Zone
                </label>
                <select
                  value={createZoneId}
                  onChange={(e) => setCreateZoneId(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Table name (optional)
                </label>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="VIP-01"
                />
              </div>

              <button
                onClick={onCreate}
                disabled={!createZoneId || createTable.isPending}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
              >
                Create & Open
              </button>
            </div>
          </div>
        </div>
      )}

      <ReservationModal 
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </DashboardLayout>
  );
}
