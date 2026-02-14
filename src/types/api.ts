export interface PageInfo {
  current_page: number;
  next_page: number;
  prev_page: number;
  total_pages: number;
  total_count: number;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'failure';
  data?: T;
  error?: unknown;
  meta?: PageInfo;
}

export interface PaginationParams {
  page?: number;
  paging?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
