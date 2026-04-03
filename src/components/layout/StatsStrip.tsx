import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTime } from '../../hooks/useTime';
import styles from './StatsStrip.module.css';

const StatsStrip: React.FC = () => {
  const { birthDate, lifeExpectancy } = useApp();
  const timeData = useTime(birthDate, lifeExpectancy);

  const stats = [
    { label: 'HOUR', value: timeData.hour.percentage },
    { label: 'DAY', value: timeData.day.percentage },
    { label: 'WEEK', value: timeData.week.percentage },
    { label: 'MONTH', value: timeData.month.percentage },
    { label: 'YEAR', value: timeData.year.percentage },
  ];

  return (
    <div className={styles.statsStrip}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statItem}>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statVal}>
            {stat.value.toFixed(2)}
            <span className={styles.decSmall}>%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;
