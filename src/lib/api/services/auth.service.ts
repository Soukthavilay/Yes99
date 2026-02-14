import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { OwnerCreate } from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authService = {
  login: async (data: LoginRequest) => {
    const res = await axiosInstance.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return res.data.data;
  },

  registerOwner: async (data: OwnerCreate) => {
    const res = await axiosInstance.post<ApiResponse>(
      ENDPOINTS.AUTH.REGISTER_OWNER,
      data,
    );
    return res.data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const res = await axiosInstance.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken },
    );
    return res.data.data;
  },

  logout: async () => {
    const res = await axiosInstance.post<ApiResponse>(ENDPOINTS.AUTH.LOGOUT);
    return res.data;
  },
};
