import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuItemService } from '@/lib/api/services/menu-item.service';
import { MenuItemCreate, MenuItemUpdate, ItemType, ImageUpload, ActiveStatusUpdate } from '@/types/menu-item';
import { PaginationParams } from '@/types/api';

const QUERY_KEY = 'menu-items';

interface MenuItemParams extends PaginationParams {
  search?: string;
  category_id?: string;
  item_type?: ItemType;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const useMenuItems = (params?: MenuItemParams) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => menuItemService.getMenuItems(params),
  });

export const usePublicMenu = (params?: { page?: number; paging?: number; category_id?: string; item_type?: ItemType }) =>
  useQuery({
    queryKey: [QUERY_KEY, 'public', params],
    queryFn: () => menuItemService.getPublicMenu(params),
  });

export const useMenuItemById = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => menuItemService.getMenuItemById(id!),
    enabled: !!id,
  });

export const useCreateMenuItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuItemCreate) => menuItemService.createMenuItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateMenuItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuItemUpdate }) =>
      menuItemService.updateMenuItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useActivateMenuItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuItemService.activateMenuItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeactivateMenuItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuItemService.deactivateMenuItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUploadMenuItemImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ImageUpload }) =>
      menuItemService.uploadMenuItemImage(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateMenuItemStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ActiveStatusUpdate }) =>
      menuItemService.updateMenuItemStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteMenuItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuItemService.deleteMenuItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
