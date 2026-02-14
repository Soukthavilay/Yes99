import { PaginationParams } from '@/types/api';

export const buildPaginationParams = (
  page: number,
  paging: number,
  filters?: Record<string, unknown>,
): PaginationParams & Record<string, unknown> => {
  const params: Record<string, unknown> = { page, paging };

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
  }

  return params;
};

export const getSkip = (page: number, paging: number): number => {
  return (Math.max(1, page) - 1) * paging;
};
