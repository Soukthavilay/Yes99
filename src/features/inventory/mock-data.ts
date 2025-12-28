import { Ingredient, Supplier } from './types';

export const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Beer (Beerlao Gold)',
    category: 'Drinks',
    unit: 'Bags (24 cans)',
    currentStock: 45,
    minThreshold: 10,
    lastRestocked: '2023-12-25T10:00:00Z',
    status: 'in_stock',
    pricePerUnit: 280000,
  },
  {
    id: '2',
    name: 'Jasmine Rice',
    category: 'Dry Goods',
    unit: 'Bags (25kg)',
    currentStock: 8,
    minThreshold: 5,
    lastRestocked: '2023-12-20T08:00:00Z',
    status: 'low_stock',
    pricePerUnit: 450000,
  },
  {
    id: '3',
    name: 'Pork Belly',
    category: 'Meat',
    unit: 'kg',
    currentStock: 120,
    minThreshold: 30,
    lastRestocked: '2023-12-27T06:00:00Z',
    status: 'in_stock',
    pricePerUnit: 85000,
  },
  {
    id: '4',
    name: 'Salmon Fillet',
    category: 'Seafood',
    unit: 'kg',
    currentStock: 2,
    minThreshold: 10,
    lastRestocked: '2023-12-26T09:00:00Z',
    status: 'out_of_stock',
    pricePerUnit: 250000,
  },
  {
    id: '5',
    name: 'Vegetable Oil',
    category: 'Cooking Essentials',
    unit: 'Liters',
    currentStock: 50,
    minThreshold: 15,
    lastRestocked: '2023-12-24T14:00:00Z',
    status: 'in_stock',
    pricePerUnit: 25000,
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'S1',
    name: 'Lao Brewery Co., Ltd',
    contactPerson: 'Somsack',
    phone: '20 5555 1234',
    email: 'sales@beerlao.com.la',
    category: 'Drinks'
  },
  {
    id: 'S2',
    name: 'Fresh Market Pakse',
    contactPerson: 'Keo',
    phone: '20 2222 9999',
    email: 'keo@market.la',
    category: 'Meat & Vegetables'
  }
];
