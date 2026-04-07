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

const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: Star,
    unlocked: true,
    progress: 1,
    total: 1,
    xpReward: 50,
    rarity: 'common'
  },
  {
    id: 2,
    title: 'Penny Pincher',
    description: 'Save $100 in a single week',
    icon: Coins,
    unlocked: true,
    progress: 1,
    total: 1,
    xpReward: 100,
    rarity: 'common'
  },
  {
    id: 3,
    title: 'Streak Master',
    description: 'Maintain a 30-day streak',
    icon: Flame,
    unlocked: false,
    progress: 15,
    total: 30,
    xpReward: 200,
    rarity: 'rare'
  },
  {
    id: 4,
    title: 'Budget Boss',
    description: 'Stay under budget for 3 months',
    icon: Crown,
    unlocked: false,
    progress: 1,
    total: 3,
    xpReward: 500,
    rarity: 'epic'
  },
  {
    id: 5,
    title: 'Quest Hunter',
    description: 'Complete 50 quests',
    icon: Target,
    unlocked: false,
    progress: 23,
    total: 50,
    xpReward: 300,
    rarity: 'rare'
  },
  {
    id: 6,
    title: 'Savings Champion',
    description: 'Save $10,000 total',
    icon: Trophy,
    unlocked: false,
    progress: 4200,
    total: 10000,
    xpReward: 1000,
    rarity: 'legendary'
  },
  {
    id: 7,
    title: 'Early Bird',
    description: 'Log in before 8 AM for 7 days',
    icon: Calendar,
    unlocked: true,
    progress: 1,
    total: 1,
    xpReward: 75,
    rarity: 'common'
  },
  {
    id: 8,
    title: 'Financial Fortress',
    description: 'Build emergency fund of $5,000',
    icon: Shield,
    unlocked: false,
    progress: 2800,
    total: 5000,
    xpReward: 750,
    rarity: 'epic'
  },
  {
    id: 9,
    title: 'Level 25',
    description: 'Reach level 25',
    icon: TrendingUp,
    unlocked: false,
    progress: 12,
    total: 25,
    xpReward: 500,
    rarity: 'rare'
  },
  {
    id: 10,
    title: 'Perfect Week',
    description: 'Complete all daily quests for a week',
    icon: Award,
    unlocked: false,
    progress: 5,
    total: 7,
    xpReward: 250,
    rarity: 'rare'
  },
  {
    id: 11,
    title: 'Power Saver',
    description: 'Save $500 in one month',
    icon: Zap,
    unlocked: false,
    progress: 450,
    total: 500,
    xpReward: 200,
    rarity: 'rare'
  },
  {
    id: 12,
    title: 'Legendary Investor',
    description: 'Save $50,000 total',
    icon: Crown,
    unlocked: false,
    progress: 4200,
    total: 50000,
    xpReward: 5000,
    rarity: 'legendary'
  }
];

const rarityColors = {
  common: { bg: '#c7b8ea', glow: '#a78bfa', text: 'Common' },
  rare: { bg: '#4ecdc4', glow: '#34d399', text: 'Rare' },
  epic: { bg: '#a78bfa', glow: '#8b5cf6', text: 'Epic' },
  legendary: { bg: '#ffd93d', glow: '#ff6b9d', text: 'Legendary' }
};

export function Achievements() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

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
