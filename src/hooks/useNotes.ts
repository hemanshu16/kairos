import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length === 0) {
        // Sync check
        const localData = localStorage.getItem(STORAGE_KEYS.NOTES);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.length > 0) {
            console.log('Syncing notes from localStorage...');
            const syncData = parsed.map((n: any) => ({
              user_id: user?.id,
              title: n.title,
              body: n.body,
              created_at: n.createdAt || new Date().toISOString(),
              updated_at: n.updatedAt || new Date().toISOString()
            }));

            const { data: inserted, error: syncError } = await supabase
              .from('notes')
              .insert(syncData)
              .select();

            if (syncError) throw syncError;
            setNotes(inserted || []);
          } else {
            setNotes([]);
          }
        } else {
          setNotes([]);
        }
      } else {
        setNotes(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title = '', body = '') => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ user_id: user.id, title, body }])
        .select()
        .single();

      if (error) throw error;
      setNotes([data, ...notes]);
      return data.id;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      // Supabase trigger will handle updated_at
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.map(n =>
        n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getNote = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getNote,
    refresh: fetchNotes
  };
};

export default useNotes;
