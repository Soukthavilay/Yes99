# API Integration Test Guide

Manual testing guide for all frontend API functions mapped from the backend (`qr-food-backend`).

> **Prerequisites**
> - Backend running at `http://localhost:8000`
> - Frontend running at `http://localhost:3000`
> - Owner account registered via `/api/v1/auth/register-owner`
> - `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` set in `.env.local`

---

## 1. Auth

### 1.1 Register Owner
- **Endpoint**: `POST /auth/register-owner`
- **Service**: `authService.registerOwner()`
- **Test**:
  1. Open Postman or use frontend registration flow
  2. Send `{ "email": "owner@test.com", "username": "owner", "password": "12345678", "full_name": "Test Owner" }`
  3. ✅ Expect `201` with user data
  4. ❌ Repeat same request → expect error (only one owner allowed)

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Service**: `authService.login()`
- **Hook**: `useAuth().login()`
- **Test**:
  1. Go to `/login`
  2. Enter email: `owner@test.com`, password: `12345678`
  3. ✅ Expect redirect to `/pos`
  4. ✅ Check cookies: `access_token` and `user_role` should be set
  5. ❌ Wrong credentials → expect error message "Invalid email or password"

### 1.3 Get Current User (token validation)
- **Endpoint**: `GET /users/me`
- **Service**: `userService.getCurrentUser()`
- **Hook**: `useAuth().fetchUser()` (auto-called on app load)
- **Test**:
  1. After login, refresh the page
  2. ✅ Should remain logged in (AuthProvider fetches `/users/me` on mount)
  3. ❌ Clear cookies → refresh → should redirect to `/login`

### 1.4 Refresh Token
- **Endpoint**: `POST /auth/refresh`
- **Service**: `authService.refreshToken()`
- **Test**:
  1. Wait for access token to expire (or manually expire it)
  2. Make any API request
  3. ✅ Axios interceptor should auto-refresh and retry the failed request
  4. ❌ If refresh also fails → should redirect to `/login`

### 1.5 Logout
- **Endpoint**: `POST /auth/logout`
- **Service**: `authService.logout()`
- **Hook**: `useAuth().logout()`
- **Test**:
  1. Click "Logout" button in sidebar
  2. ✅ Cookies cleared, redirected to `/login`
  3. ✅ Cannot access protected routes after logout

---

## 2. Users

### 2.1 Get All Users (paginated)
- **Endpoint**: `GET /users?page=1&paging=10&search=&sort_by=created_at&sort_order=desc`
- **Service**: `userService.getUsers(params)`
- **Hook**: `useUsers(params)`
- **Test**:
  1. Call with default params
  2. ✅ Returns `{ status: "success", data: [...], meta: { current_page, total_pages, ... } }`
  3. Test pagination: `page=2`
  4. Test search: `search=owner`

### 2.2 Create Employee
- **Endpoint**: `POST /users/employees`
- **Service**: `userService.createEmployee(data)`
- **Hook**: `useCreateEmployee()`
- **Test**:
  1. Login as owner
  2. Create employee: `{ "email": "waiter@test.com", "username": "waiter1", "role": "waiter" }`
  3. ✅ Returns `{ user: {...}, generated_password: "..." }` (auto-generated password)
  4. Create with explicit password: `{ ..., "password": "12345678" }`
  5. ✅ `generated_password` should be `null`
  6. ❌ Login as non-owner → expect `403 Forbidden`

### 2.3 Get User By ID
- **Endpoint**: `GET /users/:id`
- **Service**: `userService.getUserById(id)`
- **Hook**: `useUserById(id)`
- **Test**:
  1. Use a valid user ID from the list
  2. ✅ Returns user details
  3. ❌ Invalid UUID → expect `404`

