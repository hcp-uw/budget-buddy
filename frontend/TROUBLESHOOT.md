# 🆘 Quick Troubleshooting

## Problem: "LOADING PLAID..." button stuck

**Cause:** Backend not responding to create_link_token request

**Solution:**
1. Check terminal - is `npm run server` running?
2. Verify `.env` file exists in `frontend/` folder
3. Check for errors in backend console
4. Verify PLAID_CLIENT_ID and PLAID_SECRET are correct

**Test:** In new terminal, run:
```bash
curl http://localhost:8000/api/health
# Should respond: {"status":"ok","timestamp":"..."}
```

---

## Problem: "Connection failed" in Plaid

**Cause:** Backend can't reach Plaid API

**Solution:**
1. Double-check PLAID_CLIENT_ID and PLAID_SECRET in `.env`
2. Verify PLAID_ENV=sandbox in `.env`
3. Check Plaid dashboard - is app active?
4. Try different Plaid credentials

---

## Problem: User not created in Supabase

**Cause:** Either table missing or RLS blocking insert

**Solution:**

In Supabase dashboard:
1. Go to SQL Editor
2. Run:
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

3. Check backend console - should show "✅ New user created: email@example.com"

---

## Problem: Spending shows placeholder "1550"

**Cause:** Transactions not being received from backend

**Solution:**

1. **Check DevTools Console (F12):**
   - Should show: `📊 Transactions loaded from backend: X items`
   - If not, check Network tab

2. **Check if transactions were fetched:**
   - Look for: `💰 Dashboard: Calculated spending from X transactions: $$$`
   - If missing, backend didn't return transactions

3. **Fix:**
   - Verify Plaid connection completed successfully
   - Check backend returned transactions (not error)
   - Verify transactions array passed to GameDashboard

---

## Problem: Logout doesn't work or goes to wrong place

**Cause:** Navigation state not updated

**Solution:**
- Click logout button (↩ symbol on sidebar)
- Should return to HomePage with "START BUDGET"
- If not, refresh the page (Ctrl+R or Cmd+R)

---

## Problem: Form validation errors

**Cause:** Missing required fields in signup

**Solution:**
1. **Username:** Must not be empty, max 20 chars
2. **Password:** Must match confirm password
3. **Budget:** Must be > 0

---

## Problem: "No such table: users" error

**Cause:** Database table doesn't exist

**Solution:**
1. Go to Supabase dashboard
2. Create table using SQL:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plaid_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  plaid_access_token VARCHAR,
  plaid_item_id VARCHAR,
  institution_name VARCHAR,
  status VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

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

3. Disable RLS on all tables:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
```

---

## Problem: "Cannot find module 'plaid'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd frontend
npm install
# Wait for completion...
npm run server  # Try again
```

---

## Problem: Port 8000 already in use

**Cause:** Another process using port 8000

**Solution:**

**macOS/Linux:**
```bash
lsof -i :8000
# Find PID, then:
kill -9 <PID>
# Then restart: npm run server
```

**Windows:**
```bash
netstat -ano | findstr :8000
# Find PID, then:
taskkill /PID <PID> /F
```

Or use different port - edit `.env`:
```env
PORT=3000  # Use different port
```

---

## Problem: ".env not found"

**Cause:** File missing or in wrong location

**Solution:**
1. Verify you're in `frontend/` folder
2. Create `.env` file:
```bash
cd frontend
cat > .env << 'EOF'
PLAID_CLIENT_ID=your_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
PORT=8000
EOF
```

3. Verify file was created:
```bash
cat .env
```

---

## Problem: "TypeError: Cannot read property 'transactions' of undefined"

**Cause:** Transactions not passed to GameDashboard

**Solution:**
1. Check App.tsx line ~236
2. Should pass: `transactions={userTransactions}`
3. Verify LoginPage calls `onLoginSuccess` with transactions

---

## Problem: Spending calculation shows NaN

**Cause:** Transaction amounts not numbers

**Solution:**
1. Check transaction structure in console
2. Should have `amount` as number (e.g., 5.50)
3. If amount is string, GameDashboard converts it with parseFloat

---

## Still Stuck? 

**Debug checklist:**

1. **Terminal 1:** Backend running?
   ```bash
   npm run server
   # Should show: 🚀 Backend server running on http://localhost:8000
   ```

2. **Terminal 2:** Frontend running?
   ```bash
   npm run dev
   # Should show: ➜  Local:   http://localhost:5173
   ```

3. **Browser Console (F12):**
   - Look for red errors
   - Search for "Error" or "failed"
   - Check Network tab for failed API calls

4. **Backend Console:**
   - Look for ❌ errors (they print with ❌ prefix)
   - Should show ✅ for successful operations

5. **Supabase Dashboard:**
   - Tables exist?
   - Any data in tables?
   - RLS disabled?

6. **.env file:**
   - All values filled in?
   - No extra spaces or quotes?
   - All keys present?

If everything checks out but still not working, the issue is usually:
- Wrong credentials in `.env`
- Database tables missing
- RLS policies blocking access
- Plaid sandbox credentials wrong
