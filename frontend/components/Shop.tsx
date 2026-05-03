import { useState } from 'react';
import { 
  Coins,
  Sparkles,
  Palette,
  Shirt,
  Crown,
  Star,
  Zap,
  Shield,
  Heart,
  Glasses
} from 'lucide-react';
import { toast } from 'sonner';

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: any;
  category: 'cosmetic' | 'boost' | 'power-up';
  color: string;
  owned: boolean;
  filter?: string;
}

interface ShopProps {
  coins: number;
  setCoins: (coins: number) => void;
  setCowFilter: (filter: string) => void;
  cowFilter: string;
}

export function Shop({ coins, setCoins, setCowFilter, cowFilter }: ShopProps) {
  const [items, setItems] = useState<ShopItem[]>([
    {
      id: 1,
      name: 'XP Boost',
      description: '2x XP for 24 hours',
      price: 150,
      icon: Zap,
      category: 'boost',
      color: '#ffd93d',
      owned: false
    },
    {
      id: 2,
      name: 'Green Avatar',
      description: 'Change your avatar color to green',
      price: 100,
      icon: Palette,
      category: 'cosmetic',
      color: '#ff6b9d',
      owned: false,
      filter: 'sepia(1) hue-rotate(390deg) saturate(3)'
    },
    {
      id: 3,
      name: 'Golden Crown',
      description: 'Show off your wealth!',
      price: 500,
      icon: Crown,
      category: 'cosmetic',
      color: '#ffd93d',
      owned: false
    },
    {
      id: 4,
      name: 'Shield Power',
      description: 'Protect your streak for 1 day',
      price: 75,
      icon: Shield,
      category: 'power-up',
      color: '#4ecdc4',
      owned: false
    },
    {
      id: 5,
      name: 'Star Outfit',
      description: 'Sparkly avatar decoration',
      price: 200,
      icon: Star,
      category: 'cosmetic',
      color: '#a78bfa',
      owned: false
    },
    {
      id: 6,
      name: 'Double Coins',
      description: 'Earn 2x coins for 24 hours',
      price: 200,
      icon: Coins,
      category: 'boost',
      color: '#ffd93d',
      owned: false
    },
    {
      id: 7,
      name: 'Hero Cape',
      description: 'Epic cape for your avatar',
      price: 350,
      icon: Shirt,
      category: 'cosmetic',
      color: '#ff6b9d',
      owned: false
    },
    {
      id: 8,
      name: 'Life Saver',
      description: 'Extra chance to complete quests',
      price: 100,
      icon: Heart,
      category: 'power-up',
      color: '#ff6b6b',
      owned: false
    },
    {
      id: 9,
      name: 'Sparkle Effect',
      description: 'Add sparkles to your profile',
      price: 250,
      icon: Sparkles,
      category: 'cosmetic',
      color: '#ffd93d',
      owned: false
    },
    {
      id: 10,
      name: 'Sunglasses',
      description: 'Cool shades for your avatar',
      price: 180,
      icon: Glasses,
      category: 'cosmetic',
      color: '#4ecdc4',
      owned: false
},

  ]);

  const purchaseItem = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.owned) {
      toast.error('Already owned!', {
        description: 'You already own this item.',
      });
      return;
    }

    if (coins < item.price) {
      toast.error('Not enough coins!', {
        description: `You need ${item.price - coins} more coins.`,
      });
      return;
    }

    setCoins(coins - item.price);
    setItems(items.map(i => 
      i.id === itemId ? { ...i, owned: true } : i
    ));

    toast.success('Purchase successful!', {
      description: `You bought ${item.name}!`,
    });
  };

  const categories = [
    { id: 'cosmetic', name: 'Cosmetics', icon: Palette },
    { id: 'boost', name: 'Boosts', icon: Zap },
    { id: 'power-up', name: 'Power-Ups', icon: Star }
  ];

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] p-6 pixel-borders">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#1a0f2e] pixel-font text-lg mb-2">ITEM SHOP</h2>
            <p className="text-[#1a0f2e] text-sm opacity-90">Spend your coins wisely!</p>
          </div>
          <div className="bg-white/20 px-4 py-3 pixel-borders">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-white" />
              <span className="text-white pixel-font text-lg">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const CategoryIcon = category.icon;
        const categoryItems = items.filter(item => item.category === category.id);

        return (
          <div key={category.id}>
            <h3 className="text-[#ffd93d] pixel-font text-sm mb-4 flex items-center gap-2">
              <CategoryIcon className="w-5 h-5" />
              {category.name.toUpperCase()}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map((item) => {
                const ItemIcon = item.icon;
                const canAfford = coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`bg-[#2d1b4e] p-5 pixel-borders border-4 transition-all ${
                      item.owned 
                        ? 'border-[#4ecdc4] opacity-75' 
                        : canAfford 
                        ? 'border-[#6b4e91] hover:border-[#a78bfa] hover:scale-105' 
                        : 'border-[#6b4e91] opacity-50'
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className={`w-16 h-16 pixel-borders flex items-center justify-center ${
                          !item.owned && canAfford ? 'pixel-glow' : ''
                        }`}
                        style={{ backgroundColor: item.color + '40' }}
                      >
                        <ItemIcon 
                          className="w-8 h-8" 
                          style={{ color: item.color }}
                        />
                      </div>
                      {item.owned && (
                        <div className="flex flex-col gap-1">
                          <div className="bg-[#4ecdc4] px-2 py-1 pixel-borders">
                            <span className="text-[#1a0f2e] pixel-font text-xs">OWNED</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="text-white pixel-font text-sm mb-2">{item.name}</h3>
                    <p className="text-[#c7b8ea] text-sm mb-4">{item.description}</p>

                    {/* Purchase */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-5 h-5 text-[#ffd93d]" />
                        <span className="text-[#ffd93d] pixel-font text-sm">{item.price}</span>
                      </div>
                      {!item.owned && (
                        <button
                          onClick={() => purchaseItem(item.id)}
                          disabled={!canAfford}
                          className={`px-4 py-2 pixel-borders pixel-font text-xs transition-colors ${
                            canAfford
                              ? 'bg-[#4ecdc4] text-white hover:bg-[#3db8af]'
                              : 'bg-[#3d2661] text-[#6b4e91] cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'BUY' : 'LOCKED'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Special Offers */}
      <div className="bg-gradient-to-r from-[#a78bfa] to-[#ff6b9d] p-6 pixel-borders border-4 border-[#ff5a8d]">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-6 h-6 text-white pixel-glow" />
          <h3 className="text-white pixel-font text-sm">DAILY DEAL!</h3>
        </div>
        <div className="bg-white/20 p-4 pixel-borders">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white pixel-font text-sm mb-1">Starter Pack</h4>
              <p className="text-white text-sm mb-2 opacity-90">XP Boost + Shield Power</p>
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-white" />
                <span className="text-white pixel-font text-sm line-through opacity-50">225</span>
                <span className="text-[#ffd93d] pixel-font text-lg ml-2">150</span>
              </div>
            </div>
            <button className="bg-white text-[#a78bfa] px-6 py-3 pixel-borders pixel-font text-xs hover:bg-[#ffd93d] hover:text-[#1a0f2e] transition-colors">
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Inventory Panel */}
      <div className="w-64 shrink-0">
  <div className="bg-[#2d1b4e] p-4 pixel-borders border-4 border-[#6b4e91]" style={{ height: '600px', overflowY: 'auto' }}>
          <h3 className="text-white pixel-font text-sm mb-4">MY INVENTORY</h3>
          <div className="space-y-3">
            {items.filter(item => item.owned).length === 0 ? (
              <p className="text-[#c7b8ea] text-xs">No items owned yet!</p>
            ) : (
              items.filter(item => item.owned).map(item => {
                const ItemIcon = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className="p-3 pixel-borders flex items-center gap-3"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: cowFilter === item.filter ? '#7a6b00' : '#3d2661'
                    }}
                    onClick={() => setCowFilter(prev => prev === (item.filter || '') ? '' : (item.filter || ''))}
                  >
                    <div className="w-8 h-8 pixel-borders flex items-center justify-center" style={{ backgroundColor: item.color + '40' }}>
                      <ItemIcon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <span className="text-white pixel-font text-xs">{item.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
