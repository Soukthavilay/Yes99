'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (process.env.NODE_ENV === 'development') {
        const { initMocks } = await import('@/mocks/browser');
        await initMocks();
      }
      setMswReady(true);
    }
    init();
  }, []);

  // ຖ້າຫາກກຳລັງ Load MSW ໃຫ້ລໍຖ້າກ່ອນ (ເພື່ອປ້ອງກັນ API Error ໃນຄັ້ງທຳອິດ)
  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return null; 
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
