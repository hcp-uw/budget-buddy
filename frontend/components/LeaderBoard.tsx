import { useState } from 'react';
import { Users, Plus } from 'lucide-react';

interface LeaderBoardProps {
  coins: number;
  setCoins: (coins: number) => void;
}

const allFriends = [
  { name: 'User1', xp: 4200 },
  { name: 'User5', xp: 3900 },
  { name: 'You', xp: 3450 },
  { name: 'User2', xp: 3100 },
  { name: 'User6', xp: 2800 },
  { name: 'User3', xp: 2500 },
  { name: 'User7', xp: 2100 },
  { name: 'User4', xp: 1800 },
  { name: 'User8', xp: 1200 },
  { name: 'User9', xp: 800 },
];


export function LeaderBoard({ coins, setCoins }: LeaderBoardProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groups, setGroups] = useState([
  {
    id: 0,
    name: 'All Friends',
    members: allFriends.length,
    ranking: allFriends.map((f, i) => ({ rank: i + 1, ...f })),
  },
  {
    id: 1,
    name: 'Roommates',
    members: 4,
    ranking: [
      { rank: 1, name: 'User1', xp: 4200 },
      { rank: 2, name: 'User2', xp: 3100 },
      { rank: 3, name: 'You', xp: 3450 },
      { rank: 4, name: 'User4', xp: 1800 },
    ].sort((a, b) => b.xp - a.xp).map((f, i) => ({ ...f, rank: i + 1 })),
  },
  {
    id: 2,
    name: 'College Friends',
    members: 5,
    ranking: [
      { rank: 1, name: 'User5', xp: 3900 },
      { rank: 2, name: 'You', xp: 3450 },
      { rank: 3, name: 'User6', xp: 2800 },
      { rank: 4, name: 'User7', xp: 2100 },
      { rank: 5, name: 'User9', xp: 800 },
    ].sort((a, b) => b.xp - a.xp).map((f, i) => ({ ...f, rank: i + 1 })),
  },
  {
    id: 3,
    name: 'Family',
    members: 3,
    ranking: [
      { rank: 1, name: 'You', xp: 3450 },
      { rank: 2, name: 'User3', xp: 2500 },
      { rank: 3, name: 'User8', xp: 1200 },
    ].sort((a, b) => b.xp - a.xp).map((f, i) => ({ ...f, rank: i + 1 })),
  },
  ]);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const myRank = selectedGroup.ranking.find((r) => r.name === 'You')?.rank ?? '-';
  const above = selectedGroup.ranking.find((r) => r.rank === (myRank as number) - 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffd93d] via-[#ff6b9d] to-[#a78bfa] p-6 pixel-borders flex items-center justify-between">
        <div>
          <h2 className="text-[#1a0f2e] pixel-font text-lg mb-2">FRIEND GROUP</h2>
          <p className="text-[#1a0f2e] text-sm opacity-90">Compete your saving skills with friends!</p>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="bg-[#1a0f2e] text-white pixel-font text-xs px-3 py-2 pixel-borders hover:bg-[#3d2661]"
        >
          + ADD FRIEND
        </button>
      </div>

      {/* Current Ranking Banner */}
      <div className="bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] p-4 pixel-borders border-4 border-[#ff5a8d]">
        <h3 className="text-[#1a0f2e] pixel-font text-lg mb-2">
          CURRENT RANKING : #{myRank} in {selectedGroup.name}
        </h3>
        {above && (
          <p className="text-[#2d1b4e] text-sm">
            Earn more XP to beat {above.name} ({above.xp} XP)!
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Friend Groups - Left */}
        <div className="lg:col-span-1 bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white pixel-font text-sm">MY GROUPS</h3>
            <button
              onClick={() => setShowAddGroup(true)}
              className="bg-[#ff6b9d] text-white pixel-font text-xs px-2 py-1 pixel-borders flex items-center gap-1"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff5a8d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6b9d'}
            >
              <Plus className="w-3 h-3" /> NEW
            </button>
          </div>
          <div className="space-y-3">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-4 pixel-borders flex items-center justify-between transition-all ${
                  selectedGroup.id === group.id
                    ? 'bg-[#ff6b9d] text-white'
                    : 'bg-[#3d2661] text-white hover:bg-[#4d3671]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="pixel-font text-xs">{group.name}</span>
                </div>
                <span className="text-xs opacity-70">{group.members} members</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ranking - Right */}
        <div className="lg:col-span-2 bg-[#2d1b4e] p-6 pixel-borders border-4 border-[#6b4e91]">
          <h3 className="text-white pixel-font text-sm mb-6">RANKING — {selectedGroup.name}</h3>
          <div className="space-y-3">
            {selectedGroup.ranking.map((entry) => (
              <div
                key={entry.rank}
                className={`p-4 pixel-borders flex items-center justify-between ${
                  entry.name === 'You' ? 'bg-[#ff6b9d]/30 border-2 border-[#ff6b9d]' : 'bg-[#3d2661]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-[#fcf951] pixel-font text-lg w-6">{entry.rank}</div>
                  <div>
                    <div className="text-[#4ecdc4] pixel-font text-xs mb-1">{entry.name}</div>
                    <div className="text-[#c7b8ea] text-xs">{entry.xp} XP</div>
                  </div>
                </div>
                {entry.rank === 1 && <span className="text-[#ffd93d] pixel-font text-xs">👑 WINNER</span>}
                {entry.name === 'You' && entry.rank !== 1 && <span className="text-[#ff6b9d] pixel-font text-xs">← YOU</span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {showAddFriend && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91]" style={{ width: '400px', padding: '40px' }}>
          <h3 className="text-white pixel-font text-sm mb-6">ADD FRIEND</h3>
          <input
            type="text"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Enter username..."
            className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-4 focus:outline-none focus:border-[#ff6b9d]"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddFriend(false);
                setFriendUsername('');
              }}
              className="flex-1 bg-[#ff6b9d] text-white pixel-font text-xs py-2 pixel-borders hover:bg-[#ff5a8d]"
            >
              ADD
            </button>
            <button
              onClick={() => setShowAddFriend(false)}
              className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders hover:bg-[#4d3671]"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    )}

      {showAddGroup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-[#2d1b4e] pixel-borders border-4 border-[#6b4e91]" style={{ width: '600px', padding: '40px', maxHeight: '80vh', overflowY: 'auto' }}>
          <h3 className="text-white pixel-font text-sm mb-6">CREATE NEW GROUP</h3>
          
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="w-full p-3 bg-[#1a0f2e] text-white pixel-font text-sm border-4 border-[#6b4e91] mb-6 focus:outline-none focus:border-[#ff6b9d]"
          />

          <h4 className="text-[#c7b8ea] pixel-font text-xs mb-3">SELECT FRIENDS</h4>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }} className="space-y-2 mb-6">
          {allFriends.filter(f => f.name !== 'You').sort((a, b) => a.name.localeCompare(b.name)).map((friend) => (
              <div
                key={friend.name}
                className="bg-[#3d2661] p-3 pixel-borders flex items-center justify-between cursor-pointer"
                onClick={() => {
                  setSelectedFriends(prev =>
                    prev.includes(friend.name)
                      ? prev.filter(n => n !== friend.name)
                      : [...prev, friend.name]
                  );
                }}
              >
                <div>
                  <div className="text-[#4ecdc4] pixel-font text-xs">{friend.name}</div>
                  <div className="text-[#c7b8ea] text-xs">{friend.xp} XP</div>
                </div>
                <div
                  className="w-5 h-5 border-2 border-[#6b4e91] flex items-center justify-center"
                  style={{ backgroundColor: selectedFriends.includes(friend.name) ? '#ff6b9d' : 'transparent' }}
                >
                  {selectedFriends.includes(friend.name) && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
  if (groupName.trim()) {
    const newGroup = {
      id: groups.length + 1,
      name: groupName,
      members: selectedFriends.length + 1,
      ranking: [
        { rank: 1, name: 'You', xp: 3450 },
        ...selectedFriends.map((name, i) => ({
          rank: i + 2,
          name,
          xp: allFriends.find(f => f.name === name)?.xp ?? 0,
        })),
      ].sort((a, b) => b.xp - a.xp).map((f, i) => ({ ...f, rank: i + 1 })),
    };
    setGroups(prev => [...prev, newGroup]);
    setSelectedGroup(newGroup);
  }
  setShowAddGroup(false);
  setGroupName('');
  setSelectedFriends([]);
}}
              className="flex-1 bg-[#ff6b9d] text-white pixel-font text-xs py-2 pixel-borders"
              style={{ cursor: 'pointer' }}
            >
              CREATE
            </button>
            <button
              onClick={() => {
                setShowAddGroup(false);
                setGroupName('');
                setSelectedFriends([]);
              }}
              className="flex-1 bg-[#3d2661] text-white pixel-font text-xs py-2 pixel-borders"
              style={{ cursor: 'pointer' }}
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