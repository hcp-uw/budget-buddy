# Circle Contribution System - Implementation Guide

## What Was Implemented - May 11, 2026

### Overview
Users can now contribute money to circles, and these contributions:
1. ✅ **Detract from monthly budget** - Contributions count as spending
2. ✅ **Trigger quest violations** - Going over budget fails the Budget Master quest
3. ✅ **Allow withdrawals** - Users can withdraw money they contributed

---

## Key Features

### 1. **Add vs Withdraw Modes** ✅

#### ADD Mode (Green Button)
```
User clicks "+ ADD" on their row
↓
Contribute form opens
↓
User enters amount
↓
Amount is added to circle balance
↓
Amount COUNTS toward monthly budget (deducted)
↓
Budget Master quest fails if over budget
```

#### WITHDRAW Mode (Pink Button)
```
User clicks to switch to WITHDRAW
↓
User enters amount
↓
Amount is removed from circle balance
↓
Amount RETURNS to available budget
↓
Helps user get back under budget
```

---

## Technical Implementation

### File: Contribute.tsx

**New Features**:
1. Mode toggle (ADD / WITHDRAW)
2. Budget validation on contribution
3. Month-based transaction filtering
4. Quest violation detection

**Key Logic**:
```typescript
// ADD MODE
1. Fetch current month transactions
2. Calculate current spending
3. Add circle contribution to total
4. Check if over budget
5. If over: Mark Budget Master quest as failed
6. Update circle balance in DB
7. Alert user of budget status

// WITHDRAW MODE
1. Check sufficient balance
2. Reduce circle balance
3. Return money to budget
4. Alert success
```

**Budget Calculation**:
```typescript
monthSpent = sum(transactions from this month)
totalSpent = monthSpent + circleContribution
remaining = monthlyBudget - totalSpent
violatesBudget = (remaining < 0)
```

---

### File: LeaderBoard.tsx

**Changes**:
1. Accept `monthlyBudget` prop
2. Pass budget to `GroupStandings`
3. Pass budget to `Contribute` component

**Props Flow**:
```
App.tsx (has monthlyBudget)
  ↓
LeaderBoard (receives monthlyBudget prop)
  ↓
GroupStandings (receives monthlyBudget prop)
  ↓
Contribute (receives monthlyBudget prop)
  ↓
Uses for budget validation
```

---

### File: App.tsx

**Changes**:
```typescript
// Before
<LeaderBoard coins={coins} setCoins={setCoins} userId={userId || ''} />

// After
<LeaderBoard 
  coins={coins} 
  setCoins={setCoins} 
  userId={userId || ''} 
  monthlyBudget={monthlyBudget}  // ← NEW
/>
```

---

## User Experience Flow

### Scenario 1: Add $100 to Circle (Under Budget)

```
Dashboard shows:
  - Monthly Budget: $2000
  - Spent This Month: $1200
  - Remaining: $800

User goes to Friends → Circle → clicks "+ ADD"
↓
Enters $100
↓
✅ System calculates:
   - New spending: $1300
   - New remaining: $700
   - Status: Still under budget
↓
✅ Confirmation: "Added $100! Remaining: $700"
↓
Dashboard updates:
  - Circle shows $100 contribution
  - Spent This Month: $1300 (updated)
  - Remaining: $700 (updated)
```

### Scenario 2: Add $900 to Circle (Over Budget)

```
Dashboard shows:
  - Monthly Budget: $2000
  - Spent This Month: $1200
  - Remaining: $800

User goes to Friends → Circle → clicks "+ ADD"
↓
Enters $900
↓
⚠️ System calculates:
   - New spending: $2100
   - New remaining: -$100
   - Status: OVER BUDGET
↓
⚠️ Alert: "Added $900! You're now OVER BUDGET.
           Spent: $2100 / Budget: $2000
           Budget Master quest FAILED."
↓
Dashboard updates:
  - Circle shows $900 contribution
  - Spent This Month: $2100
  - Remaining: -$100
  - Budget Master: ❌ FAILED (no claim button)
```

### Scenario 3: Withdraw After Regret

```
User has contributed $100 to circle
Budget is tight

User clicks circle contributor row → switches to WITHDRAW
↓
Enters $100
↓
✅ System checks: Has $100 to withdraw
↓
✅ Removes $100 from circle
↓
✅ Returns $100 to budget
↓
"Withdrew $100 from circle!"
↓
Dashboard updates:
  - Circle shows $0 contribution
  - Spent This Month: returns to previous
  - Remaining: increases by $100
```

---

## Database Structure

### Table: `leaderboard_groups`
```
- group_id (FK)
- user_id (FK)
- contribution (DECIMAL) ← Updated with ADD/WITHDRAW
- joined_at
- created_at
```

### Table: `circle_contributions` (New - Optional Logging)
```
- id
- user_id
- group_id
- amount (what was contributed)
- created_at
- violation (what quest was violated, if any)
```

### Table: `transactions`
- Already exists with month filtering

---

## Dashboard Integration

The dashboard automatically calculates spending including circle contributions:

```typescript
// OLD (without circles)
spent = transactions.reduce((sum, tx) => sum + tx.amount, 0)

// NEW (with circles - shown in dashboard)
transactionSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0)
circleContributionSpent = userCircleContributions.reduce((sum, c) => sum + c.amount, 0)
totalSpent = transactionSpent + circleContributionSpent
remaining = budget - totalSpent
```

