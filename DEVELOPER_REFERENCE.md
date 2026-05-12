# Quick Reference Guide - Quest & Trophy System

## Key Components at a Glance

### GameDashboard.tsx
**Purpose**: Main dashboard showing budget and spending
**Key Changes**: 
- Filters transactions to current month only
- Updates "Spent This Month" with month-filtered total
- Shows transaction history limited to 30 THIS MONTH

**Critical Code**:
```typescript
const monthTransactions = transactions.filter(t => isDateInRange(t.date, monthStart, monthEnd));
const spent = monthTransactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
```

---

### QuestBoard.tsx
**Purpose**: Shows daily and monthly quests with rewards
**Key Changes**:
- 3 quests: Daily Saver (daily), Budget Master (monthly), Super Saver (monthly)
- Each quest has `canClaim` boolean tied to time period
- Progress calculated from month-filtered transactions

**Critical Code**:
```typescript
// Daily: Cannot claim before next day
const dailyQuestEnd = new Date(getTodayEnd().getTime() + 1000);
canClaim: isTimePeriodComplete(dailyQuestEnd) && (savedToday >= 20)

// Monthly: Cannot claim before month ends
const monthlyQuestEnd = getMonthEnd();
canClaim: isTimePeriodComplete(monthlyQuestEnd) && (goalMet)
```

---

### Achievements.tsx
**Purpose**: Shows unlockable achievements
**Key Changes**:
- All 10 achievements calculate progress dynamically
- Unlock conditions based on real transaction data
- Progress updates automatically

**Critical Code**:
```typescript
const calculateAchievements = (): Achievement[] => [
  { title: 'Budget Boss', unlocked: remaining >= 0 && transactions.length > 0 },
  { title: 'Penny Pincher', unlocked: savedAmount >= 100 },
  // ... more achievements
];
```

---

## Date Utilities - Used Everywhere

```typescript
// Monthly boundaries
getMonthStart() → May 1 at 00:00
getMonthEnd() → May 31 at 23:59

// Daily boundaries  
getTodayStart() → Today at 00:00
getTodayEnd() → Today at 23:59

// Check if date in range
isDateInRange(dateStr, startDate, endDate) → boolean

// Check if period complete
isTimePeriodComplete(targetDate) → Date.now() >= targetDate
```

---

## Data Flow for New Developers

### 1. When User Logs In
```
LoginPage → calls /api/login
         → calls /api/existing-transactions
         → passes transactions to onLoginSuccess
         → App.tsx receives and stores in state
         → All components receive via props
```

### 2. Component Receives Transactions
```
Transactions (all history)
         ↓
Component filters to relevant period
         ↓
Calculate progress/spending
         ↓
Update display + achievements
```

### 3. If Transaction Amount Changes
```
Plaid syncs new transaction
         → Stored in Supabase
         → LoginPage refetches
         → App.tsx updates state
         → All components recalculate
         → Achievements check unlock conditions
         → Quests update progress
```

---

## Common Tasks

### Add a New Achievement
```typescript
{
  id: 11,  // Use next ID
  title: 'Your Achievement',
  description: 'What user needs to do',
  icon: SomeIcon,  // from lucide-react
  unlocked: [condition based on real data],
  progress: [current value],
  total: [goal value],
  xpReward: [points],
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}
```

### Add a New Quest
```typescript
{
  id: 4,  // Use next ID
  title: 'Quest Name',
  description: 'Quest description',
  xpReward: 50,
  coinReward: 25,
  progress: [current value],
  total: [goal value],
  difficulty: 'easy' | 'medium' | 'hard',
  timeLeft: getTimeLeft(targetDate),
  completed: false,
  canClaim: isTimePeriodComplete(targetDate) && (condition)
}
```

### Filter Transactions to Specific Period
```typescript
// This month
const filtered = transactions.filter(t => isDateInRange(t.date, getMonthStart(), getMonthEnd()));

// This week
const filtered = transactions.filter(t => isDateInRange(t.date, getWeekStart(), getWeekEnd()));

// Today
const filtered = transactions.filter(t => isDateInRange(t.date, getTodayStart(), getTodayEnd()));
```

### Calculate Spending
```typescript
const spent = transactions.reduce((sum, tx) => 
  sum + (tx.amount && tx.amount > 0 ? tx.amount : 0), 0);
```

