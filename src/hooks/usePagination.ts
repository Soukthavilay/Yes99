import { useState, useCallback, useMemo } from 'react';
import { PageInfo } from '@/types/api';

interface UsePaginationOptions {
  initialPage?: number;
  initialPaging?: number;
}

export const usePagination = (options?: UsePaginationOptions) => {
  const [page, setPage] = useState(options?.initialPage ?? 1);
  const [paging, setPaging] = useState(options?.initialPaging ?? 10);

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, p));
  }, []);

  const nextPage = useCallback((meta?: PageInfo) => {
    if (meta && page < meta.total_pages) {
      setPage((prev) => prev + 1);
    }
  }, [page]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  const params = useMemo(() => ({ page, paging }), [page, paging]);

  return {
    page,
    paging,
    params,
    setPage: goToPage,
    setPaging,
    nextPage,
    prevPage,
    reset,
  };
};
