'use client';

import { create } from 'zustand';
import { Product, OrderItem, BeerDeposit, Reservation } from './types';

interface POSStore {
  activeTableId: string | null;
  cart: OrderItem[]; // Draft items not yet sent to kitchen
  beerDeposits: BeerDeposit[];
  reservations: Reservation[];
  
  setActiveTable: (tableId: string | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Reservation Actions (local-only for now)
  addReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  cancelReservation: (reservationId: string) => void;
  markAsSeated: (reservationId: string) => void;
  
  addBeerDeposit: (deposit: Omit<BeerDeposit, 'id' | 'depositedAt'>) => void;
  
  getTotal: () => number;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  activeTableId: null,
  cart: [],
  beerDeposits: [],
  reservations: [],

  setActiveTable: (tableId) => set({ activeTableId: tableId }),

  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        cart: [...cart, {
          id: Math.random().toString(36).substr(2, 9),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          status: 'pending',
          orderedAt: new Date().toISOString(),
        } as OrderItem],
      });
    }
  },

  removeFromCart: (productId) => {
    set({
      cart: get().cart.filter((item) => item.productId !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => set({ cart: [] }),

  addReservation: (reservation) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
    };
    set({ reservations: [newReservation, ...get().reservations] });
  },

  cancelReservation: (reservationId) => {
    set({
      reservations: get().reservations.map(r => 
        r.id === reservationId ? { ...r, status: 'cancelled' } : r
      )
    });
  },

  markAsSeated: (reservationId) => {
    set({
      reservations: get().reservations.map(r => 
        r.id === reservationId ? { ...r, status: 'seated' } : r
      )
    });
  },

  addBeerDeposit: (deposit) => {
    const newDeposit: BeerDeposit = {
      ...deposit,
      id: Math.random().toString(36).substr(2, 9),
      depositedAt: new Date().toISOString(),
    };
    set({ beerDeposits: [newDeposit, ...get().beerDeposits] });
  },

  getTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));
