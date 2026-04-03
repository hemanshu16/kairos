import React, { useMemo } from 'react';
import { useTime } from '../../hooks/useTime';
import { useApp } from '../../contexts/AppContext';
import styles from './MonthGrid.module.css';

interface GridDay {
  isPast?: boolean;
  isCurrent?: boolean;
  isActive: boolean;
  dayNum?: number;
}

const MonthGrid: React.FC = () => {
  const { birthDate, lifeExpectancy } = useApp();
  const timeData = useTime(birthDate, lifeExpectancy);
  
  const gridDays = useMemo(() => {
    const now = new Date();
    const currentDate = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get first day of month (0=Sunday, 1=Monday, etc.)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Convert to Monday=0 format
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    // Get total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: GridDay[] = [];
    // Empty slots
    for (let i = 0; i < offset; i++) {
      days.push({ isActive: false });
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        isPast: i < currentDate,
        isCurrent: i === currentDate,
        isActive: true,
        dayNum: i
      });
    }

    return days;
  }, []);

  return (
    <div className={styles.cleanWidget}>
      <div className={styles.cardTitle}>THIS MONTH</div>
      <div className={styles.monthGrid}>
        {gridDays.map((day, index) => (
          <div
            key={index}
            className={`${styles.dot} ${day.isPast ? styles.past : ''} ${day.isCurrent ? styles.current : ''} ${!day.isActive ? styles.empty : ''}`}
          >
            {day.isCurrent && day.dayNum}
          </div>
        ))}
      </div>

      <div className={styles.pct}>
        {timeData.month.percentage.toFixed(2)}
        <span className={styles.pctSmall}>%</span>
      </div>
    </div>
  );
};

export default MonthGrid;

