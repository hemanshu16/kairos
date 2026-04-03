import React, { useMemo } from 'react';
import styles from './MonthGrid.module.css';

interface GridDay {
  day?: number;
  isPast?: boolean;
  isCurrent?: boolean;
  isActive: boolean;
}

const MonthGrid: React.FC = () => {
  const gridDays = useMemo(() => {
    const now = new Date();
    const currentDate = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get first day of month (0=Sunday, 1=Monday, etc.)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Convert to Monday=0 format
    const firstDayMon = firstDay === 0 ? 6 : firstDay - 1;

    // Get total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Calculate how many rows we need
    const totalCells = firstDayMon + daysInMonth;
    const rows = Math.ceil(totalCells / 7);
    const gridSize = rows * 7;

    const days: GridDay[] = [];
    for (let i = 0; i < gridSize; i++) {
      const dayNumber = i - firstDayMon + 1;

      if (dayNumber > 0 && dayNumber <= daysInMonth) {
        days.push({
          day: dayNumber,
          isPast: dayNumber < currentDate,
          isCurrent: dayNumber === currentDate,
          isActive: true
        });
      } else {
        days.push({ isActive: false });
      }
    }

    return days;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>THIS MONTH</div>
      <div className={styles.grid}>
        {gridDays.map((day, index) => (
          <div
            key={index}
            className={`${styles.cell} ${day.isPast ? styles.past : ''} ${day.isCurrent ? styles.current : ''} ${!day.isActive ? styles.empty : ''}`}
          >
            {day.isActive && <span className={styles.dayNumber}>{day.day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthGrid;
