# Budget Buddy - Complete Setup & Testing Guide

## ✅ What's Changed

1. **Original HomePage restored** - You now see the "START BUDGET" screen first
2. **Complete login flow** - Sign up form → Plaid connection → Dashboard
3. **Real transaction spending** - Dashboard now calculates spending from Plaid transactions
4. **Backend in frontend folder** - Everything runs from `frontend/` directory
5. **Better debugging** - Console logs show what's happening at each step

## 🚀 Quick Start (3 Steps)

### Step 1: Install & Configure

```bash
cd frontend
npm install

# Edit .env file with your credentials:
nano .env
```

Add these to `.env`:
```env
PLAID_CLIENT_ID=your_plaid_client_id_from_dashboard
PLAID_SECRET=your_plaid_secret_from_dashboard
PLAID_ENV=sandbox

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### Step 2: Start Backend

```bash
npm run server
# Output: 🚀 Backend server running on http://localhost:8000
```

### Step 3: Start Frontend (in another terminal)

```bash
npm run dev
# Output: ➜  Local:   http://localhost:5173/
```

Then open http://localhost:5173 in your browser.

---

## 🎮 Login Flow (Step by Step)

### 1. Start Screen
- You see the **"BUDGET BUDDY"** title with a starfield
- Click **"START BUDGET"** button

### 2. Login / Sign Up
- **Sign Up:** Fill in username, password, confirm password, monthly budget
- Click **"NEXT: LINK BANK"**

### 3. Plaid Bank Connection
- Click **"CONNECT BANK ACCOUNT"**
- Use Plaid sandbox credentials:
  - **Username:** `user_good`
  - **Password:** `pass_good`
  - **Code:** `1111`
- Select your bank (any option works in sandbox)
- Backend creates your user in Supabase `users` table
- Transactions are fetched and displayed

### 4. Dashboard
- You see your transactions list
- **"Spent This Month"** shows calculated amount from your real Plaid transactions
- Budget and spending bar updates with real data

---

## 🔧 Understanding the Flow

### Files Working Together

```
HomePage.tsx (start screen with "START BUDGET" button)
    ↓
App.tsx (manages state, routes to LoginPage)
    ↓
LoginPage.tsx (signup form + Plaid connection)
    ↓
PlaidButton.jsx (handles Plaid Link, calls backend)
    ↓
server.js (backend - exchanges token, creates user, fetches transactions)
    ↓
supabaseClient.js (stores data in Supabase)
    ↓
GameDashboard.tsx (displays transactions + spending)
```

### Data Flow

```
1. User signs up & clicks "CONNECT BANK"
   ↓
2. PlaidButton opens Plaid Link UI
   ↓
3. User authenticates with sandbox bank
   ↓
4. Backend exchanges Plaid token for access_token
   ↓
5. Backend creates user in USERS table
   ↓
6. Backend stores Plaid connection in PLAID_ITEMS table
   ↓
7. Backend fetches transactions from Plaid API
   ↓
8. Frontend receives transactions array
   ↓
9. GameDashboard calculates total spending: $$$
   ↓
10. "Spent This Month" displays real number (not placeholder)
```

---

## 📊 Transaction Structure

When transactions come from Plaid, they look like:

```javascript
{
  transaction_id: "abc123",
  name: "STARBUCKS COFFEE #1234",
  amount: 5.50,
  date: "2026-04-30",
  personal_finance_category: {
    primary: "FOOD_AND_DRINK"
  }
}
```

The dashboard sums up all amounts > 0 to calculate spending.

---

## 🐛 Debugging Tips

### Check console output (browser DevTools F12)

**Expected logs when you log in:**
```
📱 PlaidButton: Starting Plaid Link...
✅ User created: your.email@example.com
🔑 Setting access token, user_id: abc123
📊 Transactions loaded from backend: 25 items
📊 Sample transaction: {amount: 5.50, ...}
✅ Calling onLoginComplete with 25 transactions
```

**In Dashboard:**
```
💰 Dashboard: Calculated spending from 25 transactions: 543.50
```

### If "Spent" shows placeholder (1550)

**Causes:**
1. ❌ Backend not running → Check terminal for `npm run server`
2. ❌ No transactions fetched → Check Plaid connection succeeded
3. ❌ Transactions array is empty → Check console for errors

**Fix:**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls to `http://localhost:8000`

### If "LOADING PLAID..." doesn't progress

**Causes:**
1. ❌ Backend not running on port 8000
2. ❌ Missing .env file or wrong credentials
3. ❌ `create_link_token` endpoint failing

