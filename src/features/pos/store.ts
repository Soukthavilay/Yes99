'use client';

import { create } from 'zustand';
import { Product, OrderItem, BeerDeposit, Receipt as ReceiptType, Reservation } from './types';

interface POSStore {
  activeTableId: string | null;
  cart: OrderItem[]; // Draft items not yet sent to kitchen
  tableOrders: Record<string, OrderItem[]>; // Items already sent to kitchen per table
  beerDeposits: BeerDeposit[];
  history: ReceiptType[];
  reservations: Reservation[];
  
  setActiveTable: (tableId: string | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Kitchen/Order Actions
  placeOrder: (tableId: string) => void;
  cancelOrderItem: (tableId: string, itemId: string) => void;
  updateItemStatus: (tableId: string, itemId: string, status: OrderItem['status']) => void;
  
  // Reservation Actions
  addReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  cancelReservation: (reservationId: string) => void;
  markAsSeated: (reservationId: string) => void;
  
  addBeerDeposit: (deposit: Omit<BeerDeposit, 'id' | 'depositedAt'>) => void;
  addToHistory: (receipt: ReceiptType) => void;
  
  getTotal: () => number;
  getTableTotal: (tableId: string) => number;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  activeTableId: null,
  cart: [],
  tableOrders: {},
  beerDeposits: [],
  history: [],
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

  placeOrder: (tableId) => {
    const { cart, tableOrders } = get();
    if (cart.length === 0) return;

    const existingTableItems = tableOrders[tableId] || [];
    const newItems = cart.map(item => ({
      ...item,
      orderedAt: new Date().toISOString(),
      status: 'pending' as const
    }));

    set({
      tableOrders: {
        ...tableOrders,
        [tableId]: [...existingTableItems, ...newItems]
      },
      cart: [] // Clear draft cart after placing order
    });

    console.log(`Printing Ticket to Kitchen for Table ${tableId}...`);
  },

  cancelOrderItem: (tableId, itemId) => {
    const { tableOrders } = get();
    const items = tableOrders[tableId] || [];
    const item = items.find(i => i.id === itemId);

    if (item && item.status === 'pending') {
      set({
        tableOrders: {
          ...tableOrders,
          [tableId]: items.map(i => i.id === itemId ? { ...i, status: 'cancelled' as const } : i)
        }
      });
    } else {
      alert("ອາຫານກຳລັງເຮັດ ຫຼື ສຳເລັດແລ້ວ, ບໍ່ສາມາດຍົກເລີກໄດ້!");
    }
  },

  updateItemStatus: (tableId, itemId, status) => {
    const { tableOrders } = get();
    const items = tableOrders[tableId] || [];
    set({
      tableOrders: {
        ...tableOrders,
        [tableId]: items.map(i => i.id === itemId ? { ...i, status } : i)
      }
    });
  },

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

  addToHistory: (receipt) => {
    set({ history: [receipt, ...get().history] });
  },

  getTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTableTotal: (tableId) => {
    const items = get().tableOrders[tableId] || [];
    return items
      .filter(item => item.status !== 'cancelled')
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));
