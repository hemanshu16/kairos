import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { getZonedTime } from '../utils/timeUtils';
import {
  getHourProgress,
  getDayProgress,
  getWeekProgress,
  getMonthProgress,
  getYearProgress,
  getLifeProgress,
  formatTime,
  formatDate,
  getGreeting,
  ProgressResult
} from '../utils/timeUtils';

export interface TimeData {
  now: Date;
  time: string;
  date: string;
  greeting: string;
  hour: ProgressResult;
  day: ProgressResult;
  week: ProgressResult;
  month: ProgressResult;
  year: ProgressResult;
  life: ProgressResult | null;
}

/**
 * Custom hook that provides current time and all time-based calculations
 * Updates every second
 */
export const useTime = (birthDate: string | Date | null = null, lifeExpectancy = 80): TimeData => {
  const { timezone } = useApp();

  const getZonedNow = useCallback(() => {
    return getZonedTime(timezone);
  }, [timezone]);

  const [now, setNow] = useState(getZonedNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getZonedNow());
    }, 1000);

    return () => clearInterval(interval);
  }, [getZonedNow]);

  return {
    now,
    time: formatTime(now),
    date: formatDate(now),
    greeting: getGreeting(now),
    hour: getHourProgress(now),
    day: getDayProgress(now),
    week: getWeekProgress(now),
    month: getMonthProgress(now),
    year: getYearProgress(now),
    life: birthDate ? getLifeProgress(new Date(birthDate), now, lifeExpectancy) : null,
  };
};

export default useTime;
