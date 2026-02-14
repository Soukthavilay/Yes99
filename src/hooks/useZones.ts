import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zoneService } from '@/lib/api/services/zone.service';
import { ZoneCreate, ZoneUpdate } from '@/types/zone';
import { PaginationParams } from '@/types/api';

const QUERY_KEY = 'zones';

interface ZoneParams extends PaginationParams {
  is_active?: boolean;
}

export const useZones = (params?: ZoneParams) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => zoneService.getZones(params),
  });

export const useZoneById = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => zoneService.getZoneById(id!),
    enabled: !!id,
  });

export const useCreateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ZoneCreate) => zoneService.createZone(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZoneUpdate }) =>
      zoneService.updateZone(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useActivateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => zoneService.activateZone(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeactivateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => zoneService.deactivateZone(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => zoneService.deleteZone(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
