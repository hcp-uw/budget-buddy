# 🏦 Plaid Sandbox Testing Guide

## Error: "The string did not match the expected pattern"

This error typically means the credentials you entered don't match Plaid's expected format for the sandbox.

## Correct Sandbox Flow

### Step 1: Click "CONNECT BANK"
- Plaid Link modal will open

### Step 2: Search for Bank
- **Search for**: "Sandbox" (or "Plaid Sandbox")
- This is the test bank for development
- **DO NOT** search for real banks like Chase, Bank of America, etc.

### Step 3: Login with Test Credentials
Once you select the Sandbox bank:
- **Username**: `user_good` (lowercase, exactly as shown)
- **Password**: `pass_good` (lowercase, exactly as shown)

### Step 4: MFA (if asked)
- **2FA Code**: `1111`
- Some flows ask for phone number: `(415) 555-0011` or just `4155550011`

### Step 5: Select Account
- Choose any account from the list
- Click "Continue"

### Step 6: Success
- You should see a success screen
- Our app will fetch transactions automatically
- Dashboard will show real test data

---

## Why You Might Get "Pattern Error"

| Problem | Solution |
|---------|----------|
| **Uppercase credentials** | Make sure it's `user_good` NOT `User_Good` or `USER_GOOD` |
| **Wrong bank** | Don't search for real banks. Search for **"Sandbox"** |
| **Extra spaces** | Don't add spaces: `user_good` not `user_good ` |
| **Phone format** | If asked for phone, use: `(415) 555-0011` WITH parentheses and dash |
| **Old link token** | Try refreshing the page and clicking "CONNECT BANK" again |

---

## Test Credentials Reference

These are **Plaid's official sandbox test credentials**:

```
Bank: Sandbox Bank
Username: user_good
Password: pass_good

MFA/2FA Code: 1111 (if requested)

Phone (if needed): (415) 555-0011
Email (if needed): user_good@plaid.test
```

## What Happens After Successful Connection

1. **Transactions Load**: Our app fetches ~15 sample transactions
2. **Dashboard Updates**: Shows "SPENT SO FAR: $XXXX.XX"
3. **Categories**: Transactions show up with categories like Food, Travel, Shopping, etc.
4. **Data Persists**: Your connection is saved in Supabase

## Testing Different Scenarios

Plaid sandbox has special usernames for different test scenarios:

| Username | Result |
|----------|--------|
| `user_good` | ✅ Success, normal transactions |
| `user_bad` | ❌ Will fail (for testing error handling) |
| `user_custom_password` | Special password test |

**For your first test, always use `user_good`**

## Still Getting Pattern Error?

### Try This Checklist:
1. ☐ Using `user_good` (all lowercase, no capitals)
2. ☐ Using `pass_good` (all lowercase, no capitals)
3. ☐ Searching for "Sandbox" bank (not a real bank)
4. ☐ Browser is not blocking popups
5. ☐ JavaScript is enabled
6. ☐ Try in an incognito/private window

### If Still Broken:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Share those errors with me

## Backend Logs to Check

When you connect successfully, the backend console should show:
```
🔑 Setting access token, user_id: <uuid>
✅ Link token created
✅ Plaid item saved to Supabase
📊 Fetching transactions for user: <uuid>
✅ Found 15 transactions
✅ Transactions saved to Supabase
```

If you don't see these, the connection didn't complete successfully.

## Common Issues

### "Link token expired"
- **Cause**: Took too long to click CONNECT BANK after signup
- **Fix**: Try signing up again and immediately clicking CONNECT BANK

### No institutions shown
- **Cause**: Search isn't working
- **Fix**: Clear search and scroll through list, or type "Sand" and wait

### Login button doesn't work
- **Cause**: Pop-up blocker or JavaScript error
- **Fix**: Check browser DevTools Console for errors

### "Institution not supported"
- **Cause**: Selected a real bank instead of Sandbox
- **Fix**: Go back and select "Sandbox" bank

---

## What NOT to Do

❌ Don't use real bank credentials (Chase, Bank of America, etc.) - this is for testing!
❌ Don't use random usernames - use the exact test credentials
❌ Don't add extra characters or spaces
❌ Don't refresh the page during the Plaid flow
❌ Don't use this in production (it's test data only)

---

## Next Steps

1. Try the Sandbox flow with `user_good` / `pass_good` / `1111`
2. If you get the pattern error again, note exactly which field rejected it
3. Check the browser console (DevTools) for detailed error messages
4. Let me know the exact error message so I can help further

**Remember**: All lowercase, no spaces, exact credentials match!