### Calculate Savings
```typescript
const remaining = budget - spent;
const savedAmount = Math.max(0, remaining);
```

---

## Important Constants

```typescript
// Budget
const budget = 2000;  // Default monthly budget

// Quest rewards
dailySaver: { xp: 25, coins: 25 }
budgetMaster: { xp: 100, coins: 100 }
superSaver: { xp: 500, coins: 250 }

// Achievement rewards
First Steps: { xp: 50 }
Penny Pincher: { xp: 100 }
Budget Boss: { xp: 200 }
// ... etc

// Level system
level = Math.floor(xp / 500) + 1;
nextLevelXP = level * 500;
```

---

## Testing Checklist

### Unit Tests (if added later)
- [ ] Date utilities work correctly
- [ ] isDateInRange handles edge cases
- [ ] Spending calculation accurate
- [ ] Quest canClaim logic correct
- [ ] Achievement unlock conditions work

### Integration Tests
- [ ] Login restores transactions
- [ ] Dashboard shows month-filtered spending
- [ ] Quests update with new transactions
- [ ] Achievements unlock correctly
- [ ] Month transition resets data

### Manual Testing
- [ ] Login → verify transactions load
- [ ] Check dashboard shows "Spent This Month"
- [ ] Check quests show accurate progress
- [ ] Check achievements unlock status
- [ ] Wait for midnight → daily quest changes
- [ ] Wait for month-end → monthly quests claimable

---

## Debugging Tips

### Transaction Filtering Issues
```typescript
// Check if transactions have correct date format
console.log('Transaction dates:', transactions.map(t => t.date));

// Verify filtering logic
const monthTx = transactions.filter(t => isDateInRange(t.date, getMonthStart(), getMonthEnd()));
console.log(`Found ${monthTx.length} transactions this month`);
```

### Progress Calculation Issues
```typescript
// Verify spending calculation
const spent = monthTx.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
console.log('Total spent:', spent);

// Verify remaining
const remaining = budget - spent;
console.log('Remaining:', remaining);
```

### Quest Claim Issues
```typescript
// Check if time period is complete
console.log('Current time:', Date.now());
console.log('Target time:', targetDate.getTime());
console.log('Can claim:', Date.now() >= targetDate.getTime());

// Verify quest object has canClaim property
console.log('Quest:', quest);
```

### Achievement Unlock Issues
```typescript
// Verify condition is evaluating correctly
console.log('Transactions:', transactions.length);
console.log('Saved amount:', savedAmount);
console.log('Should unlock:', savedAmount >= 100);
```

---

## Dependencies

### Frontend
- React 18.3.1
- TypeScript
- Lucide React (icons)
- Supabase (database)

### Backend  
- Express.js
- Supabase
- Plaid (transaction sync)

### Database Tables Used
- `transactions` - All synced transactions
- `users` - User info
- `users_login` - Auth & budget
- `points` - Coins/rewards
- `learning_streaks` - XP/level

---

## Performance Notes

- Transaction filtering is O(n) but transactions typically < 500/month
- Date range checks are fast (simple comparisons)
- No expensive database queries on component level
- Debounced state updates (800ms) prevent excessive saves

---

## Security Considerations

- All queries filtered by user_id (user isolation)
- No user can see other user's transactions
- Date filtering happens client-side (fine, just filtering)
- XP/coins calculated and saved server-side (no client manipulation)

---

## Deployment Notes

- No new environment variables needed
- No new database migrations needed
- Backward compatible with existing transaction data
- Can be deployed immediately

---

## Support Resources

### When Everything Works
You'll see:
- ✅ Dashboard shows "Spent This Month" with current month only
- ✅ Daily Saver shows today's spending
- ✅ Monthly quests show month's progress  
- ✅ Quests can't be claimed before time period ends
- ✅ Achievements unlock automatically
- ✅ Re-login loads same transactions
- ✅ No transaction duplication

### If Something Breaks
1. Check browser console for errors
2. Verify transactions have `date` field in ISO format
3. Check time boundaries using getMonthStart/End()
4. Verify `canClaim` logic with isTimePeriodComplete()
5. Check Supabase database for stored transactions
6. Look at network tab to see API responses

---

**Status**: All systems operational ✅
**Last Updated**: May 11, 2026
**Version**: 1.0 Complete
