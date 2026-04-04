import React, { useState } from 'react';
import { useBell } from '../../hooks/useBell';
import styles from './NotifyModal.module.css';

interface NotifyModalProps {
  onClose: () => void;
}

const NotifyModal: React.FC<NotifyModalProps> = ({ onClose }) => {
  const { settings, updateSettings, playSound } = useBell();
  const [customInterval, setCustomInterval] = useState(settings.intervalMinutes.toString());

  const intervals = [
    { label: '5m', value: 5 },
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
  ];

  const handleIntervalClick = (val: number) => {
    updateSettings({ intervalMinutes: val });
    setCustomInterval(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInterval(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      updateSettings({ intervalMinutes: num });
    }
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
            BELL SETTINGS
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <span>Enable bell</span>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={settings.enabled} 
                onChange={(e) => updateSettings({ enabled: e.target.checked })}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Interval</label>
          <div className={styles.intervalGrid}>
            {intervals.map((btn) => (
              <button
                key={btn.value}
                className={`${styles.pillBtn} ${settings.intervalMinutes === btn.value ? styles.active : ''}`}
                onClick={() => handleIntervalClick(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className={styles.customRow}>
            <span>Custom:</span>
            <input 
              type="number" 
              className={styles.input} 
              value={customInterval} 
              onChange={handleCustomChange}
            />
            <span>min</span>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Sound</label>
          <div className={styles.selectWrapper}>
            <select 
              className={styles.select}
              value={settings.soundType}
              onChange={(e) => updateSettings({ soundType: e.target.value as any })}
            >
              <option value="chime">chime</option>
              <option value="bell">bell</option>
              <option value="ding">ding</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.volumeHeader}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.volumeIcon}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Volume</span>
            <button className={styles.testBtn} onClick={playSound}>
              TEST <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /></svg>
            </button>
          </div>
          <input 
            type="range" 
            className={styles.range} 
            value={settings.volume} 
            onChange={(e) => updateSettings({ volume: parseInt(e.target.value) })}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <span>Prompt activity log</span>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={settings.promptActivity} 
                onChange={(e) => updateSettings({ promptActivity: e.target.checked })}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyModal;
