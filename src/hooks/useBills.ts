import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billService } from '@/lib/api/services/bill.service';
import { BillCreateRequest, BillUpdate, BillStatusUpdate } from '@/types/bill';

const QUERY_KEY = 'bills';

export const useBillsByTable = (tableId: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, 'table', tableId],
    queryFn: () => billService.getBillsByTable(tableId!),
    enabled: !!tableId,
  });

export const useCreateBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, data }: { tableId: string; data: BillCreateRequest }) =>
      billService.createBill(tableId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, billId, data }: { tableId: string; billId: string; data: BillUpdate }) =>
      billService.updateBill(tableId, billId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, billId }: { tableId: string; billId: string }) =>
      billService.deleteBill(tableId, billId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateBillStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, billId, data }: { tableId: string; billId: string; data: BillStatusUpdate }) =>
      billService.updateBillStatus(tableId, billId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useMarkBillComplete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, billId }: { tableId: string; billId: string }) =>
      billService.markBillComplete(tableId, billId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
