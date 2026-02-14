import { menuItemService } from '@/lib/api/services/menu-item.service';
import { tableService } from '@/lib/api/services/table.service';
import { orderItemService } from '@/lib/api/services/order-item.service';
import { billService } from '@/lib/api/services/bill.service';
import { OrderItemBulkCreate, OrderItemStatus } from '@/types/order-item';
import { BillCreateRequest } from '@/types/bill';

/**
 * POS Service — thin facade that delegates to centralized API services.
 * Kept for backward-compat with existing POS components.
 */
export const posService = {
  getProducts: async (params?: { page?: number; paging?: number; category_id?: string }) => {
    const res = await menuItemService.getPublicMenu(params);
    return res;
  },

  getTables: async (params?: { zone_id?: string; status?: string }) => {
    const res = await tableService.getTables(params as Parameters<typeof tableService.getTables>[0]);
    return res;
  },

  createOrder: async (data: OrderItemBulkCreate) => {
    return orderItemService.addOrderItems(data);
  },

  getOrderItemsByTable: async (tableId: string, status?: OrderItemStatus) => {
    return orderItemService.getOrderItemsByTable(tableId, status);
  },

  updateOrderItem: async (itemId: string, data: { status?: OrderItemStatus }) => {
    return orderItemService.updateOrderItem(itemId, data);
  },

  cancelOrderItem: async (itemId: string, reason?: string) => {
    return orderItemService.cancelOrderItem(itemId, { cancellation_reason: reason });
  },

  createBill: async (tableId: string, data: BillCreateRequest) => {
    return billService.createBill(tableId, data);
  },

  getBillsByTable: async (tableId: string) => {
    return billService.getBillsByTable(tableId);
  },
};
