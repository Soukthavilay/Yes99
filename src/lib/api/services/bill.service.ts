import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import {
  BillResponse,
  BillCreateRequest,
  BillUpdate,
  BillStatusUpdate,
} from '@/types/bill';
import { ApiResponse } from '@/types/api';

export const billService = {
  createBill: async (tableId: string, data: BillCreateRequest) => {
    const res = await axiosInstance.post<ApiResponse<BillResponse>>(
      ENDPOINTS.BILLS.BASE(tableId),
      data,
    );
    return res.data.data;
  },

  getBillsByTable: async (tableId: string) => {
    const res = await axiosInstance.get<ApiResponse<BillResponse[]>>(
      ENDPOINTS.BILLS.BASE(tableId),
    );
    return res.data.data;
  },

  updateBill: async (tableId: string, billId: string, data: BillUpdate) => {
    const res = await axiosInstance.put<ApiResponse<BillResponse>>(
      ENDPOINTS.BILLS.BY_ID(tableId, billId),
      data,
    );
    return res.data.data;
  },

  deleteBill: async (tableId: string, billId: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.BILLS.BY_ID(tableId, billId),
    );
    return res.data;
  },

  updateBillStatus: async (tableId: string, billId: string, data: BillStatusUpdate) => {
    const res = await axiosInstance.patch<ApiResponse<BillResponse>>(
      ENDPOINTS.BILLS.STATUS(tableId, billId),
      data,
    );
    return res.data.data;
  },

  markBillComplete: async (tableId: string, billId: string) => {
    const res = await axiosInstance.post<ApiResponse<BillResponse>>(
      ENDPOINTS.BILLS.COMPLETE(tableId, billId),
    );
    return res.data.data;
  },
};
