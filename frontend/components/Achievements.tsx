import { 
  Trophy,
  Star,
  Award,
  Target,
  Zap,
  Crown,
  Flame,
  Lock,
  TrendingUp,
  Coins,
  Calendar,
  Shield
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

interface AchievementsProps {
  transactions?: Transaction[];
  budget?: number;
  coins?: number;
  xp?: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  total: number;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ✅ DATE UTILITY FUNCTIONS
function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getMonthEnd(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

function isDateInRange(dateStr: string | undefined, start: Date, end: Date): boolean {
  if (!dateStr) return false;
  const txDate = new Date(dateStr);
  return txDate >= start && txDate <= end;
}

const rarityColors = {
  common: { bg: '#c7b8ea', glow: '#a78bfa', text: 'Common' },
  rare: { bg: '#4ecdc4', glow: '#34d399', text: 'Rare' },
  epic: { bg: '#a78bfa', glow: '#8b5cf6', text: 'Epic' },
  legendary: { bg: '#ffd93d', glow: '#ff6b9d', text: 'Legendary' }
};

export function Achievements({ transactions = [], budget = 2000, coins = 0, xp = 0 }: AchievementsProps) {
  // 📅 Filter transactions to THIS MONTH only
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();
  const monthTransactions = transactions.filter(t => isDateInRange(t.date, monthStart, monthEnd));

  // 📊 Calculate spending and savings
  const totalSpent = monthTransactions.reduce((s: number, t: Transaction) => s + (t.amount && t.amount > 0 ? t.amount : 0), 0);
  const remaining = budget - totalSpent;
  const savedAmount = Math.max(0, remaining);
  const level = Math.floor(xp / 500) + 1;

  // 🏆 Calculate achievement progress dynamically based on REAL transactions
  const calculateAchievements = (): Achievement[] => [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first transaction',
      icon: Star,
      unlocked: transactions.length > 0,
      progress: transactions.length > 0 ? 1 : 0,
      total: 1,
      xpReward: 50,
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Penny Pincher',
      description: 'Save $100 in this month',
      icon: Coins,
      unlocked: savedAmount >= 100,
      progress: Math.min(100, Math.round(savedAmount)),
      total: 100,
      xpReward: 100,
      rarity: 'common'
    },
    {
      id: 3,
      title: 'Budget Boss',
      description: 'Stay under budget this month',
      icon: Crown,
      unlocked: remaining >= 0 && transactions.length > 0,
      progress: remaining >= 0 ? 1 : 0,
      total: 1,
      xpReward: 200,
      rarity: 'rare'
    },
    {
      id: 4,
      title: 'Power Saver',
      description: 'Save $500 in one month',
      icon: Zap,
      unlocked: savedAmount >= 500,
      progress: Math.min(500, Math.round(savedAmount)),
      total: 500,
      xpReward: 200,
      rarity: 'rare'
    },
    {
      id: 5,
      title: 'Savings Champion',
      description: 'Save $1,000 total',
      icon: Trophy,
      unlocked: savedAmount >= 1000,
      progress: Math.min(1000, Math.round(savedAmount)),
      total: 1000,
      xpReward: 500,
      rarity: 'epic'
    },
    {
      id: 6,
      title: 'Financial Fortress',
      description: 'Save $5,000 total',
      icon: Shield,
      unlocked: savedAmount >= 5000,
      progress: Math.min(5000, Math.round(savedAmount)),
      total: 5000,
      xpReward: 750,
      rarity: 'epic'
    },
    {
      id: 7,
      title: 'Level 25',
      description: 'Reach level 25',
      icon: TrendingUp,
      unlocked: level >= 25,
      progress: Math.min(level, 25),
      total: 25,
      xpReward: 500,
      rarity: 'rare'
    },
    {
      id: 8,
      title: 'Legendary Investor',
      description: 'Save $10,000 total',
      icon: Crown,
      unlocked: savedAmount >= 10000,
      progress: Math.min(10000, Math.round(savedAmount)),
      total: 10000,
      xpReward: 2000,
      rarity: 'legendary'
    },
    {
      id: 9,
      title: 'Transaction Tracker',
      description: 'Track 100 transactions',
      icon: Target,
      unlocked: transactions.length >= 100,
      progress: Math.min(transactions.length, 100),
      total: 100,
      xpReward: 300,
      rarity: 'rare'
    },
    {
      id: 10,
      title: 'Money Master',
      description: 'Reach level 50',
      icon: Award,
      unlocked: level >= 50,
      progress: Math.min(level, 50),
      total: 50,
      xpReward: 1000,
      rarity: 'legendary'
    },
  ];

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter((a: Achievement) => a.unlocked).length;
  const totalXP = achievements.filter((a: Achievement) => a.unlocked).reduce((sum: number, a: Achievement) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffd93d] via-[#ff6b9d] to-[#a78bfa] p-6 pixel-borders">
        <h2 className="text-[#1a0f2e] pixel-font text-lg mb-2">TROPHY ROOM</h2>
        <p className="text-[#1a0f2e] text-sm opacity-90">Showcase your achievements!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#6b4e91]">
          <Trophy className="w-8 h-8 text-[#ffd93d] mb-3" />
          <div className="text-white pixel-font text-2xl mb-1">{unlockedCount}/{achievements.length}</div>
          <div className="text-[#c7b8ea] text-sm">Unlocked</div>
        </div>
        <div className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#6b4e91]">
          <Zap className="w-8 h-8 text-[#4ecdc4] mb-3" />
          <div className="text-white pixel-font text-2xl mb-1">{totalXP}</div>
          <div className="text-[#c7b8ea] text-sm">XP Earned</div>
        </div>
        <div className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#6b4e91]">
          <Star className="w-8 h-8 text-[#ff6b9d] mb-3" />
          <div className="text-white pixel-font text-2xl mb-1">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
          <div className="text-[#c7b8ea] text-sm">Complete</div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const rarity = rarityColors[achievement.rarity];
          const progress = (achievement.progress / achievement.total) * 100;

          return (
            <div
              key={achievement.id}
              className={`bg-[#2d1b4e] p-5 pixel-borders border-4 transition-all ${
                achievement.unlocked
                  ? 'border-[' + rarity.bg + '] hover:scale-105'
                  : 'border-[#6b4e91] opacity-75'
              }`}
              style={achievement.unlocked ? { borderColor: rarity.bg } : {}}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div 
                  className={`w-16 h-16 pixel-borders flex items-center justify-center ${
                    achievement.unlocked ? 'pixel-glow' : ''
                  }`}
                  style={{ 
                    backgroundColor: achievement.unlocked ? rarity.bg + '40' : '#3d2661'
                  }}
                >
                  {achievement.unlocked ? (
                    <Icon 
                      className="w-8 h-8" 
                      style={{ color: rarity.bg }}
                    />
                  ) : (
                    <Lock className="w-8 h-8 text-[#6b4e91]" />
                  )}
                </div>
                <div 
                  className="px-2 py-1 pixel-borders text-xs pixel-font"
                  style={{ 
                    backgroundColor: achievement.unlocked ? rarity.bg : '#3d2661',
                    color: achievement.unlocked ? '#1a0f2e' : '#c7b8ea'
                  }}
                >
                  {rarity.text.toUpperCase()}
                </div>
              </div>

              {/* Info */}
              <h3 className="text-white pixel-font text-sm mb-2">{achievement.title}</h3>
              <p className="text-[#c7b8ea] text-sm mb-4">{achievement.description}</p>

              {/* Progress */}
              {!achievement.unlocked && (
                <>
                  <div className="h-4 bg-[#1a0f2e] pixel-borders mb-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#34d399] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[#c7b8ea] text-xs mb-3">
                    {achievement.progress} / {achievement.total}
                  </div>
                </>
              )}

              {/* Reward */}
              <div className="flex items-center gap-1 mt-auto">
                <Zap className={`w-4 h-4 ${achievement.unlocked ? 'text-[#ffd93d]' : 'text-[#6b4e91]'}`} />
                <span className={`pixel-font text-xs ${achievement.unlocked ? 'text-[#ffd93d]' : 'text-[#6b4e91]'}`}>
                  +{achievement.xpReward} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
