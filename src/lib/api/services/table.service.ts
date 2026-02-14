import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import {
  TableResponse,
  TableCreate,
  TableBulkCreate,
  TableUpdate,
  TableStatusUpdate,
  TableStatus,
} from '@/types/table';
import { ApiResponse, PaginationParams } from '@/types/api';

interface TableParams extends PaginationParams {
  zone_id?: string;
  status?: TableStatus;
  is_active?: boolean;
}

export const tableService = {
  getTables: async (params?: TableParams) => {
    const res = await axiosInstance.get<ApiResponse<TableResponse[]>>(
      ENDPOINTS.TABLES.BASE,
      { params },
    );
    return res.data;
  },

  getTableById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.BY_ID(id),
    );
    return res.data.data;
  },

  createTable: async (data: TableCreate) => {
    const res = await axiosInstance.post<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.BASE,
      data,
    );
    return res.data.data;
  },

  createBulkTables: async (data: TableBulkCreate) => {
    const res = await axiosInstance.post<ApiResponse<TableResponse[]>>(
      ENDPOINTS.TABLES.BULK,
      data,
    );
    return res.data.data;
  },

  updateTable: async (id: string, data: TableUpdate) => {
    const res = await axiosInstance.put<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.BY_ID(id),
      data,
    );
    return res.data.data;
  },

  updateTableStatus: async (id: string, data: TableStatusUpdate) => {
    const res = await axiosInstance.patch<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.STATUS(id),
      data,
    );
    return res.data.data;
  },

  generateQR: async (id: string) => {
    const res = await axiosInstance.post<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.QR(id),
    );
    return res.data.data;
  },

  activateTable: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.ACTIVATE(id),
    );
    return res.data.data;
  },

  deactivateTable: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<TableResponse>>(
      ENDPOINTS.TABLES.DEACTIVATE(id),
    );
    return res.data.data;
  },

  deleteTable: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.TABLES.BY_ID(id),
    );
    return res.data;
  },
};
