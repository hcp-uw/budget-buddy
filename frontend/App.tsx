import { useState } from 'react';
import { GameDashboard } from './components/GameDashboard';
import { QuestBoard } from './components/QuestBoard';
import { Achievements } from './components/Achievements';
import { Shop } from './components/Shop';
import{ LeaderBoard } from './components/LeaderBoard';
import{HomePage} from './components/HomePage';
import{LoginPage} from './components/LoginPage';
import { PixelBuddy } from './components/PixelBuddy';

import {
  Gamepad2,
  Trophy,
  Scroll,
  ShoppingBag,
  Menu,
  Coins,
  ContactRound
} from 'lucide-react';

type View = 'HomePage' | 'LoginPage' | 'dashboard' | 'quests' | 'achievements' | 'shop' | 'friends';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('HomePage');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coins, setCoins] = useState(1250);
  const [xp, setXp] = useState(3450);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const navItems = [
    { id: 'dashboard' as View, label: 'Home', icon: Gamepad2 },
    { id: 'quests' as View, label: 'Quests', icon: Scroll },
    { id: 'achievements' as View, label: 'Trophies', icon: Trophy },
    { id: 'shop' as View, label: 'Shop', icon: ShoppingBag },
    { id: 'friends' as View, label: 'Friends', icon: ContactRound },
  ];

  if (currentView === 'HomePage') {
    return <HomePage onPlayClick={() => setCurrentView('LoginPage')} />;
  }

  if (currentView === 'LoginPage') {
  return (
    <LoginPage
      onBack={() => setCurrentView('HomePage')}
      onLoginSuccess={() => setCurrentView('dashboard')}
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
        className={`w-full flex items-center gap-3 px-4 py-4 transition-all pixel-borders ${
          currentView === item.id
            ? 'bg-[#ff6b9d] text-white'
            : 'bg-[#3d2661] text-white hover:bg-[#4d3671]'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className={`text-xs pixel-font transition-opacity duration-300 whitespace-nowrap ${!isSidebarHovered ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'lg:opacity-100'}`}>{item.label}</span>
      </button>
    );
  };

  return (

    <div className="min-h-screen bg-[#1a0f2e] overflow-x-hidden">
      {/* Stars Background */}
      <div className="fixed inset-0 z-0">
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
          className={`hidden lg:block min-h-screen bg-[#2d1b4e] border-r-4 border-[#6b4e91] transition-all duration-300 ease-in-out ${
            isSidebarHovered ? 'w-64' : 'w-20'
          }`}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <div className="p-6">
            {isSidebarHovered ? (
              <>
                <h1 className="text-[#ffd93d] pixel-font text-sm mb-2">BUDGET BUDDY</h1>
                <p className="text-[#c7b8ea] text-xs mb-6">Level Up Your Savings!</p>

                {/* Coins Display */}
                <div className="mb-6 bg-[#3d2661] p-4 pixel-borders">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-5 h-5 text-[#ffd93d]" />
                    <span className="text-[#ffd93d] pixel-font text-sm">{coins}</span>
                  </div>
                  <div className="text-[#c7b8ea] text-xs">Gold Coins</div>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <PixelBuddy />
              </div>
            )}

            <nav className="space-y-3">
              {navItems.map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 lg:ml-8 relative">
          {currentView === 'dashboard' && <GameDashboard coins={coins} setCoins={setCoins} xp={xp} setXp={setXp} />}
          {currentView === 'quests' && <QuestBoard coins={coins} setCoins={setCoins} xp={xp} setXp={setXp} />}
          {currentView === 'achievements' && <Achievements />}
          {currentView === 'shop' && <Shop coins={coins} setCoins={setCoins} />}
          {currentView === 'friends' && <LeaderBoard coins={coins} setCoins={setCoins}/>}
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
