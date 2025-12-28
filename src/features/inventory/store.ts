import { create } from 'zustand';
import { Ingredient, Supplier, StockAdjustment, PurchaseOrder } from './types';

interface InventoryState {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  adjustments: StockAdjustment[];
  orders: PurchaseOrder[];
  
  // Actions
  setIngredients: (ingredients: Ingredient[]) => void;
  updateStock: (ingredientId: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason: string, user: string) => void;
  addIngredient: (ingredient: Ingredient) => void;
  
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  
  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'status' | 'orderedAt'>) => void;
  updateOrderStatus: (orderId: string, status: PurchaseOrder['status']) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  ingredients: [],
  suppliers: [],
  adjustments: [],
  orders: [],

  setIngredients: (ingredients) => set({ ingredients }),

  updateStock: (ingredientId, quantity, type, reason, user) => set((state) => {
    const newAdjustments: StockAdjustment = {
      id: Math.random().toString(36).substr(2, 9),
      ingredientId,
      type,
      quantity,
      reason,
      adjustedAt: new Date().toISOString(),
      adjustedBy: user,
    };

    const newIngredients = state.ingredients.map((ing) => {
      if (ing.id === ingredientId) {
        const newStock = type === 'in' ? ing.currentStock + quantity : 
                        type === 'out' ? ing.currentStock - quantity : quantity;
        
        let status: Ingredient['status'] = 'in_stock';
        if (newStock <= 0) status = 'out_of_stock';
        else if (newStock <= ing.minThreshold) status = 'low_stock';

        return { ...ing, currentStock: newStock, status, lastRestocked: type === 'in' ? new Date().toISOString() : ing.lastRestocked };
      }
      return ing;
    });

    return {
      ingredients: newIngredients,
      adjustments: [newAdjustments, ...state.adjustments],
    };
  }),

  addIngredient: (ingredient) => set((state) => ({
    ingredients: [ingredient, ...state.ingredients],
  })),

  setSuppliers: (suppliers) => set({ suppliers }),

  addSupplier: (supplier) => set((state) => ({
    suppliers: [supplier, ...state.suppliers],
  })),

  createPurchaseOrder: (order) => set((state) => ({
    orders: [{
      ...order,
      id: `PO-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      status: 'pending',
      orderedAt: new Date().toISOString(),
    }, ...state.orders],
  })),

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((order) => order.id === orderId ? { ...order, status, receivedAt: status === 'received' ? new Date().toISOString() : order.receivedAt } : order),
  })),
}));