### 2.4 Update User
- **Endpoint**: `PUT /users/:id`
- **Service**: `userService.updateUser(id, data)`
- **Hook**: `useUpdateUser()`
- **Test**:
  1. Update `full_name`: `{ "full_name": "New Name" }`
  2. ✅ Returns updated user
  3. Test password change: `{ "password": "newpassword" }`

### 2.5 Delete User
- **Endpoint**: `DELETE /users/:id`
- **Service**: `userService.deleteUser(id)`
- **Hook**: `useDeleteUser()`
- **Test**:
  1. Delete an employee
  2. ✅ Returns `{ status: "success" }`
  3. ❌ Deleted user should not be able to login

---

## 3. Zones

### 3.1 Create Zone
- **Endpoint**: `POST /zones`
- **Service**: `zoneService.createZone(data)`
- **Hook**: `useCreateZone()`
- **Test**:
  1. Login as owner
  2. Create: `{ "name": "Indoor", "description": "Main hall" }`
  3. ✅ Returns zone with `id`, `is_active: true`
  4. ❌ Non-owner → `403`

### 3.2 Get All Zones (paginated)
- **Endpoint**: `GET /zones?page=1&paging=10`
- **Service**: `zoneService.getZones(params)`
- **Hook**: `useZones(params)`
- **Test**:
  1. ✅ Returns paginated zone list with `meta`
  2. Test filter: `is_active=true`
  3. Test search: `search=Indoor`
  4. Test sorting: `sort_by=name&sort_order=asc`

### 3.3 Get Zone By ID
- **Endpoint**: `GET /zones/:id`
- **Service**: `zoneService.getZoneById(id)`
- **Hook**: `useZoneById(id)`
- **Test**:
  1. ✅ Returns single zone
  2. ❌ Invalid ID → `404`

### 3.4 Update Zone
- **Endpoint**: `PUT /zones/:id`
- **Service**: `zoneService.updateZone(id, data)`
- **Hook**: `useUpdateZone()`
- **Test**:
  1. `{ "name": "Outdoor Terrace" }`
  2. ✅ Returns updated zone

### 3.5 Activate / Deactivate Zone
- **Endpoint**: `PATCH /zones/:id/activate` | `PATCH /zones/:id/deactivate`
- **Service**: `zoneService.activateZone(id)` | `zoneService.deactivateZone(id)`
- **Hook**: `useActivateZone()` | `useDeactivateZone()`
- **Test**:
  1. Deactivate a zone → ✅ `is_active: false`
  2. Activate it back → ✅ `is_active: true`

### 3.6 Delete Zone
- **Endpoint**: `DELETE /zones/:id`
- **Service**: `zoneService.deleteZone(id)`
- **Hook**: `useDeleteZone()`
- **Test**:
  1. ✅ Soft deletes (marks inactive)
  2. ❌ Non-owner → `403`

---

## 4. Tables

### 4.1 Create Table
- **Endpoint**: `POST /tables`
- **Service**: `tableService.createTable(data)`
- **Hook**: `useCreateTable()`
- **Test**:
  1. `{ "zone_id": "<zone-uuid>", "table_name": "VIP-1" }`
  2. ✅ Returns table with auto-incremented `table_number`

### 4.2 Create Bulk Tables
- **Endpoint**: `POST /tables/bulk`
- **Service**: `tableService.createBulkTables(data)`
- **Hook**: `useCreateBulkTables()`
- **Test**:
  1. `{ "zone_id": "<zone-uuid>", "count": 5 }`
  2. ✅ Returns array of 5 tables

### 4.3 Get All Tables (paginated + filtered)
- **Endpoint**: `GET /tables?page=1&paging=10&zone_id=...&status=available&is_active=true`
- **Service**: `tableService.getTables(params)`
- **Hook**: `useTables(params)`
- **Test**:
  1. ✅ Returns paginated list
  2. Filter by `zone_id` → only tables from that zone
  3. Filter by `status=available`
  4. Filter by `is_active=true`

