# Budget Buddy - Setup Guide

## 🚀 Quick Start

This frontend now has **everything you need** - the backend server is included!

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Copy the example and fill in your credentials:

```bash
cat .env
```

You need to add:
- **Plaid credentials** from https://dashboard.plaid.com
- **Supabase keys** from https://supabase.com

```env
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_secret_here
PLAID_ENV=sandbox
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
```

### Step 3: Start the Backend + Frontend Together

```bash
npm run dev:all
```

This will:
- ✅ Start the backend server on `http://localhost:8000`
- ✅ Start the frontend on `http://localhost:5173` (or similar)

**OR run them separately:**

Terminal 1 - Backend:
```bash
npm run server
# Server runs on http://localhost:8000
```

Terminal 2 - Frontend:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Login Flow

1. **Click "START BUDGET"** on the home page
2. **Choose "Sign Up"** → Fill out username, password, monthly budget
3. **Click "NEXT: LINK BANK"**
4. **Connect your bank** via Plaid (uses sandbox credentials)
5. **Dashboard opens** with your transactions & spending

## 🔧 How It Works

### Authentication Flow

```
User fills form
    ↓
Creates account in USERS table
    ↓
Connects to bank via Plaid
    ↓
Backend creates PLAID_ITEMS entry
    ↓
Transactions fetched from Plaid
    ↓
Dashboard shows with real data
```

### Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/create_link_token` | POST | Initialize Plaid Link UI |
| `/api/create_user` | POST | Create/get user by email |
| `/api/set_access_token` | POST | Exchange Plaid token for access token |
| `/api/transactions` | GET | Fetch user's transactions |
| `/api/health` | GET | Check if backend is running |

### Key Files

- `server.js` - Express backend handling Plaid + Supabase
- `App.tsx` - Main app, manages login/dashboard state
- `LoginPage.tsx` - Complete login form with 2-step signup
- `PlaidButton.jsx` - Plaid Link integration
- `databaseService.ts` - Supabase helper functions

## 📋 Plaid Sandbox Test Credentials

Use these to test without real bank accounts:

- **Username**: `user_good`
- **Password**: `pass_good`
- **Code**: `1111`

## ❓ Troubleshooting

### "LOADING PLAID..." stuck on button
- ❌ Backend not running → Run `npm run server`
- ❌ `.env` file missing credentials → Add PLAID_CLIENT_ID and PLAID_SECRET
- ❌ Wrong Plaid environment → Ensure PLAID_ENV=sandbox

### "Connection failed" in Plaid
- Check that backend is running on port 8000
- Check that `.env` has correct Plaid credentials

### "Failed to create user"
- Check that Supabase URL and key are correct in `.env`
- Make sure `users` table exists in Supabase
- Disable RLS on `users` table or set proper policies

### "No transactions loaded"
- Make sure you completed the Plaid login flow
- Backend should show `✅ Found X transactions` in console

## 📚 Database Schema

You need these tables in Supabase:

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Plaid connections
CREATE TABLE plaid_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  plaid_access_token VARCHAR,
  plaid_item_id VARCHAR,
  institution_name VARCHAR,
  status VARCHAR DEFAULT 'connected',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plaid_transaction_id VARCHAR,
  user_id UUID REFERENCES users(id),
  amount DECIMAL,
  description VARCHAR,
  date DATE,
  category VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎮 Next Features to Build

After core login works:
- [ ] Budget tracking & goals
- [ ] Points/rewards system
- [ ] Learning streaks
- [ ] Leaderboards
- [ ] User profile settings
