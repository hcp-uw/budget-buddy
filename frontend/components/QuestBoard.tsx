import { useState } from 'react';
import { 
  Star,
  Coins,
  Zap,
  CheckCircle2,
  Clock,
  Flame
} from 'lucide-react';

interface Quest {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  total: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft?: string;
  completed: boolean;
}

interface Transaction {
  transaction_id?: string;
  name?: string;
  merchant_name?: string;
  amount?: number;
  date?: string;
  category?: string[];
  personal_finance_category?: { primary?: string };
}

interface QuestBoardProps {
  coins: number;
  setCoins: (coins: number) => void;
  xp: number;
  setXp: (xp: number) => void;
  userId?: string | null;
  transactions?: Transaction[];
  budget?: number;
}

export function QuestBoard({ coins, setCoins, xp, setXp, userId, transactions = [], budget = 2000 }: QuestBoardProps) {
  const hasReal = transactions.length > 0;

  // Derive real progress values from Plaid transactions
  const txCount = transactions.length;
  const totalSpent = transactions.reduce((s, t) => s + (t.amount && t.amount > 0 ? t.amount : 0), 0);
  const remaining = budget - totalSpent;
  const savedAmount = Math.max(0, remaining);

  // Today's spending (transactions from today)
  const today = new Date().toISOString().split('T')[0];
  const spentToday = transactions
    .filter(t => t.date === today && (t.amount ?? 0) > 0)
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  const savedToday = Math.max(0, 20 - spentToday); // quest goal: save $20 today (spend <$20)

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: 'Daily Saver',
      description: 'Keep spending under $20 today',
      xpReward: 50,
      coinReward: 25,
      progress: hasReal ? Math.min(Math.round(savedToday), 20) : 15,
      total: 20,
      difficulty: 'easy',
      timeLeft: '6h left',
      completed: false
    },
    {
      id: 2,
      title: 'Budget Master',
      description: 'Stay under your monthly budget',
      xpReward: 200,
      coinReward: 100,
      progress: hasReal ? (remaining >= 0 ? 7 : Math.max(0, Math.round(7 * (remaining + budget) / budget))) : 5,
      total: 7,
      difficulty: 'hard',
      timeLeft: '2d left',
      completed: false
    },
    {
      id: 3,
      title: 'Expense Tracker',
      description: 'Log 10 transactions via your bank',
      xpReward: 75,
      coinReward: 40,
      progress: hasReal ? Math.min(txCount, 10) : 7,
      total: 10,
      difficulty: 'easy',
      completed: false
    },
    {
      id: 4,
      title: 'Goal Getter',
      description: `Save $500 this month`,
      xpReward: 300,
      coinReward: 150,
      progress: hasReal ? Math.min(Math.round(savedAmount), 500) : 450,
      total: 500,
      difficulty: 'hard',
      timeLeft: '5d left',
      completed: false
    },
    {
      id: 5,
      title: 'Smart Shopper',
      description: 'Make fewer than 3 shopping transactions',
      xpReward: 100,
      coinReward: 50,
      progress: hasReal
        ? Math.min(transactions.filter(t => {
            const c = (t.personal_finance_category?.primary || t.category?.[0] || '').toLowerCase();
            return c.includes('shop') || c.includes('merchan');
          }).length, 3)
        : 2,
      total: 3,
      difficulty: 'medium',
      timeLeft: '3d left',
      completed: false
    },
    {
      id: 6,
      title: 'Streak Hero',
      description: 'Maintain a 30-day login streak',
      xpReward: 500,
      coinReward: 250,
      progress: 15,
      total: 30,
      difficulty: 'hard',
      completed: false
    }
  ]);

  const completeQuest = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed || quest.progress < quest.total) return;

    const newXp = xp + quest.xpReward;
    const newCoins = coins + quest.coinReward;
    setXp(newXp);
    setCoins(newCoins);
    setQuests(quests.map(q =>
      q.id === questId ? { ...q, completed: true } : q
    ));
    // App.tsx debounce will persist to DB automatically via the useEffect
  };

  const difficultyColors = {
    easy: { bg: '#4ecdc4', border: '#3db8af' },
    medium: { bg: '#ffd93d', border: '#e6c234' },
    hard: { bg: '#ff6b9d', border: '#e65a8c' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a78bfa] to-[#ff6b9d] p-6 pixel-borders">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white pixel-font text-lg mb-2">QUEST BOARD</h2>
            <p className="text-white text-sm opacity-90">Complete quests to earn XP & coins!</p>
          </div>
          {hasReal && (
            <div className="bg-white/20 px-3 py-1 pixel-borders">
              <span className="text-white pixel-font text-xs">⚡ LIVE DATA</span>
            </div>
          )}
        </div>
      </div>

      {/* Daily Quest Highlight */}
      <div className="bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] p-6 pixel-borders border-4 border-[#ff5a8d]">
        <div className="flex items-center gap-3 mb-3">
          <Flame className="w-6 h-6 text-white pixel-glow" />
          <h3 className="text-[#1a0f2e] pixel-font text-sm">DAILY QUEST</h3>
        </div>
        <div className="bg-white/20 p-4 pixel-borders">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-white pixel-font text-sm mb-1">Daily Saver</h4>
              <p className="text-white text-sm opacity-90">Save $20 today</p>
            </div>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="h-6 bg-[#1a0f2e] pixel-borders mb-3 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500 flex items-center justify-center"
              style={{ width: '75%' }}
            >
              <span className="text-[#1a0f2e] pixel-font text-xs">$15 / $20</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-white pixel-font text-xs">+50 XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-white" />
                <span className="text-white pixel-font text-xs">+25</span>
              </div>
            </div>
            <span className="text-white text-xs">6h left</span>
          </div>
        </div>
      </div>

      {/* Quest Categories */}
      <div className="grid grid-cols-1 gap-6">
        {/* Active Quests */}
        <div>
          <h3 className="text-[#ffd93d] pixel-font text-sm mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            ACTIVE QUESTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.filter(q => !q.completed).map((quest) => {
              const progress = (quest.progress / quest.total) * 100;
              const canClaim = quest.progress >= quest.total;
              const colors = difficultyColors[quest.difficulty];
              
              return (
                <div 
                  key={quest.id} 
                  className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#6b4e91] hover:border-[#a78bfa] transition-all"
                >
                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="px-3 py-1 pixel-borders text-xs pixel-font uppercase"
                      style={{ backgroundColor: colors.bg, color: '#1a0f2e' }}
                    >
                      {quest.difficulty}
                    </div>
                    {quest.timeLeft && (
                      <div className="flex items-center gap-1 text-[#c7b8ea] text-xs">
                        <Clock className="w-3 h-3" />
                        {quest.timeLeft}
                      </div>
                    )}
                  </div>

                  {/* Quest Info */}
                  <h4 className="text-white pixel-font text-sm mb-2">{quest.title}</h4>
                  <p className="text-[#c7b8ea] text-sm mb-4">{quest.description}</p>

                  {/* Progress Bar */}
                  <div className="h-6 bg-[#1a0f2e] pixel-borders mb-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#34d399] transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                      {progress > 15 && (
                        <span className="text-white pixel-font text-xs">
                          {quest.progress}/{quest.total}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-[#ffd93d]" />
                        <span className="text-[#ffd93d] pixel-font text-xs">+{quest.xpReward}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-[#ffd93d]" />
                        <span className="text-[#ffd93d] pixel-font text-xs">+{quest.coinReward}</span>
                      </div>
                    </div>
                    {canClaim && (
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className="bg-[#4ecdc4] text-white px-4 py-2 pixel-borders hover:bg-[#3db8af] pixel-font text-xs"
                      >
                        CLAIM
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Quests */}
        {quests.some(q => q.completed) && (
          <div>
            <h3 className="text-[#4ecdc4] pixel-font text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              COMPLETED
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quests.filter(q => q.completed).map((quest) => (
                <div 
                  key={quest.id} 
                  className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#4ecdc4] opacity-75"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4ecdc4]" />
                    <h4 className="text-white pixel-font text-sm">{quest.title}</h4>
                  </div>
                  <p className="text-[#c7b8ea] text-sm mb-3">{quest.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-[#4ecdc4]" />
                      <span className="text-[#4ecdc4] pixel-font text-xs">+{quest.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-[#4ecdc4]" />
                      <span className="text-[#4ecdc4] pixel-font text-xs">+{quest.coinReward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}