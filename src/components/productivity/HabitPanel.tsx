import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useHabits from '../../hooks/useHabits';
import styles from './HabitPanel.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
};

const HabitPanel: React.FC = () => {
  const { habits, loading, addHabit, toggleHabitDay, deleteHabit, getWeekDays, getStreak } = useHabits();
  const [newHabit, setNewHabit] = useState('');
  const weekDays = getWeekDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit);
      setNewHabit('');
    }
  };

  return (
    <motion.div className={styles.panel} initial="hidden" animate="visible" variants={containerVariants}>
      
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <div className={styles.preTitle}>ZENITH • RITUALS</div>
          <div className={styles.title}>Your Habits</div>
        </div>
      </div>

      {/* ── Input ── */}
      <motion.form onSubmit={handleSubmit} className={styles.inputRow} variants={itemVariants}>
        <input
          type="text"
          className={styles.textInput}
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="What habit do you want to build?"
          disabled={loading}
        />
        <motion.button 
          type="submit" 
          className={styles.addBtn} 
          disabled={loading || !newHabit.trim()}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          + ADD
        </motion.button>
      </motion.form>

      {/* ── List ── */}
      <div className={styles.habitList}>
        {loading && habits.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.pulse} />
            <p>Loading your rituals...</p>
          </div>
        ) : habits.length === 0 ? (
          <motion.p className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            No habits yet. Start tracking one above!
          </motion.p>
        ) : (
          <AnimatePresence mode="popLayout">
            {habits.map(habit => {
              const weekCompletion = (habit.completed_dates?.filter(d => 
                weekDays.some(wd => wd.dateString === d)
              ).length || 0) / 7;

              return (
                <motion.div 
                  key={habit.id} 
                  className={styles.habitItem}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className={styles.habitTop}>
                    <div className={styles.habitInfo}>
                      <div className={styles.habitName}>{habit.name}</div>
                      <div className={styles.habitMeta}>
                        <span className={styles.streakBadge} style={{
                          background: 'linear-gradient(135deg, #ff9f43, #ff6b6b)',
                          boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
                          color: '#fff'
                        }}>
                          🔥 {getStreak(habit)} Day Streak
                        </span>
                        <span className={styles.progressText}>
                          {Math.round(weekCompletion * 100)}% this week
                        </span>
                      </div>
                    </div>
                    <motion.button 
                      className={styles.habitDel} 
                      onClick={() => deleteHabit(habit.id)}
                      whileHover={{ scale: 1.3, color: '#ff4757' }}
                    >
                      ×
                    </motion.button>
                  </div>

                  <div className={styles.habitProgressContainer}>
                    <div className={styles.habitProgressBar}>
                      <motion.div 
                        className={styles.habitProgressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${weekCompletion * 100}%` }}
                        style={{
                          background: 'linear-gradient(90deg, #f5a623, #ff9f43, #fff)',
                          boxShadow: '0 0 10px rgba(245,166,35,0.4)'
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.habitWeek}>
                    {weekDays.map(day => {
                      const isCompleted = habit.completed_dates?.includes(day.dateString);
                      return (
                        <motion.div
                          key={day.dateString}
                          className={`${styles.habitDayDot} ${day.isToday ? styles.todayRing : ''}`}
                          onClick={() => toggleHabitDay(habit.id, day.dateString)}
                          whileHover={{ scale: 1.12, y: -4 }}
                          whileTap={{ scale: 0.9 }}
                          style={isCompleted ? {
                            background: 'linear-gradient(135deg, #f5a623, #ff9f43)',
                            borderColor: '#f5a623',
                            boxShadow: '0 5px 15px rgba(245,166,35,0.4)'
                          } : {}}
                        >
                          {!isCompleted && <span className={styles.dayInitial}>{day.dayName.charAt(0)}</span>}
                          <AnimatePresence>
                            {isCompleted && (
                              <motion.div 
                                className={styles.checkIcon}
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                              >
                                ✓
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default HabitPanel;
