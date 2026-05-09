import { supabase } from './supabaseClient';

export interface GameState {
  xp: number;
  coins: number;
  streakCount: number;
}

// Load XP, coins, and streak for a user. Creates records if they don't exist.
export async function loadGameState(userId: string): Promise<GameState> {
  try {
    let xp = 0;
    let coins = 0;
    let streakCount = 1;

    // Try to load points, but don't fail if table doesn't exist
    try {
      const pointsRes = await supabase.from('points').select('*').eq('user_id', userId).single();
      if (pointsRes.data) {
        xp = pointsRes.data.total_points ?? 0;
        coins = pointsRes.data.current_period_points ?? 0;
      }
    } catch (err: any) {
      // Silently fail if points table doesn't exist (will use defaults)
      console.log('Points table not found, using defaults');
    }

    // Try to load streak, but don't fail if table doesn't exist
    try {
      const streakRes = await supabase.from('learning_streaks').select('*').eq('user_id', userId).single();
      if (streakRes.data?.last_completed) {
        const last = new Date(streakRes.data.last_completed);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
          streakCount = streakRes.data.streak_count;
        } else if (daysDiff === 1) {
          streakCount = streakRes.data.streak_count + 1;
        } else {
          streakCount = 1;
        }
      }
    } catch (err: any) {
      // Silently fail if learning_streaks table doesn't exist (will use defaults)
      console.log('Learning streaks table not found, using defaults');
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
    } catch (err: any) {
      // Silently fail if points table doesn't exist
      console.log('Points table not found, skipping save');
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
