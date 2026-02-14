import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import {
  UserResponse,
  UserCreate,
  EmployeeCreate,
  EmployeeCreateResponse,
  UserUpdate,
} from '@/types/user';
import { ApiResponse, PaginationParams } from '@/types/api';

export const userService = {
  getUsers: async (params?: PaginationParams) => {
    const res = await axiosInstance.get<ApiResponse<UserResponse[]>>(
      ENDPOINTS.USERS.BASE,
      { params },
    );
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await axiosInstance.get<ApiResponse<UserResponse>>(
      ENDPOINTS.USERS.ME,
    );
    return res.data.data;
  },

  getUserById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<UserResponse>>(
      ENDPOINTS.USERS.BY_ID(id),
    );
    return res.data.data;
  },

  createUser: async (data: UserCreate) => {
    const res = await axiosInstance.post<ApiResponse<UserResponse>>(
      ENDPOINTS.USERS.BASE,
      data,
    );
    return res.data.data;
  },

  createEmployee: async (data: EmployeeCreate) => {
    const res = await axiosInstance.post<ApiResponse<EmployeeCreateResponse>>(
      ENDPOINTS.USERS.EMPLOYEES,
      data,
    );
    return res.data.data;
  },

  updateUser: async (id: string, data: UserUpdate) => {
    const res = await axiosInstance.put<ApiResponse<UserResponse>>(
      ENDPOINTS.USERS.BY_ID(id),
      data,
    );
    return res.data.data;
  },

  deleteUser: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.USERS.BY_ID(id),
    );
    return res.data;
  },
};
