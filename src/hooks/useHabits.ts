import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { format, startOfWeek, addDays } from 'date-fns';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  streak: number;
  completed_dates: string[]; // dates like '2024-03-20'
  created_at: string;
}

export interface WeekDay {
  date: Date;
  dateString: string;
  dayName: string;
  isToday: boolean;
}

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length === 0) {
        // Sync check
        const localData = localStorage.getItem(STORAGE_KEYS.HABITS);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.length > 0) {
            console.log('Syncing habits from localStorage...');
            const syncData = parsed.map((h: any) => ({
              user_id: user?.id,
              name: h.name,
              completed_dates: h.completedDates || [],
              created_at: h.createdAt || new Date().toISOString()
            }));

            const { data: inserted, error: syncError } = await supabase
              .from('habits')
              .insert(syncData)
              .select();

            if (syncError) throw syncError;
            setHabits(inserted || []);
          } else {
            setHabits([]);
          }
        } else {
          setHabits([]);
        }
      } else {
        setHabits(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (name: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ user_id: user.id, name, completed_dates: [] }])
        .select()
        .single();

      if (error) throw error;
      setHabits([...habits, data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleHabitDay = async (habitId: string, dateString: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const dates = habit.completed_dates || [];
    const index = dates.indexOf(dateString);
    let newDates: string[];

    if (index > -1) {
      newDates = dates.filter(d => d !== dateString);
    } else {
      newDates = [...dates, dateString];
    }

    try {
      const { error } = await supabase
        .from('habits')
        .update({ completed_dates: newDates })
        .eq('id', habitId);

      if (error) throw error;
      setHabits(habits.map(h => 
        h.id === habitId ? { ...h, completed_dates: newDates } : h
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHabits(habits.filter(h => h.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getWeekDays = (): WeekDay[] => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dateString: format(date, 'yyyy-MM-dd'),
        dayName: format(date, 'EEE'),
        isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      };
    });
  };

  const getStreak = (habit: Habit): number => {
    if (!habit.completed_dates || habit.completed_dates.length === 0) return 0;
    const sorted = [...habit.completed_dates].sort().reverse();
    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < sorted.length; i++) {
      const checkDate = format(currentDate, 'yyyy-MM-dd');
      if (sorted[i] === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    toggleHabitDay,
    deleteHabit,
    getWeekDays,
    getStreak,
    refresh: fetchHabits
  };
};

export default useHabits;
