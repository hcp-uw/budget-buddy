import { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Flame,
  Star,
  Award,
  Sparkles,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Wifi,
  HelpCircle
} from 'lucide-react';

interface Transaction {
  transaction_id?: string;
  name?: string;
  merchant_name?: string;
  amount?: number;
  date?: string;
  category?: string[];
  personal_finance_category?: { primary?: string };
}

interface GameDashboardProps {
  coins: number;
  setCoins: (coins: number) => void;
  xp: number;
  setXp: (xp: number) => void;
  streak?: number;
  initialBudget?: number;
  transactions?: Transaction[];
  onBudgetChange?: (newBudget: number) => void;
}

// Map Plaid categories to icons + colors
function getCategoryIcon(tx: Transaction) {
  const cat = (tx.personal_finance_category?.primary || tx.category?.[0] || '').toLowerCase();
  if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dining'))
    return { icon: Utensils, color: '#ff6b9d' };
  if (cat.includes('shop') || cat.includes('merchan'))
    return { icon: ShoppingCart, color: '#a78bfa' };
  if (cat.includes('travel') || cat.includes('transport') || cat.includes('auto'))
    return { icon: Car, color: '#ffd93d' };
  if (cat.includes('rent') || cat.includes('housing') || cat.includes('home'))
    return { icon: Home, color: '#4ecdc4' };
  if (cat.includes('util') || cat.includes('phone') || cat.includes('internet'))
    return { icon: Wifi, color: '#34d399' };
  return { icon: HelpCircle, color: '#c7b8ea' };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function GameDashboard({ coins, setCoins, xp, setXp, streak = 1, initialBudget = 2000, transactions = [], onBudgetChange }: GameDashboardProps) {
  // Level derived from XP: each level requires 500 XP
  const level = Math.floor(xp / 500) + 1;
  const xpForCurrentLevel = (level - 1) * 500;
  const nextLevelXP = level * 500;
  const xpProgress = Math.min(((xp - xpForCurrentLevel) / 500) * 100, 100);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [budget, setBudget] = useState(initialBudget);

  // Keep budget in sync if parent changes it (e.g. on session restore)
  useEffect(() => {
    setBudget(initialBudget);
  }, [initialBudget]);

  // Spending is $0 when there are no transactions (Plaid not connected)
  const spent = transactions.length > 0
    ? transactions.reduce((sum, tx) => {
        const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : (tx.amount || 0);
        return sum + (amount > 0 ? amount : 0);
      }, 0)
    : 0;

  const remaining = budget - spent;
  const spentPercent = Math.min((spent / budget) * 100, 100);

  const stats = [
    { label: 'Spent This Month', value: `$${Math.round(spent).toLocaleString()}`, icon: TrendingUp, color: '#4ecdc4', xp: transactions.length > 0 ? 'Live data' : 'Link bank to track' },
    { label: 'Active Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, icon: Flame, color: '#ff6b9d', xp: 'Keep it up!' },
    { label: 'Budget Used', value: `${Math.round(spentPercent)}%`, icon: Target, color: '#ffd93d', xp: remaining >= 0 ? `$${Math.round(remaining)} left` : 'Over budget!' },
    { label: 'Total XP', value: `${xp}`, icon: Star, color: '#a78bfa', xp: `Level ${level}` },
  ];

  const hasRealTransactions = transactions.length > 0;

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff6b9d] via-[#a78bfa] to-[#4ecdc4] p-6 pixel-borders">
        <h2 className="text-white pixel-font text-lg mb-2">BUDGET QUEST</h2>
        <p className="text-white text-sm opacity-90">Keep saving to level up!</p>
      </div>

      {/* Character & Level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Card */}
        <div className="lg:col-span-1 bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-[#ff6b9d] to-[#a78bfa] pixel-borders flex items-center justify-center pixel-glow">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <div className="bg-[#3d2661] px-4 py-2 pixel-borders inline-block mb-2">
              <span className="text-[#ffd93d] pixel-font text-sm">LEVEL {level}</span>
            </div>
            <p className="text-white pixel-font text-xs">Savings Hero</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="lg:col-span-1 bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
          <div className="mb-4">
            <h3 className="text-white pixel-font text-sm mb-2">EXPERIENCE</h3>
            <div className="text-[#4ecdc4] pixel-font text-xs">{xp} / {nextLevelXP} XP</div>
          </div>
          <div className="h-8 bg-[#1a0f2e] pixel-borders mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#34d399] transition-all duration-500 flex items-center justify-center"
              style={{ width: `${xpProgress}%` }}
            >
              {xpProgress > 10 && (
                <span className="text-white pixel-font text-xs">{Math.round(xpProgress)}%</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#3d2661] p-3 pixel-borders">
              <div className="text-[#c7b8ea] text-xs mb-1">To Next Level</div>
              <div className="text-white pixel-font text-sm">{nextLevelXP - xp} XP</div>
            </div>
            <div className="bg-[#3d2661] p-3 pixel-borders">
              <div className="text-[#c7b8ea] text-xs mb-1">Total XP Earned</div>
              <div className="text-white pixel-font text-sm">{xp}</div>
            </div>
          </div>
        </div>

        {/* Monthly Budget — now with real data + spend bar */}
        <div className="lg:col-span-1 bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white pixel-font text-sm">MONTHLY BUDGET</h3>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="bg-[#ff6b9d] text-white pixel-font text-xs px-2 py-1 pixel-borders hover:bg-[#ff5a8d]"
            >
              SET
            </button>
          </div>
          <div className="bg-[#3d2661] p-3 pixel-borders mb-3">
            <div className="text-[#c7b8ea] text-xs mb-1">Budget Goal</div>
            <div className="text-white pixel-font text-sm">${budget.toLocaleString()}</div>
          </div>
          <div className="bg-[#3d2661] p-3 pixel-borders mb-3">
            <div className="text-[#c7b8ea] text-xs mb-1">Spent So Far {hasRealTransactions && <span className="text-[#4ecdc4]">(live)</span>}</div>
            <div className="text-white pixel-font text-sm">${Math.round(spent).toLocaleString()}</div>
          </div>
          {/* Spend bar */}
          <div className="h-3 bg-[#1a0f2e] pixel-borders mb-3 overflow-hidden">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${spentPercent}%`,
                background: spentPercent > 90 ? '#ff6b9d' : spentPercent > 70 ? '#ffd93d' : '#4ecdc4'
              }}
            />
          </div>
          <div className="bg-[#3d2661] p-3 pixel-borders">
            <div className="text-[#c7b8ea] text-xs mb-1">Remaining</div>
            <div className={`pixel-font text-sm ${remaining < 0 ? 'text-[#ff6b9d]' : 'text-[#4ecdc4]'}`}>
              {remaining < 0 ? `-$${Math.abs(Math.round(remaining)).toLocaleString()}` : `$${Math.round(remaining).toLocaleString()}`}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#6b4e91] hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-10 h-10 pixel-borders flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '40' }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-white pixel-font text-lg mb-1">{stat.value}</div>
              <div className="text-[#c7b8ea] text-xs mb-2">{stat.label}</div>
              <div className="text-[#ffd93d] pixel-font text-xs">{stat.xp}</div>
            </div>
          );
        })}
      </div>

      {/* Daily Bonus */}
      <div className="bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] p-6 pixel-borders border-4 border-[#ff5a8d]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#1a0f2e] pixel-font text-sm mb-2">DAILY BONUS READY!</h3>
            <p className="text-[#2d1b4e] text-sm mb-3">Log in tomorrow for a streak bonus!</p>
            <div className="flex gap-2">
              {[...Array(7)].map((_, i) => ( 
                <div
                  key={i}
                  className={`w-8 h-8 pixel-borders flex items-center justify-center ${
                    i < 5 ? 'bg-white text-[#ff6b9d]' : 'bg-[#2d1b4e] text-[#6b4e91]'
                  }`}
                >
                  <span className="pixel-font text-xs">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <Award className="w-16 h-16 text-white pixel-glow" />
        </div>
      </div>

      {/* Transaction History (real) or Recent Activity (placeholder) */}
      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white pixel-font text-sm">
            {hasRealTransactions ? 'TRANSACTION HISTORY' : 'RECENT ACTIVITY'}
          </h3>
          {hasRealTransactions && (
            <span className="text-[#4ecdc4] pixel-font text-xs">{transactions.length} transactions</span>
          )}
        </div>

        {hasRealTransactions ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {transactions.slice(0, 30).map((tx, i) => {
              const { icon: CatIcon, color } = getCategoryIcon(tx);
              const isNegative = (tx.amount ?? 0) < 0; // refund/credit
              return (
                <div key={tx.transaction_id || i} className="bg-[#3d2661] p-4 pixel-borders flex items-center justify-between gap-3">
                  <div
                    className="w-9 h-9 pixel-borders flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '30' }}
                  >
                    <CatIcon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{tx.merchant_name || tx.name || 'Unknown'}</div>
                    <div className="text-[#c7b8ea] text-xs">{tx.category?.[0] || tx.personal_finance_category?.primary || 'Other'}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`pixel-font text-sm ${isNegative ? 'text-[#4ecdc4]' : 'text-[#ff6b9d]'}`}>
                      {isNegative ? '+' : '-'}${Math.abs(tx.amount ?? 0).toFixed(2)}
                    </div>
                    <div className="text-[#c7b8ea] text-xs">{formatDate(tx.date)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { id: 1, action: 'Completed "Save $50"', reward: '+50 XP, +25 coins', time: '2 hours ago' },
              { id: 2, action: 'Unlocked "Penny Pincher"', reward: '+100 XP', time: '1 day ago' },
              { id: 3, action: 'Daily login streak!', reward: '+30 XP, +10 coins', time: '1 day ago' },
              { id: 4, action: 'Saved on groceries', reward: '+25 XP, +15 coins', time: '2 days ago' },
            ].map((activity) => (
              <div key={activity.id} className="bg-[#3d2661] p-4 pixel-borders flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-white text-sm mb-1">{activity.action}</div>
                  <div className="text-[#4ecdc4] pixel-font text-xs mb-2">{activity.reward}</div>
                  <div className="text-[#c7b8ea] text-xs">{activity.time}</div>
                </div>
                <Zap className="w-5 h-5 text-[#ffd93d] pixel-bounce" />
              </div>
            ))}
          </div>
        )}
      </div>

      {showBudgetModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91] w-80" style={{ width: '500px', padding: '40px' }}>
          <h3 className="text-white pixel-font text-sm mb-6">SET MONTHLY BUDGET</h3>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            placeholder="Enter amount..."
            className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-4 focus:outline-none focus:border-[#ff6b9d]"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                const newBudget = Number(budgetInput);
                if (newBudget > 0) {
                  setBudget(newBudget);
                  onBudgetChange?.(newBudget);
                }
                setShowBudgetModal(false);
              }}
              className="flex-1 bg-[#ff6b9d] text-white pixel-font text-xs py-2 pixel-borders hover:bg-[#ff5a8d]"
            >
              CONFIRM
            </button>
            <button
              onClick={() => setShowBudgetModal(false)}
              className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders hover:bg-[#4d3671]"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
)}
    </div>
    </>
  );
}