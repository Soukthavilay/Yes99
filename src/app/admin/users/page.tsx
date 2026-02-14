'use client';

import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useCreateEmployee, useCurrentUser, useDeleteUser, useUpdateUser, useUsers } from '@/hooks/useUsers';
import { EmployeeCreate, UserResponse } from '@/types/user';
import { UserRole } from '@/types/auth';
import { Plus, Search, Trash2, Pencil, User as UserIcon } from 'lucide-react';

export default function UsersAdminPage() {
  const { data: me, isLoading: isMeLoading } = useCurrentUser();
  const { data: usersRes, isLoading: isUsersLoading } = useUsers({ page: 1, paging: 100 });
  const users = usersRes?.data ?? [];

  const createEmployee = useCreateEmployee();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  const [createForm, setCreateForm] = useState<EmployeeCreate>({
    email: '',
    username: '',
    role: 'waiter',
    full_name: '',
    phone: '',
    employee_id: '',
    password: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const [editFullName, setEditFullName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.full_name ?? '').toLowerCase().includes(q) ||
        (u.phone ?? '').toLowerCase().includes(q) ||
        (u.employee_id ?? '').toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const openCreate = () => {
    setGeneratedPassword(null);
    setCreateForm({
      email: '',
      username: '',
      role: 'waiter',
      full_name: '',
      phone: '',
      employee_id: '',
      password: '',
    });
    setIsCreateOpen(true);
  };

  const onCreate = async () => {
    if (!createForm.email.trim() || !createForm.username.trim()) return;
    const payload: EmployeeCreate = {
      email: createForm.email.trim(),
      username: createForm.username.trim(),
      role: createForm.role,
      full_name: createForm.full_name?.trim() || undefined,
      phone: createForm.phone?.trim() || undefined,
      employee_id: createForm.employee_id?.trim() || undefined,
      password: createForm.password?.trim() || undefined,
    };
    const res = await createEmployee.mutateAsync(payload);
    setGeneratedPassword(res?.generated_password ?? null);
  };

  const openEdit = (u: UserResponse) => {
    setEditingUser(u);
    setEditFullName(u.full_name ?? '');
    setEditPassword('');
    setIsEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editingUser) return;
    await updateUser.mutateAsync({
      id: editingUser.id,
      data: {
        full_name: editFullName.trim() || undefined,
        password: editPassword.trim() || undefined,
      },
    });
    setIsEditOpen(false);
  };

  const onDelete = async (u: UserResponse) => {
    const ok = window.confirm(`Delete user "${u.username}"?`);
    if (!ok) return;
    await deleteUser.mutateAsync(u.id);
  };

  const roles: Array<{ value: UserRole; label: string }> = [
    { value: 'owner', label: 'Owner' },
    { value: 'waiter', label: 'Waiter' },
    { value: 'chef', label: 'Chef' },
    { value: 'bartender', label: 'Bartender' },
    { value: 'cashier', label: 'Cashier' },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Users</h1>
            <p className="text-slate-500 font-medium">Manage employees and view current account info</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Current user</p>
              {isMeLoading ? (
                <p className="text-slate-500">Loading...</p>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white font-black truncate">{me?.full_name || me?.username}</p>
                    <p className="text-slate-500 text-sm truncate">{me?.email}</p>
                  </div>
                  <div className="text-xs font-black text-orange-500 uppercase tracking-widest">{me?.role}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <div className="text-slate-500 text-sm font-medium">
              {isUsersLoading ? 'Loading...' : `${filteredUsers.length} users`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <p className="text-white font-black truncate">{u.full_name || u.username}</p>
                  <p className="text-slate-500 text-sm truncate">{u.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {u.role}
                    </span>
                    {u.employee_id && (
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {u.employee_id}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        u.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {u.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(u)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(u)}
                  className="flex-1 py-3 bg-black/20 hover:bg-red-500/20 text-slate-300 hover:text-red-500 font-bold rounded-2xl border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsCreateOpen(false)} />
          <div className="bg-[#12141a] w-full max-w-2xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-black text-white">Create Employee</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
                <input
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="staff@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Username</label>
                <input
                  value={createForm.username}
                  onChange={(e) => setCreateForm((p) => ({ ...p, username: e.target.value }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="waiter01"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value as UserRole }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Employee ID</label>
                <input
                  value={createForm.employee_id ?? ''}
                  onChange={(e) => setCreateForm((p) => ({ ...p, employee_id: e.target.value }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="EMP-001"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full name</label>
                <input
                  value={createForm.full_name ?? ''}
                  onChange={(e) => setCreateForm((p) => ({ ...p, full_name: e.target.value }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                <input
                  value={createForm.phone ?? ''}
                  onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password (optional)</label>
                <input
                  type="password"
                  value={createForm.password ?? ''}
                  onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Leave empty to auto-generate"
                />
              </div>
            </div>

            {generatedPassword && (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Generated password</div>
                <div className="text-white font-black break-all">{generatedPassword}</div>
              </div>
            )}

            <div className="mt-8 flex flex-col md:flex-row gap-3">
              <button
                onClick={onCreate}
                disabled={createEmployee.isPending}
                className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/5 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && editingUser && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsEditOpen(false)} />
          <div className="bg-[#12141a] w-full max-w-xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-black text-white">Update user</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full name</label>
                <input
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">New password (optional)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-3">
              <button
                onClick={onSaveEdit}
                disabled={updateUser.isPending}
                className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/5 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
