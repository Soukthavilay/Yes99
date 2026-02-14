'use client';

import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface MenuCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const MenuCard = ({ product, onAddToCart }: MenuCardProps) => {
  return (
    <div 
      className="bg-[#12141a] border border-white/5 rounded-3xl p-4 transition-all hover:border-orange-500/50 group cursor-pointer"
      onClick={() => onAddToCart(product)}
    >
      <div className="aspect-square bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
        {/* Placeholder for Product Image */}
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold text-4xl italic">
            Y99
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs uppercase tracking-widest px-3 py-1 bg-red-500 rounded-full">Sold Out</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{product.name}</h4>
        <div className="flex justify-between items-center">
          <p className="text-orange-500 font-black text-lg">
            {product.price.toLocaleString()} <span className="text-[10px] ml-0.5">₭</span>
          </p>
          <button 
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-lg group-active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
