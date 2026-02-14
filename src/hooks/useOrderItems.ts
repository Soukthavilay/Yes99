import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderItemService } from '@/lib/api/services/order-item.service';
import {
  OrderItemBulkCreate,
  OrderItemUpdate,
  OrderItemCancel,
  OrderItemStatus,
} from '@/types/order-item';
import { PaginationParams } from '@/types/api';

const QUERY_KEY = 'order-items';

interface OrderItemParams extends PaginationParams {
  table_id?: string;
  status?: OrderItemStatus;
}

export const useOrderItems = (params?: OrderItemParams) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => orderItemService.getOrderItems(params),
  });

export const useOrderItemsByTable = (tableId: string | undefined, status?: OrderItemStatus) =>
  useQuery({
    queryKey: [QUERY_KEY, 'table', tableId, status],
    queryFn: () => orderItemService.getOrderItemsByTable(tableId!, status),
    enabled: !!tableId,
  });

export const useOrderItemById = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => orderItemService.getOrderItemById(id!),
    enabled: !!id,
  });

export const useAddOrderItems = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OrderItemBulkCreate) => orderItemService.addOrderItems(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateOrderItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderItemUpdate }) =>
      orderItemService.updateOrderItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useCancelOrderItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderItemCancel }) =>
      orderItemService.cancelOrderItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteOrderItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderItemService.deleteOrderItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
