'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { getRoleLabel } from '@/lib/helpers/role';
import { 
  LayoutDashboard, 
  History, 
  LogOut, 
  Beer, 
  Package,
  Utensils,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BeerDepositModal } from '@/features/pos/components/BeerDepositModal';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isBeerModalOpen, setIsBeerModalOpen] = useState(false);

  const menuItems = [
    { href: '/pos', icon: <LayoutDashboard size={20} />, label: 'POS & Table', roles: ['owner', 'waiter', 'cashier'] },
    { href: '/inventory', icon: <Package size={20} />, label: 'Inventory', roles: ['owner'] },
    { href: '/kitchen', icon: <Utensils size={20} />, label: 'Kitchen View', roles: ['owner', 'waiter', 'chef', 'bartender'] },
    { href: '/pos/history', icon: <History size={20} />, label: 'Bill History', roles: ['owner', 'waiter', 'cashier'] },
  ];

  const filteredMenu = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-[#0f1115] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50">
            <span className="text-xl font-bold italic">Y99</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">YES99</h1>
            <span className="text-xs text-slate-500">Restaurant RMS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredMenu.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname.startsWith(item.href)}
            />
          ))}
          
          <button
            onClick={() => setIsBeerModalOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 text-orange-400 hover:bg-orange-500/10 rounded-xl transition-all border border-transparent hover:border-orange-500/20 mt-4 group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Beer size={18} />
            </div>
            <span className="font-bold">ຝາກເບຍ (Beer Deposit)</span>
          </button>
        </nav>

        {/* User Profile & Logout */}
        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <UserIcon size={20} className="text-slate-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate">{user?.full_name || user?.username || 'User'}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{user ? getRoleLabel(user.role) : 'Guest'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#090a0d]">
        {children}
      </main>

      <BeerDepositModal 
        isOpen={isBeerModalOpen}
        onClose={() => setIsBeerModalOpen(false)}
      />
    </div>
  );
}
