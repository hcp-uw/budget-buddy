# Circle Contributions - Quick Reference

## User Flows

### Adding Money to Circle
```
Friends Tab
    ↓
Circle Selected
    ↓
Your Row → Click "+ ADD"
    ↓
Modal Opens (Green ADD mode default)
    ↓
Enter amount (e.g., $100)
    ↓
Click CONTRIBUTE
    ↓
Budget Check:
  ✅ Under budget? → "Added $100! Remaining: $700"
  ⚠️  Over budget? → "⚠️ Over budget! Budget Master FAILED"
    ↓
Circle balance updated
    ↓
Dashboard spending increases
```

### Withdrawing Money
```
Friends Tab
    ↓
Circle Selected
    ↓
Your Row → Click "+ ADD"
    ↓
Modal Opens
    ↓
Click WITHDRAW button (Pink)
    ↓
Enter amount (e.g., $50)
    ↓
Click WITHDRAW
    ↓
Balance Check:
  ✅ Sufficient balance? → "Withdrew $50!"
  ❌ Insufficient? → "You only have $X"
    ↓
Circle balance reduced
    ↓
Dashboard spending decreases
    ↓
Budget breathing room restored
```

---

## Budget Impact Examples

### Example 1: Small Contribution (Under Budget)
```
Monthly Budget: $2000
Current Spending: $1200
Remaining: $800

ACTION: Add $100 to circle

NEW STATE:
  Current Spending: $1300 (includes circle)
  Remaining: $700
  Status: ✅ UNDER BUDGET
  Budget Master: ✅ Still claimable
```

### Example 2: Large Contribution (Over Budget)
```
Monthly Budget: $2000
Current Spending: $1200
Remaining: $800

ACTION: Add $900 to circle

NEW STATE:
  Current Spending: $2100
  Remaining: -$100
  Status: ⚠️ OVER BUDGET
  Budget Master: ❌ FAILED
  Alert: "You're $100 over budget"
```

### Example 3: Strategic Withdrawal
```
Monthly Budget: $2000
Current Spending: $2100 (includes $800 circle)
Status: ⚠️ OVER BUDGET

ACTION: Withdraw $150 from circle

NEW STATE:
  Current Spending: $1950
  Remaining: $50
  Status: ✅ UNDER BUDGET
  Budget Master: ✅ Back in play
  Alert: "Withdrew $150! Under budget again"
```

---

## Modal States

### ADD Mode (Default - Green)
```
┌─────────────────────────────────┐
│ 💸 FUNDS                  CLOSE │
├─────────────────────────────────┤
│ [ADD] [WITHDRAW]                │
├─────────────────────────────────┤
│ $ [____________________]         │
│ 💡 Adding counts toward spending│
│ [        CONTRIBUTE       ]      │
└─────────────────────────────────┘
```

### WITHDRAW Mode (Pink)
```
┌─────────────────────────────────┐
│ 💸 FUNDS                  CLOSE │
├─────────────────────────────────┤
│ [ADD] [WITHDRAW]                │
├─────────────────────────────────┤
│ $ [____________________]         │
│ 💡 Returns money to budget      │
│ [        WITHDRAW        ]       │
└─────────────────────────────────┘
```

---

## Data Flow

### Transaction Processing

```
User Input
    ↓
Amount Validation
    ├─ Not empty?
    ├─ Valid number?
    └─ Greater than 0?
    ↓
Mode Check (ADD vs WITHDRAW)
    ↓
IF ADD:
    ├─ Fetch month transactions
    ├─ Calculate month spending
    ├─ Add circle amount
    ├─ Check if over budget
    ├─ Update DB balance
    ├─ Alert result
    └─ Log contribution
    ↓
IF WITHDRAW:
    ├─ Check sufficient balance
    ├─ Update DB balance
    ├─ Alert success
    └─ Close modal
    ↓
Refresh Parent Component
    ↓
Dashboard Updates
```

---

## Budget Calculation

### Month-Based Filtering
```
All user transactions (history)
    ↓
Filter by date range:
  Start: May 1, 2026 00:00
  End: May 31, 2026 23:59
    ↓
monthTransactions = [all May transactions]
    ↓
Sum all amounts:
  spent = $1200
    ↓
Add circle contributions:
  totalSpent = $1200 + $100 = $1300
    ↓
Calculate remaining:
  remaining = $2000 - $1300 = $700
    ↓
Check budget status:
  violatesBudget = ($700 < 0) ? YES : NO
```

