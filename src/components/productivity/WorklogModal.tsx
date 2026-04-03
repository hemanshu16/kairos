import React, { useState } from 'react';
import useWorklog from '../../hooks/useWorklog';
import { format } from 'date-fns';
import styles from './WorklogModal.module.css';

const CATEGORIES = ['Work', 'Break', 'Exercise', 'Reading', 'Meeting', 'Scroll', 'Creative', 'Social'];

interface WorklogModalProps {
  onClose: () => void;
}

const WorklogModal: React.FC<WorklogModalProps> = ({ onClose }) => {
  const { logs, addLog, deleteLog } = useWorklog();
  const [activeCategory, setActiveCategory] = useState<string>('Work');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      addLog(activeCategory, description);
      setDescription('');
    }
  };

  const currentDayLogs = logs.filter(
    (log) => new Date(log.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>ACTIVITY LOG</div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.catChip} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <form className={styles.inputContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Log activity..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
          />
          <button type="submit" className={styles.sendBtn} disabled={!description.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        <div className={styles.logsList}>
          {currentDayLogs.length === 0 ? (
            <div className={styles.emptyState}>No activities logged yet</div>
          ) : (
            currentDayLogs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logTime}>{format(new Date(log.timestamp), 'HH:mm')}</div>
                <div className={styles.logCat}>{log.category}</div>
                <div className={styles.logDesc}>{log.description}</div>
                <button className={styles.logDel} onClick={() => deleteLog(log.id)}>×</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorklogModal;
