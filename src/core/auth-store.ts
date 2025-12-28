import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkPermission: (route: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      checkPermission: (route) => {
        const { user } = get();
        if (!user) return false;
        
        // Admin ເຂົ້າໄດ້ທຸກບ່ອນທີ່ມີໃນລະບົບ
        if (user.role === 'ADMIN') return true;

        // ກວດສອບສິດເຂົ້າເຖິງຕາມ Role (ຕົວຢ່າງແບບງ່າຍ)
        const allowedPrefixes: Record<string, string[]> = {
          STAFF: ['/pos', '/kitchen'],
          KITCHEN: ['/kitchen'],
          STOCK: ['/inventory'],
        };

        return allowedPrefixes[user.role]?.some(prefix => route.startsWith(prefix)) ?? false;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
