import { supabase } from './supabaseClient';

export interface GameState {
  xp: number;
  coins: number;
  streakCount: number;
}

// Load XP, coins, and streak for a user. Creates records if they don't exist.
export async function loadGameState(userId: string): Promise<GameState> {
  try {
    const [pointsRes, streakRes] = await Promise.all([
      supabase.from('points').select('*').eq('user_id', userId).single(),
      supabase.from('learning_streaks').select('*').eq('user_id', userId).single()
    ]);

    const xp = pointsRes.data?.total_points ?? 0;
    const coins = pointsRes.data?.current_period_points ?? 0;

    if (!pointsRes.data) {
      await supabase.from('points').insert([{
        user_id: userId, total_points: 0, current_period_points: 0,
        last_updated: new Date().toISOString()
      }]);
    }

    let streakCount = 1;
    if (streakRes.data?.last_completed) {
      const last = new Date(streakRes.data.last_completed);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        streakCount = streakRes.data.streak_count;
      } else if (daysDiff === 1) {
        streakCount = streakRes.data.streak_count + 1;
        await supabase.from('learning_streaks')
          .update({ streak_count: streakCount, last_completed: now.toISOString() })
          .eq('user_id', userId);
      } else {
        streakCount = 1;
        await supabase.from('learning_streaks')
          .update({ streak_count: 1, last_completed: now.toISOString() })
          .eq('user_id', userId);
      }
    } else {
      await supabase.from('learning_streaks').upsert([{
        user_id: userId, streak_count: 1, last_completed: new Date().toISOString()
      }], { onConflict: 'user_id' });
    }

    return { xp, coins, streakCount };
  } catch (err) {
    console.error('Error loading game state:', err);
    return { xp: 0, coins: 0, streakCount: 1 };
  }
}

// Persist XP and coins for a user. Uses total_points for XP, current_period_points for coins.
export async function saveGameState(userId: string, xp: number, coins: number): Promise<void> {
  try {
    const { data } = await supabase.from('points').select('id').eq('user_id', userId).single();
    if (data) {
      await supabase.from('points').update({
        total_points: xp,
        current_period_points: coins,
        last_updated: new Date().toISOString()
      }).eq('user_id', userId);
    } else {
      await supabase.from('points').insert([{
        user_id: userId, total_points: xp, current_period_points: coins,
        last_updated: new Date().toISOString()
      }]);
    }
  } catch (err) {
    console.error('Error saving game state:', err);
  }
}

export function calculateMonthlySpent(transactions: any[]): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    })
    .reduce((total, tx) => total + Math.abs(tx.amount), 0);
}

export function calculateTotalSpent(transactions: any[]): number {
  return transactions.reduce((total, tx) => total + Math.abs(tx.amount), 0);
}