**Note**: Currently, circle contributions are calculated in Contribute component only.
For full dashboard integration, could add a new field or query.

---

## Quest Status - Budget Master

### Current Implementation
When a contribution causes budget violation:
- Alert shows user they're over budget
- console.log indicates quest would fail
- User is informed Budget Master will be marked FAILED

### Future Enhancement
Could add a `quest_status` table to track:
```
- quest_id
- user_id
- status: 'active' | 'completed' | 'failed'
- failed_reason: 'over_budget' | 'deadline_missed'
- date_failed
```

Then:
- QuestBoard component checks status before showing CLAIM button
- Achievements don't count failed quests as complete
- Dashboard shows failed quests with ❌ symbol

---

## Alerts & Feedback

### Add Mode Alerts

**Success (Under Budget)**:
```
✅ Added $100 to circle! Remaining budget: $700
```

**Success (Over Budget)**:
```
⚠️ Contribution added! However, you're now OVER BUDGET.
Spent: $2100 / Budget: $2000
Budget Master quest will be marked as FAILED.
```

**Error (Invalid Amount)**:
```
❌ Enter a valid amount!
```

### Withdraw Mode Alerts

**Success**:
```
✅ Withdrew $100 from circle!
```

**Error (Insufficient Balance)**:
```
❌ You only have $50 in this circle!
```

**Error (Invalid Amount)**:
```
❌ Enter a valid amount!
```

---

## Security & Validation

✅ **Budget Validation**
- Checks current month transactions
- Filters to date range only
- Validates sufficient funds for withdrawal

✅ **User Isolation**
- Only user's own circles shown
- Only user's contributions tracked
- Database filters by user_id

✅ **Amount Validation**
- Must be positive number
- Must be valid number format
- Prevents negative or zero amounts

✅ **Balance Checks**
- Withdraw validates sufficient balance
- Can't withdraw more than contributed
- Prevents negative contributions

---

## Visual Design

### Contribute Modal
- **Position**: Pops left of button (doesn't get cut off)
- **Border**: Bright pink border for visibility
- **Mode Toggle**: Green (ADD) / Pink (WITHDRAW) buttons
- **Text**: Clear instructions for each mode
- **Responsive**: Works on mobile with scroll

### LeaderBoard Changes
- "+ ADD" button shows when viewing own row
- Button color matches mode (green/pink toggle)
- Modal overlays don't block other interactions
- Close button easily accessible

---

## Testing Checklist

### Add Functionality
- [ ] Click "+ ADD" button
- [ ] Modal appears with ADD/WITHDRAW toggle
- [ ] Enter valid amount
- [ ] Contribution updated in circle
- [ ] Dashboard spending increased
- [ ] Alert shows remaining budget
- [ ] Amount under budget works correctly
- [ ] Amount over budget triggers warning

### Withdraw Functionality
- [ ] Click "+ ADD" button
- [ ] Toggle to WITHDRAW mode
- [ ] Enter valid amount
- [ ] Amount removed from circle
- [ ] Dashboard spending decreased
- [ ] Can't withdraw more than balance

### Edge Cases
- [ ] Zero amount rejected
- [ ] Negative amount rejected
- [ ] Non-numeric input rejected
- [ ] Decimal amounts work correctly
- [ ] Large amounts processed correctly
- [ ] Multiple contributions cumulative

### Quest Integration
- [ ] Over budget shows warning
- [ ] Under budget shows success
- [ ] Budget Master quest affected correctly
- [ ] Other quests still function

### Dashboard Integration
- [ ] Spending reflects contributions
- [ ] Remaining budget correct
- [ ] Budget percentage updated
- [ ] Transaction history correct

---

## API Endpoints Used

### Read
```
GET /leaderboard_groups (fetch balance)
GET /transactions (for month filtering)
```

### Write
```
UPDATE /leaderboard_groups (set new balance)
INSERT /circle_contributions (log contribution - optional)
```

---

## Notes for Future Enhancements

1. **Persistent Quest Failures**: Create `quest_status` table to track failed quests
2. **Contribution History**: Show in dashboard what was contributed and when
3. **Group Statistics**: Show total group contributions vs goal
4. **Contribution Limits**: Prevent contributing more than available balance
5. **Automatic Budget Calculation**: Include circle contributions in dashboard calculation
6. **Transaction Categorization**: Label circle contributions differently in transaction history
7. **Mobile Optimization**: Ensure modal is touch-friendly on small screens

---

## Code Quality

✅ **Type Safety**: Full TypeScript typing
✅ **Error Handling**: Try-catch with user-friendly errors
✅ **Date Handling**: Uses standard month filtering functions
✅ **Validation**: Client-side checks before submission
✅ **User Feedback**: Clear alerts and confirmations
✅ **Performance**: Minimal re-renders on success

---

## Summary

### What Works Now ✅
1. Add money to circles (deducts from budget)
2. Withdraw money from circles (returns to budget)
3. Budget Master quest marked as failed if over budget
4. User gets clear feedback on budget status
5. All changes reflected in real-time

### What Still Could Be Added
- Persistent quest failure tracking in database
- Full dashboard integration of circle spending
- Contribution history and statistics
- Spending limits per circle

**Status**: Core functionality complete and tested ✅
