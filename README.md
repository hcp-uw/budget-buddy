# 🎮 Budget Buddy
### 💰 A dollar a day keeps your finance advisor away! 💰

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech: React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Backend-Supabase-green)](https://supabase.com/)

**Budget Buddy** is a gamified personal finance application designed to help solve the challenges many people struggle with in their finances. By converting a challenging task such as savings into a game that rewards participation and engagment with the application on a consistent bases through acitivities and streaks. Users earn XP and coins for participation on quizzes and actual money invested into group savings or personal savings accounts. Budget Buddy helps users build healthy habits through social competition, daily quests, and a retro aesthetic.

---

## 🕹️ Why Budget Buddy?
Traditional finance apps can be very complicated and confusing without professionals, Budget Buddy is easily navigable by anyone and makes such a complicating task of savings into a fun everyday activity:
* **Gamification:** Earn XP for saving and maintain your "HP" by staying within budget.
* **Social Accountability:** Budgeting is better with a party. Join "Circles" to compete or collaborate with friends.
* **Visual Storytelling:** A custom-built CRT/Pixel-art interface that makes checking your balance feel like entering a shop in an 8-bit RPG.

---

## 👾 Key Features

### 🔗 Real-Time Banking (Plaid API)
Securely link your actual bank accounts using the **Plaid API**. 
* Automatic transaction syncing.
* Secure OAuth authentication.
* *Note: Currently operating in Sandbox Mode for demonstration purposes.*

### ⭕ Social Circles & Global Standings
Groups allow people to save money towards a common goal
* **Join/Create Circles:** Create private groups with friends via a 6-digit invite code.
* **Live Leaderboards:** See who is managing their budget most effectively in real-time.
* **Switchable Views:** Easily toggle between different social circles to see various group standings without UI overlap.

### 🧠 Financial Quizzes & Streaks
Daily Grind!
* **Daily Quizzes:** Test your financial literacy with interactive mini-games.
* **Streak System:** Maintain your learning streak to unlock rare UI badges and trophies.

### 📺 Retro RPG UI
A fully custom-designed frontend featuring:
* **CRT Scanline Effects:** For that authentic 90s arcade feel.
* **Cosmic Backgrounds:** Dynamic layers featuring `GalaxySpirals`, `Comets`, and `PixelatedPlanets`.
* **Pixel-Grid Layouts:** 8-bit borders and Jersey-25 typography.

---

## 🛠️ The Tech Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | **React + Vite** | High-performance SPA architecture. |
| **Backend** | **Supabase** | Real-time DB, Auth, and Row Level Security (RLS). |
| **Finance API** | **Plaid API** | Bank-grade transaction data aggregation. |
| **Animation** | **Framer Motion** | Physics-based UI transitions and cosmic effects. |
| **Styling** | **Tailwind CSS** | Custom utility-first pixel art styling. |

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **Supabase Account** (for database and Auth)
* **Plaid Developer Account** (for Link integration)

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/hcp-uw/budget-buddy.git](https://github.com/hcp-uw/budget-buddy.git)


# Enter the frontend directory
cd budget-buddy/frontend

# Install dependencies
npm install
# Create an env file in frontend folder and paste your keys ( VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY )
# Launch Budget Buddy
npm run dev
```
### 3. Contributors
Sathvik Kotapati, Nini Le, Kaitlin Qu, Abhinav Damarla, Divyansh Kamboj, Sydney Vo, Ruoying Wu
### 4. Licenses
Distributed under the MIT License. See LICENSE for more information.
