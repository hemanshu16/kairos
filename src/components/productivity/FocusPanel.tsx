import React, { useState, useEffect, useRef } from 'react';
import styles from './FocusPanel.module.css';

const MODES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

type Mode = keyof typeof MODES;

const FocusPanel: React.FC = () => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODES.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound or show alert
            alert('Focus session complete!');
            return MODES[mode];
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode]);
    setIsRunning(false);
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = ((MODES[mode] - timeLeft) / MODES[mode]) * 100;
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>FOCUS TIMER</h2>
      </div>

      {/* Mode Selection */}
      <div className={styles.modes}>
        <button
          className={`${styles.modeBtn} ${mode === 'focus' ? styles.active : ''}`}
          onClick={() => handleModeChange('focus')}
        >
          Focus (25m)
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'short' ? styles.active : ''}`}
          onClick={() => handleModeChange('short')}
        >
          Short Break (5m)
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'long' ? styles.active : ''}`}
          onClick={() => handleModeChange('long')}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Timer Circle */}
      <div className={styles.circle}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--gold)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className={styles.timeDisplay}>{formatTime(timeLeft)}</div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={`${styles.btn} ${styles.secondary}`} onClick={handleReset}>
          ↻
        </button>
        <button className={`${styles.btn} ${styles.primary}`} onClick={handleToggle}>
          {isRunning ? '⏸' : '▶'}
        </button>
      </div>

      <div className={styles.label}>{isRunning ? 'Stay focused!' : 'Ready to start?'}</div>
    </div>
  );
};

export default FocusPanel;
