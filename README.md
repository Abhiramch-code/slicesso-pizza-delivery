# Slices - Pizza Delivery Platform

## Overview
Slices is a full-stack pizza delivery platform with real-time order tracking, dynamic pizza builder, inventory management, and Razorpay payment integration.

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS 4, Redux Toolkit, React Router, Socket.IO Client, Axios
- **Backend**: Express 5, MongoDB (Mongoose), Socket.IO, Node-Cron, Nodemailer, Razorpay, JWT Auth
- **Database**: MongoDB with Mongoose ODM

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or remote URI
- Razorpay test keys (optional - mock mode available)

### Backend Setup
```bash
cd backend
npm install
# Configure .env (see .env.example)
npm run seed    # Seed database with inventory + admin user
npm run dev     # Start backend server
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Start frontend dev server
```

### Default Accounts
- **Admin**: admin@slicesso.com / admin123
- **User**: test@slicesso.com / test123

## Environment Variables
See `.env.example` for required variables. Key ones:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - JWT signing keys
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` - Razorpay keys (placeholder values enable mock mode)
- `SMTP_*` - Email configuration (Mailtrap for dev)
- `ADMIN_EMAIL` - Admin email for low stock alerts

## Payment Modes
- **Mock Mode**: When Razorpay keys are placeholder values, payments are automatically simulated
- **Live Mode**: When real Razorpay test keys are provided, the Razorpay checkout popup appears

## Project Structure
```
backend/
  config/          # DB + Razorpay config
  controllers/     # API controllers
  cron/            # Scheduled tasks
  middleware/       # Auth + error handling
  models/          # Mongoose schemas
  routes/          # Express routes
  utils/           # Token generation + email

frontend/
  src/
    components/    # Layout + common components
    pages/         # Auth, user, admin pages
    services/      # API layer + socket service
    store/         # Redux Toolkit slices
    index.css      # Tailwind + theme config
```

## API Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

- `GET /api/orders/pricing` - Get pricing config
- `POST /api/orders/create-razorpay-order` - Create payment order
- `POST /api/orders/verify-payment` - Verify + create order
- `GET /api/orders/my-orders` - User's orders
- `GET /api/orders/:id` - Single order
- `GET /api/orders` - All orders (admin)
- `PUT /api/orders/:id/status` - Update status (admin)

- `GET /api/inventory` - All inventory (admin)
- `POST /api/inventory` - Create item (admin)
- `PUT /api/inventory/:id` - Update item (admin)
- `DELETE /api/inventory/:id` - Delete item (admin)
- `PUT /api/inventory/:id/restock` - Restock (admin)
- `GET /api/inventory/analytics` - Analytics (admin)
- `GET /api/inventory/transactions` - Transactions (admin)

- `GET /api/notifications` - User notifications
- `PUT /api/notifications/:id/read` - Mark read
- `PUT /api/notifications/mark-all-read` - Mark all read