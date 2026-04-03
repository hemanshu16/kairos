import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface WorklogEntry {
  id: string;
  user_id: string;
  category: string;
  description: string;
  timestamp: string; // ISO string
}

const useWorklog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WorklogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('worklogs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (data && data.length === 0) {
        // Initial sync check
        const localData = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.length > 0) {
            console.log('Syncing worklogs from localStorage...');
            const syncData = parsed.map((l: any) => ({
              user_id: user?.id,
              category: l.category,
              description: l.description,
              timestamp: l.timestamp || new Date().toISOString()
            }));

            const { data: inserted, error: syncError } = await supabase
              .from('worklogs')
              .insert(syncData)
              .select();

            if (syncError) throw syncError;
            setLogs(inserted || []);
          } else {
            setLogs([]);
          }
        } else {
          setLogs([]);
        }
      } else {
        setLogs(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (category: string, description: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('worklogs')
        .insert([{ user_id: user.id, category, description }])
        .select()
        .single();

      if (error) throw error;
      setLogs((prev) => [data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('worklogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLogs((prev) => prev.filter((log) => log.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    logs,
    loading,
    error,
    addLog,
    deleteLog,
    refresh: fetchLogs
  };
};

export default useWorklog;
