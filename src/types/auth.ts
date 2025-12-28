export type Role = 'ADMIN' | 'STAFF' | 'KITCHEN' | 'STOCK';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Routes Definition ສໍາລັບ RBAC
export const ROLE_ROUTES: Record<Role, string[]> = {
  ADMIN: ['/admin', '/pos', '/inventory', '/kitchen', '/reports'],
  STAFF: ['/pos', '/kitchen'],
  KITCHEN: ['/kitchen'],
  STOCK: ['/inventory'],
};

export const PUBLIC_ROUTES = ['/login', '/api/auth'];
