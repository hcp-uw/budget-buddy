import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { JoinGroup } from './JoinGroups';   
import { CreateGroup } from './CreateGroup';

const GroupStandings = ({ groupId, circleName }: { groupId: string, circleName: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leaderboard_groups')
          .select('user_id, joined_at')
          .eq('group_id', groupId);

        if (error) throw error;
        if (data) {
          const mocked = data.map((m: any) => ({
            ...m,
            balance: Math.floor(Math.random() * 40000) + 10000 
          })).sort((a: any, b: any) => b.balance - a.balance);
          setMembers(mocked);
        }
      } catch (err) {
        console.error("Standings Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [groupId]);

  if (!groupId) {
    return (
      <div className="bg-[#2d1b4e] p-10 pixel-borders w-full flex items-center justify-center min-h-[400px]">
        <p className="text-[#c7b8ea] pixel-font text-center leading-loose">
          NO CIRCLE SELECTED<br/>
          <span className="text-xs opacity-50">USE THE DROPDOWN OR JOIN A NEW ONE</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2d1b4e] p-6 pixel-borders w-full min-h-[400px]">
      <div className="flex justify-between items-center mb-6 border-b-2 border-[#3d2661] pb-4">
        <h4 className="text-[#ffd93d] pixel-font text-lg">🏆 {circleName}</h4>
        <span className="text-[#6366f1] pixel-font text-[10px]">{members.length} MEMBERS</span>
      </div>
      
      {loading ? (
        <div className="text-white pixel-font text-xs p-6 text-center animate-pulse">SYNCING DATA...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#c7b8ea] pixel-font text-[10px] uppercase">
                <th className="p-2">Rank</th>
                <th className="p-2 text-center">Member</th>
                <th className="p-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="pixel-font text-xs">
              {members.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-center text-[#c7b8ea]">Empty Circle</td></tr>
              ) : (
                members.map((m: any, i: number) => (
                  <tr key={m.user_id} className={`${i === 0 ? "text-[#ffd93d]" : "text-white"} hover:bg-[#3d2661] transition-colors`}>
                    <td className="p-3">{i === 0 ? '🥇' : i + 1}</td>
                    <td className="p-3 text-center">{m.user_id.substring(0, 8)}...</td>
                    <td className="p-3 text-right font-mono">${m.balance.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const LeaderBoard = ({ coins, setCoins }: { coins: number; setCoins: any }) => {
  const USER_ID = "eb18528f-81cd-4f3a-9af8-fe5603938070"; 
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<{id: string, name: string}>({ id: "", name: "" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch all groups this user is a member of
  const fetchMyGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_groups')
        .select(`
          group_id,
          groups ( id, name )
        `)
        .eq('user_id', USER_ID);

      if (error) throw error;

      if (data) {
        const formattedGroups = data.map((item: any) => item.groups).filter(Boolean);
        setMyGroups(formattedGroups);
        
        // Auto-select the first group if nothing is selected
        if (formattedGroups.length > 0 && isInitialLoad) {
          setActiveGroup(formattedGroups[0]);
          setIsInitialLoad(false);
        }
      }
    } catch (err) {
      console.error("Error fetching my groups:", err);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const handleGroupUpdate = (id: string, name: string) => {
    // When a user joins/creates, refresh the list and switch view
    fetchMyGroups();
    setActiveGroup({ id, name });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[#ffd93d] pixel-font text-3xl mb-2">Friends & Circles</h1>
          <p className="text-[#c7b8ea] pixel-font text-[10px] uppercase tracking-widest">Compete with your crew</p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative min-w-[250px]">
          <label className="block text-[#ffd93d] pixel-font text-[10px] mb-2">Switch Circle:</label>
          <select 
            value={activeGroup.id}
            onChange={(e) => {
              const selected = myGroups.find(g => g.id === e.target.value);
              if (selected) setActiveGroup(selected);
            }}
            className="w-full bg-[#1a0f2e] text-white p-3 pixel-borders pixel-font text-xs outline-none appearance-none cursor-pointer hover:border-[#6366f1]"
          >
            {myGroups.length === 0 && <option value="">No Circles Joined</option>}
            {myGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-4 bottom-4 pointer-events-none text-[#6366f1]">▼</div>
        </div>
      </div>
      
      {/* Layout Grid - Fixed to prevent overlap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Actions (Span 4) */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <JoinGroup userId={USER_ID} onSuccess={handleGroupUpdate} />
          </section>
          <section>
            <CreateGroup userId={USER_ID} onSuccess={handleGroupUpdate} />
          </section>
        </div>

        {/* Right Column: Standings (Span 8) */}
        <div className="lg:col-span-8 h-full">
          <GroupStandings 
            groupId={activeGroup.id} 
            circleName={activeGroup.name} 
          />
        </div>
      </div>
    </div>
  );
};