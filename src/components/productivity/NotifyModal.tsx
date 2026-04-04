import React, { useState } from 'react';
import { useBell } from '../../hooks/useBell';
import { ReminderType, SoundType } from '../../contexts/BellContext';
import styles from './NotifyModal.module.css';

interface NotifyModalProps {
  onClose: () => void;
}

const NotifyModal: React.FC<NotifyModalProps> = ({ onClose }) => {
  const { settings, addReminder, updateReminder, deleteReminder, playSound } = useBell();
  const [view, setView] = useState<'list' | 'add'>('list');

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ReminderType>('interval');
  const [intervalMins, setIntervalMins] = useState(60);
  const [timeStr, setTimeStr] = useState('12:00');
  const [soundType, setSoundType] = useState<SoundType>('chime');

  const handleAdd = () => {
    if (!title.trim()) {
      alert("Please provide a title for this reminder.");
      return;
    }
    addReminder({
      title,
      message,
      type,
      intervalMinutes: type === 'interval' ? intervalMins : undefined,
      timeOfDay: type === 'time' ? timeStr : undefined,
      soundType,
      enabled: true
    });
    setView('list');
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setType('interval');
    setIntervalMins(60);
    setTimeStr('12:00');
    setSoundType('chime');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {view === 'list' ? 'REMINDERS' : 'NEW REMINDER'}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {view === 'list' && (
          <div className={styles.listContainer}>
            {settings.reminders && settings.reminders.length === 0 && (
              <div className={styles.emptyState}>No reminders active.</div>
            )}
            {settings.reminders && settings.reminders.map(r => (
              <div key={r.id} className={`${styles.reminderCard} ${!r.enabled ? styles.disabled : ''}`}>
                <div className={styles.reminderInfo}>
                  <div className={styles.reminderTitle}>{r.title}</div>
                  <div className={styles.reminderMeta}>
                    {r.type === 'interval' ? `Every ${r.intervalMinutes}m` : `At ${r.timeOfDay}`} • {r.soundType}
                  </div>
                </div>
                <div className={styles.reminderActions}>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={r.enabled} 
                      onChange={(e) => updateReminder(r.id, { enabled: e.target.checked })}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <button className={styles.deleteBtn} onClick={() => deleteReminder(r.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            ))}
            
            <button className={styles.addBtn} onClick={() => setView('add')}>
              + CREATE REMINDER
            </button>
          </div>
        )}

        {view === 'add' && (
          <div className={styles.formContainer}>
            <label className={styles.label}>Title</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Drink Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className={styles.label}>Message (Optional)</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Stay hydrated!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className={styles.splitRow}>
              <div className={styles.halfCol}>
                <label className={styles.label}>Trigger Type</label>
                <div className={styles.tabGroup}>
                  <button 
                    className={`${styles.tabBtn} ${type === 'interval' ? styles.activeTab : ''}`}
                    onClick={() => setType('interval')}
                  >Interval</button>
                  <button 
                    className={`${styles.tabBtn} ${type === 'time' ? styles.activeTab : ''}`}
                    onClick={() => setType('time')}
                  >Time</button>
                </div>
              </div>

              <div className={styles.halfCol}>
                {type === 'interval' ? (
                  <div className={styles.intervalField}>
                    <label className={styles.label}>Repeat Every</label>
                    <div className={styles.inputWithUnit}>
                      <input 
                        type="number" 
                        className={styles.input} 
                        value={intervalMins}
                        onChange={(e) => setIntervalMins(parseInt(e.target.value) || 1)}
                        min={1}
                      />
                      <span>MINS</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.timeField}>
                    <label className={styles.label}>Trigger At</label>
                    <div className={styles.timeInputWrapper}>
                      <input 
                        type="time" 
                        className={styles.input} 
                        value={timeStr}
                        onChange={(e) => setTimeStr(e.target.value)}
                      />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.clockIcon}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.splitRow}>
               <div className={styles.halfCol}>
                 <div className={styles.selectWrapper}>
                  <select 
                    className={styles.select}
                    value={soundType}
                    onChange={(e) => setSoundType(e.target.value as SoundType)}
                  >
                    <option value="chime">Chime</option>
                    <option value="bell">Soft Bell</option>
                    <option value="ding">Quick Ding</option>
                    <option value="gong">Gong</option>
                    <option value="digital">Digital Pulse</option>
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.selectArrow}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                 </div>
               </div>
               <div className={styles.halfCol}>
                 <label className={styles.label}>Preview</label>
                 <button className={styles.testBtn} onClick={() => playSound(soundType)}>
                   PLAY <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                 </button>
               </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={() => { setView('list'); resetForm(); }}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleAdd}>Save Reminder</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NotifyModal;
