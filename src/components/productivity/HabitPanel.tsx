import React, { useState } from 'react';
import useHabits from '../../hooks/useHabits';
import styles from './HabitPanel.module.css';

const HabitPanel: React.FC = () => {
  const { habits, addHabit, toggleHabitDay, deleteHabit, getWeekDays, getStreak } = useHabits();
  const [newHabit, setNewHabit] = useState<string>('');
  const weekDays = getWeekDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit);
      setNewHabit('');
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>HABITS</h2>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Track a new habit..."
        />
        <button type="submit" className={styles.addBtn}>
          Add
        </button>
      </form>

      {/* Habit List */}
      <div className={styles.habitList}>
        {habits.length === 0 ? (
          <p className={styles.emptyState}>No habits yet. Start tracking one above!</p>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className={styles.habitItem}>
              <div className={styles.habitTop}>
                <div className={styles.habitName}>{habit.name}</div>
                <div className={styles.habitStreak}>🔥 {getStreak(habit)} day streak</div>
                <button className={styles.habitDel} onClick={() => deleteHabit(habit.id)}>
                  ×
                </button>
              </div>
              <div className={styles.habitWeek}>
                {weekDays.map((day) => {
                  const isCompleted = habit.completedDates?.includes(day.dateString);
                  return (
                    <div
                      key={day.dateString}
                      className={`${styles.habitDayDot} ${isCompleted ? styles.done : ''} ${
                        day.isToday ? styles.todayRing : ''
                      }`}
                      onClick={() => toggleHabitDay(habit.id, day.dateString)}
                      title={day.dayName}
                    >
                      {day.dayName.charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitPanel;
