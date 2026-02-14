import { MenuItemResponse } from './menu-item';
import { UserResponse } from './user';

export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type OrderBy = 'owner' | 'employee' | 'guest';

export interface OrderItemResponse {
  id: string;
  table_id: string;
  order_id: string;
  menu_item: MenuItemResponse;
  user: UserResponse | null;
  quantity: number;
  special_instructions: string | null;
  order_by: OrderBy;
  device_name: string | null;
  unit_price: number;
  total_price: number;
  status: OrderItemStatus;
  is_priority: boolean;
  prepared_by_id: string | null;
  ordered_at: string;
  prepared_at: string | null;
  ready_at: string | null;
  served_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemCreate {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
  is_priority?: boolean;
}

export interface OrderItemBulkCreate {
  table_id: string;
  device_name?: string;
  items: OrderItemCreate[];
}

export interface OrderItemUpdate {
  quantity?: number;
  status?: OrderItemStatus;
  special_instructions?: string;
  is_priority?: boolean;
  prepared_by_id?: string;
  cancellation_reason?: string;
}

export interface OrderItemCancel {
  cancellation_reason?: string;
}
