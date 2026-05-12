import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { JoinGroup } from './JoinGroups';   
import { CreateGroup } from './CreateGroup';
import { Contribute } from './Contribute'; 

const GroupStandings = ({ 
  groupId, 
  circleName, 
  inviteCode,
  refreshTrigger,
  currentUserId,
  onContributionSuccess,
  monthlyBudget = 2000
}: { 
  groupId: string; 
  circleName: string; 
  inviteCode: string;
  refreshTrigger: number;
  currentUserId: string;
  onContributionSuccess: () => void;
  monthlyBudget?: number;
}) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null); 

  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leaderboard_groups')
          .select('user_id, joined_at, contribution')
          .eq('group_id', groupId);

        if (error) throw error;
        
        if (data) {
          const sorted = data.sort((a: any, b: any) => {
            const balanceA = a.contribution || 0;
            const balanceB = b.contribution || 0;
            return balanceB - balanceA;
          });
          setMembers(sorted);
        }
      } catch (err) {
        console.error("Standings Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [groupId, refreshTrigger]); 

  if (!groupId) {
    return (
      <div className="bg-[#2d1b4e] p-10 pixel-borders w-full flex items-center justify-center min-h-[400px]">
        <p className="text-[#c7b8ea] pixel-font text-center leading-loose text-sm">
          NO CIRCLE SELECTED<br/>
          <span className="text-xs opacity-50">USE THE DROPDOWN OR JOIN A NEW ONE</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2d1b4e] p-8 pixel-borders w-full min-h-[400px] shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 border-b-2 border-[#3d2661] pb-4 gap-4">
        <div>
          <h4 className="text-[#ffd93d] pixel-font text-2xl flex items-center flex-wrap gap-4">
            🏆 {circleName}
            {/* THIS IS THE NEW CODE BADGE */}
            {inviteCode && (
              <span className="bg-[#1a0f2e] text-[#ff6b9d] px-3 py-1 text-sm pixel-borders uppercase border-2 border-[#3d2661]">
                CODE: {inviteCode}
              </span>
            )}
          </h4>
        </div>
        <span className="text-[#6366f1] pixel-font text-xs whitespace-nowrap">{members.length} MEMBERS</span>
      </div>
      
      {loading ? (
        <div className="text-white pixel-font text-sm p-6 text-center animate-pulse">SYNCING DATA...</div>
      ) : (
        <div className="overflow-visible">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#c7b8ea] pixel-font text-xs uppercase border-b border-[#3d2661]">
                <th className="p-3">Rank</th>
                <th className="p-3 text-center">Member</th>
                <th className="p-3 text-right">Balance</th>
                <th className="p-3 text-center">Contribute</th>
              </tr>
            </thead>
            <tbody className="pixel-font text-sm">
              {members.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-[#c7b8ea]">Empty Circle</td></tr>
              ) : (
                members.map((m: any, i: number) => {
                  const isCurrentUser = m.user_id === currentUserId;
                  
                  return (
                    <tr key={m.user_id} className={`${i === 0 ? "text-[#ffd93d]" : "text-white"} hover:bg-[#3d2661] transition-colors border-b border-[#3d2661]/30 last:border-0`}>
                      <td className="p-4">{i === 0 && (m.contribution > 0) ? '🥇' : i + 1}</td>
                      <td className="p-4 text-center">
                        {m.user_id.substring(0, 8)}...
                        {isCurrentUser && <span className="text-[#6366f1] ml-2">(YOU)</span>}
                      </td>
                      <td className="p-4 text-right font-mono text-[#4ade80] text-base">${(m.contribution || 0).toLocaleString()}</td>
                      <td className="p-4 text-center relative">
                        {isCurrentUser && (
                          <>
                            <button 
                              onClick={() => setActiveActionRow(m.user_id)}
                              className="bg-[#6366f1] text-white px-4 py-2 text-xs pixel-font pixel-borders hover:brightness-110 active:scale-95 transition-all"
                            >
                              + ADD
                            </button>
                            
                            {activeActionRow === m.user_id && (
                              <Contribute 
                                groupId={groupId} 
                                userId={currentUserId}
                                monthlyBudget={monthlyBudget}
                                onClose={() => setActiveActionRow(null)}
                                onSuccess={() => {
                                  setActiveActionRow(null); 
                                  onContributionSuccess(); 
                                }} 
                              />
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const LeaderBoard = ({ coins, setCoins, userId, monthlyBudget = 2000, onContributionRefresh }: { coins: number; setCoins: any; userId: string; monthlyBudget?: number; onContributionRefresh?: () => Promise<void> }) => {
  const USER_ID = userId;
  const [myGroups, setMyGroups] = useState<any[]>([]);
  
  // Updated state to track the inviteCode
  const [activeGroup, setActiveGroup] = useState<{id: string, name: string, inviteCode: string}>({ id: "", name: "", inviteCode: "" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMyGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_groups')
        .select(`
          group_id,
          groups ( id, name, invite_code )
        `)
        .eq('user_id', USER_ID);

      if (error) throw error;

      if (data) {
        // Map the data and explicitly cast the type after filtering out nulls
        const formattedGroups = data.map((item: any) => {
          if (!item.groups) return null;
          return {
            id: item.groups.id,
            name: item.groups.name,
            inviteCode: item.groups.invite_code
          };
        }).filter(Boolean) as { id: string; name: string; inviteCode: string }[]; // <--- The fix is here

        setMyGroups(formattedGroups);
        
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
    fetchMyGroups();
    // We fetch groups again, which will naturally update the activeGroup via the dropdown, 
    // but we can temporarily set it to avoid flashing
    setActiveGroup(prev => ({ ...prev, id, name }));
  };

  const handleContributionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    // Refresh transactions in parent (App) so dashboard and quests update
    if (onContributionRefresh) {
      onContributionRefresh();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative z-10 block space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#2d1b4e] pb-6">
        <div>
          <h1 className="text-[#ffd93d] pixel-font text-3xl mb-2">Friends & Circles</h1>
          <p className="text-[#c7b8ea] pixel-font text-xs uppercase tracking-widest">Compete with your crew</p>
        </div>

        <div className="relative min-w-[280px]">
          <label className="block text-[#ffd93d] pixel-font text-xs mb-2">Switch Circle:</label>
          <select 
            value={activeGroup.id}
            onChange={(e) => {
              const selected = myGroups.find(g => g.id === e.target.value);
              if (selected) setActiveGroup(selected);
            }}
            className="w-full bg-[#1a0f2e] text-white p-3 pixel-borders pixel-font text-sm outline-none cursor-pointer hover:border-[#6366f1]"
          >
            {myGroups.length === 0 && <option value="">No Circles Joined</option>}
            {myGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Restored the 12-column grid layout so they sit Left and Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Forms) */}
        <div className="lg:col-span-4 block">
          <JoinGroup userId={USER_ID} onSuccess={handleGroupUpdate} />
          <CreateGroup userId={USER_ID} onSuccess={handleGroupUpdate} />
        </div>

        {/* Right Column (Leaderboard) */}
        <div className="lg:col-span-8 w-full">
          <GroupStandings 
            groupId={activeGroup.id} 
            circleName={activeGroup.name}
            inviteCode={activeGroup.inviteCode}
            refreshTrigger={refreshTrigger} 
            currentUserId={USER_ID}
            monthlyBudget={monthlyBudget}
            onContributionSuccess={handleContributionSuccess}
          />
        </div>

      </div>
    </div>
  );
};