---

## Feature Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Add contribution | ✅ | Deducts from budget |
| Withdraw contribution | ✅ | Returns to budget |
| Budget validation | ✅ | Month-filtered |
| Over-budget alert | ✅ | Shows exact amounts |
| Quest violation tracking | ✅ | Alerts user |
| Real-time updates | ✅ | Modal closes, parent refreshes |
| Balance validation | ✅ | Can't withdraw more than balance |
| Input validation | ✅ | No negative/zero amounts |
| Mobile responsive | ✅ | Works on small screens |
| Error handling | ✅ | User-friendly messages |

---

## Code Snippets for Reference

### Check if Over Budget
```typescript
const monthStart = getMonthStart(); // May 1 00:00
const monthEnd = getMonthEnd();     // May 31 23:59
const monthTransactions = transactions.filter(t => 
  isDateInRange(t.date, monthStart, monthEnd)
);
const spent = monthTransactions.reduce((sum, tx) => 
  sum + (tx.amount > 0 ? tx.amount : 0), 0
);
const newTotal = spent + circleContribution;
const violatesBudget = newTotal > monthlyBudget;
```

### Calculate Remaining Budget
```typescript
const monthlyBudget = 2000;
const spent = 1200;
const circleContribution = 100;
const totalSpent = spent + circleContribution; // 1300
const remaining = monthlyBudget - totalSpent;   // 700
const isOverBudget = remaining < 0;             // false
```

### Mode Toggle Logic
```typescript
const [mode, setMode] = useState<'add' | 'withdraw'>('add');

if (mode === 'add') {
  // Fetch transactions, check budget, update balance
} else {
  // Check balance sufficiency, reduce contribution
}
```

---

## User Messages

### Success Messages
- ✅ "Added $X to circle! Remaining budget: $Y"
- ✅ "Withdrew $X from circle!"

### Warning Messages
- ⚠️ "Added $X to circle! You're now OVER BUDGET."
- ⚠️ "Spent: $X / Budget: $Y"
- ⚠️ "Budget Master quest will be marked FAILED."

### Error Messages
- ❌ "Enter a valid amount!"
- ❌ "You only have $X in this circle!"
- ❌ "Transaction Failed: [error details]"

### Info Messages
- 💡 "Adding money counts toward spending"
- 💡 "Withdrawing returns money to budget"

---

## Month Transition Behavior

### May 31 → June 1

**May 31, 11:59 PM**:
- Dashboard: "Spent This Month: $1800"
- Circle: Shows current contributions
- Budget Master: Ready to claim ✅

**June 1, 12:00 AM**:
- Dashboard: "Spent This Month: $0" (reset)
- Circle: Contributions remain (they're persistent)
- Budget Master: Resets to 0% progress
- New budget period starts fresh

**Note**: Circle contributions themselves don't reset. They're historical record. But the "Spent This Month" calculation resets.

---

## Troubleshooting

### "Transaction Failed" Error
- Check network connection
- Verify circle exists
- Check user permissions
- Ensure amount is valid

### Modal Won't Close
- Click CLOSE button
- Or press Escape (if implemented)
- Try refresh page

### Budget Not Updating
- Refresh LeaderBoard component
- Verify month filtering is correct
- Check if transactions loaded properly

### Circle Balance Wrong
- Verify no duplicate contributions
- Check DB directly via Supabase
- Ensure withdraw calculation correct

---

## Performance Notes

- ✅ Modal lazy-loaded (only shows on click)
- ✅ Minimal re-renders (only parent refreshes)
- ✅ Database queries optimized (filtered by user_id)
- ✅ No unnecessary API calls

---

## Security Notes

- ✅ User isolation (filters by user_id)
- ✅ Amount validation (no negative values)
- ✅ Balance checks (can't over-withdraw)
- ✅ Budget verification (calculated fresh each time)
- ✅ No hardcoded values (uses passed props)

---

## Future Enhancements

1. **Quest Status DB**: Track quest failures permanently
2. **Contribution History**: Show timeline of contributions
3. **Group Analytics**: Show contribution breakdown by member
4. **Limits**: Set max contribution per user
5. **Notifications**: Alert when group goal reached
6. **Recurring**: Auto-contributions on schedule
7. **Refunds**: Automatic return after event date
8. **Spending Reports**: Show circle spending impact

---

**Last Updated**: May 11, 2026
**Version**: 1.0 Complete
**Status**: Ready for production ✅
