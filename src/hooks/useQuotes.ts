import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserQuote {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export const useQuotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setQuotes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const addQuote = async (text: string) => {
    if (!user || !text.trim()) return;
    try {
      const { data, error: addError } = await supabase
        .from('quotes')
        .insert([{ user_id: user.id, text }])
        .select()
        .single();

      if (addError) throw addError;
      setQuotes(prev => [data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error: delError } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (delError) throw delError;
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    quotes,
    loading,
    error,
    addQuote,
    deleteQuote,
    refresh: fetchQuotes
  };
};
