'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, AuthState, LoginRequest, ROLE_ROUTES } from '@/types/auth';
import { authService } from '@/lib/api/services/auth.service';
import { userService } from '@/lib/api/services/user.service';
import { tokenManager } from '@/lib/api/axios-instance';

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  canAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const fetchUser = useCallback(async () => {
    try {
      const data = await userService.getCurrentUser();
      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          username: data.username,
          full_name: data.full_name,
          role: data.role,
          is_active: data.is_active,
        });
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      const result = await authService.login(data);
      if (result) {
        tokenManager.setTokens(result.access_token, result.refresh_token);
      }
      await fetchUser();
      router.replace('/pos');
    },
    [fetchUser, router],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout API errors
    } finally {
      tokenManager.clear();
      setUser(null);
      router.replace('/login');
    }
  }, [router]);

  const canAccess = useCallback(
    (path: string): boolean => {
      if (!user) return false;
      const routes = ROLE_ROUTES[user.role];
      return routes?.some((prefix) => path.startsWith(prefix)) ?? false;
    },
    [user],
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      fetchUser,
      canAccess,
    }),
    [user, isAuthenticated, isLoading, login, logout, fetchUser, canAccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
