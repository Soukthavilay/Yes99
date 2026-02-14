import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posService } from '../services/pos-service';
import { OrderItemBulkCreate, OrderItemStatus } from '@/types/order-item';
import { BillCreateRequest } from '@/types/bill';

/**
 * usePOSData Hook
 * Centralizes all React Query logic for the POS module.
 * Provides data fetching, caching, and invalidation.
 */
export const usePOSData = () => {
  const queryClient = useQueryClient();

  const useProducts = (params?: { page?: number; paging?: number; category_id?: string }) =>
    useQuery({
      queryKey: ['pos', 'products', params],
      queryFn: () => posService.getProducts(params),
    });

  const useTables = (params?: { zone_id?: string; status?: string }) =>
    useQuery({
      queryKey: ['pos', 'tables', params],
      queryFn: () => posService.getTables(params),
    });

  const useOrderItemsByTable = (tableId: string | undefined, status?: OrderItemStatus) =>
    useQuery({
      queryKey: ['pos', 'order-items', tableId, status],
      queryFn: () => posService.getOrderItemsByTable(tableId!, status),
      enabled: !!tableId,
    });

  const useBillsByTable = (tableId: string | undefined) =>
    useQuery({
      queryKey: ['pos', 'bills', tableId],
      queryFn: () => posService.getBillsByTable(tableId!),
      enabled: !!tableId,
    });

  const useCreateOrder = () =>
    useMutation({
      mutationFn: (data: OrderItemBulkCreate) => posService.createOrder(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pos', 'order-items'] });
        queryClient.invalidateQueries({ queryKey: ['pos', 'tables'] });
      },
    });

  const useUpdateItemStatus = () =>
    useMutation({
      mutationFn: ({ itemId, status }: { itemId: string; status: OrderItemStatus }) =>
        posService.updateOrderItem(itemId, { status }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pos', 'order-items'] });
      },
    });

  const useCancelItem = () =>
    useMutation({
      mutationFn: ({ itemId, reason }: { itemId: string; reason?: string }) =>
        posService.cancelOrderItem(itemId, reason),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pos', 'order-items'] });
      },
    });

  const useCreateBill = () =>
    useMutation({
      mutationFn: ({ tableId, data }: { tableId: string; data: BillCreateRequest }) =>
        posService.createBill(tableId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pos', 'bills'] });
        queryClient.invalidateQueries({ queryKey: ['pos', 'tables'] });
      },
    });

  return {
    useProducts,
    useTables,
    useOrderItemsByTable,
    useBillsByTable,
    useCreateOrder,
    useUpdateItemStatus,
    useCancelItem,
    useCreateBill,
  };
};
