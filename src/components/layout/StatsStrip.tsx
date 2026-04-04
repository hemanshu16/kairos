import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTime } from '../../hooks/useTime';
import styles from './StatsStrip.module.css';

const StatsStrip: React.FC = () => {
  const { birthDate, lifeExpectancy } = useApp();
  const timeData = useTime(birthDate, lifeExpectancy);

  const stats = [
    { label: 'HOUR', value: timeData.hour.percentage, decimals: 2 },
    { label: 'DAY', value: timeData.day.percentage, decimals: 4 },
    { label: 'WEEK', value: timeData.week.percentage, decimals: 5 },
    { label: 'MONTH', value: timeData.month.percentage, decimals: 5},
    { label: 'YEAR', value: timeData.year.percentage, decimals: 6},
  ];

  return (
    <div className={styles.statsStrip}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statItem}>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statVal}>
            {stat.value.toFixed(stat.decimals)}
            <span className={styles.decSmall}>%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;
