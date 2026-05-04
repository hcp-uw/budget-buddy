import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface Props {
  groupId: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const Contribute = ({ groupId, userId, onClose, onSuccess }: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return alert("Enter a valid contribution amount!");
    }
    
    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from('leaderboard_groups')
        .select('contribution')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentBalance = data.contribution || 0;
      const newBalance = currentBalance + numAmount;

      const { error: updateError } = await supabase
        .from('leaderboard_groups')
        .update({ contribution: newBalance })
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAmount('');
      onSuccess(); 
      
    } catch (err: any) {
      console.error("Contribution Error:", err);
      alert(`Transaction Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Changed to pop out to the LEFT (right-full mr-4) so it doesn't get cut off
    // Added a bright border so it stands out from the dark background
    <div className="absolute top-1/2 -translate-y-1/2 right-full mr-4 z-[100] bg-[#2d1b4e] p-5 pixel-borders w-[260px] shadow-2xl border-2 border-[#ff6b9d]">
      
      {/* Replaced 'X' with text to avoid font bugs */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#ffd93d] pixel-font text-sm mt-1">💸 SEND FUNDS</h2>
        <button 
          onClick={onClose}
          className="text-[#ff6b9d] hover:text-white pixel-font text-xs"
        >
          CLOSE
        </button>
      </div>
      
      <form onSubmit={handleContribute}>
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-white pixel-font text-xs">$</span>
          <input 
            type="number"
            className="w-full bg-[#1a0f2e] text-white p-3 pl-8 pixel-borders outline-none pixel-font text-sm" 
            placeholder="AMOUNT" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          // Changed to the pink color since we know it renders correctly in your setup
          className="w-full bg-[#ff6b9d] text-white p-3 pixel-borders pixel-font text-xs hover:brightness-110 active:scale-95 transition-all"
        >
          {loading ? "SENDING..." : "CONFIRM"}
        </button>
      </form>
    </div>
  );
};