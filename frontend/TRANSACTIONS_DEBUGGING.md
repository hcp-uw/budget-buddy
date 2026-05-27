# 🔍 Transactions Not Loading - Debugging Guide

## What We Fixed

The backend had a critical architecture issue:
- ❌ **OLD**: Used global variables for access tokens (shared across all users!)
- ✅ **NEW**: Retrieves each user's access token from the database

## Changes Made

### 1. **Backend `/api/transactions` Endpoint** (server.js)
- Now accepts `user_id` as a query parameter: `?user_id=<userId>`
- Looks up that user's access token from `plaid_items` table
- Properly associates transactions with the user

### 2. **Frontend PlaidConnectionPage.tsx**
- Now passes `user_id` when fetching transactions: `?user_id=${userId}`

### 3. **Fixed Column Names**
- Changed `plaid_access_token` → `access_token` (matches actual table schema)

## How to Test

### Step 1: Start Fresh
```bash
# Kill old server (Ctrl+C)
# Start fresh backend:
npm run server

# In another terminal, start frontend:
npm run dev
```

### Step 2: Go Through Full Flow
1. Click "START BUDGET"
2. Sign up with:
   - Username: `testuser1`
   - Password: `password123`
   - Budget: `2000`
3. Click "CONNECT BANK"
4. Use Plaid sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`
   - 2FA Code: `1111`
5. Select a bank and account to connect
6. **Should see**: "CONNECTING..." → "✅ Transactions fetched: X transactions"
7. **Go to Dashboard**: Should show "SPENT SO FAR: $XXX" (not $0)

## Backend Console - What to Look For

If it's **working**, you should see:
```
📊 Fetching transactions for user: <uuid>
✅ Found 15 transactions
✅ Transactions saved to Supabase
```

If it's **broken**, you might see:
```
❌ No Plaid item found for user: <uuid>
// This means: plaid_items table is empty for that user
// Possible cause: Plaid connection didn't save properly
```

Or:
```
No access token available
// This means: access_token field is NULL in database
```

## What Each Component Does

### PlaidConnectionPage.tsx
```typescript
1. Fetches link_token from backend
2. Opens Plaid Link UI (user connects bank)
3. Receives public_token from Plaid
4. Calls /api/set_access_token with:
   - public_token
   - user_id
   - institution_name
5. Calls /api/transactions?user_id=<userId>
6. Receives transactions array
7. Calls onPlaidConnected(transactions)
8. App.tsx sets userTransactions and goes to dashboard
```

### GameDashboard.tsx
```typescript
Receives transactions prop
Calculates: spent = sum of all transaction amounts
Shows: "SPENT SO FAR: $<spent>"
```

## If Transactions Still Show as $0

### Check 1: Are transactions being fetched?
- Open browser DevTools → Console
- Look for: "✅ Transactions fetched: X transactions"
- If you see 0, the issue is in Plaid fetch

### Check 2: Did user_id get passed?
- Backend console should show: "📊 Fetching transactions for user: <some-uuid>"
- If you don't see this, check PlaidConnectionPage is passing it

### Check 3: Is data in Supabase?
- Go to Supabase dashboard
- Check `plaid_items` table:
  - Should have a row for your user
  - `access_token` should NOT be NULL
- Check `transactions` table:
  - Should have rows with `user_id` matching your user
  - `amount` should have values

### Check 4: Is access token being stored?
- Look at backend console when you click "CONNECT BANK"
- Should see: "✅ Plaid item saved to Supabase"
- If you don't see this, check Supabase connection

## Sandbox Mode vs Production

Sandbox mode (what you're using) is **correct** and has:
- ✅ Sample transactions available
- ✅ Demo credentials that work
- ✅ No real money involved
- ✅ Perfect for testing

Don't use Plaid Production until you're ready to go live with real user data.

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Spent so far: $0" | Transactions not fetched | Check console for fetch errors |
| "No Plaid connection found" | user_id not found in plaid_items | Make sure Plaid connect completed |
| Plaid Link won't open | Link token not created | Check backend /api/create_link_token |
| "Invalid API key" | Supabase credentials wrong | Check .env file has correct keys |
| No institutions shown in Plaid | Wrong sandbox credentials | Use user_good/pass_good/1111 |

## Next Steps If Still Broken

1. **Restart everything**:
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `npm run server`
   - Start frontend: `npm run dev`

2. **Clear browser cache**:
   - DevTools → Application → Clear Storage
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

3. **Check server is running**:
   - Visit http://localhost:8000/api/health
   - Should see: `{"status":"ok",...}`

4. **Look at browser console** for ANY errors:
   - Red text = errors
   - Orange text = warnings
   - Share these with debugging!

5. **Check backend console** for error messages during each step

---

**After making these changes, completely restart both the backend and frontend servers to pick up the code changes!**
