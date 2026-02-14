export type UserRole = 'owner' | 'waiter' | 'chef' | 'bartender' | 'cashier';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export const ROLE_ROUTES: Record<UserRole, string[]> = {
  owner: ['/pos', '/zones', '/inventory', '/kitchen', '/reports', '/admin'],
  waiter: ['/pos', '/kitchen'],
  chef: ['/kitchen'],
  bartender: ['/kitchen'],
  cashier: ['/pos'],
};

export const PUBLIC_ROUTES = ['/login', '/customer'];
