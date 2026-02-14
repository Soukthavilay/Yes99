import { OrderItemStatus } from '@/types/order-item';
import { TableStatus } from '@/types/table';
import { PaymentStatus } from '@/types/bill';

interface StatusConfig {
  label: string;
  color: string;
}

export const ORDER_ITEM_STATUS_MAP: Record<OrderItemStatus, StatusConfig> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
  preparing: { label: 'Preparing', color: 'bg-blue-500/20 text-blue-400' },
  ready: { label: 'Ready', color: 'bg-green-500/20 text-green-400' },
  served: { label: 'Served', color: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
};

export const TABLE_STATUS_MAP: Record<TableStatus, StatusConfig> = {
  available: { label: 'Available', color: 'bg-green-500/20 text-green-400' },
  busy: { label: 'Busy', color: 'bg-red-500/20 text-red-400' },
  reserved: { label: 'Reserved', color: 'bg-yellow-500/20 text-yellow-400' },
  maintenance: { label: 'Maintenance', color: 'bg-gray-500/20 text-gray-400' },
};

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, StatusConfig> = {
  unpaid: { label: 'Unpaid', color: 'bg-red-500/20 text-red-400' },
  partial: { label: 'Partial', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Paid', color: 'bg-green-500/20 text-green-400' },
  refunded: { label: 'Refunded', color: 'bg-gray-500/20 text-gray-400' },
};

export const getOrderItemStatus = (status: OrderItemStatus): StatusConfig => {
  return ORDER_ITEM_STATUS_MAP[status] ?? { label: status, color: 'bg-gray-500/20 text-gray-400' };
};

export const getTableStatus = (status: TableStatus): StatusConfig => {
  return TABLE_STATUS_MAP[status] ?? { label: status, color: 'bg-gray-500/20 text-gray-400' };
};

export const getPaymentStatus = (status: PaymentStatus): StatusConfig => {
  return PAYMENT_STATUS_MAP[status] ?? { label: status, color: 'bg-gray-500/20 text-gray-400' };
};
