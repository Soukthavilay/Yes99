import { setupWorker } from 'msw/browser';
import { posHandlers } from './handlers/pos-handlers';
import { authHandlers } from './handlers/auth-handlers';

export const worker = setupWorker(...posHandlers, ...authHandlers);

export async function initMocks() {
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
    }
  }
}
