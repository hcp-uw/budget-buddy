# Complete Plaid + Supabase Integration Guide

## Overview

Your frontend now has a complete authentication and data flow:

1. **HomePage** → User enters email → Connects Plaid
2. **Plaid Connection** → Bank authentication and transaction fetching
3. **User Creation** → Auto-creates user in Supabase USERS table
4. **Data Storage** → Stores Plaid token and transactions in database
5. **Dashboard** → Displays transactions and calculates spending

## Architecture

### Frontend Flow

```
HomePage.tsx (Login Screen with Plaid)
    ↓
PlaidButton.jsx (Plaid Connect)
    ↓
Backend: /api/create_user (Creates user)
    ↓
Backend: /api/set_access_token (Stores Plaid item)
    ↓
Backend: /api/transactions (Fetches transactions)
    ↓
App.tsx Dashboard (Displays data)
```

### Files Modified/Created

**Frontend:**
- `components/HomePage-new.tsx` - New login screen with Plaid
- `components/databaseService.ts` - NEW: Database helper functions
- `PlaidButton.jsx` - UPDATED: Passes user data and email
- `App.tsx` - UPDATED: Handles new user data structure

**Backend:**
- `quickstart/node/server.js` - UPDATED: Added `/api/create_user` endpoint

## Database Schema Integration

### USERS Table
```
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  auth0_user_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### PLAID_ITEMS Table
```
CREATE TABLE plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plaid_access_token TEXT NOT NULL,
  plaid_item_id TEXT NOT NULL,
  institution_name TEXT,
  status TEXT DEFAULT 'connected',
  created_at TIMESTAMP DEFAULT now()
);
```

### TRANSACTIONS Table
```
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plaid_item_id UUID REFERENCES plaid_items(id),
  plaid_transaction_id TEXT,
  amount DECIMAL(10, 2),
  date DATE,
  merchant_name TEXT,
  category TEXT,
  pending BOOLEAN,
  created_at TIMESTAMP DEFAULT now()
);
```

## How It Works

### Step 1: User Enters Email
- User clicks "Get Started" on HomePage
- Sees login modal asking for email
- User enters their email address

### Step 2: Plaid Connection
- User clicks "Connect Bank Account"
- Plaid Link modal opens
- User selects their bank and authenticates
- Plaid returns public token

### Step 3: Backend Processing
```
PlaidButton.jsx sends to backend:
├─ POST /api/create_user
│  └─ Creates user in USERS table with email
│  └─ Returns user_id, email
│
└─ POST /api/set_access_token
   ├─ Exchanges public_token for access_token
   ├─ Stores Plaid item in PLAID_ITEMS table
   └─ Returns access_token, item_id
```

### Step 4: Transaction Fetching
- Backend calls `/api/transactions`
- Syncs all transactions to TRANSACTIONS table
- Returns latest transactions to frontend

### Step 5: Dashboard Data
- App.tsx receives:
  - `userId` - User's UUID from USERS table
  - `email` - User's email
  - `transactions` - Array of transaction objects
- Calculates monthly spending using `calculateMonthlySpent()`
- Displays in GameDashboard

## Key Functions

### `databaseService.ts`

```typescript
// Calculate monthly spending
calculateMonthlySpent(transactions: any[]): number

// Get all transactions for user
await getUserTransactions(userId: string)

// Get user's budgets
await getUserBudgets(userId: string)

// Get user's points/rewards
await getUserPoints(userId: string)
```

## Data Flow to Dashboard

```javascript
User Data:
{
  userId: "4daed9c1-65c8-4348-9951-7d0df4852110",
  email: "user@example.com",
  transactions: [
    {
      id: "tx_123",
      amount: 45.50,
      merchant_name: "Starbucks",
      date: "2025-04-30",
      category: "FOOD_AND_DRINK"
    },
    // ... more transactions
  ]
}

GameDashboard Props:
- coins: points earned
- xp: experience points
- initialBudget: monthly budget limit
- transactions: user's transactions (auto-calculates spent)
```

## Testing the Integration

### 1. Start Backend
```bash
cd quickstart/node
npm install
npm start  # Should run on http://localhost:8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev  # Should run on http://localhost:5173 or 3001
```

### 3. Test Flow
1. Click "Get Started"
2. Enter email (e.g., test@example.com)
3. Click "Connect Bank Account"
4. Go through Plaid login (use test credentials)
5. Should see transactions loaded
6. Click "Complete" or wait for redirect
7. Dashboard should show your transactions and spending

## Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Backend (.env in quickstart/node)
```
PLAID_CLIENT_ID=your_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox

SUPABASE_URL=your_url
SUPABASE_KEY=your_key  # Use service role key for backend
```

## Dashboard Integration

The GameDashboard now:

1. **Receives transactions** from authenticated user
2. **Calculates monthly spending** automatically
3. **Displays spent amount** based on real data
4. **Compares vs budget** to show overspending/savings

```javascript
// In App.tsx
useEffect(() => {
  if (userTransactions.length > 0) {
    const spent = calculateMonthlySpent(userTransactions);
    setTotalSpent(spent); // Updates dashboard
  }
}, [userTransactions]);
```

## Error Handling

### If user creation fails:
- Check email is valid
- Check USERS table exists
- Check RLS policies allow insertions

### If Plaid connection fails:
- Verify Plaid credentials in backend .env
- Check Plaid is running in correct environment (sandbox/production)
- Verify user has valid bank in selected country

### If transactions don't load:
- Check TRANSACTIONS table exists
- Verify Plaid access token is valid
- Check transaction sync cursor

## Next Steps

1. ✅ Complete initial setup above
2. ✅ Test email login + Plaid
3. ✅ Verify transactions appear in dashboard
4. ⏳ Add budget tracking logic
5. ⏳ Add points/rewards system
6. ⏳ Add leaderboard groups
7. ⏳ Add user profile/settings

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module './HomePage-new'" | Make sure HomePage-new.tsx was created correctly |
| Plaid connection hangs | Check backend is running and accessible |
| Transactions not showing | Check TRANSACTIONS table exists, RLS enabled correctly |
| Wrong user ID displayed | Verify /api/create_user returns correct user data |
| Amount spent is always 0 | Check transactions array is populated, calculateMonthlySpent works |

---

**Next Phase:** Set up budget tracking and points system based on spending patterns!
