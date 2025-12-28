import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posService } from '../services/pos-service';
import { Reservation, OrderItem } from '../types';

/**
 * usePOSData Hook
 * Centralizes all React Query logic for the POS module.
 * Provides data fetching, caching, and invalidation.
 */
export const usePOSData = () => {
  const queryClient = useQueryClient();

  // --- Queries ---

  const useProducts = () => useQuery({
    queryKey: ['pos', 'products'],
    queryFn: posService.getProducts,
  });

  const useTables = () => useQuery({
    queryKey: ['pos', 'tables'],
    queryFn: posService.getTables,
  });

  const useReservations = () => useQuery({
    queryKey: ['pos', 'reservations'],
    queryFn: posService.getReservations,
  });

  const useHistory = () => useQuery({
    queryKey: ['pos', 'history'],
    queryFn: posService.getSalesHistory,
  });

  const useBeerDeposits = () => useQuery({
    queryKey: ['pos', 'beer-deposits'],
    queryFn: posService.getBeerDeposits,
  });

  // --- Mutations ---

  const useAddReservation = () => useMutation({
    mutationFn: (reservation: Omit<Reservation, 'id' | 'status'>) => posService.addReservation(reservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'reservations'] });
    },
  });

  const useUpdateReservationStatus = () => useMutation({
    mutationFn: ({ id, status }: { id: string, status: Reservation['status'] }) => 
      posService.updateReservationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'reservations'] });
    },
  });

  const useCreateOrder = () => useMutation({
    mutationFn: ({ tableId, items }: { tableId: string, items: OrderItem[] }) => 
      posService.createOrder(tableId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'tables'] });
    },
  });

  const useUpdateItemStatus = () => useMutation({
    mutationFn: ({ tableId, itemId, status }: { tableId: string, itemId: string, status: OrderItem['status'] }) => 
      posService.updateOrderItemStatus(tableId, itemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'tables'] });
    },
  });

  const useCheckout = () => useMutation({
    mutationFn: ({ tableId, paymentData }: { tableId: string, paymentData: any }) => 
      posService.processPayment(tableId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'tables'] });
      queryClient.invalidateQueries({ queryKey: ['pos', 'history'] });
    },
  });

  return {
    useProducts,
    useTables,
    useReservations,
    useHistory,
    useBeerDeposits,
    useAddReservation,
    useUpdateReservationStatus,
    useCreateOrder,
    useUpdateItemStatus,
    useCheckout,
  };
};
