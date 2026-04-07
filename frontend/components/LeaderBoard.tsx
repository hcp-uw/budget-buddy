import{
    ChartColumnIncreasing
} from 'lucide-react';

interface LeaderBoardProps {
  coins: number;
  setCoins: (coins: number) => void;
}

const ranking = [
    { rank: '1', name: "User1", value: '300 coins'},
    { rank: '2', name: "User2", value: '280 coins'},
    { rank: '3', name: "User3", value: '250 coins'},
    { rank: '4', name: "User4", value: '200 coins'},
    { rank: '5', name: "User5", value: '190 coins'},
    { rank: '6', name: "User6", value: '30 coins'},
];

export function LeaderBoard({coins, setCoins}: LeaderBoardProps) {
    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffd93d] via-[#ff6b9d] to-[#a78bfa] p-6 pixel-borders">
        <h2 className="text-[#1a0f2e] pixel-font text-lg mb-2">FRIEND GROUP</h2>
        <p className="text-[#1a0f2e] text-sm opacity-90"> Compete your saving skills with friends! </p>
      </div>

      {/* Current Ranking */}
      <div className="bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] p-4 pixel-borders border-4 border-[#ff5a8d]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#1a0f2e] pixel-font text-lg mb-2">CURRENT RANKING : 3</h3>
            <div className="flex gap-2"></div>
            <p className="text-[#2d1b4e] text-sm mb-3">Earn 200 more coins to past User2 !</p>
          </div>
        </div>
      </div>

      {/* Showcase Friends */}
      <div className="bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
        <h3 className="text-white pixel-font text-sm mb-6">RANKING</h3>
        <div className="space-y-4">
          {ranking.map((activity) => (
            <div key={activity.rank} className="bg-[#3d2661] p-4 pixel-borders flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[#fcf951] pixel-font text-lg mb-1">{activity.rank}</div>
                <div className="text-[#4ecdc4] pixel-font text-xs mb-2">{activity.name}</div>
                <div className="text-[#c7b8ea] text-s">{activity.value}</div>
              </div> 
            </div>
          ))}
        </div>
      </div>
    </div>
)
}