### 4.4 Get Table By ID
- **Endpoint**: `GET /tables/:id`
- **Service**: `tableService.getTableById(id)`
- **Hook**: `useTableById(id)`
- **Test**: ✅ Returns single table with all fields

### 4.5 Update Table
- **Endpoint**: `PUT /tables/:id`
- **Service**: `tableService.updateTable(id, data)`
- **Hook**: `useUpdateTable()`
- **Test**: `{ "table_name": "Table Premium" }` → ✅ updated

### 4.6 Update Table Status
- **Endpoint**: `PATCH /tables/:id/status`
- **Service**: `tableService.updateTableStatus(id, data)`
- **Hook**: `useUpdateTableStatus()`
- **Test**:
  1. `{ "status": "busy" }` → ✅ status changes
  2. `{ "status": "available" }` → ✅ status changes back
  3. Test all statuses: `available`, `busy`, `reserved`, `maintenance`

### 4.7 Generate QR Code
- **Endpoint**: `POST /tables/:id/generate-qr`
- **Service**: `tableService.generateQR(id)`
- **Hook**: `useGenerateQR()`
- **Test**:
  1. ✅ Returns table with `qr_code` field populated
  2. Call again → ✅ generates new QR code

### 4.8 Activate / Deactivate Table
- **Endpoint**: `PATCH /tables/:id/activate` | `PATCH /tables/:id/deactivate`
- **Service**: `tableService.activateTable(id)` | `tableService.deactivateTable(id)`
- **Hook**: `useActivateTable()` | `useDeactivateTable()`
- **Test**: Same pattern as zones

### 4.9 Delete Table
- **Endpoint**: `DELETE /tables/:id`
- **Service**: `tableService.deleteTable(id)`
- **Hook**: `useDeleteTable()`
- **Test**: ✅ Soft delete, owner only

---

## 5. Menu Categories

### 5.1 Create Category
- **Endpoint**: `POST /categories`
- **Service**: `categoryService.createCategory(data)`
- **Hook**: `useCreateCategory()`
- **Test**:
  1. `{ "name": "Appetizers", "description": "Starters" }`
  2. ✅ Returns category with `id`
  3. ❌ Non-owner → `403`

### 5.2 Get All Categories (paginated)
- **Endpoint**: `GET /categories?page=1&paging=10`
- **Service**: `categoryService.getCategories(params)`
- **Hook**: `useCategories(params)`
- **Test**:
  1. ✅ Paginated response
  2. Filter: `is_active=true`
  3. Search: `search=Appetizer`

### 5.3 Get Active Categories (public)
- **Endpoint**: `GET /categories/active`
- **Service**: `categoryService.getActiveCategories()`
- **Hook**: `useActiveCategories()`
- **Test**:
  1. ✅ Returns only active categories (no auth required by frontend, but backend requires owner/waiter)
  2. ✅ Sorted by name ascending

### 5.4 Get Category By ID
- **Endpoint**: `GET /categories/:id`
- **Service**: `categoryService.getCategoryById(id)`
- **Hook**: `useCategoryById(id)`
- **Test**: ✅ Returns single category

### 5.5 Update Category
- **Endpoint**: `PUT /categories/:id`
- **Service**: `categoryService.updateCategory(id, data)`
- **Hook**: `useUpdateCategory()`
- **Test**: `{ "name": "Main Course" }` → ✅ updated

### 5.6 Delete Category
- **Endpoint**: `DELETE /categories/:id`
- **Service**: `categoryService.deleteCategory(id)`
- **Hook**: `useDeleteCategory()`
- **Test**: ✅ Soft delete

---

## 6. Menu Items

### 6.1 Create Menu Item
- **Endpoint**: `POST /menu-items`
- **Service**: `menuItemService.createMenuItem(data)`
- **Hook**: `useCreateMenuItem()`
- **Test**:
  1. Create food item:
     ```json
     {
       "name": "Pad Thai",
       "description": "Classic Thai noodles",
       "price": 45000,
       "category_id": "<category-uuid>",
       "item_type": "food",
       "preparation_time": 15
     }
     ```
  2. ✅ Returns menu item with `id`
  3. Create beverage: `{ ..., "item_type": "beverage" }`

