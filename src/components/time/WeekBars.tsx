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
    const names = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return names.map((name, index) => {
      const isPast = index < mondayIndex;
      const isCurrent = index === mondayIndex;
      const percentage = isCurrent ? timeData.day.percentage : (isPast ? 100 : 0);

      return {
        label: name,
        percentage,
        isPast,
        isCurrent
      };
    });
  }, [timeData.day.percentage]);

  return (
    <div className={styles.cleanWidget}>
      <div className={styles.cardTitle}>THIS WEEK</div>
      <div className={styles.weekBars}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.barWrapper}>
            <div className={`${styles.barContainer} ${day.isPast ? styles.pastContainer : ''}`}>
              <div
                className={`${styles.bar} ${day.isPast ? styles.past : ''} ${day.isCurrent ? styles.current : ''}`}
                style={{ height: `${day.percentage}%` }}
              />
            </div>
            <div className={`${styles.label} ${day.isCurrent ? styles.currentLabel : ''}`}>{day.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.pct}>
        {timeData.week.percentage.toFixed(2)}
        <span className={styles.pctSmall}>%</span>
      </div>
    </div>
  );
};

export default WeekBars;

