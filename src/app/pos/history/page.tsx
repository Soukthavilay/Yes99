'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Receipt, History, Calendar, Search, ArrowRight } from 'lucide-react';
import { BillDetailModal } from '@/features/pos/components/BillDetailModal';
import { Receipt as ReceiptType } from '@/features/pos/types';

export default function BillHistoryPage() {
  const [selectedBill, setSelectedBill] = useState<ReceiptType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // TODO: Backend needs a global GET /bills endpoint to fetch all bills
  // For now, this page will show a placeholder until that endpoint is added
  const allBills: any[] = [];
  
  const filteredBills = allBills.filter(bill => 
    searchQuery ? bill.bill_number.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const handleShowDetail = (bill: ReceiptType) => {
    setSelectedBill(bill);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-4">
              <History size={40} className="text-orange-500" />
              Bill History
            </h1>
            <p className="text-slate-500 font-medium italic">Viewing all past sales transactions</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bill Number..."
                className="w-full bg-[#12141a] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <button className="bg-[#12141a] border border-white/5 rounded-2xl px-6 py-4 text-slate-400 hover:text-white transition-all flex items-center gap-2">
              <Calendar size={20} />
              Today
            </button>
          </div>
        </div>

        {filteredBills.length === 0 ? (
          <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-20 text-center">
            <Receipt size={80} className="mx-auto mb-6 text-slate-500" />
            <h3 className="text-2xl font-bold text-slate-400">Bill History Coming Soon</h3>
            <p className="text-slate-600">Backend needs a global GET /bills endpoint to display all bills across all tables.</p>
            <p className="text-slate-500 text-sm mt-4">Current API only supports GET /tables/{'{tableId}'}/bills per table.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBills.map((bill) => (
              <div 
                key={bill.id}
                className="bg-[#12141a] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-orange-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500">
                    <Receipt size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">#{bill.bill_number}</h4>
                    <div className="flex items-center gap-3 text-slate-500 text-sm mt-1">
                      <span className="font-bold text-orange-500/80">Table {bill.tableNumber}</span>
                      <span>•</span>
                      <span>{new Date(bill.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span className="capitalize">{bill.payment_status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-10">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-white">{bill.total_amount.toLocaleString()} ₭</p>
                  </div>
                  
                  <div className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest ${
                    bill.payment_status === 'paid' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                      : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                  }`}>
                    {bill.payment_type}
                  </div>

                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 hover:text-white hover:bg-orange-500 transition-all group-hover:translate-x-1">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BillDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        bill={selectedBill}
      />
    </DashboardLayout>
  );
}
