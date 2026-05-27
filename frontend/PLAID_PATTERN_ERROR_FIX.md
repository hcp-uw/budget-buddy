# 🔧 Plaid Connection Troubleshooting

## Your Specific Error

**Error**: "The string did not match the expected pattern" after entering `pass_good`

This means Plaid is validating the password format and rejecting it. However, `pass_good` is the correct sandbox password.

## What We Just Changed

We updated the backend to:
1. ✅ Request BOTH `['auth', 'transactions']` instead of just `['transactions']`
2. ✅ **Skip the bank search** by specifying the Sandbox Bank directly (`institution_id: 'ins_127537'`)
3. ✅ Added a `/api/sandbox-test` endpoint to verify configuration

## New Plaid Flow (After Restart)

Now when you click "CONNECT BANK":
1. ✅ It will go **directly to Plaid Sandbox Bank** (no search needed)
2. ✅ It will ask for phone number first (this is normal for auth product)
3. ✅ Then username: `user_good`
4. ✅ Then password: `pass_good`
5. ✅ Then MFA: `1111`

## To Test the Fix

### Step 1: Completely Restart Everything
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)

# Then restart:
npm run server  # Terminal 1
npm run dev     # Terminal 2 (different terminal)
```

### Step 2: Verify Backend is Configured
- Visit: http://localhost:8000/api/sandbox-test
- Should show the Sandbox test credentials
- If you see an error, the backend didn't restart properly

### Step 3: Go Through the Flow Again
1. Click "START BUDGET"
2. Create new account
3. Click "CONNECT BANK"
4. **NEW**: It should go straight to Plaid Sandbox Bank (no search)
5. Enter credentials:
   - Phone: `(415) 555-0011` or `4155550011`
   - Username: `user_good`
   - Password: `pass_good`
   - MFA: `1111`

## If You Still Get the Pattern Error

The error "string did not match the expected pattern" typically happens when:

1. **Phone number format is wrong**
   - Try: `(415) 555-0011` (with parentheses and dash)
   - Or: `4155550011` (just digits)
   - Or: `415-555-0011` (with dashes only)

2. **Username/password has typos**
   - Must be: `user_good` (all lowercase, no spaces)
   - Must be: `pass_good` (all lowercase, no spaces)

3. **You're in the wrong Plaid flow**
   - Should NOT ask you to search for banks anymore
   - Should go straight to Sandbox Bank

## Debug Checklist

Before trying again, verify:

☐ Backend is running (`npm run server`)
☐ Frontend is running (`npm run dev`)
☐ http://localhost:8000/api/health returns `{"status":"ok"}`
☐ http://localhost:8000/api/sandbox-test shows the test credentials
☐ Browser console (DevTools) has no red errors
☐ You're using lowercase: `user_good` and `pass_good`

## What Phone Number to Use

The Plaid Sandbox Bank test flow asks for a phone number. You can use:

```
(415) 555-0011   ← Recommended (Plaid's official sandbox phone)
4155550011       ← Also works (no formatting)
415-555-0011     ← Also works (dashes only)
```

Don't use your real phone number - this is a test!

## Backend Console Should Show

After successfully connecting, you should see:
```
✅ Link token created
🔑 Setting access token, user_id: <uuid>
✅ Plaid item saved to Supabase
📊 Fetching transactions for user: <uuid>
✅ Found 15 transactions
✅ Transactions saved to Supabase
```

## Still Broken?

If you still get the pattern error after restarting:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages during the Plaid flow
4. Copy the exact error and tell me

Or try this alternative approach:

### Option A: Skip Plaid for Now
1. Click "CONNECT BANK"
2. Click "SKIP FOR NOW"
3. Go to dashboard
4. We can debug the Plaid connection separately

### Option B: Check Plaid Status
- Visit: https://status.plaid.com
- Make sure Plaid services are online (usually are)

## Expected Behavior After Fix

The new flow should be:

```
1. Click CONNECT BANK
2. Plaid modal opens (goes straight to Sandbox - no search!)
3. Asks for phone number
4. Asks for username: user_good
5. Asks for password: pass_good
6. Asks for MFA: 1111
7. Asks to select account
8. Success! Transactions load
9. Dashboard shows real spending data
```

---

**Try restarting both backend and frontend, then test again. The direct institution ID should fix the issue!**

If it still doesn't work, let me know:
1. Does it still ask you to search for banks? (should NOT)
2. Does it still ask for phone number? (should YES)
3. What exact error message do you see?
4. At which step does it appear?
