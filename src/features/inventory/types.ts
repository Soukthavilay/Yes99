export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string; // e.g., kg, liters, pcs, bags
  currentStock: number;
  minThreshold: number;
  lastRestocked: string;
  status: StockStatus;
  pricePerUnit: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string; // e.g., Meat, Vegetables, Drinks
}

export interface StockAdjustment {
  id: string;
  ingredientId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  adjustedAt: string;
  adjustedBy: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: {
    ingredientId: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  orderedAt: string;
  receivedAt?: string;
}
