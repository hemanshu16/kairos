import React from 'react';
import { useBell } from '../../hooks/useBell';
import styles from './GlobalReminderPopup.module.css';

const GlobalReminderPopup: React.FC = () => {
  const { activeAlert, dismissAlert } = useBell();

  if (!activeAlert) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.bellIcon}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        
        <div className={styles.title}>{activeAlert.title}</div>
        <div className={styles.message}>{activeAlert.message}</div>
        
        <button className={styles.dismissBtn} onClick={dismissAlert}>
          DISMISS
        </button>
      </div>
    </div>
  );
};

export default GlobalReminderPopup;
