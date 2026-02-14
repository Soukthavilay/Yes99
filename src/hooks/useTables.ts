import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableService } from '@/lib/api/services/table.service';
import {
  TableCreate,
  TableBulkCreate,
  TableUpdate,
  TableStatusUpdate,
  TableStatus,
} from '@/types/table';
import { PaginationParams } from '@/types/api';

const QUERY_KEY = 'tables';

interface TableParams extends PaginationParams {
  zone_id?: string;
  status?: TableStatus;
  is_active?: boolean;
}

export const useTables = (params?: TableParams) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => tableService.getTables(params),
  });

export const useTableById = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => tableService.getTableById(id!),
    enabled: !!id,
  });

export const useCreateTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TableCreate) => tableService.createTable(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useCreateBulkTables = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TableBulkCreate) => tableService.createBulkTables(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TableUpdate }) =>
      tableService.updateTable(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateTableStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TableStatusUpdate }) =>
      tableService.updateTableStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useGenerateQR = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tableService.generateQR(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useActivateTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tableService.activateTable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeactivateTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tableService.deactivateTable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tableService.deleteTable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
