import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export interface UserTheme {
  id: string;
  user_id: string;
  name: string;
  url: string;
  created_at: string;
}

export const useThemes = () => {
  const { user } = useAuth();
  const { setCustomBg } = useApp();
  const [themes, setThemes] = useState<UserTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setThemes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const uploadAndAddTheme = async (file: File, name: string) => {
    if (!user) return;
    setUploading(true);
    setError(null);
    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('themes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('themes')
        .getPublicUrl(fileName);

      // 3. Add to Database
      const { data: dbData, error: dbError } = await supabase
        .from('images')
        .insert([{ user_id: user.id, name: name || file.name, url: publicUrl }])
        .select()
        .single();

      if (dbError) throw dbError;
      
      setThemes(prev => [dbData, ...prev]);
      return dbData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteTheme = async (id: string, url: string) => {
    try {
      // 1. Delete from DB
      const { error: delError } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (delError) throw delError;

      // 2. Optionally delete from Storage
      // Extract fileName from URL if possible
      const fileName = url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('themes')
          .remove([`${user?.id}/${fileName}`]);
        if (storageError) console.warn('Could not delete file from storage:', storageError);
      }

      setThemes(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const applyTheme = (url: string | null) => {
    setCustomBg(url);
  };

  return {
    themes,
    loading,
    uploading,
    error,
    uploadAndAddTheme,
    deleteTheme,
    applyTheme,
    refresh: fetchThemes
  };
};
