import React, { useState } from 'react';
import useHabits from '../../hooks/useHabits';
import styles from './HabitPanel.module.css';

const HabitPanel: React.FC = () => {
  const { habits, loading, addHabit, toggleHabitDay, deleteHabit, getWeekDays, getStreak } = useHabits();
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
        <div className={styles.labelGroup}>
          <div className={styles.preTitle}>ZENITH • RITUALS</div>
          <div className={styles.title}>Your Habits</div>
        </div>
        {/* {loading && <div className={styles.loaderSmall}>Syncing...</div>} */}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="What habit do you want to build?"
          disabled={loading}
        />
        <button type="submit" className={styles.addBtn} disabled={loading || !newHabit.trim()}>
          + ADD
        </button>
      </form>

      {/* Habit List */}
      <div className={styles.habitList}>
        {loading && habits.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.pulse}></div>
            <p>Loading your habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <p className={styles.emptyState}>No habits yet. Start tracking one above!</p>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className={styles.habitItem}>
              <div className={styles.habitTop}>
                <div className={styles.habitName}>{habit.name}</div>
                <div className={styles.habitRight}>
                   <div className={styles.habitStreak}>🔥 {getStreak(habit)} days</div>
                   <button className={styles.habitDel} onClick={() => deleteHabit(habit.id)}>
                     ×
                   </button>
                </div>
              </div>
              <div className={styles.habitWeek}>
                {weekDays.map((day) => {
                  const isCompleted = habit.completed_dates?.includes(day.dateString);
                  const dayInitial = day.dayName.charAt(0);
                  return (
                    <div
                      key={day.dateString}
                      className={`${styles.habitDayDot} ${isCompleted ? styles.done : ''} ${
                        day.isToday ? styles.todayRing : ''
                      }`}
                      onClick={() => toggleHabitDay(habit.id, day.dateString)}
                      title={day.dayName}
                    >
                      {dayInitial}
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
