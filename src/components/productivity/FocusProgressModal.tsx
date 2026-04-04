import React, { useState } from 'react';
import styles from './FocusProgressModal.module.css';

interface FocusProgressModalProps {
  task: string;
  timeLeft: number; // in seconds
  isBreak: boolean;
  breakTimeLeft: number;
  onStartBreak: (mins: number) => void;
  onEndBreak: () => void;
  onClose: () => void;
  onStop: () => void;
}

const FocusProgressModal: React.FC<FocusProgressModalProps> = ({ 
  task, 
  timeLeft, 
  isBreak,
  breakTimeLeft,
  onStartBreak,
  onEndBreak,
  onStop 
}) => {
  const [showBreakOptions, setShowBreakOptions] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showBreakOptions) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.title}>TAKE A BREATHER</div>
            <button className={styles.closeBtn} onClick={() => setShowBreakOptions(false)}>×</button>
          </div>
          <div className={styles.taskName}>How long do you need?</div>
          <div className={styles.timerDisplay} style={{ fontSize: '10vw' }}>PAUSED</div>
          <div className={styles.statusLabel}>FOCUS TIMER HALTED</div>
          <div className={styles.actions}>
            <button className={styles.keepWorkingBtn} onClick={() => { onStartBreak(5); setShowBreakOptions(false); }}>5 MIN</button>
            <button className={styles.keepWorkingBtn} onClick={() => { onStartBreak(15); setShowBreakOptions(false); }}>15 MIN</button>
            <button className={styles.stopBtn} onClick={() => setShowBreakOptions(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (isBreak) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.title} style={{ color: '#4ade80' }}>ACTIVE BREAK</div>
          </div>
          <div className={styles.taskName}>Enjoy your break</div>
          <div className={styles.timerDisplay} style={{ color: '#4ade80', textShadow: '0 0 100px rgba(74, 222, 128, 0.25)' }}>
            {formatTime(breakTimeLeft)}
          </div>
          <div className={styles.statusLabel}>RECHARGING</div>
          <div className={styles.actions}>
            <button className={styles.keepWorkingBtn} style={{ background: '#4ade80', color: '#111' }} onClick={onEndBreak}>
              RESUME FOCUS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>ACTIVE FOCUS SESSION</div>
        </div>

        <div className={styles.taskName}>
          {task || 'Personal Flow Session'}
        </div>

        <div className={styles.timerDisplay}>
          {formatTime(timeLeft)}
        </div>

        <div className={styles.statusLabel}>REMAINING</div>

        <div className={styles.actions}>
          <button className={styles.keepWorkingBtn} onClick={() => setShowBreakOptions(true)}>
            TAKE A BREAK
          </button>
          <button className={styles.stopBtn} onClick={onStop}>
            Stop Early
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusProgressModal;
