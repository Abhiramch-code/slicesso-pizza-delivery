# Slices - API Documentation

## Base URL
`http://localhost:5001/api`

## Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <accessToken>
```

## Auth Endpoints

### POST /auth/register
Register a new user.
**Body**: `{ name, email, password }`
**Response**: `{ success, accessToken, refreshToken, user }`

### POST /auth/login
Login existing user.
**Body**: `{ email, password }`
**Response**: `{ success, accessToken, refreshToken, user }`

### POST /auth/logout
Logout (requires auth).
**Response**: `{ success, message }`

### POST /auth/refresh-token
Refresh expired access token.
**Body**: `{ refreshToken }`
**Response**: `{ success, accessToken, refreshToken }`

### POST /auth/verify-email
Verify email with token from email link.
**Body**: `{ token }`
**Response**: `{ success, message }`

### POST /auth/forgot-password
Request password reset email.
**Body**: `{ email }`
**Response**: `{ success, message }`

### POST /auth/reset-password
Reset password with token from email.
**Body**: `{ token, password }`
**Response**: `{ success, message }`

### GET /auth/me
Get current user profile (requires auth).
**Response**: `{ success, user }`

### PUT /auth/profile
Update user profile (requires auth).
**Body**: `{ name, phone, address: { street, city, state, zip } }`
**Response**: `{ success, user }`

---

## Order Endpoints

### GET /orders/pricing
Get pizza pricing configuration.
**Response**: `{ success, pricing }`

### POST /orders/calculate
Calculate total price for items.
**Body**: `{ items: [{ base, sauce, cheese, veggies, meat, quantity }] }`
**Response**: `{ success, items, totalAmount }`

### POST /orders/create-razorpay-order
Create Razorpay/Mock payment order (requires auth).
**Body**: `{ items: [{ base, sauce, cheese, veggies, meat, quantity }] }`
**Response**: `{ success, mockMode, razorpayOrder, items, totalAmount, key }`

### POST /orders/verify-payment
Verify payment and create order (requires auth).
**Body**: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, items, deliveryAddress, mockMode? }`
**Response**: `{ success, order, mockMode? }`

### GET /orders/my-orders
Get user's orders (requires auth).
**Response**: `{ success, orders }`

### GET /orders/:id
Get single order (requires auth, user must own order or be admin).
**Response**: `{ success, order }`

### GET /orders
Get all orders (requires auth, admin only).
**Query**: `{ status?, page?, limit? }`
**Response**: `{ success, orders, total, page, pages }`

### PUT /orders/:id/status
Update order status (requires auth, admin only).
**Body**: `{ status }` (ORDER_RECEIVED | IN_KITCHEN | SENT_TO_DELIVERY | DELIVERED)
**Response**: `{ success, order }`

---

## Inventory Endpoints (All require auth + admin role)

### GET /inventory
Get all inventory items.
**Query**: `{ category? }`
**Response**: `{ success, items, stats: { total, lowStock, totalValue } }`

### POST /inventory
Create inventory item.
**Body**: `{ name, category, quantity, unit, threshold, unitCost }`
**Response**: `{ success, item }`

### GET /inventory/:id
Get single inventory item.

### PUT /inventory/:id
Update inventory item.
**Body**: `{ name?, category?, quantity?, unit?, threshold?, unitCost? }`

### DELETE /inventory/:id
Delete inventory item.

### PUT /inventory/:id/restock
Restock inventory item.
**Body**: `{ quantity, note? }`

### GET /inventory/analytics
Get inventory analytics.
**Response**: `{ success, analytics: { totalItems, lowStockCount, criticalCount, totalInventoryValue, categoryBreakdown, lowStockItems } }`

### GET /inventory/transactions
Get inventory transaction history.
**Query**: `{ page?, limit? }`

---

## Notification Endpoints (All require auth)

### GET /notifications
Get user notifications.
**Response**: `{ success, notifications, unreadCount }`

### PUT /notifications/:id/read
Mark notification as read.

### PUT /notifications/mark-all-read
Mark all notifications as read.

---

## Pricing Configuration
```
Base:     Thin Crust(200), Thick Crust(250), Cheese Burst(350), Whole Wheat(220), Stuffed Crust(300)
Sauce:    Tomato Basil(30), BBQ(40), Pesto(50), Garlic Parmesan(45), Arrabbiata(35)
Cheese:   Mozzarella(60), Cheddar(70), Parmesan(80), Mixed(90)
Veggie:   Onion(20), Capsicum(20), Tomato(15), Mushroom(30), Corn(20), Olive(35), Jalapeno(25), Paneer(50)
Meat:     Chicken(60), Pepperoni(70), Sausage(65), Bacon(75)
```

## Order Status Flow
ORDER_RECEIVED -> IN_KITCHEN -> SENT_TO_DELIVERY -> DELIVERED