import React, { useState } from 'react';
import { supabase } from './supabaseClient'; 

interface Props { 
  userId: string; 
  onSuccess: (groupId: string, name: string) => void;
}

export const JoinGroup = ({ userId, onSuccess }: Props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code) return alert("Enter a code!");
    setLoading(true);
    
    try {
      // 1. Find the circle by code
      const { data: circle, error: fetchError } = await supabase
        .from('groups')
        .select('id, name')
        .eq('invite_code', code.toUpperCase())
        .single();

      if (fetchError || !circle) {
        alert("Circle not found! Double check that code.");
      } else {
        // 2. Insert the user into the group membership
        const { error: joinError } = await supabase
          .from('leaderboard_groups') 
          .insert([{ 
            group_id: circle.id, 
            user_id: userId, 
            joined_at: new Date() 
          }]);

        if (joinError) {
          alert("You are already in this circle or an error occurred.");
        } else {
          alert(`🤝 Joined ${circle.name}!`);
          setCode('');
          onSuccess(circle.id, circle.name);
        }
      }
    } catch (err) { 
      console.error("Join Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="bg-[#2d1b4e] p-6 pixel-borders mb-6">
      <h2 className="text-[#ffd93d] pixel-font text-lg mb-4">🤝 Join a Circle</h2>
      <input 
        className="w-full bg-[#1a0f2e] text-white p-3 pixel-borders mb-4 outline-none"
        placeholder="6-DIGIT CODE" 
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button 
        onClick={handleJoin} 
        disabled={loading}
        className="w-full bg-[#ff6b9d] text-white p-3 pixel-borders pixel-font text-sm hover:brightness-110 active:scale-95 transition-all"
      >
        {loading ? "JOINING..." : "JOIN CIRCLE"}
      </button>
    </div>
  );
};