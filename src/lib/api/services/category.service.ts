import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import {
  MenuCategoryResponse,
  MenuCategoryCreate,
  MenuCategoryUpdate,
} from '@/types/category';
import { ApiResponse, PaginationParams } from '@/types/api';

interface CategoryParams extends PaginationParams {
  is_active?: boolean;
}

export const categoryService = {
  getCategories: async (params?: CategoryParams) => {
    const res = await axiosInstance.get<ApiResponse<MenuCategoryResponse[]>>(
      ENDPOINTS.CATEGORIES.BASE,
      { params },
    );
    return res.data;
  },

  getActiveCategories: async () => {
    const res = await axiosInstance.get<ApiResponse<MenuCategoryResponse[]>>(
      ENDPOINTS.CATEGORIES.ACTIVE,
    );
    return res.data.data;
  },

  getCategoryById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<MenuCategoryResponse>>(
      ENDPOINTS.CATEGORIES.BY_ID(id),
    );
    return res.data.data;
  },

  createCategory: async (data: MenuCategoryCreate) => {
    const res = await axiosInstance.post<ApiResponse<MenuCategoryResponse>>(
      ENDPOINTS.CATEGORIES.BASE,
      data,
    );
    return res.data.data;
  },

  updateCategory: async (id: string, data: MenuCategoryUpdate) => {
    const res = await axiosInstance.put<ApiResponse<MenuCategoryResponse>>(
      ENDPOINTS.CATEGORIES.BY_ID(id),
      data,
    );
    return res.data.data;
  },

  deleteCategory: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.CATEGORIES.BY_ID(id),
    );
    return res.data;
  },
};
