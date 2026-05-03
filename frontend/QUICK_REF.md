# ⚡ Quick Reference Card

## 🚀 Run Commands

```bash
# First time
cd frontend && npm install

# Every time
npm run server      # Terminal 1 - Backend on :8000
npm run dev         # Terminal 2 - Frontend on :5173

# Or run both:
npm run dev:all
```

## 🔑 Test Credentials

**Plaid Sandbox:**
- Username: `user_good`
- Password: `pass_good`
- Code: `1111`

## 📝 .env Template

```env
PLAID_CLIENT_ID=your_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
PORT=8000
```

## 🎮 User Flow

1. See HomePage → Click "START BUDGET"
2. SignUp form → Fill username, password, budget
3. Plaid form → Click "CONNECT BANK ACCOUNT"
4. Plaid popup → Login with user_good/pass_good
5. Dashboard → See real spending calculated!

## 🐛 Quick Debug

| Problem | Fix |
|---------|-----|
| "LOADING PLAID..." stuck | Backend not running? `npm run server` |
| Spending shows 1550 | No transactions loaded. Check Plaid connection |
| User not created | Check Supabase `users` table exists |
| API errors | Check `.env` credentials are correct |
| Port in use | Kill process on port 8000 or use different PORT |

## 📊 Spending Calculation

```
Dashboard sums all transactions:
$5.50 + $87.23 + $24.99 + ... = $543.50
                    ↓
         Displays: "Spent This Month: $543.50"
```

## 🔗 URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **Health check:** http://localhost:8000/api/health
- **Plaid Dashboard:** https://dashboard.plaid.com
- **Supabase Dashboard:** https://app.supabase.com

## 📁 Key Files

- `App.tsx` - Main app, starts on HomePage
- `GameDashboard.tsx` - Displays spending calculated from transactions
- `LoginPage.tsx` - Signup form + Plaid connection
- `server.js` - Backend (in frontend folder!)
- `.env` - Your credentials

## ✅ Checklist

- [ ] `.env` file created with credentials
- [ ] `npm install` completed
- [ ] `npm run server` running (no errors)
- [ ] `npm run dev` running (no errors)
- [ ] Browser shows HomePage with "START BUDGET"
- [ ] Can click through signup form
- [ ] Plaid connects without "LOADING PLAID..." stuck
- [ ] Dashboard loads with real transactions
- [ ] "Spent This Month" shows real number (not 1550)

## 🎯 What Changed

| Before | After |
|--------|-------|
| Showed LoginPage directly | Shows HomePage first |
| Spending was hardcoded 1550 | Spending calculated from transactions |
| Backend in quickstart folder | Backend in frontend folder |
| Manual calculations | Automatic sum of all transaction amounts |

## 📊 Data Flow

```
HomePage "START BUDGET"
    ↓
LoginPage (signup)
    ↓
PlaidButton (bank connection)
    ↓
Backend (create user + get transactions)
    ↓
App.tsx (stores transactions in state)
    ↓
GameDashboard (calculates $spending!)
```

## 🆘 If Stuck

1. Check backend console for ❌ errors
2. Check frontend console (F12) for errors
3. Verify `.env` file has all 5 values
4. Verify backend running: `curl http://localhost:8000/api/health`
5. Check Supabase dashboard for tables & data
6. Read `TROUBLESHOOT.md` for detailed solutions

## 💡 Pro Tips

- Backend logs show: ✅ = success, ❌ = error
- Frontend logs show: 📊, 💰, ✅ = different operations
- Check Network tab (F12) to see API calls
- Supabase dashboard shows what's in database
- Plaid sandbox has ~5-10 fake transactions

## 🎉 You're Ready!

```bash
npm run server    # Terminal 1
npm run dev       # Terminal 2
# Open: http://localhost:5173
# Click: START BUDGET
# Enjoy: Real spending calculation! 🚀
```
