import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTodos from '../../hooks/useTodos';
import styles from './TodoPanel.module.css';

const CATEGORIES = ['all', 'work', 'personal', 'health', 'learning'];

const CAT_COLORS: Record<string, { border: string; bg: string; glow: string; text: string }> = {
  all:      { border: '#f5a623', bg: 'rgba(245,166,35,0.25)',   glow: 'rgba(245,166,35,0.4)',   text: '#fff' },
  work:     { border: '#00d2ff', bg: 'rgba(0,210,255,0.22)',    glow: 'rgba(0,210,255,0.35)',   text: '#fff' },
  personal: { border: '#ff4757', bg: 'rgba(255,71,87,0.22)',    glow: 'rgba(255,71,87,0.35)',   text: '#fff' },
  health:   { border: '#2ed573', bg: 'rgba(46,213,115,0.22)',   glow: 'rgba(46,213,115,0.35)',  text: '#fff' },
  learning: { border: '#a55eea', bg: 'rgba(165,94,234,0.22)',   glow: 'rgba(165,94,234,0.35)', text: '#fff' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
  exit: { x: -30, opacity: 0, transition: { duration: 0.18 } }
};

const TodoPanel: React.FC = () => {
  const { todos, loading, addTodo, toggleTodo, deleteTodo, getTodosByCategory } = useTodos();
  const [newTodo, setNewTodo] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo, activeCategory === 'all' ? 'personal' : activeCategory);
      setNewTodo('');
    }
  };

  const filteredTodos = getTodosByCategory(activeCategory);
  const completedCount = filteredTodos.filter(t => t.completed).length;
  const progress = filteredTodos.length > 0 ? (completedCount / filteredTodos.length) * 100 : 0;

  return (
    <motion.div className={styles.panel} initial="hidden" animate="visible" variants={containerVariants}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <div className={styles.preTitle}>ZENITH • TASK MASTER</div>
          <div className={styles.title}>Your Todos</div>
        </div>
        {filteredTodos.length > 0 && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>{Math.round(progress)}% complete</div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Category Pills ── */}
      <motion.div className={styles.categoryRow} variants={itemVariants}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          const c = CAT_COLORS[cat];
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={styles.catChip}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={isActive ? {
                borderColor: c.border,
                background: c.bg,
                color: c.text,
                boxShadow: `0 0 20px ${c.glow}, 0 4px 15px rgba(0,0,0,0.3)`,
              } : {}}
            >
              {cat.toUpperCase()}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Input ── */}
      <motion.form onSubmit={handleSubmit} className={styles.inputRow} variants={itemVariants}>
        <input
          type="text"
          className={styles.textInput}
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
        />
        <motion.button
          type="submit"
          className={styles.addBtn}
          disabled={loading || !newTodo.trim()}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          + ADD
        </motion.button>
      </motion.form>

      {/* ── List ── */}
      <div className={styles.todoList}>
        {loading && todos.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.pulse} />
            <p>Loading tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <motion.p className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Nothing here yet. Add a task above ↑
          </motion.p>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTodos.map(todo => {
              const catColor = CAT_COLORS[todo.category] || CAT_COLORS.personal;
              return (
                <motion.div
                  key={todo.id}
                  className={`${styles.todoItem} ${todo.completed ? styles.done : ''}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  style={{ borderColor: todo.completed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)' }}
                >
                  {/* Checkbox */}
                  <motion.div
                    className={`${styles.todoCheck} ${todo.completed ? styles.checked : ''}`}
                    onClick={() => toggleTodo(todo.id)}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    style={todo.completed ? {
                      background: 'linear-gradient(135deg, #f5a623, #ff9f43)',
                      borderColor: '#f5a623',
                      boxShadow: '0 0 20px rgba(245,166,35,0.55)',
                      color: '#000',
                    } : {}}
                  >
                    <AnimatePresence>
                      {todo.completed && (
                        <motion.span
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                        >✓</motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Text */}
                  <div className={styles.todoText}>{todo.text}</div>

                  {/* Category badge */}
                  {todo.category !== 'all' && (
                    <span
                      className={styles.todoCat}
                      style={{
                        background: catColor.bg,
                        borderColor: catColor.border,
                        color: catColor.border,
                        boxShadow: `0 0 10px ${catColor.glow}`,
                      }}
                    >
                      {todo.category}
                    </span>
                  )}

                  {/* Delete */}
                  <motion.button
                    className={styles.todoDel}
                    onClick={() => deleteTodo(todo.id)}
                    whileHover={{ scale: 1.3, color: '#ff4757' }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default TodoPanel;
