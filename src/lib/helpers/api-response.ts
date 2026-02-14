import { ApiResponse, PageInfo } from '@/types/api';

export const extractData = <T>(response: ApiResponse<T>): T | undefined => {
  return response.data;
};

export const extractPaginatedData = <T>(
  response: ApiResponse<T[]>,
): { data: T[]; meta: PageInfo | undefined } => {
  return {
    data: response.data ?? [],
    meta: response.meta,
  };
};

export const isSuccess = (response: ApiResponse): boolean => {
  return response.status === 'success';
};

export const isFailure = (response: ApiResponse): boolean => {
  return response.status === 'failure';
};
