import apiClient from "@/core/api-client";
import { Product, Reservation, OrderItem, Receipt as ReceiptType, BeerDeposit } from '../types';

/**
 * POS Service handles all API interactions for the POS module.
 * Designed to be swapped with a real backend easily.
 */
export const posService = {
  // Menu & Products
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/pos/products');
    return response.data;
  },

  // Tables & Orders
  getTables: async () => {
    const response = await apiClient.get('/pos/tables');
    return response.data;
  },

  createOrder: async (tableId: string, items: OrderItem[]) => {
    const response = await apiClient.post(`/pos/tables/${tableId}/orders`, { items });
    return response.data;
  },

  updateOrderItemStatus: async (tableId: string, itemId: string, status: OrderItem['status']) => {
    const response = await apiClient.patch(`/pos/tables/${tableId}/items/${itemId}`, { status });
    return response.data;
  },

  // Reservations
  getReservations: async (): Promise<Reservation[]> => {
    const response = await apiClient.get('/pos/reservations');
    return response.data;
  },

  addReservation: async (reservation: Omit<Reservation, 'id' | 'status'>) => {
    const response = await apiClient.post('/pos/reservations', reservation);
    return response.data;
  },

  updateReservationStatus: async (reservationId: string, status: Reservation['status']) => {
    const response = await apiClient.patch(`/pos/reservations/${reservationId}`, { status });
    return response.data;
  },

  // Payments & History
  processPayment: async (tableId: string, paymentData: any): Promise<ReceiptType> => {
    const response = await apiClient.post(`/pos/tables/${tableId}/checkout`, paymentData);
    return response.data;
  },

  getSalesHistory: async (): Promise<ReceiptType[]> => {
    const response = await apiClient.get('/pos/history');
    return response.data;
  },

  // Beer Deposits
  addBeerDeposit: async (deposit: Omit<BeerDeposit, 'id' | 'depositedAt'>) => {
    const response = await apiClient.post('/pos/beer-deposits', deposit);
    return response.data;
  },
  
  getBeerDeposits: async (): Promise<BeerDeposit[]> => {
    const response = await apiClient.get('/pos/beer-deposits');
    return response.data;
  }
};
