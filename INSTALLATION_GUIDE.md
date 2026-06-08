# Slices - Installation Guide

## Prerequisites
- Node.js 18+ (recommend 20+)
- npm 9+
- MongoDB 6+ (running locally or remote connection)

## Step-by-Step Installation

### 1. Clone the repository
```bash
git clone <repo-url>
cd pizza-delivery-app
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp ../.env.example .env
# Edit .env with your MongoDB URI, JWT secrets, etc.
# Important: Do NOT modify .env placeholder values unless you have real keys

# Start MongoDB (if running locally)
# Ensure mongod is running on default port 27017

# Seed the database
npm run seed
# This creates: admin user, test user, and all inventory items

# Start the backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# App runs on http://localhost:5173
```

### 4. Verify Installation
- Open http://localhost:5173
- Register a new account or login with test account:
  - User: test@slicesso.com / test123
  - Admin: admin@slicesso.com / admin123

## Production Build
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or `mongo`
- Check MONGODB_URI in backend/.env
- Default: `mongodb://localhost:27017/slicesso`

### Port Conflicts
- Backend default: 5000 (change via PORT in .env)
- Frontend default: 5173 (Vite auto-selects if conflict)

### Email Not Working
- SMTP is configured for Mailtrap sandbox by default
- Emails won't be sent to real addresses in development
- This is intentional - email failure doesn't crash the app

### Payment Testing
- Mock mode is active by default (placeholder Razorpay keys)
- No real payments needed for development
- To enable real Razorpay test mode: replace RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env