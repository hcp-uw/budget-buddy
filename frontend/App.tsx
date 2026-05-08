import { useState, useEffect } from 'react';
import { GameDashboard } from './components/GameDashboard';
import { QuestBoard } from './components/QuestBoard';
import { Achievements } from './components/Achievements';
import { Shop } from './components/Shop';
import { LeaderBoard } from './components/LeaderBoard';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { loadGameState, saveGameState } from './components/databaseService';

import {
  Gamepad2,
  Trophy,
  Scroll,
  ShoppingBag,
  Menu,
  Coins,
  ContactRound,
  User
} from 'lucide-react';

type View = 'start' | 'login' | 'dashboard' | 'quests' | 'achievements' | 'shop' | 'friends' | 'profile';

const SESSION_KEY = 'budgetbuddy_session';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('start');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [username, setUsername] = useState('Player');
  const [userId, setUserId] = useState<string | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(2000);
  const [cowFilter, setCowFilter] = useState('');
  const [crownEquipped, setCrownEquipped] = useState(false);
  const [sunglassesEquipped, setSunglassesEquipped] = useState(false);
  const [ufoEquipped, setUfoEquipped] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const session = JSON.parse(saved);
        setUserId(session.userId);
        setUsername(session.username);
        setMonthlyBudget(session.monthlyBudget || 2000);
        loadGameState(session.userId).then(({ xp, coins, streakCount }) => {
          setXp(xp);
          setCoins(coins);
          setStreak(streakCount);
        });
        setCurrentView('dashboard');
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // Persist XP and coins to DB whenever they change (debounced)
  useEffect(() => {
    if (!userId) return;
    const timer = setTimeout(() => {
      saveGameState(userId, xp, coins);
    }, 800);
    return () => clearTimeout(timer);
  }, [xp, coins, userId]);

  const handleLoginSuccess = (budget: number, transactions: any[], userName: string, uid: string) => {
    setMonthlyBudget(budget);
    setUserTransactions(transactions);
    setUsername(userName);
    setUserId(uid);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: uid, username: userName, monthlyBudget: budget }));
    loadGameState(uid).then(({ xp, coins, streakCount }) => {
      setXp(xp);
      setCoins(coins);
      setStreak(streakCount);
    });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentView('start');
    setUsername('Player');
    setUserId(null);
    setUserTransactions([]);
    setCoins(0);
    setXp(0);
    setStreak(1);
    setMonthlyBudget(2000);
  };

  const handleBudgetChange = (newBudget: number) => {
    setMonthlyBudget(newBudget);
    if (userId && username) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, username, monthlyBudget: newBudget }));
      fetch('http://localhost:8000/api/update-budget', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newBudget })
      }).catch(console.error);
    }
  };

  const navItems = [
    { id: 'dashboard' as View, label: 'Home', icon: Gamepad2 },
    { id: 'quests' as View, label: 'Quests', icon: Scroll },
    { id: 'achievements' as View, label: 'Trophies', icon: Trophy },
    { id: 'shop' as View, label: 'Shop', icon: ShoppingBag },
    { id: 'friends' as View, label: 'Friends', icon: ContactRound },
    { id: 'profile' as View, label: 'Profile', icon: User },
  ];

  if (currentView === 'start') {
    return <HomePage onPlayClick={() => setCurrentView('login')} />;
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onBack={() => setCurrentView('start')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const NavButton = ({ item, showLabel = false }: { item: typeof navItems[0]; showLabel?: boolean }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => { setCurrentView(item.id); setIsMenuOpen(false); }}
        className={`w-full flex items-center justify-center gap-3 py-4 transition-all pixel-borders ${
          currentView === item.id ? 'bg-[#ff6b9d] text-white' : 'bg-[#3d2661] text-white hover:bg-[#4d3671]'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {(isSidebarHovered || showLabel) && (
          <span className="text-xs pixel-font whitespace-nowrap">{item.label}</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a0f2e] overflow-x-hidden">
      {/* Stars Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#2d1b4e] border-b-4 border-[#6b4e91] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[#ffd93d] pixel-font text-xs">BUDGET QUEST</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#3d2661] px-3 py-2 pixel-borders">
              <Coins className="w-4 h-4 text-[#ffd93d]" />
              <span className="text-[#ffd93d] pixel-font text-xs">{coins}</span>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-[#ff6b9d] p-2 pixel-borders hover:bg-[#ff5a8d]">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 space-y-2">
            {navItems.map((item) => <NavButton key={item.id} item={item} showLabel />)}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 pixel-borders bg-[#3d2661] text-white hover:bg-[#ff6b9d]"
            >
              <span className="text-xs pixel-font">LOGOUT</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed min-h-screen bg-[#2d1b4e] border-r-4 border-[#6b4e91] transition-all duration-300 ease-in-out z-50 ${isSidebarHovered ? 'w-64' : 'w-16'}`}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <div className={`${isSidebarHovered ? 'p-6' : 'p-2'}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ height: '160px' }}>
              {isSidebarHovered && (
                <>
                  <h1 className="text-[#ffd93d] pixel-font text-sm mb-2">BUDGET BUDDY</h1>
                  <p className="text-[#c7b8ea] text-xs mb-6">User: {username}</p>
                  <div className="mb-6 bg-[#3d2661] p-4 pixel-borders">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-[#ffd93d]" />
                      <span className="text-[#ffd93d] pixel-font text-sm">{coins}</span>
                    </div>
                    <div className="text-[#c7b8ea] text-xs">Gold Coins</div>
                  </div>
                </>
              )}
            </div>

            <nav className="space-y-3">
              {navItems.map((item) => <NavButton key={item.id} item={item} />)}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 transition-all pixel-borders bg-[#3d2661] text-white hover:bg-[#ff6b9d] mt-4"
              style={{ cursor: 'pointer', marginTop: 'auto' }}
            >
              <span className="text-xs pixel-font">{isSidebarHovered ? 'LOGOUT' : '↩'}</span>
            </button>
          </div>
        </aside>

        {/* Moolah mascot */}
        <div style={{ position: 'fixed', left: '92px', top: '50%', transform: 'translateY(-50%)', zIndex: 45, width: '364px', height: '750px',
          display: 'flex', justifyContent: 'center', border: '4px solid #6b4e91', backgroundColor: '#2d1b4e', padding: '8px', paddingTop: '100px' }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {crownEquipped && (
              <div style={{ position: 'absolute', top: '25px', left: '52%', transform: 'translateX(-50%)', zIndex: 46, fontSize: '80px' }}>
                👑
              </div>
            )}
            {sunglassesEquipped && (
              <div style={{ position: 'absolute', top: '78px', left: '52%', transform: 'translateX(-50%) scaleX(1.18)', zIndex: 46, fontSize: '160px', filter: 'brightness(0.4)' }}>
                🕶️
              </div>
            )}
            {ufoEquipped && (
              <div style={{ position: 'absolute', top: '-120px', left: '60%', transform: 'translateX(-50%)', zIndex: 46, fontSize: '180px' }}>
                🛸
              </div>
            )}
            <img
              src="./Moolah.png"
              alt="Moolah"
              style={{ imageRendering: 'pixelated', width: '500px', height: '510px', filter: cowFilter }}
            />
          </div>
        </div>

        {/* Floating Coins (collapsed sidebar) */}
        <div className="flex fixed top-4 z-40 items-center gap-2 px-2 py-1" style={{ left: '68px' }}>
          <Coins className="w-4 h-4 text-[#ffd93d]" />
          <span className="text-[#ffd93d] pixel-font text-[8px]">{coins}</span>
        </div>

        {/* Main Content */}
        <main className="p-4 lg:p-8 relative" style={{ marginLeft: '450px', width: 'calc(100% - 400px)' }}>
          {currentView === 'dashboard' && (
            <GameDashboard
              coins={coins} setCoins={setCoins}
              xp={xp} setXp={setXp}
              streak={streak}
              initialBudget={monthlyBudget}
              transactions={userTransactions}
              onBudgetChange={handleBudgetChange}
            />
          )}
          {currentView === 'quests' && (
            <QuestBoard
              coins={coins} setCoins={setCoins}
              xp={xp} setXp={setXp}
              userId={userId}
              transactions={userTransactions}
              budget={monthlyBudget}
            />
          )}
          {currentView === 'achievements' && <Achievements />}
          {currentView === 'shop' && <Shop coins={coins} setCoins={setCoins} setCowFilter={setCowFilter}
           setCrownEquipped={setCrownEquipped} crownEquipped={crownEquipped} cowFilter={cowFilter}
           setSunglassesEquipped={setSunglassesEquipped} sunglassesEquipped={sunglassesEquipped}
           setUfoEquipped={setUfoEquipped} ufoEquipped = {ufoEquipped}/>}
          {currentView === 'friends' && <LeaderBoard coins={coins} setCoins={setCoins} userId={userId || ''} />}
          {currentView === 'profile' && <ProfilePage username={username} userId={userId || ''} />}
        </main>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
