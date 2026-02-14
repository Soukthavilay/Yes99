'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth/auth-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(
    process.env.NEXT_PUBLIC_USE_MOCKS !== 'true',
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCKS !== 'true') return;
    async function init() {
      const { initMocks } = await import('@/mocks/browser');
      await initMocks();
      setMswReady(true);
    }
    init();
  }, []);

  if (!mswReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
