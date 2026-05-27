# Data Flow Diagram - Quest & Trophy Sync System

## 1. LOGIN FLOW (Existing User)

```
User enters credentials
         ↓
/api/login endpoint
         ↓
validateUser() → returns { userId, monthlyBudget }
         ↓
/api/existing-transactions?user_id={userId}
         ↓
SELECT * FROM transactions WHERE user_id = {userId}
         ↓
LoginPage receives transactions array
         ↓
onLoginSuccess(budget, transactions, username, userId)
         ↓
App.tsx sets userTransactions = [all stored transactions]
```

## 2. DATA PROCESSING IN COMPONENTS

```
userTransactions (passed to components)
         ↓
┌────────┴────────┬──────────────┬────────────────┐
↓                 ↓              ↓                ↓
GameDashboard   QuestBoard   Achievements    LeaderBoard
         ↓            ↓           ↓
Filter:           Filter:      Filter:
Month dates     Month dates   Month dates
         ↓            ↓           ↓
Calculate:      Calculate:   Calculate:
- Spent         - Daily progress  - Achievement progress
- Remaining     - Month progress  - Unlock status
- Trends        - Claimable?      - Level
         ↓            ↓           ↓
Display:        Display:        Display:
Current month   Quest cards     Trophy cards
spending        with timer      with progress
```

## 3. TIMELINE BOUNDARIES

### Daily Quest (Daily Saver)
```
TODAY (00:00) ──────────────────────────── TOMORROW (00:00)
    ↑                                           ↑
  START                                    CLAIM AVAILABLE
  Can spend & track                        Progress frozen
  Progress updates live                    Button appears
```

### Monthly Quests (Budget Master, Super Saver)
```
MONTH START (1st at 00:00) ──────────────── MONTH END (last day at 23:59)
    ↑                                           ↑
  START                                    CLAIM AVAILABLE
  Can spend & track                        Progress frozen
  Progress updates live                    Button appears
  
NEXT MONTH (1st at 00:00)
    ↑
  RESET
  All quests reset
  New budget period
```

## 4. TRANSACTION FILTERING LOGIC

```
userTransactions (ALL historical)
         ↓
         ├─ Trans 1: date: "2026-04-15" ─ OUT OF RANGE (last month)
         ├─ Trans 2: date: "2026-05-01" ─ ✓ IN RANGE
         ├─ Trans 3: date: "2026-05-15" ─ ✓ IN RANGE
         ├─ Trans 4: date: "2026-05-31" ─ ✓ IN RANGE
         └─ Trans 5: date: "2026-06-02" ─ OUT OF RANGE (next month)
         ↓
monthTransactions = [Trans 2, Trans 3, Trans 4]
         ↓
spent = $X (sum of May transactions only)
remaining = budget - spent
```

## 5. QUEST CLAIM LOGIC

```
User clicks CLAIM button
         ↓
completeQuest(questId)
         ↓
Validate:
  - quest exists?
  - quest not already completed?
  - quest.canClaim === true? ◄─ KEY CHECK
         ↓
  if (ALL VALID):
    Add xpReward to total XP
    Add coinReward to total coins
    Mark quest as completed
    Save to database (debounced)
  else:
    Button disabled (cannot click)
```

## 6. ACHIEVEMENT UNLOCK LOGIC

```
Component mounts / transactions updated
         ↓
For each achievement:
  Check unlock condition
         ↓
  Examples:
  ├─ "First Steps": transactions.length > 0
  ├─ "Penny Pincher": savedAmount >= 100
  ├─ "Budget Boss": remaining >= 0 && transactions.length > 0
  ├─ "Level 25": level >= 25
  └─ "Legend Investor": savedAmount >= 10000
         ↓
  unlocked = condition result
  progress = current value
  total = goal value
         ↓
Display:
  ✓ Icon colored (if unlocked)
  🔒 Icon locked (if locked)
  Progress bar shows completion %
```

## 7. MONTH TRANSITION HANDLING

```
May 31, 23:59:59
  - "Spent This Month": $1,234
  - "Super Saver" progress: $400/$500
  - Budget Master claimable: YES ✓
         ↓
June 1, 00:00:00
  - "Spent This Month": $0
  - "Super Saver" progress: $0/$500
  - Budget Master claimable: NO (not month-end)
  - quests reset to incomplete
  - new budget period starts
```

## 8. DATA PERSISTENCE

```
Browser (App.tsx state)
  ├─ userTransactions
  ├─ coins
  ├─ xp
  └─ monthlyBudget
         ↓
    debounce (800ms)
         ↓
Supabase Database
  ├─ transactions table (synced via Plaid)
  ├─ points table (coins)
  ├─ learning_streaks table (xp/level)
  └─ users_login table (budget)
         ↓
    On next login:
    Auto-restore all state
```

## 9. COMPLETE USER JOURNEY

```
SIGNUP DAY:
  1. Create account → /api/signup
  2. Connect bank → Plaid Link
  3. Sync transactions → /api/transactions
  4. Store in DB → Supabase
  5. Show in dashboard → THIS MONTH only
  6. Quests appear with live progress
  7. Achievements show unlock status

LOGIN DAY (3 days later):
  1. Enter credentials → /api/login
  2. Fetch stored transactions → /api/existing-transactions
  3. Pass to App.tsx
  4. NO Plaid reconnect needed (check-plaid-connection)
  5. Dashboard loads with previous month's data
  6. New month data starts fresh
  7. Quests in new period show 0 progress
```

## Key Design Principles

### 1. Month-Based Isolation
- Each calendar month is separate
- "Spent This Month" = May 1-31 transactions only
- Quests reset on 1st of each month
- Budget resets monthly

### 2. Time-Aware Claiming
- Daily quests: Cannot claim before next day
- Monthly quests: Cannot claim before month ends
- Prevents early exploitation
- Natural gameplay progression

### 3. Real Data Only
- All progress from Plaid transactions
- No mock data or artificial inflation
- Achievable goals tied to actual behavior
- Transparent progress tracking

### 4. Seamless Session Restore
- Login retrieves stored transactions
- No need to reconnect bank each time
- Quests/achievements show current month status
- Previous month history retained

### 5. Automatic Updates
- As transactions arrive, metrics update
- Achievements unlock automatically
- Progress bars animate in real-time
- No manual refresh needed

---

## Formula Reference

### Calculations

```typescript
// Month boundaries
monthStart = new Date(currentYear, currentMonth, 1)
monthEnd = new Date(currentYear, currentMonth+1, 0)

// Spending
spent = sum(transactions where date in [monthStart, monthEnd] and amount > 0)
remaining = budget - spent
savedAmount = max(0, remaining)

// Progress
questProgress = min(currentValue, questGoal)
achievementProgress = min(currentValue, targetAmount)

// Quest Claimable
dailyClaimable = (now >= tomorrow at 00:00) && (savedToday >= 20)
monthlyClaimable = (now >= month-end) && (goalsMet)

// Achievement Unlock
unlocked = (condition is true)
```

### Example: Budget Master Quest

```
Quest Goal: Stay under budget
Timeline: Full month (May 1-31)

Day 1:  spent=$100, remaining=$1900, progress=95%, canClaim=FALSE
Day 15: spent=$800, remaining=$1200, progress=60%, canClaim=FALSE
Day 30: spent=$1500, remaining=$500, progress=25%, canClaim=FALSE
Day 31: spent=$1800, remaining=$200, progress=10%, canClaim=FALSE (not yet month-end)
June 1: spent=$1800, remaining=$200, progress=10%, canClaim=TRUE ✓

User claims reward:
- +100 XP
- +100 coins
- Quest marked complete
```
