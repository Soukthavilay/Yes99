export type TableStatus = 'available' | 'busy' | 'reserved' | 'maintenance';

export interface TableResponse {
  id: string;
  table_number: number;
  table_name: string | null;
  zone_id: string;
  status: TableStatus;
  qr_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TableCreate {
  zone_id: string;
  table_name?: string;
}

export interface TableBulkCreate {
  zone_id: string;
  count: number;
}

export interface TableUpdate {
  table_name?: string;
  zone_id?: string;
  status?: TableStatus;
  is_active?: boolean;
}

export interface TableStatusUpdate {
  status: TableStatus;
}
