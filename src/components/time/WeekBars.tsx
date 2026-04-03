import React, { useMemo } from 'react';
import { TimeData } from '../../hooks/useTime';
import styles from './WeekBars.module.css';

interface WeekBarsProps {
  timeData: TimeData;
}

const WeekBars: React.FC<WeekBarsProps> = ({ timeData }) => {
  const weekDays = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0

    const days = [
      { short: 'MON' },
      { short: 'TUE' },
      { short: 'WED' },
      { short: 'THU' },
      { short: 'FRI' },
      { short: 'SAT' },
      { short: 'SUN' },
    ];

    return days.map((day, index) => {
      const isPast = index < mondayIndex;
      const isCurrent = index === mondayIndex;
      const percentage = isCurrent ? timeData.day.percentage : (isPast ? 100 : 0);

      return {
        label: day.short,
        percentage,
        isPast,
        isCurrent
      };
    });
  }, [timeData.day.percentage]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>THIS WEEK</div>
      <div className={styles.bars}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.barWrapper}>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${day.isPast ? styles.past : ''} ${day.isCurrent ? styles.current : ''}`}
                style={{ height: `${day.percentage}%` }}
              />
            </div>
            <div className={`${styles.label} ${day.isCurrent ? styles.currentLabel : ''}`}>{day.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekBars;
