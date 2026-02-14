'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePOSStore } from '@/features/pos/store';
import { MenuCard } from '@/features/pos/components/MenuCard';
import { Category } from '@/features/pos/types';
import { ShoppingBag, Utensils, Coffee, Beer, IceCream, Pizza, ArrowLeft, Send, Receipt, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { usePublicMenu } from '@/hooks/useMenuItems';
import { Product } from '@/features/pos/types';

export default function CustomerOrderPage() {
  const params = useParams();
  const tableId = params.tableId as string;
  const router = useRouter();
  
  const { cart, tableOrders, addToCart, placeOrder, clearCart, getTableTotal } = usePOSStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [showCart, setShowCart] = useState(false);

  const { data: menuRes } = usePublicMenu({ page: 1, paging: 200 });

  const products: Product[] = (menuRes?.data ?? []).map((item: any) => {
    const category: Category = item.item_type === 'beverage' ? 'DRINK' : 'FOOD';
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      category,
      image: item.image_url ?? undefined,
      isAvailable: !!item.is_active,
    };
  });

  const activeTableItems = tableOrders[tableId] || [];
  const tableTotal = getTableTotal(tableId);

  const categories: { id: Category | 'ALL'; name: string; icon: React.ReactNode }[] = [
    { id: 'ALL', name: 'All', icon: <Pizza size={18} /> },
    { id: 'FOOD', name: 'Food', icon: <Utensils size={18} /> },
    { id: 'DRINK', name: 'Beverage', icon: <Coffee size={18} /> },
    { id: 'ALCOHOL', name: 'Alcohols', icon: <Beer size={18} /> },
    { id: 'DESSERT', name: 'Desserts', icon: <IceCream size={18} /> },
  ];

  const filteredProducts = products.filter(product => 
    activeCategory === 'ALL' || product.category === activeCategory
  );

  const statusIcons: any = {
    pending: <Clock size={12} className="text-amber-500" />,
    preparing: <Utensils size={12} className="text-orange-500" />,
    ready: <CheckCircle2 size={12} className="text-emerald-500" />,
    served: <CheckCircle2 size={12} className="text-blue-500" />,
    cancelled: <XCircle size={12} className="text-red-500" />,
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#090a0d]/80 backdrop-blur-xl border-b border-white/5 p-6">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-orange-500">YES99</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Table {tableId}</p>
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="relative w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-[#090a0d]">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap transition-all border font-bold text-sm ${
                activeCategory === cat.id
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-[#12141a] border border-white/5 rounded-[2rem] p-4 flex gap-4">
              <div className="w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <Pizza size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                  <p className="text-orange-500 font-black mt-1">{product.price.toLocaleString()} ₭</p>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-white/5 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-black transition-all border border-white/5"
                >
                  ADD TO ORDER
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order History Summary */}
        {activeTableItems.length > 0 && (
          <div className="pt-8 border-t border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Your Table Orders</h3>
            <div className="space-y-3">
              {activeTableItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-orange-500">
                      {statusIcons[item.status]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{item.status}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-slate-400">x{item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Modal/Overlay */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#090a0d] animate-in slide-in-from-bottom duration-300">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
            <button onClick={() => setShowCart(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-black">Your Order Basket</h2>
            <div className="w-12" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-20">
                <ShoppingBag size={80} className="mb-6" />
                <p className="text-xl font-bold">Your basket is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="bg-[#12141a] border border-white/5 rounded-3xl p-5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold mb-1">{item.name}</h4>
                    <p className="text-orange-500 font-black text-sm">{item.price.toLocaleString()} ₭</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-1 flex items-center gap-4">
                    <button 
                      onClick={() => usePOSStore.getState().updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => usePOSStore.getState().updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5 space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-white">{usePOSStore.getState().getTotal().toLocaleString()} ₭</span>
            </div>
            <button 
              onClick={() => {
                placeOrder(tableId);
                setShowCart(false);
              }}
              disabled={cart.length === 0}
              className="w-full py-6 bg-orange-500 text-white font-black rounded-3xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Send size={24} />
              CONFIRM & SEND TO KITCHEN
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar */}
      {!showCart && cart.length > 0 && (
        <div className="fixed bottom-10 left-6 right-6 z-40 animate-in slide-in-from-bottom-10 duration-500">
          <button 
            onClick={() => setShowCart(true)}
            className="w-full h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-between px-8 shadow-2xl shadow-emerald-500/30 border-4 border-[#090a0d]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-100/50 uppercase tracking-widest">View Basket</p>
                <p className="text-lg font-black text-white leading-none">{cart.length} Items</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">{usePOSStore.getState().getTotal().toLocaleString()} ₭</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
