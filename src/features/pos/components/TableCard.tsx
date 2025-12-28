import { LucideIcon, Users, Clock, Receipt } from 'lucide-react';
import Link from 'next/link';
import { usePOSStore } from '../store';

interface TableProps {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  zone: string;
  guestCount?: number;
  duration?: string;
  totalAmount?: string;
}

export const TableCard = ({ id, name, status, guestCount, duration }: TableProps) => {
  const getTableTotal = usePOSStore((state: any) => state.getTableTotal);
  const reservations = usePOSStore((state: any) => state.reservations);
  
  const tableTotal = getTableTotal(id);
  
  // ກວດສອບວ່າມີການຈອງຢູ່ຫຼືບໍ່
  const activeReservation = reservations.find(
    (r: any) => r.tableId === id && r.status === 'confirmed'
  );

  const currentStatus = (status === 'available' && activeReservation) ? 'reserved' : status;

  const statusConfig = {
    available: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      dot: 'bg-emerald-500',
      label: 'ແປ້ງຫວ່າງ (Available)',
    },
    occupied: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-500',
      dot: 'bg-orange-500',
      label: 'ກຳລັງນັ່ງ (Occupied)',
    },
    reserved: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-500',
      dot: 'bg-indigo-500',
      label: 'ຈອງແລ້ວ (Reserved)',
    },
    cleaning: {
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      text: 'text-slate-500',
      dot: 'bg-slate-500',
      label: 'ກຳລັງທຳຄວາມສະອາດ',
    },
  };

  const config = statusConfig[currentStatus];

  return (
    <div className={`p-5 rounded-[2.5rem] border ${config.border} ${config.bg} transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group`}>
      {/* Glow Effect */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[60px] opacity-20 ${config.dot}`} />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${config.text}`}>
              {config.label}
              {activeReservation && currentStatus === 'reserved' && ` - ${activeReservation.customerName}`}
            </span>
          </div>
        </div>
        {status === 'occupied' && tableTotal > 0 && (
          <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-xs font-bold text-orange-400">{tableTotal.toLocaleString()} ₭</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {status === 'occupied' ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 p-3 rounded-2xl flex items-center gap-3">
              <Users size={16} className="text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Guests</p>
                <p className="text-sm font-bold">{guestCount || 0}</p>
              </div>
            </div>
            <div className="bg-black/20 p-3 rounded-2xl flex items-center gap-3">
              <Clock size={16} className="text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Time</p>
                <p className="text-sm font-bold">{duration || '0m'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[76px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-xs text-slate-500 font-medium">Ready for Orders</p>
          </div>
        )}
        
        <Link href={`/pos/order?tableId=${id}`}>
          <button className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            status === 'occupied' 
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600' 
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
          }`}>
            {status === 'occupied' ? (
              <>
                <Receipt size={16} />
                Open Order
              </>
            ) : (
              'Take Order'
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};
