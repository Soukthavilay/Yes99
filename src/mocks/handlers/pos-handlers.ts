import { http, HttpResponse } from 'msw';

// ຕົວຢ່າງ Mock Data ສໍາລັບ POS
const mockTables = [
  { id: '1', name: 'Table 01', status: 'available', zone: 'A' },
  { id: '2', name: 'Table 02', status: 'occupied', zone: 'A' },
  { id: '3', name: 'Table 03', status: 'available', zone: 'B' },
];

export const posHandlers = [
  // Get all tables
  http.get('/api/pos/tables', () => {
    return HttpResponse.json(mockTables);
  }),

  // Add order to table
  http.post('/api/pos/order', async ({ request }) => {
    const newOrder = await request.json();
    console.log('Mocked Order Received:', newOrder);
    return HttpResponse.json({ success: true, orderId: 'ORD-' + Math.random().toString(36).substr(2, 9) }, { status: 201 });
  }),
];
