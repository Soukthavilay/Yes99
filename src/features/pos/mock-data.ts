import { Product } from './types';

export const mockProducts: Product[] = [
  // FOOD
  { id: 'f1', name: 'ຜັດໄທກຸ້ງສົດ (Pad Thai)', price: 45000, category: 'FOOD', isAvailable: true },
  { id: 'f2', name: 'ຕຳໝາກຫຸ່ງ (Papaya Salad)', price: 25000, category: 'FOOD', isAvailable: true },
  { id: 'f3', name: 'ລາບໝູ (Larb Moo)', price: 35000, category: 'FOOD', isAvailable: true },
  { id: 'f4', name: 'ເຂົ້າຜັດລວມມິດ (Fried Rice)', price: 40000, category: 'FOOD', isAvailable: true },
  
  // DRINK
  { id: 'd1', name: 'ນ້ຳດື່ມບໍລິສຸດ (Water)', price: 5000, category: 'DRINK', isAvailable: true },
  { id: 'd2', name: 'ນ້ຳໝາກພ້າວ (Coconut)', price: 15000, category: 'DRINK', isAvailable: true },
  { id: 'd3', name: 'ເປັບຊີ (Pepsi)', price: 8000, category: 'DRINK', isAvailable: true },
  
  // ALCOHOL
  { id: 'a1', name: 'Beerlao Gold (L)', price: 18000, category: 'ALCOHOL', isAvailable: true },
  { id: 'a2', name: 'Beerlao Lager (L)', price: 15000, category: 'ALCOHOL', isAvailable: true },
  { id: 'a3', name: 'Somersby Apple', price: 22000, category: 'ALCOHOL', isAvailable: true },
  
  // DESSERT
  { id: 'e1', name: 'ເຂົ້າໜຽວໝາກມ່ວງ', price: 30000, category: 'DESSERT', isAvailable: true },
];
