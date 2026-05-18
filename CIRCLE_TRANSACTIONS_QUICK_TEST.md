# Circle Transactions Fix - Quick Test Guide

**Date**: May 17, 2026  
**Time to Complete**: 10-15 minutes

---

## ⚡ Quick Start Testing

### Setup
```bash
# Terminal 1: Start backend
cd frontend
npm start

# Terminal 2: Start frontend
npm run dev
```

### Verify Backend Running
```bash
curl http://localhost:8000/api/health
# Expected: { "status": "ok", "timestamp": "..." }
```

---

## 🧪 Test Cases

### Test 1: Add to Circle (5 min)

**Scenario**: Add $50 to a circle and verify it creates a transaction

**Steps**:
1. Login to app
2. Go to "Friends & Circles" tab
3. Join or create a circle
4. Click "+ ADD" on your row
5. Enter $50
6. Click CONTRIBUTE
7. Verify modal closes

**Expected Results**:
- ✅ Modal closes
- ✅ Alert says: "Added $50! Remaining: $1950"
- ✅ Dashboard "Spent So Far" increases by $50
- ✅ Backend console shows: "✅ Added $50 to circle"

**Backend Verification** (Console should show):
```
Transaction successfully created for circle contribution
```

**Supabase Verification**:
1. Go to Supabase dashboard
2. Open `transactions` table
3. Find newest row
4. Verify:
   - `amount`: 50
   - `user_id`: Your user
   - `group_id`: Circle UUID
   - `merchant_name`: "Circle Contribution"
   - `description`: "Circle Contribution - $50"

---

### Test 2: Withdraw from Circle (5 min)

**Scenario**: Withdraw $50 from circle and verify transaction is deleted

**Steps**:
1. From Test 1, you should have $50 in a circle
2. Click "+ ADD" on the circle row again
3. Modal opens
4. Toggle to WITHDRAW (pink button)
5. Enter $50
6. Click WITHDRAW
7. Verify modal closes

**Expected Results**:
- ✅ Modal closes
- ✅ Alert says: "✅ Withdrew $50 from circle!"
- ✅ Dashboard "Spent So Far" decreases by $50
- ✅ Backend console shows: "✅ Circle transaction deleted"

**Backend Verification** (Console should show):
```
🗑️ Deleting circle transaction: user=..., group=..., amount=$50
✅ Circle transaction deleted: ...
```

**Supabase Verification**:
1. Open `transactions` table
2. The circle transaction row should be GONE
3. Count of transactions decreased

---

### Test 3: Persistence (5 min)

**Scenario**: Logout and login to verify circle contribution persists

**Steps**:
1. Add $100 to a circle
2. Dashboard should show: Spent $1300 (example)
3. Note the exact amount
4. Click Logout (top menu)
5. Login again with same username
6. Go to Dashboard

**Expected Results**:
- ✅ Dashboard loads quickly
- ✅ Shows same Spent amount from before
- ✅ Circle contribution still appears in list
- ✅ No need to manually add the circle amount

---

### Test 4: Over Budget Warning (3 min)

**Scenario**: Add to circle when it would exceed budget

**Steps**:
1. Check current budget (default $2000)
2. Check current spending
3. Calculate: remaining budget
4. Add amount that exceeds remaining
5. Example: Spent $1900, try to add $150

**Expected Results**:
- ✅ Modal closes
- ✅ Alert shows: "⚠️ Contribution added! You're now OVER BUDGET"
- ✅ Shows: "Spent: $2050 / Budget: $2000"
- ✅ Says: "Budget Master quest will be marked as FAILED"
- ✅ Dashboard updates to show negative remaining

---

### Test 5: Multiple Circles (3 min)

**Scenario**: Add to different circles and verify each tracked separately

**Steps**:
1. Create/join Circle A
2. Create/join Circle B
3. Add $60 to Circle A
4. Add $40 to Circle B
5. Dashboard should show: Spent $100 from circles

**Expected Results**:
- ✅ Dashboard shows total: $100
- ✅ Both circles show correct balances
- ✅ Can withdraw from either independently
- ✅ Supabase shows both with different `group_id`s

---

## 🔍 Debugging Commands

### Check Backend Logs
```bash
# Terminal where backend is running
# Should see timestamped logs for:
# - Transaction creation
# - Transaction deletion
# - Budget calculations
```

### Test API Endpoint Directly
```bash
# Add circle transaction (POST request)
curl -X POST http://localhost:8000/api/delete-circle-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "group_id": "YOUR_GROUP_ID",
    "amount": 50
  }'

# Expected response:
# { "success": true, "deletedTransactionId": "uuid..." }
# or error if not found
```

