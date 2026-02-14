import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import {
  OrderItemResponse,
  OrderItemBulkCreate,
  OrderItemUpdate,
  OrderItemCancel,
  OrderItemStatus,
} from '@/types/order-item';
import { ApiResponse, PaginationParams } from '@/types/api';

interface OrderItemParams extends PaginationParams {
  table_id?: string;
  status?: OrderItemStatus;
}

export const orderItemService = {
  addOrderItems: async (data: OrderItemBulkCreate) => {
    const res = await axiosInstance.post<ApiResponse<OrderItemResponse[]>>(
      ENDPOINTS.ORDER_ITEMS.BASE,
      data,
    );
    return res.data.data;
  },

  getOrderItems: async (params?: OrderItemParams) => {
    const res = await axiosInstance.get<ApiResponse<OrderItemResponse[]>>(
      ENDPOINTS.ORDER_ITEMS.BASE,
      { params },
    );
    return res.data;
  },

  getOrderItemsByTable: async (tableId: string, status?: OrderItemStatus) => {
    const res = await axiosInstance.get<ApiResponse<OrderItemResponse[]>>(
      ENDPOINTS.ORDER_ITEMS.BY_TABLE(tableId),
      { params: status ? { status } : undefined },
    );
    return res.data.data;
  },

  getOrderItemById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<OrderItemResponse>>(
      ENDPOINTS.ORDER_ITEMS.BY_ID(id),
    );
    return res.data.data;
  },

  updateOrderItem: async (id: string, data: OrderItemUpdate) => {
    const res = await axiosInstance.put<ApiResponse<OrderItemResponse>>(
      ENDPOINTS.ORDER_ITEMS.BY_ID(id),
      data,
    );
    return res.data.data;
  },

  cancelOrderItem: async (id: string, data: OrderItemCancel) => {
    const res = await axiosInstance.patch<ApiResponse<OrderItemResponse>>(
      ENDPOINTS.ORDER_ITEMS.CANCEL(id),
      data,
    );
    return res.data.data;
  },

  deleteOrderItem: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.ORDER_ITEMS.BY_ID(id),
    );
    return res.data;
  },
};
