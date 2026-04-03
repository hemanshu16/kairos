import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Todo {
  id: string; // Changed to string for UUID
  user_id: string;
  text: string;
  category: string;
  completed: boolean; // Changed from 'done' to match Supabase schema
  created_at: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  remaining: number;
}

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length === 0) {
        // Check for initial sync from localStorage
        const localData = localStorage.getItem(STORAGE_KEYS.TODOS);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.length > 0) {
            console.log('Syncing todos from localStorage...');
            const syncData = parsed.map((t: any) => ({
              user_id: user?.id,
              text: t.text,
              category: t.category,
              completed: t.done,
              created_at: t.createdAt || new Date().toISOString()
            }));

            const { data: inserted, error: syncError } = await supabase
              .from('todos')
              .insert(syncData)
              .select();

            if (syncError) throw syncError;
            setTodos(inserted || []);
            // Clear local storage after successful sync (optional)
            // localStorage.removeItem(STORAGE_KEYS.TODOS);
          } else {
            setTodos([]);
          }
        } else {
          setTodos([]);
        }
      } else {
        setTodos(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string, category = 'all') => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ user_id: user.id, text, category, completed: false }])
        .select()
        .single();

      if (error) throw error;
      setTodos([...todos, data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getTodosByCategory = (category: string): Todo[] => {
    if (category === 'all') return todos;
    return todos.filter(todo => todo.category === category);
  };

  const getStats = (): TodoStats => {
    const total = todos.length;
    const completedCount = todos.filter(t => t.completed).length;
    const remaining = total - completedCount;
    return { total, completed: completedCount, remaining };
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    getTodosByCategory,
    getStats,
    refresh: fetchTodos
  };
};

export default useTodos;
