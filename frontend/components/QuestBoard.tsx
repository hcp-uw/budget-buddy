import { useState, useEffect } from 'react';
import { 
  Star,
  Coins,
  Zap,
  CheckCircle2,
  Clock,
  Flame
} from 'lucide-react';

import { updateQuizStreak } from './databaseService';


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
  canClaim?: boolean; // Whether time period has ended and quest can be claimed
  failed?: boolean; // Whether quest was failed (e.g., over budget)
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

// ✅ DATE UTILITY FUNCTIONS
function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getMonthEnd(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(now.getFullYear(), now.getMonth(), diff);
}

function getWeekEnd(): Date {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59);
  return weekEnd;
}

function getTodayStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getTodayEnd(): Date {
  const today = getTodayStart();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMilliseconds(-1);
  return tomorrow;
}

function isDateInRange(dateStr: string | undefined, start: Date, end: Date): boolean {
  if (!dateStr) return false;
  const txDate = new Date(dateStr);
  return txDate >= start && txDate <= end;
}

export function QuestBoard({ coins, setCoins, xp, setXp, userId, transactions = [], budget = 2000 }: QuestBoardProps) {
  const hasReal = transactions.length > 0;

  // 📅 Filter transactions to THIS MONTH only
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();
  const monthTransactions = transactions.filter(t => isDateInRange(t.date, monthStart, monthEnd));

  // 📊 Calculate month-based metrics
  const totalSpent = monthTransactions.reduce((s, t) => s + (t.amount && t.amount > 0 ? t.amount : 0), 0);
  const remaining = budget - totalSpent;
  const savedAmount = Math.max(0, remaining);

  // 📅 Today's spending (transactions from TODAY only)
  const todayStart = getTodayStart();
  const todayEnd = getTodayEnd();
  const todayTransactions = monthTransactions.filter(t => isDateInRange(t.date, todayStart, todayEnd));
  const spentToday = todayTransactions.reduce((s, t) => {
    const amount = t.amount ?? 0;
    return s + (amount > 0 ? amount : 0);
  }, 0);
  const savedToday = Math.max(0, 20 - spentToday); // quest goal: save $20 today (spend <$20)

  const getTimeLeft = (targetDate: Date) => {
    const diff = targetDate.getTime() - Date.now();

    if (diff <= 0) return 'Ready to claim!';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m left`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }

    return `${minutes}m left`;
  };

  const isTimePeriodComplete = (targetDate: Date): boolean => {
    return Date.now() >= targetDate.getTime();
  };

  // ✅ Quest time periods
  const dailyQuestEnd = new Date(getTodayEnd().getTime() + 1000); // Tomorrow at 00:00
  const monthlyQuestEnd = getMonthEnd();

  // ✅ Recalculate quests with real transaction data
  const calculateQuests = (): Quest[] => {
    const baseQuests: Quest[] = [
      {
        id: 1,
        title: 'Daily Saver',
        description: 'Keep spending under $20 today',
        xpReward: 25,
        coinReward: 25,
        progress: hasReal ? Math.max(0, Math.min(20, Math.round(spentToday))) : 0,
        total: 20,
        difficulty: 'easy',
        timeLeft: getTimeLeft(dailyQuestEnd),
        completed: false,
        failed: hasReal && spentToday > 20,
        canClaim: isTimePeriodComplete(dailyQuestEnd) && (hasReal ? spentToday <= 20 : false),
      },
      {
        id: 4,
        title: 'Finance Quiz',
        description: 'Complete today’s finance quiz',
        xpReward: 50,
        coinReward: 30,
        progress: 0,
        total: 1,
        difficulty: 'medium',
        timeLeft: getTimeLeft(dailyQuestEnd),
        completed: false,
        failed: false,
        canClaim: false,
      },
      {
        id: 2,
        title: 'Budget Master',
        description: 'Stay under your monthly budget',
        xpReward: 100,
        coinReward: 100,
        // Only claimable when month ends while under budget
        progress: hasReal ? Math.min(100, Math.round(((budget - totalSpent) / budget) * 100)) : 0,
        total: 100,
        difficulty: 'hard',
        timeLeft: getTimeLeft(monthlyQuestEnd),
        completed: false,
        failed: remaining < 0, // ✅ FAILS if over budget at month end
        canClaim: isTimePeriodComplete(monthlyQuestEnd) && remaining >= 0,
      },
      {
        id: 3,
        title: 'Super Saver',
        description: 'Save $500 this month',
        xpReward: 500,
        coinReward: 250,
        progress: hasReal ? Math.min(500, Math.round(totalSpent)) : 0,
        total: 500,
        difficulty: 'hard',
        timeLeft: getTimeLeft(monthlyQuestEnd),
        completed: false,
        failed: totalSpent > budget,
        canClaim: isTimePeriodComplete(monthlyQuestEnd) && (budget - totalSpent) >= 500,
      },
    ];
    return baseQuests;
  };

  const isQuizDone = localStorage.getItem(`quizCompleted_${new Date().toDateString()}`) === 'true';
  const freshQuests = calculateQuests().map(quest => 
    quest.id === 4 ? { ...quest, completed: isQuizDone, progress: isQuizDone ? 1 : 0 } : quest
  );
  const [quests, setQuests] = useState<Quest[]>(freshQuests);

  useEffect(() => {
    const isQuizDone = localStorage.getItem(`quizCompleted_${new Date().toDateString()}`) === 'true';
    setQuests(calculateQuests().map(quest =>
      quest.id === 4 ? { ...quest, completed: isQuizDone, progress: isQuizDone ? 1 : 0 } : quest
    ));
  }, [transactions, budget]);
  const [showQuiz, setShowQuiz] = useState(false);

  const quizPool = [
    { question: "What is a budget?", options: ["A spending plan", "A type of loan", "A credit score", "A bank account"], answer: 0 },
    { question: "What does APR stand for?", options: ["Annual Percentage Rate", "Applied Payment Ratio", "Average Prime Rate", "Authorized Payment Record"], answer: 0 },
    { question: "What is an emergency fund?", options: ["Money saved for unexpected expenses", "A government assistance program", "A type of investment", "A credit card limit"], answer: 0 },
    { question: "Which is a 'need' vs a 'want'?", options: ["Rent/housing", "Streaming services", "Vacation", "New clothes"], answer: 0 },
    { question: "What is compound interest?", options: ["Interest earned on principal and accumulated interest", "A fixed monthly fee", "Interest only on original amount", "A penalty for late payments"], answer: 0 },
    { question: "The 50/30/20 rule puts 20% toward what?", options: ["Savings and debt repayment", "Wants", "Needs", "Entertainment"], answer: 0 },
    { question: "What is a credit score used for?", options: ["To evaluate creditworthiness", "To track savings", "To measure income", "To calculate taxes"], answer: 0 },
    { question: "What does 'pay yourself first' mean?", options: ["Save before spending on anything else", "Pay your highest bill first", "Spend on fun before bills", "Pay off debt before saving"], answer: 0 },
    { question: "Which account typically earns more interest?", options: ["High-yield savings account", "Standard checking account", "Prepaid debit card", "Cash under the mattress"], answer: 0 },
    { question: "What is a W-4 form for?", options: ["Tell employer how much tax to withhold", "File annual taxes", "Apply for a loan", "Open a bank account"], answer: 0 },
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyQuiz = quizPool[dayOfYear % quizPool.length];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const todayKey = `quizCompleted_${new Date().toDateString()}`;
  const [quizCompleted, setQuizCompleted] = useState(() => {
    return localStorage.getItem(todayKey) === 'true';
  });

  const completeQuest = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    // ✅ Can only claim if: not completed AND time period ended AND progress threshold met
    if (!quest || quest.completed || !quest.canClaim) return;

    const newXp = xp + quest.xpReward;
    const newCoins = coins + quest.coinReward;
    setXp(newXp);
    setCoins(newCoins);
    setQuests(quests.map(q =>
      q.id === questId ? { ...q, completed: true, canClaim: false } : q
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
      {quests[0] && (
        <div className="bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] p-6 pixel-borders border-4 border-[#ff5a8d]">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-6 h-6 text-white pixel-glow" />
            <h3 className="text-[#1a0f2e] pixel-font text-sm">DAILY QUEST</h3>
          </div>
          <div className="bg-white/20 p-4 pixel-borders">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-white pixel-font text-sm mb-1">{quests[0].title}</h4>
                <p className="text-white text-sm opacity-90">{quests[0].description}</p>
              </div>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="h-6 bg-[#1a0f2e] pixel-borders mb-3 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 flex items-center justify-center"
                style={{ width: `${Math.min((quests[0].progress / quests[0].total) * 100, 100)}%` }}
              >
                {(quests[0].progress / quests[0].total) * 100 > 15 && (
                  <span className="text-[#1a0f2e] pixel-font text-xs">${quests[0].progress.toFixed(0)} / ${quests[0].total}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-white pixel-font text-xs">+{quests[0].xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-white" />
                  <span className="text-white pixel-font text-xs">+{quests[0].coinReward}</span>
                </div>
              </div>
              <span className="text-white text-xs">{quests[0].timeLeft}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quest Categories */}
      <div className="grid grid-cols-1 gap-6">
        {/* Active Quests */}
        <div>
          <h3 className="text-[#ffd93d] pixel-font text-sm mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            ACTIVE QUESTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.filter(q => !q.completed && !q.failed).map((quest) => {
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
                    {quest.id === 4 && !quizCompleted && (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="bg-[#a78bfa] text-white px-4 py-2 pixel-borders hover:bg-[#9677f7] pixel-font text-xs"
                      >
                        START QUIZ
                      </button>
                    )}
                    {quest.canClaim && !quest.completed && (
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className="bg-[#4ecdc4] text-white px-4 py-2 pixel-borders hover:bg-[#3db8af] pixel-font text-xs"
                      >
                        CLAIM
                      </button>
                    )}
                    {!quest.canClaim && !quest.completed && quest.progress < quest.total && (
                      <div className="text-[#c7b8ea] text-xs">
                        {Math.round((quest.progress / quest.total) * 100)}% done
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Failed Quests */}
        {quests.some(q => q.failed) && (
          <div>
            <h3 className="text-[#ff6b9d] pixel-font text-sm mb-4 flex items-center gap-2">
              <span className="text-lg">❌</span>
              FAILED QUESTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quests.filter(q => q.failed).map((quest) => (
                <div 
                  key={quest.id} 
                  className="bg-[#2d1b4e] p-5 pixel-borders border-4 border-[#ff6b9d] opacity-90"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">❌</span>
                    <h4 className="text-white pixel-font text-sm">{quest.title}</h4>
                  </div>
                  <p className="text-[#ff6b9d] text-sm mb-3">{quest.description}</p>
                  <div className="bg-[#3d2661]/50 p-2 pixel-borders mb-3">
                    <p className="text-[#ff6b9d] text-xs">
                      {quest.id === 2 ? '💸 You went over budget this month!' : quest.id === 1 ? '💸 You spent over $20 today!' : quest.id === 3 ? '💸 You went over budget this month!' : 'Quest failed - Better luck next time!'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-[#c7b8ea]" />
                      <span className="text-[#c7b8ea] pixel-font text-xs line-through">+{quest.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-[#c7b8ea]" />
                      <span className="text-[#c7b8ea] pixel-font text-xs line-through">+{quest.coinReward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91] w-[500px]">

            <h3 className="text-white pixel-font text-sm mb-4">
              DAILY FINANCE QUIZ
            </h3>

            <p className="text-white mb-4">
              {dailyQuiz.question}
            </p>

            <div className="space-y-3 mb-6">
              {dailyQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-3 text-left pixel-borders text-white ${
                    selectedAnswer === index
                      ? 'bg-[#4ecdc4]'
                      : 'bg-[#3d2661]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (selectedAnswer === dailyQuiz.answer) {

                    setXp(xp + 50);
                    setCoins(coins + 30);

                    setQuizCompleted(true);
                    localStorage.setItem(todayKey, 'true');
                    if (userId) updateQuizStreak(userId);


                    setQuests(
                      quests.map(q =>
                        q.id === 4
                          ? { ...q, completed: true }
                          : q
                      )
                    );
                  }

                  setShowQuiz(false);
                }}
                className="flex-1 bg-[#ff6b9d] text-white pixel-font text-xs py-2 pixel-borders"
              >
                SUBMIT
              </button>

              <button
                onClick={() => setShowQuiz(false)}
                className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders"
              >
                CANCEL
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}