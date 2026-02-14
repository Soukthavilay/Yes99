import { UserRole, ROLE_ROUTES } from '@/types/auth';

export const ROLE_LABEL_MAP: Record<UserRole, string> = {
  owner: 'Owner',
  waiter: 'Waiter',
  chef: 'Chef',
  bartender: 'Bartender',
  cashier: 'Cashier',
};

export const ROLE_COLOR_MAP: Record<UserRole, string> = {
  owner: 'bg-purple-500/20 text-purple-400',
  waiter: 'bg-blue-500/20 text-blue-400',
  chef: 'bg-orange-500/20 text-orange-400',
  bartender: 'bg-cyan-500/20 text-cyan-400',
  cashier: 'bg-green-500/20 text-green-400',
};

export const getRoleLabel = (role: UserRole): string => {
  return ROLE_LABEL_MAP[role] ?? role;
};

export const getRoleColor = (role: UserRole): string => {
  return ROLE_COLOR_MAP[role] ?? 'bg-gray-500/20 text-gray-400';
};

export const canAccessRoute = (role: UserRole, path: string): boolean => {
  const routes = ROLE_ROUTES[role];
  return routes?.some((prefix) => path.startsWith(prefix)) ?? false;
};

export const ALL_ROLES: UserRole[] = ['owner', 'waiter', 'chef', 'bartender', 'cashier'];
export const EMPLOYEE_ROLES: UserRole[] = ['waiter', 'chef', 'bartender', 'cashier'];
