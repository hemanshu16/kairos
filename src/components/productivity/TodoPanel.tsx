import React, { useState } from 'react';
import useTodos from '../../hooks/useTodos';
import styles from './TodoPanel.module.css';

const CATEGORIES = ['all', 'work', 'personal', 'health', 'learning'];

const TodoPanel: React.FC = () => {
  const { todos, loading, addTodo, toggleTodo, deleteTodo, getTodosByCategory } = useTodos();
  const [newTodo, setNewTodo] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo, activeCategory);
      setNewTodo('');
    }
  };

  const filteredTodos = getTodosByCategory(activeCategory);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <div className={styles.preTitle}>ZENITH • TASK MASTER</div>
          <div className={styles.title}>Your Todos</div>
        </div>
        {/* {loading && <div className={styles.loaderSmall}>Syncing...</div>} */}
      </div>

      {/* Categories */}
      <div className={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.catChip} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
        />
        <button type="submit" className={styles.addBtn} disabled={loading || !newTodo.trim()}>
          + ADD
        </button>
      </form>

      {/* Todo List */}
      <div className={styles.todoList}>
        {loading && todos.length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.pulse}></div>
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <p className={styles.emptyState}>No todos yet. Add one above!</p>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.done : ''}`}>
              <div
                className={`${styles.todoCheck} ${todo.completed ? styles.checked : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && '✓'}
              </div>
              <div className={styles.todoText}>{todo.text}</div>
              {todo.category !== 'all' && (
                <span className={styles.todoCat}>{todo.category}</span>
              )}
              <button className={styles.todoDel} onClick={() => deleteTodo(todo.id)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoPanel;
