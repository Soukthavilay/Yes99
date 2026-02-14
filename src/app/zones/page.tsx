'use client';

import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  useActivateZone,
  useCreateZone,
  useDeactivateZone,
  useDeleteZone,
  useUpdateZone,
  useZones,
} from '@/hooks/useZones';
import { ZoneResponse, ZoneCreate, ZoneUpdate } from '@/types/zone';

export default function ZonesPage() {
  const { data: zonesRes, isLoading, isError, error } = useZones({ page: 1, paging: 100 });
  const zones = zonesRes?.data ?? [];

  const createZone = useCreateZone();
  const updateZone = useUpdateZone();
  const activateZone = useActivateZone();
  const deactivateZone = useDeactivateZone();
  const deleteZone = useDeleteZone();

  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ZoneCreate>({ name: '', description: '' });
  const [editing, setEditing] = useState<ZoneResponse | null>(null);

  const filteredZones = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return zones;
    return zones.filter((z) => {
      return (
        z.name.toLowerCase().includes(q) ||
        (z.description ?? '').toLowerCase().includes(q)
      );
    });
  }, [zones, search]);

  const isBusy =
    createZone.isPending ||
    updateZone.isPending ||
    activateZone.isPending ||
    deactivateZone.isPending ||
    deleteZone.isPending;

  const onSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    await createZone.mutateAsync({
      name,
      description: (form.description ?? '').trim() || undefined,
    });

    setForm({ name: '', description: '' });
  };

  const onSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const data: ZoneUpdate = {
      name: editing.name.trim() || undefined,
      description: (editing.description ?? '').trim() || undefined,
    };

    await updateZone.mutateAsync({ id: editing.id, data });
    setEditing(null);
  };

  const onToggleActive = async (z: ZoneResponse) => {
    if (z.is_active) {
      await deactivateZone.mutateAsync(z.id);
      return;
    }
    await activateZone.mutateAsync(z.id);
  };

  const onDelete = async (z: ZoneResponse) => {
    const ok = window.confirm(`Delete zone "${z.name}"?`);
    if (!ok) return;
    await deleteZone.mutateAsync(z.id);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Zones</h1>
            <p className="text-slate-500 font-medium">Create and manage dining zones</p>
          </div>

          <div className="w-full md:w-96">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search zone..."
              className="w-full bg-[#12141a] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-8">
              <h2 className="text-lg font-black text-white mb-6">Create Zone</h2>

              <form onSubmit={onSubmitCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Indoor"
                    disabled={isBusy}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description ?? ''}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-24"
                    placeholder="Optional"
                    disabled={isBusy}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBusy || !form.name.trim()}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                >
                  Create
                </button>
              </form>
            </div>

            {editing && (
              <div className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-8 mt-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h2 className="text-lg font-black text-white">Edit Zone</h2>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                    disabled={isBusy}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={onSubmitEdit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      Name
                    </label>
                    <input
                      value={editing.name}
                      onChange={(e) =>
                        setEditing((s) => (s ? { ...s, name: e.target.value } : s))
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      disabled={isBusy}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      Description
                    </label>
                    <textarea
                      value={editing.description ?? ''}
                      onChange={(e) =>
                        setEditing((s) =>
                          s ? { ...s, description: e.target.value } : s,
                        )
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-24"
                      disabled={isBusy}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy || !editing.name.trim()}
                    className="w-full py-4 bg-white text-black disabled:opacity-50 font-black rounded-2xl shadow-xl shadow-white/10 transition-all active:scale-95"
                  >
                    Save
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-black text-white">All Zones</h2>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  {filteredZones.length} zones
                </div>
              </div>

              {isLoading && (
                <div className="text-slate-400">Loading...</div>
              )}

              {isError && (
                <div className="text-red-400">
                  {(error as any)?.message ?? 'Failed to load zones'}
                </div>
              )}

              {!isLoading && !isError && filteredZones.length === 0 && (
                <div className="text-slate-500">No zones</div>
              )}

              <div className="space-y-4">
                {filteredZones.map((z) => (
                  <div
                    key={z.id}
                    className="bg-black/30 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-white truncate">{z.name}</h3>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            z.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          {z.is_active ? 'active' : 'inactive'}
                        </span>
                      </div>
                      {z.description && (
                        <p className="text-slate-500 mt-2 line-clamp-2">{z.description}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditing(z)}
                        disabled={isBusy}
                        className="px-5 py-3 rounded-2xl font-black text-xs bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleActive(z)}
                        disabled={isBusy}
                        className={`px-5 py-3 rounded-2xl font-black text-xs border transition-all ${
                          z.is_active
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15'
                        }`}
                      >
                        {z.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => onDelete(z)}
                        disabled={isBusy}
                        className="px-5 py-3 rounded-2xl font-black text-xs bg-black/40 border border-white/5 text-slate-300 hover:text-red-400 hover:border-red-500/30 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
