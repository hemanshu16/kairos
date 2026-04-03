import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface WorklogEntry {
  id: string;
  category: string;
  description: string;
  timestamp: string; // ISO string
}

const useWorklog = () => {
  const [logs, setLogs] = useLocalStorage<WorklogEntry[]>(STORAGE_KEYS.ACTIVITY_LOG, []);

  const addLog = (category: string, description: string) => {
    const newLog: WorklogEntry = {
      id: crypto.randomUUID(),
      category,
      description,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return {
    logs,
    addLog,
    deleteLog,
  };
};

export default useWorklog;
