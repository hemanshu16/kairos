import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, differenceInMilliseconds } from 'date-fns';

export interface ProgressResult {
  percentage: number;
  label?: string;
  minutesLeft?: number;
  hoursLeft?: string;
  daysLeft?: number;
  year?: number;
  yearsLived?: string;
  yearsLeft?: string;
}

/**
 * Get progress percentage for a time period
 * @param {Date} now - Current date
 * @param {Date} start - Start of period
 * @param {Date} end - End of period
 * @returns {number} - Progress percentage (0-100)
 */
export const getProgressPercentage = (now: Date, start: Date, end: Date): number => {
  const total = differenceInMilliseconds(end, start);
  const elapsed = differenceInMilliseconds(now, start);
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
};

/**
 * Calculate hour progress
 * @param {Date} now
 * @returns {ProgressResult}
 */
export const getHourProgress = (now: Date): ProgressResult => {
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Calculate percentage of hour passed
  const percentage = ((minutes * 60 + seconds + milliseconds / 1000) / 3600) * 100;
  const minutesLeft = 60 - minutes - (seconds / 60);

  return {
    percentage,
    minutesLeft: Math.ceil(minutesLeft),
    label: format(now, 'ha'),
  };
};

/**
 * Calculate day progress
 * @param {Date} now
 * @returns {ProgressResult}
 */
export const getDayProgress = (now: Date): ProgressResult => {
  const start = startOfDay(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const percentage = getProgressPercentage(now, start, end);
  const hoursLeft = 24 - now.getHours() - (now.getMinutes() / 60);

  return {
    percentage,
    hoursLeft: hoursLeft.toFixed(1),
    label: format(now, 'EEEE'),
  };
};

/**
 * Calculate week progress
 * @param {Date} now
 * @returns {ProgressResult}
 */
export const getWeekProgress = (now: Date): ProgressResult => {
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const percentage = getProgressPercentage(now, start, end);
  const daysLeft = 7 - now.getDay();

  return {
    percentage,
    daysLeft,
    label: `Week ${format(now, 'w')}`,
  };
};

/**
 * Calculate month progress
 * @param {Date} now
 * @returns {ProgressResult}
 */
export const getMonthProgress = (now: Date): ProgressResult => {
  const start = startOfMonth(now);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const percentage = getProgressPercentage(now, start, end);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();

  return {
    percentage,
    daysLeft,
    label: format(now, 'MMMM'),
  };
};

/**
 * Calculate year progress
 * @param {Date} now
 * @returns {ProgressResult}
 */
export const getYearProgress = (now: Date): ProgressResult => {
  const start = startOfYear(now);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);

  const percentage = getProgressPercentage(now, start, end);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = 365 - dayOfYear;

  return {
    percentage,
    daysLeft,
    label: format(now, 'yyyy'),
    year: now.getFullYear(),
  };
};

/**
 * Calculate life progress based on expected lifespan
 * @param {Date | string | null} birthDate
 * @param {Date} now
 * @param {number} expectedYears
 * @returns {ProgressResult}
 */
export const getLifeProgress = (birthDate: Date | string | null, now: Date, expectedYears = 80): ProgressResult => {
  if (!birthDate) return { percentage: 0, yearsLived: '0', yearsLeft: String(expectedYears) };

  const birth = new Date(birthDate);
  const end = new Date(birth);
  end.setFullYear(end.getFullYear() + expectedYears);

  const percentage = getProgressPercentage(now, birth, end);
  const yearsLived = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const yearsLeft = Math.max(expectedYears - yearsLived, 0);

  return {
    percentage: Math.min(percentage, 100),
    yearsLived: yearsLived.toFixed(1),
    yearsLeft: yearsLeft.toFixed(1),
  };
};

/**
 * Get greeting based on time of day
 * @param {Date} now
 * @returns {string}
 */
export const getGreeting = (now: Date): string => {
  const hour = now.getHours();

  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

export interface SkyColorKeyframe {
  hour: number;
  bg: string;
}

/**
 * Interpolate background color based on time
 * @param {Date} now
 * @param {SkyColorKeyframe[]} keyframes - Array of {hour, bg} objects
 * @returns {string}
 */
export const interpolateSkyColor = (now: Date, keyframes: SkyColorKeyframe[]): string => {
  const hour = now.getHours() + now.getMinutes() / 60;

  // Find surrounding keyframes
  let before = keyframes[0];
  let after = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (hour >= keyframes[i].hour && hour <= keyframes[i + 1].hour) {
      before = keyframes[i];
      after = keyframes[i + 1];
      break;
    }
  }

  // For now, return the closest keyframe
  // TODO: Implement actual color interpolation
  const distToBefore = Math.abs(hour - before.hour);
  const distToAfter = Math.abs(hour - after.hour);

  return distToBefore < distToAfter ? before.bg : after.bg;
};

/**
 * Format time for display
 * @param {Date} date
 * @param {boolean} use24Hour
 * @returns {string}
 */
export const formatTime = (date: Date, use24Hour = true): string => {
  return format(date, use24Hour ? 'HH:mm:ss' : 'hh:mm:ss a');
};

/**
 * Format date for display
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};
