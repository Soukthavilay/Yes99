export type PaymentType = 'cash' | 'bank';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';
export type DiscountType = 'percentage' | 'fixed';

export interface BillResponse {
  id: string;
  bill_number: string;
  table_id: string;
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  service_charge_percentage: number;
  service_charge: number;
  discount_type: DiscountType | null;
  discount_value: number;
  discount_amount: number;
  total_amount: number;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
  paid_amount: number;
  remaining_amount: number;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface BillCreateRequest {
  payment_type: PaymentType;
  discount_type?: DiscountType;
  discount_value?: number;
  tax_percentage?: number;
  service_charge_percentage?: number;
}

export interface BillUpdate {
  payment_type?: PaymentType;
  discount_type?: DiscountType;
  discount_value?: number;
  tax_percentage?: number;
  service_charge_percentage?: number;
}

export interface BillStatusUpdate {
  payment_status: PaymentStatus;
  paid_amount?: number;
}
