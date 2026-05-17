import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface Props {
  groupId: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
  monthlyBudget?: number;
}

export const Contribute = ({ groupId, userId, onClose, onSuccess, monthlyBudget = 2000 }: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'add' | 'withdraw'>('add');

  // Get current month start and end
  const getMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getMonthEnd = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  };

  const isDateInRange = (dateStr: string | undefined, start: Date, end: Date): boolean => {
    if (!dateStr) return false;
    const txDate = new Date(dateStr);
    return txDate >= start && txDate <= end;
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return alert("Enter a valid amount!");
    }
    
    setLoading(true);

    try {
      // Fetch user's current contribution
      const { data: userData, error: fetchError } = await supabase
        .from('leaderboard_groups')
        .select('contribution')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentBalance = userData?.contribution || 0;

      if (mode === 'withdraw') {
        // WITHDRAW MODE: Simply reduce contribution
        if (currentBalance < numAmount) {
          return alert(`You only have $${currentBalance} in this circle!`);
        }

        const newBalance = currentBalance - numAmount;

        const { error: updateError } = await supabase
          .from('leaderboard_groups')
          .update({ contribution: newBalance })
          .eq('group_id', groupId)
          .eq('user_id', userId);

        if (updateError) throw updateError;

        await supabase.from('transactions').insert([{
          user_id: userId,
          plaid_transaction_id: `circle_withdraw_${Date.now()}`,
          plaid_item_id: `circle_${groupId}`,
          amount: -numAmount,
          merchant_name: `Circle Withdrawal`,
          date: new Date().toISOString(),
          category: 'circle',
          pending: false,
        }]);

        alert(`✅ Withdrew $${numAmount} from circle!`);
        setAmount('');
        onSuccess();
        onClose();
      } else {
        // ADD MODE: Deduct from budget and check quests
        
        // 1️⃣ Fetch current month's transactions to calculate spending
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('amount, date')
          .eq('user_id', userId);

        if (txError) throw txError;

        const monthStart = getMonthStart();
        const monthEnd = getMonthEnd();
        
        // Filter to THIS MONTH transactions only
        const monthTransactions = (transactions || []).filter(t => 
          isDateInRange(t.date, monthStart, monthEnd)
        );

        const currentSpent = monthTransactions.reduce((sum, tx) => 
          sum + (tx.amount && tx.amount > 0 ? tx.amount : 0), 0
        );

        const newSpentTotal = currentSpent + numAmount;
        const newRemaining = monthlyBudget - newSpentTotal;

        // 2️⃣ Check if contribution violates Budget Master quest
        const violatesBudget = newRemaining < 0;

        // 3️⃣ Update contribution in database
        const newBalance = currentBalance + numAmount;

        const { error: updateError } = await supabase
          .from('leaderboard_groups')
          .update({ contribution: newBalance })
          .eq('group_id', groupId)
          .eq('user_id', userId);

        if (updateError) throw updateError;
        await supabase.from('transactions').insert([{
          user_id: userId,
          plaid_transaction_id: `circle_add_${Date.now()}`,
          plaid_item_id: `circle_${groupId}`,
          amount: numAmount,
          merchant_name: `Circle Contribution`,
          date: new Date().toISOString().split('T')[0],
          category: 'circle',
          pending: false,
        }]);

        // 4️⃣ Store contribution as a virtual transaction for budget tracking
        const { error: logError } = await supabase
          .from('circle_contributions')
          .insert([{
            user_id: userId,
            group_id: groupId,
            amount: numAmount,
            created_at: new Date().toISOString(),
            violation: violatesBudget ? 'budget_master_failed' : null
          }]);

        if (logError && logError.code !== 'PGRST116') {
          // Only warn if it's not a "table doesn't exist" error
          console.warn('Contribution log warning:', logError);
        }

        // 5️⃣ Mark Budget Master quest as failed if over budget
        if (violatesBudget) {
          // Store quest failure status (you can create a quest_status table later)
          console.log('⚠️ Budget Master quest violated! Would be marked as failed.');
          alert(`⚠️ Contribution added! However, you're now OVER BUDGET.\nSpent: $${newSpentTotal} / Budget: $${monthlyBudget}\nBudget Master quest will be marked as FAILED.`);
        } else {
          alert(`✅ Added $${numAmount} to circle! Remaining budget: $${newRemaining}`);
        }

        setAmount('');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Contribution Error:", err);
      alert(`Transaction Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-full mr-4 z-[100] bg-[#2d1b4e] p-5 pixel-borders w-[280px] shadow-2xl border-2 border-[#ff6b9d]">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#ffd93d] pixel-font text-sm mt-1">💸 FUNDS</h2>
        <button 
          onClick={onClose}
          className="text-[#ff6b9d] hover:text-white pixel-font text-xs"
        >
          CLOSE
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('add')}
          className={`flex-1 py-2 pixel-borders text-xs pixel-font ${
            mode === 'add' 
              ? 'bg-[#4ade80] text-[#1a0f2e]' 
              : 'bg-[#1a0f2e] text-[#4ade80] border border-[#4ade80]'
          }`}
        >
          ADD
        </button>
        <button
          onClick={() => setMode('withdraw')}
          className={`flex-1 py-2 pixel-borders text-xs pixel-font ${
            mode === 'withdraw' 
              ? 'bg-[#ff6b9d] text-[#1a0f2e]' 
              : 'bg-[#1a0f2e] text-[#ff6b9d] border border-[#ff6b9d]'
          }`}
        >
          WITHDRAW
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

        <p className="text-[#c7b8ea] text-xs mb-3">
          {mode === 'add' 
            ? '💡 Adding money counts toward your spending and may affect quests!'
            : '💡 Withdrawing returns money to your available budget.'}
        </p>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full p-3 pixel-borders pixel-font text-xs hover:brightness-110 active:scale-95 transition-all text-white ${
            mode === 'add' ? 'bg-[#4ade80]' : 'bg-[#ff6b9d]'
          }`}
        >
          {loading ? "PROCESSING..." : mode === 'add' ? "CONTRIBUTE" : "WITHDRAW"}
        </button>
      </form>
    </div>
  );
};