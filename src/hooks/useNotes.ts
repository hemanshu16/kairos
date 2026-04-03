import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Note {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom hook for managing notes
 */
export const useNotes = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, []);

  const addNote = (title = '', body = ''): number => {
    const newNote: Note = {
      id: Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    return newNote.id;
  };

  const updateNote = (id: number, updates: Partial<Note>): void => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: number): void => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getNote = (id: number): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNote,
  };
};

export default useNotes;