### 6.2 Get All Menu Items (paginated + filtered)
- **Endpoint**: `GET /menu-items?page=1&paging=10`
- **Service**: `menuItemService.getMenuItems(params)`
- **Hook**: `useMenuItems(params)`
- **Test**:
  1. ✅ Paginated response
  2. Filter: `category_id=<uuid>`, `item_type=food`, `is_active=true`
  3. Search: `search=Pad`

### 6.3 Get Public Menu (no auth required)
- **Endpoint**: `GET /menu-items/public?page=1&paging=50`
- **Service**: `menuItemService.getPublicMenu(params)`
- **Hook**: `usePublicMenu(params)`
- **Test**:
  1. ✅ Returns only active items
  2. ✅ Accessible without auth token
  3. Filter: `category_id`, `item_type`

### 6.4 Get Menu Item By ID
- **Endpoint**: `GET /menu-items/:id`
- **Service**: `menuItemService.getMenuItemById(id)`
- **Hook**: `useMenuItemById(id)`
- **Test**: ✅ Returns full item details

### 6.5 Update Menu Item
- **Endpoint**: `PUT /menu-items/:id`
- **Service**: `menuItemService.updateMenuItem(id, data)`
- **Hook**: `useUpdateMenuItem()`
- **Test**: `{ "price": 50000 }` → ✅ price updated

### 6.6 Activate / Deactivate Menu Item
- **Endpoint**: `PATCH /menu-items/:id/activate` | `PATCH /menu-items/:id/deactivate`
- **Service**: `menuItemService.activateMenuItem(id)` | `menuItemService.deactivateMenuItem(id)`
- **Hook**: `useActivateMenuItem()` | `useDeactivateMenuItem()`
- **Test**: ✅ Toggles `is_active`

### 6.7 Update Status (bulk toggle)
- **Endpoint**: `PATCH /menu-items/:id/status`
- **Service**: `menuItemService.updateMenuItemStatus(id, data)`
- **Test**: `{ "is_active": false }` → ✅

### 6.8 Upload Image
- **Endpoint**: `PATCH /menu-items/:id/image`
- **Service**: `menuItemService.uploadMenuItemImage(id, data)`
- **Hook**: `useUploadMenuItemImage()`
- **Test**: `{ "image_url": "https://example.com/img.jpg" }` → ✅ `image_url` updated

### 6.9 Delete Menu Item
- **Endpoint**: `DELETE /menu-items/:id`
- **Service**: `menuItemService.deleteMenuItem(id)`
- **Hook**: `useDeleteMenuItem()`
- **Test**: ✅ Soft delete

---

## 7. Order Items

### 7.1 Add Order Items (bulk)
- **Endpoint**: `POST /order-items`
- **Service**: `orderItemService.addOrderItems(data)`
- **Hook**: `useAddOrderItems()`
- **Test**:
  1. As owner/waiter (authenticated):
     ```json
     {
       "table_id": "<table-uuid>",
       "device_name": "POS-1",
       "items": [
         { "menu_item_id": "<item-uuid>", "quantity": 2 },
         { "menu_item_id": "<item-uuid>", "quantity": 1, "special_instructions": "No spice", "is_priority": true }
       ]
     }
     ```
  2. ✅ Returns array of created order items with `order_by: "owner"` or `"employee"`
  3. As guest (no auth):
     - Same payload → ✅ `order_by: "guest"`, `user: null`
  4. ✅ Each item has `unit_price`, `total_price` calculated

