import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import {
  MenuItemResponse,
  MenuItemCreate,
  MenuItemUpdate,
  ItemType,
  ActiveStatusUpdate,
  ImageUpload,
} from '@/types/menu-item';
import { ApiResponse, PaginationParams } from '@/types/api';

interface MenuItemParams extends PaginationParams {
  category_id?: string;
  item_type?: ItemType;
  is_active?: boolean;
}

export const menuItemService = {
  getMenuItems: async (params?: MenuItemParams) => {
    const res = await axiosInstance.get<ApiResponse<MenuItemResponse[]>>(
      ENDPOINTS.MENU_ITEMS.BASE,
      { params },
    );
    return res.data;
  },

  getPublicMenu: async (params?: { page?: number; paging?: number; category_id?: string; item_type?: ItemType }) => {
    const res = await axiosInstance.get<ApiResponse<MenuItemResponse[]>>(
      ENDPOINTS.MENU_ITEMS.PUBLIC,
      { params },
    );
    return res.data;
  },

  getMenuItemById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.BY_ID(id),
    );
    return res.data.data;
  },

  createMenuItem: async (data: MenuItemCreate) => {
    const res = await axiosInstance.post<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.BASE,
      data,
    );
    return res.data.data;
  },

  updateMenuItem: async (id: string, data: MenuItemUpdate) => {
    const res = await axiosInstance.put<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.BY_ID(id),
      data,
    );
    return res.data.data;
  },

  activateMenuItem: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.ACTIVATE(id),
    );
    return res.data.data;
  },

  deactivateMenuItem: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.DEACTIVATE(id),
    );
    return res.data.data;
  },

  updateMenuItemStatus: async (id: string, data: ActiveStatusUpdate) => {
    const res = await axiosInstance.patch<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.STATUS(id),
      data,
    );
    return res.data.data;
  },

  uploadMenuItemImage: async (id: string, data: ImageUpload) => {
    const res = await axiosInstance.patch<ApiResponse<MenuItemResponse>>(
      ENDPOINTS.MENU_ITEMS.IMAGE(id),
      data,
    );
    return res.data.data;
  },

  deleteMenuItem: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse>(
      ENDPOINTS.MENU_ITEMS.BY_ID(id),
    );
    return res.data;
  },
};
