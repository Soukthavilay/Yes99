export type Category = 'FOOD' | 'DRINK' | 'ALCOHOL' | 'DESSERT' | 'SNACK';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image?: string;
  isAvailable: boolean;
  stock?: number;
}

export interface OrderItem {
  id: string; // Unique ID for each item instance in an order
  productId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  orderedAt: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'served' | 'paid' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  paymentMethod?: PaymentMethod;
  paidAt?: string;
}

export type PaymentMethod = 'CASH' | 'QR_BCEL' | 'QR_LDB' | 'CREDIT_CARD';

export interface CheckoutSession {
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method?: PaymentMethod;
}

export interface BeerDeposit {
  id: string;
  customerName: string;
  phoneNumber: string;
  brand: string;
  quantity: number;
  depositedAt: string;
  note?: string;
}

export interface Receipt {
  orderId: string;
  tableId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  change: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  phoneNumber: string;
  guestCount: number;
  reservationTime: string; // ISO string
  status: 'confirmed' | 'cancelled' | 'seated';
  note?: string;
}
