import React, { useState } from 'react';
import useTodos from '../../hooks/useTodos';
import styles from './TodoPanel.module.css';

const CATEGORIES = ['all', 'work', 'personal', 'health', 'learning'];

const TodoPanel: React.FC = () => {
  const { addTodo, toggleTodo, deleteTodo, getTodosByCategory } = useTodos();
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
        <div className={styles.title}>YOUR TODOS</div>
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
        />
        <button type="submit" className={styles.addBtn}>
          + ADD
        </button>
      </form>

      {/* Todo List */}
      <div className={styles.todoList}>
        {filteredTodos.length === 0 ? (
          <p className={styles.emptyState}>No todos yet. Add one above!</p>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`${styles.todoItem} ${todo.done ? styles.done : ''}`}>
              <div
                className={`${styles.todoCheck} ${todo.done ? styles.checked : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.done && '✓'}
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
