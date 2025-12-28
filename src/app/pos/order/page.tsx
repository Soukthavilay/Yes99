'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MenuCard } from '@/features/pos/components/MenuCard';
import { OrderSidebar } from '@/features/pos/components/OrderSidebar';
import { mockProducts } from '@/features/pos/mock-data';
import { usePOSStore } from '@/features/pos/store';
import { Category } from '@/features/pos/types';
import { Search, Utensils, Coffee, Beer, IceCream, Pizza } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const categories: { id: Category | 'ALL'; name: string; icon: React.ReactNode }[] = [
  { id: 'ALL', name: 'All Menu', icon: <Pizza size={18} /> },
  { id: 'FOOD', name: 'Food', icon: <Utensils size={18} /> },
  { id: 'DRINK', name: 'Beverage', icon: <Coffee size={18} /> },
  { id: 'ALCOHOL', name: 'Alcohols', icon: <Beer size={18} /> },
  { id: 'DESSERT', name: 'Desserts', icon: <IceCream size={18} /> },
];

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-white">Loading Menu...</div>}>
      <OrderContent />
    </Suspense>
  );
}

function OrderContent() {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const addToCart = usePOSStore((state: any) => state.addToCart);
  const setActiveTable = usePOSStore((state: any) => state.setActiveTable);
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId');

  useEffect(() => {
    if (tableId) {
      setActiveTable(tableId);
    }
  }, [tableId, setActiveTable]);

  const filteredProducts = mockProducts.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="flex h-full min-h-screen">
        {/* Main Menu Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Main Menu</h1>
              <p className="text-slate-500 font-medium italic">Pakse Branch, Laos</p>
            </div>
            
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food or drinks..."
                className="w-full bg-[#12141a] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20'
                    : 'bg-[#12141a] text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <MenuCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Order Summary */}
        <OrderSidebar />
      </div>
    </DashboardLayout>
  );
}
