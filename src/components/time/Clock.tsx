import React from 'react';
import styles from './Clock.module.css';

interface ClockProps {
  time: string;
  date: string;
}

const Clock: React.FC<ClockProps> = ({ time, date }) => {
  return (
    <div className={styles.clockSection}>
      <div className={styles.digitalClock}>{time}</div>
      <div className={styles.dateStr}>{date}</div>
    </div>
  );
};

export default Clock;
