import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/services/user.service';
import { EmployeeCreate, UserUpdate } from '@/types/user';
import { PaginationParams } from '@/types/api';

const QUERY_KEY = 'users';

export const useUsers = (params?: PaginationParams) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => userService.getUsers(params),
  });

export const useCurrentUser = () =>
  useQuery({
    queryKey: [QUERY_KEY, 'me'],
    queryFn: () => userService.getCurrentUser(),
  });

export const useUserById = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeCreate) => userService.createEmployee(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
      userService.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
