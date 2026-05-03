import { useState, useEffect } from 'react';
import { GameDashboard } from './components/GameDashboard';
import { QuestBoard } from './components/QuestBoard';
import { Achievements } from './components/Achievements';
import { Shop } from './components/Shop';
import { LeaderBoard } from './components/LeaderBoard';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import PlaidButton from './PlaidButton';
import { calculateMonthlySpent } from './components/databaseService';

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

type View = 'start' | 'login' | 'dashboard' | 'quests' | 'achievements' | 'shop' | 'friends'|'profile';

interface UserData {
  userId: string;
  email: string;
  transactions: any[];
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('start');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coins, setCoins] = useState(1250);
  const [xp, setXp] = useState(3450);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [username, setUsername] = useState('Player');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(2000);

  const navItems = [
    { id: 'dashboard' as View, label: 'Home', icon: Gamepad2 },
    { id: 'quests' as View, label: 'Quests', icon: Scroll },
    { id: 'achievements' as View, label: 'Trophies', icon: Trophy },
    { id: 'shop' as View, label: 'Shop', icon: ShoppingBag },
    { id: 'friends' as View, label: 'Friends', icon: ContactRound },
    { id: 'profile' as View, label: 'Profile', icon: User },
  ];

  // Calculate spent whenever transactions change
  useEffect(() => {
    if (userTransactions.length > 0) {
      const spent = calculateMonthlySpent(userTransactions);
      setTotalSpent(spent);
      console.log('💰 Total spent calculated:', spent, 'from', userTransactions.length, 'transactions');
    }
  }, [userTransactions]);

  // Show start/intro page with "START BUDGET" button
  if (currentView === 'start') {
    return (
      <HomePage 
        onPlayClick={() => setCurrentView('login')}
      />
    );
  }

  // Show login page
  if (currentView === 'login') {
    return (
      <LoginPage 
        onBack={() => {
          setCurrentView('start');
          setUsername('Player');
          setUserId(null);
          setUserEmail(null);
          setUserTransactions([]);
        }}
        onLoginSuccess={(budget: number, transactions: any[], userName: string) => {
          console.log('✅ Login successful:', userName, 'with', transactions.length, 'transactions');
          setMonthlyBudget(budget);
          setUserTransactions(transactions);
          setUsername(userName);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => {
          setCurrentView(item.id);
          setIsMenuOpen(false);
        }}
        className={`w-full flex items-center justify-center gap-3 py-4 transition-all pixel-borders ${
          currentView === item.id
            ? 'bg-[#ff6b9d] text-white'
            : 'bg-[#3d2661] text-white hover:bg-[#4d3671]'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {isSidebarHovered && (
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-[#ff6b9d] p-2 pixel-borders hover:bg-[#ff5a8d]"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 space-y-2">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed min-h-screen bg-[#2d1b4e] border-r-4 border-[#6b4e91] transition-all duration-300 ease-in-out z-50 ${
            isSidebarHovered ? 'w-64' : 'w-16'
          }`}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <div
            className={`${isSidebarHovered ? 'p-6' : 'p-2'}`}
            style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
          >
            <div style={{ height: '160px' }}>
              {isSidebarHovered && (
                <>
                  <h1 className="text-[#ffd93d] pixel-font text-sm mb-2">BUDGET BUDDY</h1>
                  <p className="text-[#c7b8ea] text-xs mb-6">UserName: {username}</p>
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
              {navItems.map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>

            {/* Logout */}
            <button
              onClick={() => {
                setCurrentView('start');
                setUsername('Player');
                setUserId(null);
                setUserEmail(null);
                setUserTransactions([]);
                setTotalSpent(0);
              }}
              className="w-full flex items-center justify-center gap-3 py-4 transition-all pixel-borders bg-[#3d2661] text-white hover:bg-[#ff6b9d] mt-4"
              style={{ cursor: 'pointer', marginTop: 'auto' }}
            >
              <span className="text-xs pixel-font">
                {isSidebarHovered ? 'LOGOUT' : '↩'}
              </span>
            </button>
          </div>
        </aside>

        <div style={{ position: 'fixed', left: '92px', top: '50%', transform: 'translateY(-50%)', zIndex: 45, width: '364px', height: '750px', 
          display: 'flex', justifyContent: 'center', border: '4px solid #6b4e91', backgroundColor: '#2d1b4e', padding: '8px', paddingTop: '100px'  }}>
  <img 
    src="/Moolah.png" 
    alt="Moolah"
    style={{ imageRendering: 'pixelated', width: '500px', height: '510px' }} 
  />
</div>

        {/* Floating Coins (collapsed sidebar) */}
        <div
          className="flex fixed top-4 z-40 items-center gap-2 px-2 py-1"
          style={{ left: '68px' }}
        >
          <Coins className="w-4 h-4 text-[#ffd93d]" />
          <span className="text-[#ffd93d] pixel-font text-[8px]">{coins}</span>
        </div>

        {/* Main Content */}
        <main
          className="p-4 lg:p-8 relative"
          style={{ marginLeft: '450px', width: 'calc(100% - 400px)' }}
        >
          {currentView === 'dashboard' && <GameDashboard coins={coins} setCoins={setCoins} xp={xp} setXp={setXp} initialBudget={monthlyBudget} transactions={userTransactions} />}
          {currentView === 'quests' && <QuestBoard coins={coins} setCoins={setCoins} xp={xp} setXp={setXp} transactions={userTransactions} budget={monthlyBudget} />}
          {currentView === 'achievements' && <Achievements />}
          {currentView === 'shop' && <Shop coins={coins} setCoins={setCoins} />}
          {currentView === 'friends' && <LeaderBoard coins={coins} setCoins={setCoins} />}
          {currentView === 'profile' && <ProfilePage username={username} />}
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