### 7.2 Get All Order Items (paginated)
- **Endpoint**: `GET /order-items?page=1&paging=20&table_id=...&status=pending`
- **Service**: `orderItemService.getOrderItems(params)`
- **Hook**: `useOrderItems(params)`
- **Test**:
  1. ✅ Returns paginated list
  2. Filter: `table_id=<uuid>`
  3. Filter: `status=pending` (values: `pending`, `preparing`, `ready`, `served`, `cancelled`)

### 7.3 Get Order Items By Table
- **Endpoint**: `GET /order-items/table/:tableId?status=...`
- **Service**: `orderItemService.getOrderItemsByTable(tableId, status)`
- **Hook**: `useOrderItemsByTable(tableId, status)`
- **Test**:
  1. ✅ Returns all items for a table
  2. Optional filter by status

### 7.4 Get Order Item By ID
- **Endpoint**: `GET /order-items/:id`
- **Service**: `orderItemService.getOrderItemById(id)`
- **Hook**: `useOrderItemById(id)`
- **Test**: ✅ Returns single item with nested `menu_item` and `user`

### 7.5 Update Order Item
- **Endpoint**: `PUT /order-items/:id`
- **Service**: `orderItemService.updateOrderItem(id, data)`
- **Hook**: `useUpdateOrderItem()`
- **Test**:
  1. Update status: `{ "status": "preparing" }` → ✅
  2. Update quantity: `{ "quantity": 3 }` → ✅
  3. ❌ Cannot update cancelled items

### 7.6 Cancel Order Item
- **Endpoint**: `PATCH /order-items/:id/cancel`
- **Service**: `orderItemService.cancelOrderItem(id, data)`
- **Hook**: `useCancelOrderItem()`
- **Test**:
  1. `{ "cancellation_reason": "Customer changed mind" }` → ✅ status changes to `cancelled`
  2. ❌ Cannot cancel already served items
  3. ✅ `cancelled_at` timestamp set

### 7.7 Delete Order Item
- **Endpoint**: `DELETE /order-items/:id`
- **Service**: `orderItemService.deleteOrderItem(id)`
- **Hook**: `useDeleteOrderItem()`
- **Test**:
  1. ✅ Only works for `pending` status items
  2. ❌ Non-pending items → error

---

## 8. Bills

### 8.1 Create Bill
- **Endpoint**: `POST /tables/:tableId/bills`
- **Service**: `billService.createBill(tableId, data)`
- **Hook**: `useCreateBill()`
- **Test**:
  1. Table must have an open order with items
  2. Create:
     ```json
     {
       "payment_type": "cash",
       "tax_percentage": 10,
       "service_charge_percentage": 5,
       "discount_type": "percentage",
       "discount_value": 10
     }
     ```
  3. ✅ Returns bill with calculated `subtotal`, `tax_amount`, `service_charge`, `discount_amount`, `total_amount`
  4. ✅ `payment_status: "unpaid"`, `bill_number` auto-generated
  5. Test `discount_type: "fixed"` with `discount_value: 5000`
  6. Test `payment_type: "bank"`

### 8.2 Get Bills By Table
- **Endpoint**: `GET /tables/:tableId/bills`
- **Service**: `billService.getBillsByTable(tableId)`
- **Hook**: `useBillsByTable(tableId)`
- **Test**: ✅ Returns array of bills for the table

### 8.3 Update Bill
- **Endpoint**: `PUT /tables/:tableId/bills/:billId`
- **Service**: `billService.updateBill(tableId, billId, data)`
- **Hook**: `useUpdateBill()`
- **Test**:
  1. `{ "payment_type": "bank" }` → ✅ updated
  2. `{ "tax_percentage": 7 }` → ✅ amounts recalculated

### 8.4 Update Bill Status
- **Endpoint**: `PATCH /tables/:tableId/bills/:billId/status`
- **Service**: `billService.updateBillStatus(tableId, billId, data)`
- **Hook**: `useUpdateBillStatus()`
- **Test**:
  1. Partial payment: `{ "payment_status": "partial", "paid_amount": 50000 }` → ✅
  2. ✅ `remaining_amount` updated correctly
  3. Full payment: `{ "payment_status": "paid", "paid_amount": 100000 }` → ✅