**Fix:**
- Verify `npm run server` is running
- Check backend console for "Link token created" message
- Verify PLAID_CLIENT_ID and PLAID_SECRET in .env

### If user not created in Supabase

**Causes:**
1. ❌ `users` table doesn't exist
2. ❌ RLS policy blocking insert
3. ❌ SUPABASE_URL or SUPABASE_KEY wrong in .env

**Fix:**
- Go to Supabase dashboard
- Create `users` table if it doesn't exist:
  ```sql
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- Disable RLS on `users` table (or set proper policies)
- Check backend console for "New user created" message

---

## 📋 Plaid Sandbox Test Data

| Field | Value |
|-------|-------|
| Username | `user_good` |
| Password | `pass_good` |
| Code | `1111` |
| Bank Name | Any (choose "Chase" or "Wells Fargo") |
| Account | Checking or Savings |

After "connecting," Plaid returns ~5-10 fake transactions.

---

## 🎯 What Happens After Login

### You should see:

1. ✅ Dashboard loads
2. ✅ Your username in top left (from email prefix)
3. ✅ Transaction list below
4. ✅ "Spent This Month" shows real number (e.g., "$543.50")
5. ✅ Budget bar shows percentage used
6. ✅ Remaining budget calculated correctly

### If spending shows wrong number:

- Open DevTools → Application tab
- Check if `userTransactions` state has items
- Look for calculation logic: `spent = sum of all transaction.amounts > 0`

---

## 🔄 API Endpoints (Backend)

| Endpoint | Method | Purpose | Called By |
|----------|--------|---------|-----------|
| `/api/create_link_token` | POST | Initialize Plaid Link UI | PlaidButton on mount |
| `/api/create_user` | POST | Create/get user by email | PlaidButton after Plaid success |
| `/api/set_access_token` | POST | Exchange Plaid token for access_token | PlaidButton after Plaid success |
| `/api/transactions` | GET | Fetch user's transactions from Plaid | PlaidButton after token exchange |
| `/api/health` | GET | Check backend is running | Manual testing |

---

## 🗄️ Database Tables Needed

You must create these in Supabase:

```sql
-- Users table
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

---

## ✨ Key Points

| Question | Answer |
|----------|--------|
| How do transactions show real spending? | GameDashboard sums `tx.amount` from the transactions array passed from App.tsx |
| Where do transactions come from? | Plaid API via backend `/api/transactions` endpoint |
| When does spending calculate? | In GameDashboard render - checks if `transactions.length > 0` |
| What if no transactions? | Falls back to placeholder `1550` |
| Can I change the placeholder? | Yes, edit GameDashboard.tsx line `let spent = 1550` |
| How to test without real bank? | Use Plaid sandbox with `user_good` / `pass_good` |
| Can I see what's stored in Supabase? | Yes, check Supabase dashboard → your project → check `users`, `plaid_items` tables |

---

## 🎓 Troubleshooting Checklist

- [ ] `npm install` completed successfully
- [ ] `.env` file created with Plaid credentials
- [ ] `.env` file created with Supabase credentials  
- [ ] `npm run server` running (backend on port 8000)
- [ ] `npm run dev` running (frontend on port 5173)
- [ ] Supabase `users` table exists
- [ ] RLS disabled on Supabase tables (or policies set)
- [ ] Can open http://localhost:5173
- [ ] See HomePage with "START BUDGET" button
- [ ] Can click and see LoginPage signup form
- [ ] Can fill form and click "NEXT: LINK BANK"
- [ ] Plaid Link button appears and isn't stuck on "LOADING PLAID..."
- [ ] Can authenticate with Plaid sandbox
- [ ] User appears in Supabase `users` table
- [ ] Dashboard loads after login
- [ ] Transactions list shows
- [ ] "Spent This Month" shows real number (not 1550)

---

## 🆘 Still Having Issues?

Check these in order:

1. **Terminal logs** - Both backend & frontend must show no errors
2. **Browser console** (F12) - Check for JavaScript errors
3. **Network tab** (F12) - Check API calls to `http://localhost:8000`
4. **Supabase dashboard** - Verify tables exist and have data
5. **Backend `.env` file** - Verify all keys are correct
6. **Plaid dashboard** - Verify Client ID & Secret match `.env`

Need more help? Add console logs to:
- PlaidButton.jsx (after transactions fetch)
- GameDashboard.tsx (already added detailed logs)
- App.tsx (already added detailed logs)
