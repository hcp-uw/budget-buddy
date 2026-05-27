
# 🎮 Budget Buddy - Frontend + Backend

Complete Budget Buddy application with Plaid integration for real bank transactions.

## 🚀 Quick Start

### Setup (First Time)
```bash
npm install
cp .env.example .env  # Add your credentials
```

### Run
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

Then open: http://localhost:5173

## 📚 Documentation

- **`QUICK_REF.md`** - Quick commands (1 min)
- **`START_HERE.md`** - Step-by-step setup (5 min)
- **`GUIDE.md`** - Complete guide (15 min)
- **`TROUBLESHOOT.md`** - Problem solving (as needed)
- **`VISUAL_SUMMARY.md`** - Diagrams & flows (5 min)

👉 **Start with QUICK_REF.md**

## ✨ Features

✅ Original HomePage with "START BUDGET" button
✅ Complete signup flow (form → Plaid → Dashboard)
✅ Real transaction spending calculated from Plaid
✅ Backend + Frontend in one folder
✅ Detailed logging for debugging
✅ Supabase integration for data storage

## 🎮 User Flow

1. See HomePage → Click "START BUDGET"
2. Fill signup form (username, password, budget)
3. Connect to bank via Plaid
4. Dashboard shows real transactions & spending calculated

## 🔑 Test Credentials

**Plaid Sandbox:**
- Username: `user_good`
- Password: `pass_good`
- Code: `1111`

## 📋 Setup Checklist

- [ ] `npm install` completed
- [ ] `.env` file created with credentials
- [ ] Backend running: `npm run server`
- [ ] Frontend running: `npm run dev`
- [ ] Browser shows HomePage
- [ ] Can signup and connect Plaid
- [ ] Dashboard shows real spending ✅

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express
- **Payments:** Plaid API
- **Database:** Supabase
- **Animations:** Framer Motion
- **UI:** Radix UI components

## 📦 Project Structure

```
frontend/
├── server.js              # Backend (Express)
├── App.tsx               # Main app
├── PlaidButton.jsx       # Plaid integration
├── components/
│   ├── HomePage.tsx      # Start screen
│   ├── LoginPage.tsx     # Signup + Plaid
│   ├── GameDashboard.tsx # Dashboard with spending
│   └── ...
├── .env                  # Your credentials
├── package.json          # All dependencies
└── README.md             # This file
```

## 🔗 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Health check: http://localhost:8000/api/health

## 💡 Key Changes

- ✅ HomePage restored (shows start screen first)
- ✅ Spending calculated from real Plaid transactions
- ✅ Backend moved to frontend folder
- ✅ Better logging for debugging
- ✅ Complete signup flow working

## 🐛 Troubleshooting

**"LOADING PLAID..." stuck?**
- Verify backend running: `npm run server`
- Check `.env` has PLAID credentials

**Spending shows 1550?**
- Check Plaid connection completed
- Verify transactions loaded in console

**User not created?**
- Check Supabase `users` table exists
- Verify SUPABASE credentials in `.env`

See `TROUBLESHOOT.md` for more solutions.

## 📊 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/create_link_token` | Initialize Plaid Link |
| `POST /api/create_user` | Create/get user by email |
| `POST /api/set_access_token` | Exchange Plaid token |
| `GET /api/transactions` | Fetch transactions |
| `GET /api/health` | Health check |

## 🎯 Next Features

- [ ] Budget tracking & alerts
- [ ] Points/rewards system
- [ ] Learning streaks
- [ ] Leaderboards
- [ ] User profiles
- [ ] More categories

## 📖 Full Documentation

Read the docs in this order:
1. **QUICK_REF.md** (commands & essentials)
2. **START_HERE.md** (setup instructions)
3. **GUIDE.md** (complete documentation)
4. **TROUBLESHOOT.md** (problem solving)

---

**Everything is ready to go!** Start with: `npm install` → `npm run server` → `npm run dev`

