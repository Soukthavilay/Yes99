'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useInventoryStore } from '@/features/inventory/store';
import { 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Activity,
  Users,
  User,
  Phone
} from 'lucide-react';
import { StockAdjustmentModal } from '@/features/inventory/components/StockAdjustmentModal';
import { Ingredient } from '@/features/inventory/types';
import { mockIngredients, mockSuppliers } from '@/features/inventory/mock-data';

export default function InventoryPage() {
  const { ingredients, setIngredients, suppliers, setSuppliers, updateStock } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'suppliers'>('overview');
  
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  const handleAdjust = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsAdjustmentOpen(true);
  };

  const onConfirmAdjustment = (id: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason: string) => {
    updateStock(id, quantity, type, reason, 'Admin');
  };

  // Initialize with mock data
  useEffect(() => {
    if (ingredients.length === 0) {
      setIngredients(mockIngredients);
    }
    if (suppliers.length === 0) {
      setSuppliers(mockSuppliers);
    }
  }, [ingredients.length, setIngredients, suppliers.length, setSuppliers]);

  const stats = [
    { label: 'Total Items', value: ingredients.length, icon: <Package size={20} />, color: 'blue' },
    { label: 'Low Stock', value: ingredients.filter(i => i.status === 'low_stock').length, icon: <AlertTriangle size={20} />, color: 'orange' },
    { label: 'Out of Stock', value: ingredients.filter(i => i.status === 'out_of_stock').length, icon: <AlertTriangle size={20} />, color: 'red' },
    { label: 'Monthly Inbound', value: '12.4M ₭', icon: <ArrowUpRight size={20} />, color: 'emerald' },
  ];

  const categories = ['All', ...Array.from(new Set(ingredients.map(i => i.category)))];

  const filteredItems = ingredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Inventory Management</h1>
            <p className="text-slate-500 font-medium">Monitor stock levels, suppliers, and procurement</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#12141a] border border-white/5 px-6 py-4 rounded-2xl text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2">
              <Activity size={20} className="text-orange-500" />
              Stock Reports
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2">
              <Plus size={20} />
              Add New Item
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-[#12141a] p-1.5 rounded-2xl border border-white/5 w-fit mb-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'overview' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            Inventory Overview
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'suppliers' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            Supplier Directory
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#12141a] border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${stat.color}-500/10 transition-all`} />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500 border border-${stat.color}-500/20 shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                      : 'bg-black/20 text-slate-400 border-white/5 hover:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>
              <button className="bg-black/40 border border-white/5 p-3.5 rounded-2xl text-slate-400 hover:text-white transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-6 group hover:border-orange-500/30 transition-all relative overflow-hidden">
               {/* Status Indicator */}
               <div className={`absolute top-0 right-0 w-24 h-24 blur-[80px] -mr-10 -mt-10 opacity-30 ${
                 item.status === 'in_stock' ? 'bg-emerald-500' : 
                 item.status === 'low_stock' ? 'bg-orange-500' : 'bg-red-500'
               }`} />

               <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                   <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block w-fit">
                     {item.category}
                   </span>
                   <h4 className="text-xl font-black text-white">{item.name}</h4>
                 </div>
                 <button className="text-slate-600 hover:text-white transition-colors">
                   <MoreVertical size={20} />
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                 <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Current Stock</p>
                   <p className={`text-xl font-black ${
                     item.status === 'in_stock' ? 'text-white' : 
                     item.status === 'low_stock' ? 'text-orange-500' : 'text-red-500'
                   }`}>
                     {item.currentStock.toLocaleString()} <span className="text-xs font-medium text-slate-500 tracking-normal">{item.unit}</span>
                   </p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Unit Price</p>
                   <p className="text-xl font-black text-white">{item.pricePerUnit.toLocaleString()} ₭</p>
                 </div>
               </div>

               <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                     item.status === 'in_stock' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                     item.status === 'low_stock' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 
                     'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                   }`} />
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     item.status === 'in_stock' ? 'text-emerald-500' : 
                     item.status === 'low_stock' ? 'text-orange-500' : 'text-red-500'
                   }`}>
                     {item.status.replace('_', ' ')}
                   </span>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleAdjust(item)}
                     className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                   >
                     <Plus size={18} />
                   </button>
                   <button 
                     onClick={() => handleAdjust(item)}
                     className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white font-bold rounded-xl text-xs hover:bg-white/10 transition-all border border-white/5"
                   >
                     Adjust
                   </button>
                 </div>
               </div>
            </div>
          ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-8 group hover:border-orange-500/30 transition-all relative overflow-hidden">
                <div className="bg-orange-500/5 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <button className="text-slate-600 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 block">{supplier.category}</span>
                  <h4 className="text-2xl font-black text-white mb-6">{supplier.name}</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Contact</p>
                        <p className="text-sm font-bold text-white">{supplier.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-bold text-white">{supplier.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all active:scale-95">
                    View Purchase History
                  </button>
                </div>
              </div>
            ))}
            <button className="bg-black/20 border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-500 hover:border-orange-500/50 hover:text-orange-500 transition-all group">
               <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Plus size={32} />
               </div>
               <span className="font-black uppercase tracking-widest text-sm">Add New Supplier</span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
