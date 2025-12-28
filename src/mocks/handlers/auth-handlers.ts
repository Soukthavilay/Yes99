import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json() as any;

    if (username === 'admin' && password === '1234') {
      // Side-effect to ensure cookies are set in browser for Middleware
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=mock-jwt-token-admin; Path=/; SameSite=Strict';
        document.cookie = 'user_role=ADMIN; Path=/; SameSite=Strict';
      }

      return HttpResponse.json({
        user: { id: '1', username: 'admin', name: 'System Admin', role: 'ADMIN' },
        token: 'mock-jwt-token-admin',
      }, {
        headers: {
          'Set-Cookie': [
            'auth_token=mock-jwt-token-admin; Path=/; HttpOnly; SameSite=Strict',
            'user_role=ADMIN; Path=/; SameSite=Strict'
          ].join(', '),
        }
      });
    }

    if (username === 'staff' && password === '1234') {
      // Side-effect to ensure cookies are set in browser for Middleware
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=mock-jwt-token-staff; Path=/; SameSite=Strict';
        document.cookie = 'user_role=STAFF; Path=/; SameSite=Strict';
      }

      return HttpResponse.json({
        user: { id: '2', username: 'staff', name: 'John Staff', role: 'STAFF' },
        token: 'mock-jwt-token-staff',
      }, {
        headers: {
          'Set-Cookie': [
            'auth_token=mock-jwt-token-staff; Path=/; HttpOnly; SameSite=Strict',
            'user_role=STAFF; Path=/; SameSite=Strict'
          ].join(', '),
        }
      });
    }

    return new HttpResponse(null, { status: 401, statusText: 'Invalid credentials' });
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': [
          'auth_token=; Path=/; HttpOnly; Max-Age=0',
          'user_role=; Path=/; Max-Age=0'
        ].join(', '),
      }
    });
  }),
];
