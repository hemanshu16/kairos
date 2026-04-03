import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { format, startOfWeek, addDays } from 'date-fns';

export interface Habit {
  id: number;
  name: string;
  completedDates: string[];
  createdAt: string;
}

export interface WeekDay {
  date: Date;
  dateString: string;
  dayName: string;
  isToday: boolean;
}

/**
 * Custom hook for managing habits
 */
export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, []);

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now(),
      name,
      completedDates: [], // Array of ISO date strings
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabitDay = (habitId: number, dateString: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const dates = habit.completedDates || [];
      const index = dates.indexOf(dateString);

      if (index > -1) {
        // Remove date
        return {
          ...habit,
          completedDates: dates.filter(d => d !== dateString),
        };
      } else {
        // Add date
        return {
          ...habit,
          completedDates: [...dates, dateString],
        };
      }
    }));
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const getWeekDays = (): WeekDay[] => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
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
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;

    const sorted = [...habit.completedDates].sort().reverse();
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
    addHabit,
    toggleHabitDay,
    deleteHabit,
    getWeekDays,
    getStreak,
  };
};

export default useHabits;
