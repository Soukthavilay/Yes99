export type ItemType = 'food' | 'beverage';

export interface MenuItemResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  item_type: ItemType;
  preparation_time: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemCreate {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  item_type: ItemType;
  preparation_time?: number;
  image_url?: string;
}

export interface MenuItemUpdate {
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  item_type?: ItemType;
  preparation_time?: number;
  image_url?: string;
  is_active?: boolean;
}

export interface ActiveStatusUpdate {
  is_active: boolean;
}

export interface ImageUpload {
  image_url: string;
}
