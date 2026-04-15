import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface StreakContextType {
  streak: number;
  lastDate: string | null;
  updateStreak: () => Promise<void>;
  loading: boolean;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStreakData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('streak_count, last_quiz_date').eq('id', user.id).single();
      if (data) {
        setStreak(data.streak_count || 0);
        setLastDate(data.last_quiz_date);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchStreakData(); }, []);

  const updateStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    if (lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const newStreak = lastDate === yesterdayStr ? streak + 1 : 1;

    const { error } = await supabase.from('profiles').upsert({ 
      id: user.id, streak_count: newStreak, last_quiz_date: today, updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (!error) {
      setStreak(newStreak);
      setLastDate(today);
    }
  };

  return (
    <StreakContext.Provider value={{ streak, lastDate, updateStreak, loading }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) throw new Error('useStreak must be used within a StreakProvider');
  return context;
};