### 8.5 Mark Bill Complete
- **Endpoint**: `POST /tables/:tableId/bills/:billId/complete`
- **Service**: `billService.markBillComplete(tableId, billId)`
- **Hook**: `useMarkBillComplete()`
- **Test**:
  1. ✅ Sets `payment_status: "paid"` with full amount
  2. ✅ Table status may change after bill completion

### 8.6 Delete Bill
- **Endpoint**: `DELETE /tables/:tableId/bills/:billId`
- **Service**: `billService.deleteBill(tableId, billId)`
- **Hook**: `useDeleteBill()`
- **Test**:
  1. ✅ Only non-paid bills can be deleted
  2. ❌ Paid bill → error

---

## 9. Middleware & RBAC

### 9.1 Route Protection
- **File**: `src/middleware.ts`
- **Test**:
  1. Not logged in → visit `/pos` → ✅ redirected to `/login`
  2. Not logged in → visit `/login` → ✅ allowed
  3. Not logged in → visit `/customer/order/123` → ✅ allowed (public)

### 9.2 Role-Based Access
- **Test matrix**:

| Route | owner | waiter | chef | bartender | cashier |
|-------|-------|--------|------|-----------|---------|
| `/pos` | ✅ | ✅ | ❌ | ❌ | ✅ |
| `/kitchen` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/inventory` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/admin` | ✅ | ❌ | ❌ | ❌ | ❌ |

### 9.3 Sidebar Menu Filtering
- **File**: `src/components/dashboard-layout.tsx`
- **Test**: Login as different roles → sidebar menu should only show allowed items

---

## 10. Helpers

### 10.1 Format Helpers (`src/lib/helpers/format.ts`)
```ts
import { formatCurrency, formatDate, formatDateTime, formatRelativeTime } from '@/lib/helpers/format';

formatCurrency(45000)          // "LAK 45,000"
formatDate('2026-02-14')       // "14/02/2026"
formatDateTime('2026-02-14T13:00:00') // "14/02/2026, 13:00"
formatRelativeTime(new Date()) // "just now"
```

### 10.2 Status Helpers (`src/lib/helpers/status.ts`)
```ts
import { getOrderItemStatus, getTableStatus, getPaymentStatus } from '@/lib/helpers/status';

getOrderItemStatus('pending')   // { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" }
getTableStatus('available')     // { label: "Available", color: "bg-green-500/20 text-green-400" }
getPaymentStatus('paid')        // { label: "Paid", color: "bg-green-500/20 text-green-400" }
```

### 10.3 Role Helpers (`src/lib/helpers/role.ts`)
```ts
import { getRoleLabel, getRoleColor, canAccessRoute } from '@/lib/helpers/role';

getRoleLabel('owner')           // "Owner"
getRoleColor('chef')            // "bg-orange-500/20 text-orange-400"
canAccessRoute('waiter', '/pos') // true
canAccessRoute('chef', '/pos')   // false
```

---

## Quick Smoke Test Sequence

Run these steps in order to verify the full flow works end-to-end:

1. **Register owner** → `POST /auth/register-owner`
2. **Login** → go to `/login`, enter credentials
3. **Create zone** → "Indoor"
4. **Create bulk tables** → 5 tables in Indoor zone
5. **Create category** → "Main Course"
6. **Create menu item** → "Pad Thai" in Main Course, price 45000
7. **Place order** → add 2x Pad Thai to Table 1
8. **Update order status** → change to "preparing" → "ready" → "served"
9. **Create bill** → for Table 1, cash, 10% tax
10. **Mark bill complete** → payment done
11. **Create employee** → waiter role
12. **Login as waiter** → verify limited menu access
13. **Logout** → verify redirect to login

✅ If all steps pass, the API integration is fully functional.
