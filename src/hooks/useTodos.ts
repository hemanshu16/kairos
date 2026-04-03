import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Todo {
  id: number;
  text: string;
  category: string;
  done: boolean;
  createdAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  remaining: number;
}

/**
 * Custom hook for managing todos
 */
export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEYS.TODOS, []);

  const addTodo = (text: string, category = 'all') => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      category,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getTodosByCategory = (category: string): Todo[] => {
    if (category === 'all') return todos;
    return todos.filter(todo => todo.category === category);
  };

  const getStats = (): TodoStats => {
    const total = todos.length;
    const completed = todos.filter(t => t.done).length;
    const remaining = total - completed;
    return { total, completed, remaining };
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    getTodosByCategory,
    getStats,
  };
};

export default useTodos;
