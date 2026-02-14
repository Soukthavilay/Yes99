import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { ZoneResponse, ZoneCreate, ZoneUpdate } from '@/types/zone';
import { ApiResponse, PaginationParams } from '@/types/api';

interface ZoneParams extends PaginationParams {
  is_active?: boolean;
}

export const zoneService = {
  getZones: async (params?: ZoneParams) => {
    const res = await axiosInstance.get<ApiResponse<ZoneResponse[]>>(
      ENDPOINTS.ZONES.BASE,
      { params },
    );
    return res.data;
  },

  getZoneById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<ZoneResponse>>(
      ENDPOINTS.ZONES.BY_ID(id),
    );
    return res.data.data;
  },

  createZone: async (data: ZoneCreate) => {
    const res = await axiosInstance.post<ApiResponse<ZoneResponse>>(
      ENDPOINTS.ZONES.BASE,
      data,
    );
    return res.data.data;
  },

  updateZone: async (id: string, data: ZoneUpdate) => {
    const res = await axiosInstance.put<ApiResponse<ZoneResponse>>(
      ENDPOINTS.ZONES.BY_ID(id),
      data,
    );
    return res.data.data;
  },

  activateZone: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<ZoneResponse>>(
      ENDPOINTS.ZONES.ACTIVATE(id),
    );
    return res.data.data;
  },

  deactivateZone: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<ZoneResponse>>(
      ENDPOINTS.ZONES.DEACTIVATE(id),
    );
    return res.data.data;
  },

  deleteZone: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.ZONES.BY_ID(id),
    );
    return res.data;
  },
};
