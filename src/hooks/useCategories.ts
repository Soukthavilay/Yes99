import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/api/services/category.service';
import { MenuCategoryCreate, MenuCategoryUpdate } from '@/types/category';
import { PaginationParams } from '@/types/api';

const QUERY_KEY = 'categories';

interface CategoryParams extends PaginationParams {
  is_active?: boolean;
}

export const useCategories = (params?: CategoryParams) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => categoryService.getCategories(params),
  });

export const useActiveCategories = () =>
  useQuery({
    queryKey: [QUERY_KEY, 'active'],
    queryFn: () => categoryService.getActiveCategories(),
  });

export const useCategoryById = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuCategoryCreate) => categoryService.createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuCategoryUpdate }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