### View Database Directly
```bash
# In Supabase Console:

# 1. Check transactions created
SELECT * FROM transactions 
WHERE merchant_name = 'Circle Contribution'
ORDER BY created_at DESC;

# 2. Check circle contributions logged
SELECT * FROM circle_contributions
ORDER BY created_at DESC;

# 3. Check circle balance
SELECT user_id, group_id, contribution
FROM leaderboard_groups
WHERE user_id = 'YOUR_USER_ID';
```

---

## ✅ Success Criteria

**All Tests Pass If**:
- [x] Add creates transaction visible in dashboard
- [x] Withdraw deletes transaction
- [x] Dashboard spending updates in real-time
- [x] Logout/login preserves circle contributions
- [x] Over budget warning works
- [x] Multiple circles tracked independently
- [x] Backend logs show operations
- [x] Supabase data correct
- [x] No TypeScript errors
- [x] No console errors

---

## 🐛 Troubleshooting

### Problem: "Added to circle but dashboard didn't update"
**Solution**:
1. Check browser console for errors
2. Verify `onSuccess()` was called
3. Check network tab - transaction request succeeded?
4. Manually refresh page
5. Check Supabase - is transaction there?

### Problem: "Withdraw failed"
**Solution**:
1. Check backend console for delete endpoint errors
2. Verify transaction exists in Supabase
3. Check group_id matches
4. Try exact amount vs approximate
5. Check browser console for fetch error

### Problem: "Dashboard shows wrong amount"
**Solution**:
1. Check current spending calculation
2. Verify circle transactions included
3. Check date range filtering
4. Verify month start/end dates
5. Manually add up transactions

### Problem: "Network error on delete"
**Solution**:
1. Verify backend still running
2. Check backend server.js loaded new endpoint
3. Check fetch URL is correct
4. Test endpoint manually with curl
5. Check CORS settings

### Problem: "Supabase shows no transaction"
**Solution**:
1. Check correct table: `transactions`
2. Check filters (user_id, group_id)
3. Verify `group_id` column exists
4. Check RLS policies allow insert
5. Look for error in transaction insert

---

## 📋 Test Checklist

### Pre-Test
- [ ] Backend running (http://localhost:8000/api/health returns 200)
- [ ] Frontend running (http://localhost:5173 loads)
- [ ] Logged in to app
- [ ] Have access to Supabase console
- [ ] Backend logs visible in terminal

### Test 1 (Add)
- [ ] Add $50 successful
- [ ] Modal closes
- [ ] Dashboard updates
- [ ] Backend shows creation log
- [ ] Supabase shows transaction

### Test 2 (Withdraw)
- [ ] Withdraw $50 successful
- [ ] Modal closes
- [ ] Dashboard updates
- [ ] Backend shows deletion log
- [ ] Supabase transaction deleted

### Test 3 (Persistence)
- [ ] Logout successful
- [ ] Login successful
- [ ] Dashboard shows circle contribution
- [ ] No manual recalculation needed

### Test 4 (Over Budget)
- [ ] Over-budget addition works
- [ ] Warning shows correct amounts
- [ ] Budget Master fails appropriately
- [ ] Transaction still created

### Test 5 (Multiple)
- [ ] Multiple circles independent
- [ ] Dashboard sums correctly
- [ ] Can manage each circle
- [ ] Supabase tracking correct

---

## 📊 Test Results Template

```
Test Results - Circle Transactions Fix
Date: May 17, 2026
Tester: _______________

Test 1: Add to Circle
  Status: [ ] Pass [ ] Fail [ ] Partial
  Issues: _____________________________________

Test 2: Withdraw from Circle
  Status: [ ] Pass [ ] Fail [ ] Partial
  Issues: _____________________________________

Test 3: Persistence (Login)
  Status: [ ] Pass [ ] Fail [ ] Partial
  Issues: _____________________________________

Test 4: Over Budget
  Status: [ ] Pass [ ] Fail [ ] Partial
  Issues: _____________________________________

Test 5: Multiple Circles
  Status: [ ] Pass [ ] Fail [ ] Partial
  Issues: _____________________________________

Overall: [ ] Ready for Step 2 [ ] Needs Fixes [ ] Needs Redesign

Notes: ________________________________________
```

---

## 🚀 Ready to Test!

**Next Steps**:
1. Run backend: `npm start`
2. Run frontend: `npm run dev`
3. Follow test cases above
4. Document results
5. Report any issues

**Estimated Time**: 15 minutes
**Expected Outcome**: All tests pass ✅

---

**Last Updated**: May 17, 2026  
**Implementation Status**: ✅ Complete  
**Testing Status**: 📋 Ready to Start

