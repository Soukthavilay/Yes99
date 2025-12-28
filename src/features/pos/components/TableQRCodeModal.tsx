'use client';

import React from 'react';
import { QrCode } from 'lucide-react';

interface TableQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string | null;
}

export const TableQRCodeModal = ({ isOpen, onClose, tableId }: TableQRCodeModalProps) => {
  if (!isOpen || !tableId) return null;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const orderUrl = `${baseUrl}/customer/order/${tableId}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-[#12141a] w-full max-w-sm rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8 text-center">
        <h3 className="text-xl font-black text-white mb-6">Table {tableId} Order Link</h3>
        <div className="bg-white p-6 rounded-3xl inline-block mb-6 shadow-2xl">
          <QrCode size={180} className="text-black" />
        </div>
        <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">
          ສະແກນ QR ຫຼື ສົ່ງ Link ນີ້ໃຫ້ລູກຄ້າເພື່ອສັ່ງອາຫານເອງ:<br/>
          <span className="text-orange-500 font-bold break-all">{orderUrl}</span>
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
