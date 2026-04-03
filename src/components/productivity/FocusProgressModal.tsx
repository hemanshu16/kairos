import React from 'react';
import styles from './FocusProgressModal.module.css';

interface FocusProgressModalProps {
  task: string;
  timeLeft: number; // in seconds
  onClose: () => void;
  onStop: () => void;
}

const FocusProgressModal: React.FC<FocusProgressModalProps> = ({ 
  task, 
  timeLeft, 
  onClose, 
  onStop 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>ACTIVE FOCUS SESSION</div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.taskName}>
          {task || 'Personal Flow Session'}
        </div>

        <div className={styles.timerDisplay}>
          {formatTime(timeLeft)}
        </div>

        <div className={styles.statusLabel}>REMAINING</div>

        <div className={styles.actions}>
          <button className={styles.keepWorkingBtn} onClick={onClose}>
            KEEP WORKING
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
