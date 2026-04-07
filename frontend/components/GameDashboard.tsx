import { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Flame,
  Star,
  Award,
  Sparkles
} from 'lucide-react';

interface GameDashboardProps {
  coins: number;
  setCoins: (coins: number) => void;
  xp: number;
  setXp: (xp: number) => void;
}

const stats = [
  { label: 'Saved This Month', value: '$450', icon: TrendingUp, color: '#4ecdc4', xp: '+120 XP' },
  { label: 'Active Streak', value: '15 days', icon: Flame, color: '#ff6b9d', xp: 'Keep it up!' },
  { label: 'Goals Complete', value: '3/5', icon: Target, color: '#ffd93d', xp: '60%' },
  { label: 'Daily Quest', value: 'Done!', icon: Star, color: '#a78bfa', xp: '+50 XP' },
];

const recentActivity = [
  { id: 1, action: 'Completed "Save $50"', reward: '+50 XP, +25 coins', time: '2 hours ago', type: 'quest' },
  { id: 2, action: 'Unlocked "Penny Pincher"', reward: '+100 XP', time: '1 day ago', type: 'achievement' },
  { id: 3, action: 'Daily login streak!', reward: '+30 XP, +10 coins', time: '1 day ago', type: 'bonus' },
  { id: 4, action: 'Saved on groceries', reward: '+25 XP, +15 coins', time: '2 days ago', type: 'bonus' },
];

export function GameDashboard({ coins, setCoins, xp, setXp }: GameDashboardProps) {
  const [level] = useState(12);
  const currentLevelXP = 3000;
  const nextLevelXP = 4000;
  const xpProgress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
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
        <div className="lg:col-span-2 bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white pixel-font text-sm">EXPERIENCE</h3>
            <span className="text-[#4ecdc4] pixel-font text-xs">{xp} / {nextLevelXP} XP</span>
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

      {/* Recent Activity */}
      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <h3 className="text-white pixel-font text-sm mb-6">RECENT ACTIVITY</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
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
      </div>
    </div>
  );
}
