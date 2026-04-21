import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface Props { 
  userId: string; 
  onSuccess: (newGroupId: string, name: string) => void; 
}

export const CreateGroup = ({ userId, onSuccess }: Props) => {
  const [groupName, setGroupName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !goalAmount) return alert("Fill all fields!");
    setLoading(true);
    
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      // Step 1: Create the group
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert([{ 
          name: groupName, 
          goal_amount: parseFloat(goalAmount), 
          invite_code: inviteCode, 
          created_by: userId 
        }])
        .select()
        .single();

      // If Step 1 fails, show exactly why
      if (groupError) {
        alert(`Step 1 (Groups) Error: ${groupError.message}\nCode: ${groupError.code}`);
        setLoading(false);
        return;
      }

      if (newGroup) {
        // Step 2: Add member to leaderboard
        const { error: joinError } = await supabase
          .from('leaderboard_groups')
          .insert([{ 
            group_id: newGroup.id, 
            user_id: userId, 
            joined_at: new Date() 
          }]);

        // If Step 2 fails, show exactly why
        if (joinError) {
          alert(`Step 2 (Leaderboard) Error: ${joinError.message}\nCode: ${joinError.code}`);
          setLoading(false);
          return;
        }

        setGroupName('');
        setGoalAmount('');
        alert(`🚀 Success! Code: ${inviteCode}`);
        onSuccess(newGroup.id, newGroup.name);
      }
    } catch (error: any) { 
      console.error("Critical Error:", error);
      alert(`System Error: ${error.message}`);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="bg-[#2d1b4e] p-6 pixel-borders">
      <h2 className="text-[#ffd93d] pixel-font text-lg mb-4">⭕ Create Circle</h2>
      <form onSubmit={handleCreateGroup}>
        <input 
          className="w-full bg-[#1a0f2e] text-white p-3 pixel-borders mb-3 outline-none" 
          placeholder="NAME" 
          value={groupName} 
          onChange={(e) => setGroupName(e.target.value)} 
        />
        <input 
          className="w-full bg-[#1a0f2e] text-white p-3 pixel-borders mb-4 outline-none" 
          placeholder="GOAL" 
          value={goalAmount} 
          onChange={(e) => setGoalAmount(e.target.value)} 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#6366f1] text-white p-3 pixel-borders pixel-font text-sm"
        >
          {loading ? "LAUNCHING..." : "LAUNCH CIRCLE"}
        </button>
      </form>
    </div>
  );
};