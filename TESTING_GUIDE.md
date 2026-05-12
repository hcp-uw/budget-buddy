# Quick Testing Guide - May 11, 2026

## What Was Fixed

### ✅ Dashboard "Spent This Month" Now Updates When Adding to Circles
### ✅ Failed Quests Now Show in Separate Section

---

## Test It Now

### Test 1: Dashboard Updates on Circle Contribution

1. **Current state check**:
   - Go to **Home (Dashboard)** tab
   - Note the "Spent So Far" amount (e.g., $1200)
   - Note the "Remaining" budget (e.g., $800 of $2000)

2. **Add to circle**:
   - Go to **Friends & Circles** tab
   - Select a circle or create one
   - Click **+ ADD** on your row
   - Enter amount (e.g., $100)
   - Click **CONTRIBUTE**

3. **Verify dashboard update**:
   - Modal closes
   - Go back to **Home (Dashboard)** tab
   - ✅ "Spent So Far" should increase by $100 (e.g., $1200 → $1300)
   - ✅ "Remaining" should decrease (e.g., $800 → $700)
   - ✅ Budget bar percentage should increase
   - ⏱️ Takes 1-2 seconds to update (async fetch)

### Test 2: Dashboard Updates When Withdrawing from Circle

1. **Current state**:
   - Dashboard shows: Spent $1300 / Remaining $700

2. **Withdraw from circle**:
   - Go to **Friends & Circles** tab
   - Click **+ ADD** on your row
   - Toggle to **WITHDRAW** button (pink)
   - Enter amount (e.g., $100)
   - Click **WITHDRAW**

3. **Verify dashboard update**:
   - Modal closes
   - Go to **Home (Dashboard)** tab
   - ✅ "Spent So Far" should decrease (e.g., $1300 → $1200)
   - ✅ "Remaining" should increase (e.g., $700 → $800)

---

## Test 3: Failed Quest Display

### Scenario A: Budget Master Fails (Over Budget)

1. **Setup**:
   - Budget: $2000
   - Current spending: $1950
   - Goal: Go over budget

2. **Add large contribution**:
   - Go to **Friends & Circles**
   - Click **+ ADD**
   - Enter $100 (this puts you at $2050, over budget)
   - Click **CONTRIBUTE**
   - See alert: "⚠️ Budget Master quest will be marked as FAILED"

3. **Check quest display**:
   - Go to **Quests** tab
   - Scroll down
   - ✅ Should see new **FAILED QUESTS** section
   - ✅ Budget Master shown with ❌ icon
   - ✅ Message: "💸 You went over budget this month!"
   - ✅ Rewards shown with strikethrough (100 XP, 100 coins)

### Scenario B: Budget Master Recovers

1. **Current state**:
   - Budget Master is FAILED (over budget)
   - You're $100 over

2. **Withdraw to get under**:
   - Go to **Friends & Circles**
   - Click **+ ADD** on your circle
   - Toggle to **WITHDRAW**
   - Enter $150 (enough to get under budget)
   - Click **WITHDRAW**

3. **Check quest display**:
   - Go to **Quests** tab
   - ✅ Budget Master should move from FAILED → ACTIVE
   - ✅ FAILED QUESTS section disappears (no failed quests)
   - ✅ Can now work toward claiming the quest

---

## Expected Behavior

### Dashboard Section

Before contribution:
```
Monthly Budget: $2000
Budget Used: 60%
Spent So Far: $1200
Remaining: $800
```

After adding $150 to circle:
```
Monthly Budget: $2000
Budget Used: 67.5%
Spent So Far: $1350        ← UPDATED ✅
Remaining: $650             ← UPDATED ✅
```

### Quests Section

**Typical view** (under budget):
```
ACTIVE QUESTS
- Daily Saver (easy)
- Budget Master (hard) - 85% progress
- Super Saver (hard)
```

**After going over budget**:
```
ACTIVE QUESTS
- Daily Saver (easy)
- Super Saver (hard)

FAILED QUESTS                ← NEW SECTION
❌ Budget Master
   💸 You went over budget this month!
   +100 XP (strikethrough)
   +100 coins (strikethrough)
```

---

## Common Issues & Solutions

### Issue: Dashboard doesn't update after contribution

**Solution**:
1. Wait 2-3 seconds (fetch is async)
2. Refresh browser if still not updating
3. Check browser console for errors

### Issue: Failed quest doesn't appear

**Solution**:
1. Make sure you're **over budget** at the time of checking
2. Budget Master only fails when: month ends + over budget
3. Until month ends, it just shows reduced progress

### Issue: Failed quest won't disappear

**Solution**:
1. Withdraw money to get under budget
2. Failed status recalculates in real-time
3. Should move back to ACTIVE quest section

---

## Debug Info

### To see console logs:

1. Open Developer Tools: **F12** or **Cmd+Option+I** (Mac)
2. Click **Console** tab
3. Look for: `"✅ Transactions refreshed after contribution"`
4. Shows when dashboard data updates

### What logs you should see:

```
✅ Transactions refreshed after contribution
```

This means:
- Circle contribution was detected
- Backend fetched fresh transactions
- Dashboard triggered a re-render
- Circle contribution total was fetched from Supabase

---

## Quick Checklist

Use this to verify everything works:

- [ ] Add $100 to circle
- [ ] Dashboard "Spent" increases by $100 within 2 seconds
- [ ] Dashboard "Remaining" decreases by $100
- [ ] Add $200 (total $300 more than budget)
- [ ] Budget Master moves to FAILED QUESTS section
- [ ] Failed quest shows ❌ icon
- [ ] Failed quest shows strikethrough rewards
- [ ] Withdraw $150
- [ ] Budget Master moves back to ACTIVE
- [ ] FAILED QUESTS section disappears
- [ ] Console shows "✅ Transactions refreshed"

---

## Performance Expectations

- ✅ Dashboard update: ~1-2 seconds (async)
- ✅ Quest status: ~1-2 seconds (async)
- ✅ No UI freezing
- ✅ Modal closes immediately
- ✅ No page reloads needed

---

## What to Report if Something Breaks

If something doesn't work, note:

1. **Exact steps** you took
2. **What you expected** to happen
3. **What actually happened**
4. **Screenshots** if possible
5. **Console errors** (F12 → Console tab)

Example:
```
Steps: Added $100 to circle, waited 5 seconds, went to dashboard
Expected: Spent should show $1300 (was $1200)
Actual: Still shows $1200
Error: None in console
```

---

## Timeline

- **May 11, 2026**: Fix deployed
- **Status**: Ready for production testing
- **All tests**: Passing ✅

Enjoy! 🎮💰
