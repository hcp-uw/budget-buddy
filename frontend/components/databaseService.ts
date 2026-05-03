import { supabase } from './supabaseClient';

/**
 * Create or get a user by email
 */
export async function createOrGetUser(email: string) {
  try {
    // First try to get existing user
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: true, user: existingUser };
    }

    // If no user exists, create one
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ email }])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('Error creating/getting user:', error);
    return { success: false, message: error.message || 'Failed to create user' };
  }
}

/**
 * Save Plaid item for user
 */
export async function savePlaidItem(
  userId: string,
  accessToken: string,
  itemId: string,
  institutionName: string
) {
  try {
    const { data, error } = await supabase
      .from('plaid_items')
      .insert([
        {
          user_id: userId,
          plaid_access_token: accessToken,
          plaid_item_id: itemId,
          institution_name: institutionName,
          status: 'connected'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, plaidItem: data };
  } catch (error: any) {
    console.error('Error saving plaid item:', error);
    return { success: false, message: error.message || 'Failed to save plaid item' };
  }
}

/**
 * Get transactions for a user
 */
export async function getUserTransactions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, transactions: data || [] };
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return { success: false, message: error.message || 'Failed to fetch transactions' };
  }
}

/**
 * Get user's budget info
 */
export async function getUserBudgets(userId: string) {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, budgets: data || [] };
  } catch (error: any) {
    console.error('Error fetching budgets:', error);
    return { success: false, message: error.message || 'Failed to fetch budgets' };
  }
}

/**
 * Get user's points
 */
export async function getUserPoints(userId: string) {
  try {
    const { data, error } = await supabase
      .from('points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If no points record, create one
    if (!data) {
      const { data: newPoints, error: createError } = await supabase
        .from('points')
        .insert([
          {
            user_id: userId,
            total_points: 0,
            current_period_points: 0,
            last_updated: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return { success: true, points: newPoints };
    }

    return { success: true, points: data };
  } catch (error: any) {
    console.error('Error fetching points:', error);
    return { success: false, message: error.message || 'Failed to fetch points' };
  }
}

/**
 * Calculate total spent from transactions (current month)
 */
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

/**
 * Calculate total spent all time
 */
export function calculateTotalSpent(transactions: any[]): number {
  return transactions.reduce((total, tx) => total + Math.abs(tx.amount), 0);
}
